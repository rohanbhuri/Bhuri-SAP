import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { RoleType } from '../entities/role.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async findAll() {
    return this.organizationRepository.find();
  }

  async create(orgData: any) {
    const organization = this.organizationRepository.create(orgData);
    return this.organizationRepository.save(organization);
  }

  async update(id: string, updateData: any) {
    await this.organizationRepository.update(new ObjectId(id), updateData);
    return this.organizationRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async delete(id: string) {
    return this.organizationRepository.delete(new ObjectId(id));
  }

  async findUserOrganizations(userId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });
    
    if (!user || user.organizationIds.length === 0) {
      return [];
    }

    return this.organizationRepository.find({
      where: { _id: { $in: user.organizationIds } }
    });
  }

  async findPublicOrganizations() {
    return this.organizationRepository.find({
      where: { isPublic: true }
    });
  }

  async createOrganization(orgData: any, creatorId: string) {
    // Check if code already exists
    const existingOrg = await this.organizationRepository.findOne({
      where: { code: orgData.code }
    });
    
    if (existingOrg) {
      throw new Error('Organization code already exists');
    }

    const organization = this.organizationRepository.create({
      ...orgData,
      memberCount: 1,
      activeModuleIds: [],
      createdAt: new Date()
    });
    
    const savedOrg = await this.organizationRepository.save(organization) as unknown as Organization;

    // Add creator to organization
    const creator = await this.userRepository.findOne({
      where: { _id: new ObjectId(creatorId) }
    });
    
    if (creator) {
      if (!creator.organizationIds) creator.organizationIds = [];
      creator.organizationIds.push(savedOrg._id);
      if (!creator.currentOrganizationId) {
        creator.currentOrganizationId = savedOrg._id;
      }
      await this.userRepository.save(creator);
    }

    return savedOrg;
  }
}