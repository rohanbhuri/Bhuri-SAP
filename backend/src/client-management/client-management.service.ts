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

  async apiLogin(email: string, password: string, deviceId?: string, userAgent?: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const client = await this.clientRepository.findOne({ where: { userId: user._id, isDeleted: { $ne: true } } } as any);
    if (!client || !client.isActive) {
      throw new UnauthorizedException('Client account is inactive');
    }

    if (deviceId) {
      await this.handleSession(user, deviceId, userAgent);
    }

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const payload = {
      email: user.email,
      sub: user._id.toString(),
      organizationId: user.organizationId?.toString() || user.organizationIds?.[0]?.toString(),
      roles: roles.map(r => r.type),
      deviceId
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

  private async handleSession(user: User, deviceId: string, userAgent?: string) {
    if (!user.activeDevices) {
      user.activeDevices = [];
    }

    const existingDeviceIndex = user.activeDevices.findIndex(d => d.deviceId === deviceId);

    if (existingDeviceIndex !== -1) {
      user.activeDevices[existingDeviceIndex].lastActive = new Date();
      user.activeDevices[existingDeviceIndex].userAgent = userAgent;
    } else {
      if (user.maxDevices && user.activeDevices.length >= user.maxDevices) {
        throw new UnauthorizedException(`Maximum device limit reached (${user.maxDevices}). Please logout from another device.`);
      }
      user.activeDevices.push({
        deviceId,
        lastActive: new Date(),
        userAgent
      });
    }

    await this.userRepository.save(user);
  }

  async apiLogout(clientId: string, deviceId?: string) {
    const client = await this.clientRepository.findOne({ where: { _id: new ObjectId(clientId) } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (deviceId && client.userId) {
      const user = await this.userRepository.findOne({ where: { _id: client.userId } });
      if (user && user.activeDevices) {
        user.activeDevices = user.activeDevices.filter(d => d.deviceId !== deviceId);
        await this.userRepository.save(user);
      }
    }

    return { success: true, message: 'Logged out successfully' };
  }

  async createClientRequest(requestData: any) {
    // Validate required fields
    if (!requestData.email) {
      throw new BadRequestException('Email is required');
    }

    const existing = await this.clientRequestRepository.findOne({ 
      where: { email: requestData.email } 
    });
    
    if (existing) {
      throw new ConflictException('A request with this email already exists');
    }

    // Handle both formats: contactPerson or firstName/lastName
    const contactPerson = requestData.contactPerson || 
      `${requestData.firstName || ''} ${requestData.lastName || ''}`.trim() || 
      'Unknown';

    const clientRequest = this.clientRequestRepository.create({
      companyName: requestData.companyName || 'Not Provided',
      contactPerson,
      email: requestData.email,
      phone: requestData.phone || '',
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
    return this.clientRequestRepository.find({ 
      where: { isDeleted: { $ne: true } } as any,
      order: { createdAt: -1 } 
    });
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

    const changeLog = request.changeLog || [];
    const changes = [];
    const skipFields = ['updatedAt', 'reviewedAt', 'reviewedBy', 'changeLog', '_id'];
    for (const key in updateData) {
        if (skipFields.includes(key)) continue;
        if (JSON.stringify(request[key]) !== JSON.stringify(updateData[key])) {
            changes.push(key);
        }
    }
    if (changes.length > 0) {
        changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
    }

    Object.assign(request, updateData);
    request.reviewedBy = new ObjectId(userId);
    request.reviewedAt = new Date();
    request.changeLog = changeLog;

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
        organizationIds: [],
        roleIds: [clientRole._id],
        currency: 'INR',
        currencySymbol: '₹',
      } as any);
      const savedUser = await this.userRepository.save(user) as unknown as User;

      const client = this.clientRepository.create({
        _id: savedUser._id,
        userId: savedUser._id,
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
        allowApiAccess: conversionData.allowApiAccess || false,
        changeLog: [{ userId: adminUserId, action: 'created', timestamp: new Date(), details: 'Client created from request' }]
      });
      const savedClient = await this.clientRepository.save(client);

      await this.syncClientSecurityToUser(savedClient, savedUser as User);

      request.status = ClientRequestStatus.CONVERTED;
      request.convertedUserId = (savedUser as any)._id;
      // request.convertedOrganizationId = savedOrg._id;
      request.reviewedBy = new ObjectId(adminUserId);
      request.reviewedAt = new Date();
      await this.clientRequestRepository.save(request);

      return {
        client: savedClient,
        user: { ...(savedUser as any), password: undefined },
        organization: null,
        credentials: { email: (savedUser as any).email, password }
      };
    } catch (error) {
      console.error('Error in convertToClient:', error);
      throw error;
    }
  }

  async deleteClientRequest(requestId: string, userId?: string) {
    const request = await this.clientRequestRepository.findOne({ 
      where: { _id: new ObjectId(requestId) } 
    });
    
    if (!request) {
      throw new NotFoundException('Client request not found');
    }

    const changeLog = request.changeLog || [];
    if (userId) {
      changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Client request soft-deleted' });
    }

    await this.clientRequestRepository.update(
      { _id: new ObjectId(requestId) },
      { 
        isDeleted: true, 
        deletedAt: new Date(), 
        deletedBy: userId,
        changeLog
      }
    );
    return { message: 'Client request deleted successfully' };
  }

  async getAllClients() {
    return this.clientRepository.find({ 
      where: { isDeleted: { $ne: true } } as any,
      order: { createdAt: -1 } 
    });
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

  async updateClient(clientId: string, updateData: any, userId?: string) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const changeLog = client.changeLog || [];
    if (userId) {
        const changes = [];
        const skipFields = ['updatedAt', 'changeLog', '_id', 'userId'];
        for (const key in updateData) {
            if (skipFields.includes(key)) continue;
            if (JSON.stringify(client[key]) !== JSON.stringify(updateData[key])) {
                changes.push(key);
            }
        }
        if (changes.length > 0) {
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
        }
    }

    // Capture old userId before data update if it's being changed (though it shouldn't be)
    const existingUserId = client.userId;

    Object.assign(client, updateData);
    client.changeLog = changeLog;
    const updatedClient = await this.clientRepository.save(client);

    if (existingUserId) {
      const user = await this.userRepository.findOne({ 
        where: { _id: userId } 
      });
      if (user) {
        // Sync name and email if they were passed
        if (updateData.firstName) user.firstName = updateData.firstName;
        if (updateData.lastName) user.lastName = updateData.lastName;
        if (updateData.email) user.email = updateData.email;
        
        await this.userRepository.save(user);
        await this.syncClientSecurityToUser(updatedClient, user);
      }
    }

    return updatedClient;
  }

  async deleteClient(clientId: string, deletedBy?: string) {
    const client = await this.clientRepository.findOne({ 
      where: { _id: new ObjectId(clientId) } 
    });
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const changeLog = client.changeLog || [];
    if (deletedBy) {
      changeLog.push({ userId: deletedBy, action: 'deleted', timestamp: new Date(), details: 'Client account soft-deleted' });
    }

    await this.clientRepository.update(
      { _id: new ObjectId(clientId) },
      { 
        isDeleted: true, 
        isActive: false, 
        deletedAt: new Date(),
        deletedBy: deletedBy,
        changeLog
      }
    );

    if (client.userId) {
      await this.userRepository.update(
        { _id: client.userId },
        { isActive: false, isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy }
      );
    }

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
        organizationIds: client.organizationId ? [client.organizationId] : [],
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
      user.forcePasswordChange = client.forcePasswordChange;
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
      where: { ...query, isDeleted: { $ne: true } } as any,
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
    message.readAt = new Date();
    return this.contactUsRepository.save(message);
  }

  async deleteContactMessage(messageId: string, userId?: string) {
    const message = await this.contactUsRepository.findOne({ where: { _id: new ObjectId(messageId) } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const changeLog = message.changeLog || [];
    if (userId) {
      changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Contact message soft-deleted' });
    }

    await this.contactUsRepository.update(
      { _id: new ObjectId(messageId) },
      { 
        isDeleted: true, 
        deletedAt: new Date(), 
        deletedBy: userId,
        changeLog
      }
    );
    return { success: true, message: 'Message deleted successfully' };
  }

  async getContactUnreadCount(organizationId?: string) {
    const query: any = { isRead: false };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    return this.contactUsRepository.count({ where: { ...query, isDeleted: { $ne: true } } } as any);
  }

  async getAnalytics() {
    const requests = await this.clientRequestRepository.find({ where: { isDeleted: { $ne: true } } } as any);
    const clients = await this.clientRepository.find({ where: { isDeleted: { $ne: true } } } as any);
    const contactMessages = await this.contactUsRepository.find({ where: { isDeleted: { $ne: true } } } as any);

    // Request Stats
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === ClientRequestStatus.PENDING).length;
    const approvedRequests = requests.filter(r => r.status === ClientRequestStatus.APPROVED).length;
    const convertedRequests = requests.filter(r => r.status === ClientRequestStatus.CONVERTED).length;

    // Contact Us Stats
    const totalContact = contactMessages.length;
    const unreadContact = contactMessages.filter(m => !m.isRead).length;

    // Derived Data: average contact us read time
    const readMessages = contactMessages.filter(m => m.isRead && m.readAt);
    let avgReadTime = 0;
    if (readMessages.length > 0) {
      const totalReadTime = readMessages.reduce((sum, m) => {
        const diff = new Date(m.readAt).getTime() - new Date(m.createdAt).getTime();
        return sum + diff;
      }, 0);
      avgReadTime = totalReadTime / readMessages.length;
    }

    // Derived Data: client request to login creation time (conversion time)
    const convertedReqs = requests.filter(r => r.status === ClientRequestStatus.CONVERTED && r.reviewedAt);
    let avgConversionTime = 0;
    if (convertedReqs.length > 0) {
      const totalConversionTime = convertedReqs.reduce((sum, r) => {
        const diff = new Date(r.reviewedAt).getTime() - new Date(r.createdAt).getTime();
        return sum + diff;
      }, 0);
      avgConversionTime = totalConversionTime / convertedReqs.length;
    }

    // Recent Changes (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentChanges = {
      requests: requests.filter(r => r.createdAt && new Date(r.createdAt) >= sevenDaysAgo).length,
      clients: clients.filter(c => c.createdAt && new Date(c.createdAt) >= sevenDaysAgo).length,
      contactMessages: contactMessages.filter(m => m.createdAt && new Date(m.createdAt) >= sevenDaysAgo).length
    };

    // Requests by Country
    const requestsByCountry: Record<string, number> = {};
    const requestsByIndustry: Record<string, number> = {};
    const requestsByCompanySize: Record<string, number> = {};
    
    requests.forEach(r => {
      const country = r.country || 'Unknown';
      requestsByCountry[country] = (requestsByCountry[country] || 0) + 1;
      
      const industry = r.industry || 'Other';
      requestsByIndustry[industry] = (requestsByIndustry[industry] || 0) + 1;
      
      const size = r.companySize || 'Unknown';
      requestsByCompanySize[size] = (requestsByCompanySize[size] || 0) + 1;
    });

    // Clients by Industry
    const clientsByIndustry: Record<string, number> = {};
    clients.forEach(c => {
      const industry = c.industry || 'Other';
      clientsByIndustry[industry] = (clientsByIndustry[industry] || 0) + 1;
    });

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      convertedRequests,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.isActive).length,
      totalContact,
      unreadContact,
      avgReadTime: this.formatDuration(avgReadTime),
      avgConversionTime: this.formatDuration(avgConversionTime),
      recentChanges,
      requestsByCountry: Object.entries(requestsByCountry).map(([name, count]) => ({ name, count })),
      requestsByIndustry: Object.entries(requestsByIndustry).map(([name, count]) => ({ name, count })),
      requestsByCompanySize: Object.entries(requestsByCompanySize).map(([name, count]) => ({ name, count })),
      clientsByIndustry: Object.entries(clientsByIndustry).map(([name, count]) => ({ name, count }))
    };
  }

  private formatDuration(ms: number): string {
    if (ms <= 0) return '0h';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  async exportRequestsCSV(): Promise<string> {
    const requests = await this.clientRequestRepository.find({ where: { isDeleted: { $ne: true } } } as any);
    const headers = ['ID', 'Company', 'Contact', 'Email', 'Phone', 'Industry', 'Status', 'Message', 'Created At'];
    const rows = requests.map(r => [
      r._id.toString(),
      r.companyName || '',
      r.contactPerson,
      r.email,
      r.phone,
      r.industry || '',
      r.status,
      (r.message || '').replace(/\n/g, ' '),
      r.createdAt.toISOString()
    ]);
    return [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
  }

  async exportClientsCSV(): Promise<string> {
    const clients = await this.clientRepository.find({ where: { isDeleted: { $ne: true } } } as any);
    const headers = ['ID', 'Company', 'Contact', 'Email', 'Phone', 'Industry', 'Active', 'Created At'];
    const rows = clients.map(c => [
      c._id.toString(),
      c.companyName,
      c.contactPerson,
      c.email,
      c.phone,
      c.industry || '',
      c.isActive ? 'Yes' : 'No',
      c.createdAt.toISOString()
    ]);
    return [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
  }

  async exportContactMessagesCSV(): Promise<string> {
    const messages = await this.contactUsRepository.find({ where: { isDeleted: { $ne: true } } } as any);
    const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Read', 'Created At'];
    const rows = messages.map(m => [
      m._id.toString(),
      m.name,
      m.email,
      m.subject,
      (m.message || '').replace(/\n/g, ' '),
      m.isRead ? 'Yes' : 'No',
      m.createdAt.toISOString()
    ]);
    return [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
  }
}
