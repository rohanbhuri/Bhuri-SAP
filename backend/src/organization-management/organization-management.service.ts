import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, In } from 'typeorm';
import { ObjectId, MongoClient } from 'mongodb';
import { Organization } from '../entities/organization.entity';
import { OrganizationRequest, RequestStatus } from '../entities/organization-request.entity';
import { User } from '../entities/user.entity';
import { Module as ModuleEntity } from '../entities/module.entity';

@Injectable()
export class OrganizationManagementService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(OrganizationRequest)
    private organizationRequestRepository: MongoRepository<OrganizationRequest>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(ModuleEntity)
    private moduleRepository: MongoRepository<ModuleEntity>,
  ) {}

  async findAll() {
    const organizations = await this.organizationRepository.find();
    
    // Use direct MongoDB client for array matching
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      const orgsWithUserCount = await Promise.all(
        organizations.map(async (org) => {
          const userCount = await db.collection('users').countDocuments({
            organizationIds: { $in: [org._id] }
          });
          return { ...org, userCount };
        })
      );
      
      return orgsWithUserCount;
    } finally {
      await client.close();
    }
  }

  async create(orgData: any) {
    // Check if code already exists
    const existingOrg = await this.organizationRepository.findOne({
      where: { code: orgData.code }
    });
    
    if (existingOrg) {
      throw new BadRequestException('Organization code already exists');
    }

    const organization = this.organizationRepository.create({
      ...orgData,
      activeModuleIds: orgData.activeModuleIds?.map(id => new ObjectId(id)) || [],
      createdAt: new Date()
    });
    
    return this.organizationRepository.save(organization);
  }

  async update(id: string, updateData: any) {
    const organization = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(id) }
    });
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if code already exists (excluding current org)
    if (updateData.code && updateData.code !== organization.code) {
      const existingOrg = await this.organizationRepository.findOne({
        where: { code: updateData.code }
      });
      
      if (existingOrg) {
        throw new BadRequestException('Organization code already exists');
      }
    }

    const updatePayload = {
      ...updateData,
      activeModuleIds: updateData.activeModuleIds?.map(id => new ObjectId(id)) || organization.activeModuleIds
    };

    await this.organizationRepository.update(new ObjectId(id), updatePayload);
    return this.organizationRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async delete(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(id) }
    });
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if organization has users
    const userCount = await this.userRepository.count({
      where: { organizationIds: new ObjectId(id) }
    });
    
    if (userCount > 0) {
      throw new BadRequestException('Cannot delete organization with existing users');
    }

    return this.organizationRepository.delete(new ObjectId(id));
  }

  async getOrganizationRequests() {
    const requests = await this.organizationRequestRepository.find();
    
    // Populate user and organization details
    const populatedRequests = await Promise.all(
      requests.map(async (request) => {
        const user = await this.userRepository.findOne({
          where: { _id: request.userId }
        });
        const organization = await this.organizationRepository.findOne({
          where: { _id: request.organizationId }
        });
        
        return {
          ...request,
          id: request._id,
          user: user ? { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email } : null,
          organization: organization ? { id: organization._id, name: organization.name } : null
        };
      })
    );
    
    return populatedRequests;
  }

  async approveRequest(requestId: string) {
    if (!ObjectId.isValid(requestId)) {
      throw new BadRequestException('Invalid request ID');
    }
    
    const request = await this.organizationRequestRepository.findOne({
      where: { _id: new ObjectId(requestId) }
    });
    
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Add user to organization
    const user = await this.userRepository.findOne({
      where: { _id: request.userId }
    });
    
    if (user && !user.organizationIds.some(id => id.toString() === request.organizationId.toString())) {
      user.organizationIds.push(request.organizationId);
      if (!user.currentOrganizationId) {
        user.currentOrganizationId = request.organizationId;
      }
      await this.userRepository.save(user);
    }

    // Update request status
    await this.organizationRequestRepository.update(
      new ObjectId(requestId),
      {
        status: RequestStatus.APPROVED,
        processedAt: new Date()
      }
    );
    
    return { success: true };
  }

  async rejectRequest(requestId: string) {
    if (!ObjectId.isValid(requestId)) {
      throw new BadRequestException('Invalid request ID');
    }
    
    const request = await this.organizationRequestRepository.findOne({
      where: { _id: new ObjectId(requestId) }
    });
    
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    await this.organizationRequestRepository.update(
      new ObjectId(requestId),
      {
        status: RequestStatus.REJECTED,
        processedAt: new Date()
      }
    );
    
    return { success: true };
  }

  async requestToJoin(userId: string, organizationId: string) {
    if (!userId || !organizationId) {
      throw new BadRequestException('User ID and Organization ID are required');
    }

    // Check if organization exists
    const organization = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(organizationId) }
    });
    
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    // Check if user already in organization
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    if (user.organizationIds?.some(id => id.toString() === organizationId)) {
      throw new BadRequestException('User already in organization');
    }

    // Check if request already exists
    const existingRequest = await this.organizationRequestRepository.findOne({
      where: {
        userId: new ObjectId(userId),
        organizationId: new ObjectId(organizationId),
        status: RequestStatus.PENDING
      }
    });
    
    if (existingRequest) {
      throw new BadRequestException('Request already pending');
    }

    // Create new request
    const request = this.organizationRequestRepository.create({
      userId: new ObjectId(userId),
      organizationId: new ObjectId(organizationId),
      status: RequestStatus.PENDING,
      requestedAt: new Date()
    });
    
    await this.organizationRequestRepository.save(request);
    return { success: true, message: 'Request submitted' };
  }



  async updateOrganizationModules(orgId: string, moduleIds: string[]) {
    const organization = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.organizationRepository.update(
      new ObjectId(orgId),
      { activeModuleIds: moduleIds.map(id => new ObjectId(id)) }
    );

    return { success: true };
  }

  async switchUserOrganization(userId: string, organizationId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orgObjectId = new ObjectId(organizationId);
    if (!user.organizationIds.some(id => id.toString() === organizationId)) {
      throw new BadRequestException('User not member of this organization');
    }

    await this.userRepository.update(
      new ObjectId(userId),
      { currentOrganizationId: orgObjectId }
    );

    return { success: true };
  }
}