import { Injectable, ConflictException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ClientRequest, ClientRequestStatus } from '../entities/client-request.entity';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role, RoleType } from '../entities/role.entity';
import { ContactUs } from '../entities/contact-us.entity';
import { JwtService } from '@nestjs/jwt';
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
    @InjectRepository(ContactUs)
    private contactUsRepository: MongoRepository<ContactUs>,
    private jwtService: JwtService,
  ) {}

  async apiLogin(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const client = await this.clientRepository.findOne({ where: { userId: user._id } });
    if (!client || !client.isActive) {
      throw new UnauthorizedException('Client account is inactive');
    }

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const payload = {
      email: user.email,
      sub: user._id.toString(),
      organizationId: user.organizationId?.toString() || user.organizationIds[0]?.toString(),
      roles: roles.map(r => r.type)
    };

    const { password: _, ...userWithoutPassword } = user;
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
      client: {
        id: client._id.toString(),
        companyName: client.companyName,
        email: client.email
      },
      roles: roles.map(r => ({ id: r._id.toString(), name: r.name, type: r.type }))
    };
  }

  async apiLogout(clientId: string) {
    const client = await this.clientRepository.findOne({ where: { _id: new ObjectId(clientId) } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return { success: true, message: 'Logged out successfully' };
  }

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
    try {
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
        roleIds: [clientRole._id]
      } as any);
      const savedUser = await this.userRepository.save(user) as unknown as User;

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
        expiryDate: conversionData.expiryDate ? new Date(conversionData.expiryDate) : null,
        ipWhitelist: conversionData.ipWhitelist,
        requireTwoFactor: conversionData.requireTwoFactor || false,
        forcePasswordChange: conversionData.forcePasswordChange || false,
        restrictToBusinessHours: conversionData.restrictToBusinessHours || false,
        allowApiAccess: conversionData.allowApiAccess || false
      });
      const savedClient = await this.clientRepository.save(client);

      await this.syncClientSecurityToUser(savedClient, savedUser as User);

      request.status = ClientRequestStatus.CONVERTED;
      request.convertedUserId = (savedUser as any)._id;
      request.convertedOrganizationId = savedOrg._id;
      request.reviewedBy = new ObjectId(adminUserId);
      request.reviewedAt = new Date();
      await this.clientRequestRepository.save(request);

      return {
        client: savedClient,
        user: { ...(savedUser as any), password: undefined },
        organization: savedOrg,
        credentials: { email: (savedUser as any).email, password }
      };
    } catch (error) {
      console.error('Error in convertToClient:', error);
      throw error;
    }
  }

  async deleteClientRequest(requestId: string) {
    const request = await this.clientRequestRepository.findOne({ 
      where: { _id: new ObjectId(requestId) } 
    });
    
    if (!request) {
      throw new NotFoundException('Client request not found');
    }

    await this.clientRequestRepository.delete(requestId);
    return { message: 'Client request deleted successfully' };
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
    const updatedClient = await this.clientRepository.save(client);

    if (client.userId) {
      const user = await this.userRepository.findOne({ 
        where: { _id: client.userId } 
      });
      if (user) {
        await this.syncClientSecurityToUser(updatedClient, user);
      }
    }

    return updatedClient;
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

  async requestLoginCredentials(clientId: string, credentialData: any) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    let user = await this.userRepository.findOne({ 
      where: { _id: client.userId } 
    });

    const password = this.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      user.password = hashedPassword;
      user.forcePasswordChange = true;
      user = await this.userRepository.save(user);
    } else {
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

      const newUser = this.userRepository.create({
        email: credentialData.email || client.email,
        password: hashedPassword,
        firstName: credentialData.firstName || client.contactPerson.split(' ')[0],
        lastName: credentialData.lastName || client.contactPerson.split(' ').slice(1).join(' '),
        isActive: true,
        organizationId: client.organizationId,
        organizationIds: [client.organizationId],
        roleIds: [clientRole._id],
        forcePasswordChange: true
      } as any);
      user = await this.userRepository.save(newUser) as unknown as User;
      client.userId = (user as any)._id;
      await this.clientRepository.save(client);
    }

    await this.syncClientSecurityToUser(client, user);

    return {
      success: true,
      message: 'Login credentials created successfully',
      credentials: {
        email: user.email,
        password,
        userId: user._id
      }
    };
  }

  private async syncClientSecurityToUser(client: Client, user: User): Promise<void> {
    try {
      user.requireTwoFactor = client.requireTwoFactor;
      user.sessionTimeout = client.sessionTimeout;
      user.restrictToBusinessHours = client.restrictToBusinessHours;
      user.allowApiAccess = client.allowApiAccess;
      user.expiryDate = client.expiryDate;
      user.ipWhitelist = client.ipWhitelist;
      user.maxDevices = client.maxDevices;
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error in syncClientSecurityToUser:', error);
      throw error;
    }
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

  async getSecuritySettings(clientId: string) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return {
      requireTwoFactor: client.requireTwoFactor,
      sessionTimeout: client.sessionTimeout,
      restrictToBusinessHours: client.restrictToBusinessHours,
      allowApiAccess: client.allowApiAccess,
      expiryDate: client.expiryDate,
      ipWhitelist: client.ipWhitelist,
      maxDevices: client.maxDevices
    };
  }

  async updateSecuritySettings(clientId: string, settings: any) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    Object.assign(client, settings);
    const updatedClient = await this.clientRepository.save(client);

    if (client.userId) {
      const user = await this.userRepository.findOne({ 
        where: { _id: client.userId } 
      });
      if (user) {
        await this.syncClientSecurityToUser(updatedClient, user);
      }
    }

    return this.getSecuritySettings(clientId);
  }

  async createContactMessage(messageData: any) {
    const contactUs = this.contactUsRepository.create({
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
      organizationId: messageData.organizationId?.toString() || '',
    } as any);
    return this.contactUsRepository.save(contactUs);
  }

  async getAllContactMessages(organizationId?: string) {
    const query: any = {};
    if (organizationId) {
      query.organizationId = organizationId;
    }
    return this.contactUsRepository.find({
      where: query,
      order: { createdAt: -1 }
    });
  }

  async getContactMessageById(messageId: string) {
    const message = await this.contactUsRepository.findOne({
      where: { _id: new ObjectId(messageId) }
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async markContactMessageAsRead(messageId: string) {
    const message = await this.getContactMessageById(messageId);
    message.isRead = true;
    return this.contactUsRepository.save(message);
  }

  async deleteContactMessage(messageId: string) {
    const result = await this.contactUsRepository.delete({ _id: new ObjectId(messageId) });
    if (result.affected === 0) {
      throw new NotFoundException('Message not found');
    }
    return { success: true, message: 'Message deleted successfully' };
  }

  async getContactUnreadCount(organizationId?: string) {
    const query: any = { isRead: false };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    return this.contactUsRepository.count({ where: query });
  }
}
