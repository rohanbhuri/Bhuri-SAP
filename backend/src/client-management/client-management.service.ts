import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ClientRequest, ClientRequestStatus } from '../entities/client-request.entity';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role, RoleType } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientManagementService {
  constructor(
    @InjectRepository(ClientRequest)
    private clientRequestRepository: MongoRepository<ClientRequest>,
    @InjectRepository(Client)
    private clientRepository: MongoRepository<Client>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
  ) {}

  async createClientRequest(requestData: any) {
    const existing = await this.clientRequestRepository.findOne({ 
      where: { email: requestData.email } 
    });
    
    if (existing) {
      throw new ConflictException('A request with this email already exists');
    }

    const clientRequest = this.clientRequestRepository.create({
      companyName: requestData.companyName,
      contactPerson: requestData.contactPerson,
      email: requestData.email,
      phone: requestData.phone,
      website: requestData.website,
      industry: requestData.industry,
      companySize: requestData.companySize,
      address: requestData.address,
      city: requestData.city,
      country: requestData.country,
      message: requestData.message,
      status: ClientRequestStatus.PENDING
    });

    return this.clientRequestRepository.save(clientRequest);
  }

  async getAllClientRequests() {
    return this.clientRequestRepository.find({ order: { createdAt: -1 } });
  }

  async getClientRequestById(requestId: string) {
    const request = await this.clientRequestRepository.findOne({ 
      where: { _id: new ObjectId(requestId) } 
    });
    
    if (!request) {
      throw new NotFoundException('Client request not found');
    }
    
    return request;
  }

  async updateClientRequest(requestId: string, updateData: any, userId: string) {
    const request = await this.clientRequestRepository.findOne({ 
      where: { _id: new ObjectId(requestId) } 
    });
    
    if (!request) {
      throw new NotFoundException('Client request not found');
    }

    Object.assign(request, updateData);
    request.reviewedBy = new ObjectId(userId);
    request.reviewedAt = new Date();

    return this.clientRequestRepository.save(request);
  }

  async convertToClient(requestId: string, conversionData: any, adminUserId: string) {
    const request = await this.clientRequestRepository.findOne({ 
      where: { _id: new ObjectId(requestId) } 
    });
    
    if (!request) {
      throw new NotFoundException('Client request not found');
    }

    if (request.status === ClientRequestStatus.CONVERTED) {
      throw new BadRequestException('This request has already been converted');
    }

    const existingUser = await this.userRepository.findOne({ 
      where: { email: request.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const organization = this.organizationRepository.create({
      name: conversionData.companyName || request.companyName,
      code: (conversionData.companyName || request.companyName).toLowerCase().replace(/\s+/g, '-'),
      description: conversionData.industry || request.industry || '',
      isPublic: false,
      memberCount: 1,
      activeModuleIds: []
    });
    const savedOrg = await this.organizationRepository.save(organization);

    let clientRole = await this.roleRepository.findOne({ 
      where: { type: RoleType.CLIENT } 
    });
    
    if (!clientRole) {
      clientRole = await this.roleRepository.save(
        this.roleRepository.create({
          name: 'Client',
          type: RoleType.CLIENT,
          description: 'Client user with limited access',
          permissionIds: []
        })
      );
    }

    const password = conversionData.password || this.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email: conversionData.email || request.email,
      password: hashedPassword,
      firstName: conversionData.firstName || request.contactPerson.split(' ')[0],
      lastName: conversionData.lastName || request.contactPerson.split(' ').slice(1).join(' '),
      isActive: true,
      organizationId: savedOrg._id,
      organizationIds: [savedOrg._id],
      roleIds: [clientRole._id],
      permissionIds: []
    });
    const savedUser = await this.userRepository.save(user);

    const client = this.clientRepository.create({
      userId: savedUser._id,
      organizationId: savedOrg._id,
      companyName: conversionData.companyName || request.companyName,
      contactPerson: `${conversionData.firstName} ${conversionData.lastName}`,
      email: conversionData.email || request.email,
      phone: conversionData.phone || request.phone,
      website: conversionData.website || request.website,
      industry: conversionData.industry || request.industry,
      companySize: conversionData.companySize || request.companySize,
      address: conversionData.address || request.address,
      city: conversionData.city || request.city,
      country: conversionData.country || request.country,
      taxId: conversionData.taxId,
      billingAddress: conversionData.billingAddress,
      isActive: true,
      notes: conversionData.notes,
      maxDevices: conversionData.maxDevices,
      sessionTimeout: conversionData.sessionTimeout,
      expiryDate: conversionData.expiryDate,
      ipWhitelist: conversionData.ipWhitelist,
      requireTwoFactor: conversionData.requireTwoFactor || false,
      forcePasswordChange: conversionData.forcePasswordChange || false,
      restrictToBusinessHours: conversionData.restrictToBusinessHours || false,
      allowApiAccess: conversionData.allowApiAccess || false
    });
    const savedClient = await this.clientRepository.save(client);

    request.status = ClientRequestStatus.CONVERTED;
    request.convertedUserId = savedUser._id;
    request.convertedOrganizationId = savedOrg._id;
    request.reviewedBy = new ObjectId(adminUserId);
    request.reviewedAt = new Date();
    await this.clientRequestRepository.save(request);

    return {
      client: savedClient,
      user: { ...savedUser, password: undefined },
      organization: savedOrg,
      credentials: { email: savedUser.email, password }
    };
  }

  async getAllClients() {
    return this.clientRepository.find({ order: { createdAt: -1 } });
  }

  async getClientById(clientId: string) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
    return client;
  }

  async updateClient(clientId: string, updateData: any) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    Object.assign(client, updateData);
    return this.clientRepository.save(client);
  }

  async deleteClient(clientId: string) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientRepository.delete({ _id: new ObjectId(clientId) });
    return { success: true, message: 'Client deleted successfully' };
  }

  async toggleClientStatus(clientId: string, isActive: boolean) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.isActive = isActive;
    await this.userRepository.update({ _id: client.userId }, { isActive });
    return this.clientRepository.save(client);
  }

  private generatePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}
