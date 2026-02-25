"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const client_request_entity_1 = require("../entities/client-request.entity");
const client_entity_1 = require("../entities/client.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const role_entity_1 = require("../entities/role.entity");
const contact_us_entity_1 = require("../entities/contact-us.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const mail_service_1 = require("../notifications/mail.service");
let ClientManagementService = class ClientManagementService {
    constructor(clientRequestRepository, clientRepository, userRepository, organizationRepository, roleRepository, contactUsRepository, jwtService, mailService) {
        this.clientRequestRepository = clientRequestRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
        this.contactUsRepository = contactUsRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async apiLogin(email, password, deviceId, userAgent, ip) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        const client = await this.clientRepository.findOne({ where: { userId: user._id, isDeleted: { $ne: true } } });
        if (!client || !client.isActive) {
            throw new common_1.UnauthorizedException('Client account is inactive');
        }
        if (user.ipWhitelist && user.ipWhitelist.trim() !== '') {
            const allowedIps = user.ipWhitelist.split(',').map(i => i.trim());
            if (ip && !allowedIps.includes(ip) && !allowedIps.includes('127.0.0.1') && !allowedIps.includes('::1')) {
                throw new common_1.UnauthorizedException(`Access from IP ${ip} is not allowed.`);
            }
        }
        if (user.restrictToBusinessHours) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours + minutes / 60;
            if (currentTime < 9 || currentTime >= 18) {
                throw new common_1.UnauthorizedException('Login is restricted to business hours (9:00 AM - 6:00 PM).');
            }
        }
        await this.handleSession(user, deviceId || `agent-${Buffer.from(userAgent || 'unknown').toString('base64').substring(0, 16)}`, userAgent);
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
        const signOptions = {};
        if (user.sessionTimeout) {
            signOptions.expiresIn = `${user.sessionTimeout}m`;
        }
        return {
            access_token: this.jwtService.sign(payload, signOptions),
            user: userWithoutPassword,
            client: {
                id: client._id.toString(),
                companyName: client.companyName,
                email: client.email
            },
            roles: roles.map(r => ({ id: r._id.toString(), name: r.name, type: r.type }))
        };
    }
    async handleSession(user, deviceId, userAgent) {
        if (!user.activeDevices) {
            user.activeDevices = [];
        }
        const existingDeviceIndex = user.activeDevices.findIndex(d => d.deviceId === deviceId);
        if (existingDeviceIndex !== -1) {
            user.activeDevices[existingDeviceIndex].lastActive = new Date();
            user.activeDevices[existingDeviceIndex].userAgent = userAgent;
        }
        else {
            if (user.maxDevices && user.activeDevices.length >= user.maxDevices) {
                throw new common_1.UnauthorizedException(`Maximum device limit reached (${user.maxDevices}). Please logout from another device.`);
            }
            user.activeDevices.push({
                deviceId,
                lastActive: new Date(),
                userAgent
            });
        }
        await this.userRepository.save(user);
    }
    async apiLogout(clientId, deviceId) {
        const client = await this.clientRepository.findOne({ where: { _id: new mongodb_1.ObjectId(clientId) } });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
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
    async createClientRequest(requestData) {
        if (!requestData.email) {
            throw new common_1.BadRequestException('Email is required');
        }
        const existing = await this.clientRequestRepository.findOne({
            where: { email: requestData.email }
        });
        if (existing) {
            throw new common_1.ConflictException('A request with this email already exists');
        }
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
            status: client_request_entity_1.ClientRequestStatus.PENDING
        });
        const savedRequest = await this.clientRequestRepository.save(clientRequest);
        const emailResult = await this.mailService.sendCredentialRequestNotification({
            companyName: savedRequest.companyName,
            contactPerson: savedRequest.contactPerson,
            email: savedRequest.email,
            phone: savedRequest.phone
        });
        console.log('[ClientManagementService] Credential request email result:', emailResult);
        return savedRequest;
    }
    async getAllClientRequests() {
        return this.clientRequestRepository.find({
            where: { isDeleted: { $ne: true } },
            order: { createdAt: -1 }
        });
    }
    async getClientRequestById(requestId) {
        const request = await this.clientRequestRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(requestId) }
        });
        if (!request) {
            throw new common_1.NotFoundException('Client request not found');
        }
        return request;
    }
    async updateClientRequest(requestId, updateData, userId) {
        const request = await this.clientRequestRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(requestId) }
        });
        if (!request) {
            throw new common_1.NotFoundException('Client request not found');
        }
        const changeLog = request.changeLog || [];
        const changes = [];
        const skipFields = ['updatedAt', 'reviewedAt', 'reviewedBy', 'changeLog', '_id'];
        for (const key in updateData) {
            if (skipFields.includes(key))
                continue;
            if (JSON.stringify(request[key]) !== JSON.stringify(updateData[key])) {
                changes.push(key);
            }
        }
        if (changes.length > 0) {
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
        }
        Object.assign(request, updateData);
        request.reviewedBy = new mongodb_1.ObjectId(userId);
        request.reviewedAt = new Date();
        request.changeLog = changeLog;
        return this.clientRequestRepository.save(request);
    }
    async convertToClient(requestId, conversionData, adminUserId) {
        try {
            const request = await this.clientRequestRepository.findOne({
                where: { _id: new mongodb_1.ObjectId(requestId) }
            });
            if (!request) {
                throw new common_1.NotFoundException('Client request not found');
            }
            if (request.status === client_request_entity_1.ClientRequestStatus.CONVERTED) {
                throw new common_1.BadRequestException('This request has already been converted');
            }
            const existingUser = await this.userRepository.findOne({
                where: { email: request.email }
            });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            let clientRole = await this.roleRepository.findOne({
                where: { type: role_entity_1.RoleType.CLIENT }
            });
            if (!clientRole) {
                clientRole = await this.roleRepository.save(this.roleRepository.create({
                    name: 'Client',
                    type: role_entity_1.RoleType.CLIENT,
                    description: 'Client user with limited access',
                    permissionIds: []
                }));
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
            });
            const savedUser = await this.userRepository.save(user);
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
            await this.syncClientSecurityToUser(savedClient, savedUser);
            request.status = client_request_entity_1.ClientRequestStatus.CONVERTED;
            request.convertedUserId = savedUser._id;
            request.reviewedBy = new mongodb_1.ObjectId(adminUserId);
            request.reviewedAt = new Date();
            await this.clientRequestRepository.save(request);
            return {
                client: savedClient,
                user: { ...savedUser, password: undefined },
                organization: null,
                credentials: { email: savedUser.email, password }
            };
        }
        catch (error) {
            console.error('Error in convertToClient:', error);
            throw error;
        }
    }
    async deleteClientRequest(requestId, userId) {
        const request = await this.clientRequestRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(requestId) }
        });
        if (!request) {
            throw new common_1.NotFoundException('Client request not found');
        }
        const changeLog = request.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Client request soft-deleted' });
        }
        await this.clientRequestRepository.update({ _id: new mongodb_1.ObjectId(requestId) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
        return { message: 'Client request deleted successfully' };
    }
    async getAllClients() {
        return this.clientRepository.find({
            where: { isDeleted: { $ne: true } },
            order: { createdAt: -1 }
        });
    }
    async getClientById(clientId) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        return client;
    }
    async updateClient(clientId, updateData, userId) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        const changeLog = client.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'changeLog', '_id', 'userId'];
            for (const key in updateData) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(client[key]) !== JSON.stringify(updateData[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }
        const existingUserId = client.userId;
        Object.assign(client, updateData);
        client.changeLog = changeLog;
        const updatedClient = await this.clientRepository.save(client);
        if (existingUserId) {
            const user = await this.userRepository.findOne({
                where: { _id: userId }
            });
            if (user) {
                if (updateData.firstName)
                    user.firstName = updateData.firstName;
                if (updateData.lastName)
                    user.lastName = updateData.lastName;
                if (updateData.email)
                    user.email = updateData.email;
                await this.userRepository.save(user);
                await this.syncClientSecurityToUser(updatedClient, user);
            }
        }
        return updatedClient;
    }
    async deleteClient(clientId, deletedBy) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        const changeLog = client.changeLog || [];
        if (deletedBy) {
            changeLog.push({ userId: deletedBy, action: 'deleted', timestamp: new Date(), details: 'Client account soft-deleted' });
        }
        await this.clientRepository.update({ _id: new mongodb_1.ObjectId(clientId) }, {
            isDeleted: true,
            isActive: false,
            deletedAt: new Date(),
            deletedBy: deletedBy,
            changeLog
        });
        if (client.userId) {
            await this.userRepository.update({ _id: client.userId }, { isActive: false, isDeleted: true, deletedAt: new Date(), deletedBy: deletedBy });
        }
        return { success: true, message: 'Client deleted successfully' };
    }
    async toggleClientStatus(clientId, isActive) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        client.isActive = isActive;
        await this.userRepository.update({ _id: client.userId }, { isActive });
        return this.clientRepository.save(client);
    }
    async requestLoginCredentials(clientId, credentialData) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
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
        }
        else {
            let clientRole = await this.roleRepository.findOne({
                where: { type: role_entity_1.RoleType.CLIENT }
            });
            if (!clientRole) {
                clientRole = await this.roleRepository.save(this.roleRepository.create({
                    name: 'Client',
                    type: role_entity_1.RoleType.CLIENT,
                    description: 'Client user with limited access',
                    permissionIds: []
                }));
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
            });
            user = await this.userRepository.save(newUser);
            client.userId = user._id;
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
    async syncClientSecurityToUser(client, user) {
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
        }
        catch (error) {
            console.error('Error in syncClientSecurityToUser:', error);
            throw error;
        }
    }
    generatePassword() {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
    async getSecuritySettings(clientId) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
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
    async updateSecuritySettings(clientId, settings) {
        const client = await this.clientRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(clientId) }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
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
    async createContactMessage(messageData) {
        const contactUs = this.contactUsRepository.create({
            name: messageData.name,
            email: messageData.email,
            subject: messageData.subject,
            message: messageData.message,
            organizationId: messageData.organizationId?.toString() || '',
        });
        const savedContact = await this.contactUsRepository.save(contactUs);
        const emailResult = await this.mailService.sendContactUsNotification({
            name: savedContact.name,
            email: savedContact.email,
            subject: savedContact.subject || 'No Subject',
            message: savedContact.message
        });
        console.log('[ClientManagementService] Contact us email result:', emailResult);
        return savedContact;
    }
    async getAllContactMessages(organizationId) {
        const query = {};
        if (organizationId) {
            query.organizationId = organizationId;
        }
        return this.contactUsRepository.find({
            where: { ...query, isDeleted: { $ne: true } },
            order: { createdAt: -1 }
        });
    }
    async getContactMessageById(messageId) {
        const message = await this.contactUsRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(messageId) }
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        return message;
    }
    async markContactMessageAsRead(messageId) {
        const message = await this.getContactMessageById(messageId);
        message.isRead = true;
        message.readAt = new Date();
        return this.contactUsRepository.save(message);
    }
    async deleteContactMessage(messageId, userId) {
        const message = await this.contactUsRepository.findOne({ where: { _id: new mongodb_1.ObjectId(messageId) } });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        const changeLog = message.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Contact message soft-deleted' });
        }
        await this.contactUsRepository.update({ _id: new mongodb_1.ObjectId(messageId) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
        return { success: true, message: 'Message deleted successfully' };
    }
    async getContactUnreadCount(organizationId) {
        const query = { isRead: false };
        if (organizationId) {
            query.organizationId = organizationId;
        }
        return this.contactUsRepository.count({ where: { ...query, isDeleted: { $ne: true } } });
    }
    async getAnalytics() {
        const requests = await this.clientRequestRepository.find({ where: { isDeleted: { $ne: true } } });
        const clients = await this.clientRepository.find({ where: { isDeleted: { $ne: true } } });
        const contactMessages = await this.contactUsRepository.find({ where: { isDeleted: { $ne: true } } });
        const totalRequests = requests.length;
        const pendingRequests = requests.filter(r => r.status === client_request_entity_1.ClientRequestStatus.PENDING).length;
        const approvedRequests = requests.filter(r => r.status === client_request_entity_1.ClientRequestStatus.APPROVED).length;
        const convertedRequests = requests.filter(r => r.status === client_request_entity_1.ClientRequestStatus.CONVERTED).length;
        const totalContact = contactMessages.length;
        const unreadContact = contactMessages.filter(m => !m.isRead).length;
        const readMessages = contactMessages.filter(m => m.isRead && m.readAt);
        let avgReadTime = 0;
        if (readMessages.length > 0) {
            const totalReadTime = readMessages.reduce((sum, m) => {
                const diff = new Date(m.readAt).getTime() - new Date(m.createdAt).getTime();
                return sum + diff;
            }, 0);
            avgReadTime = totalReadTime / readMessages.length;
        }
        const convertedReqs = requests.filter(r => r.status === client_request_entity_1.ClientRequestStatus.CONVERTED && r.reviewedAt);
        let avgConversionTime = 0;
        if (convertedReqs.length > 0) {
            const totalConversionTime = convertedReqs.reduce((sum, r) => {
                const diff = new Date(r.reviewedAt).getTime() - new Date(r.createdAt).getTime();
                return sum + diff;
            }, 0);
            avgConversionTime = totalConversionTime / convertedReqs.length;
        }
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentChanges = {
            requests: requests.filter(r => r.createdAt && new Date(r.createdAt) >= sevenDaysAgo).length,
            clients: clients.filter(c => c.createdAt && new Date(c.createdAt) >= sevenDaysAgo).length,
            contactMessages: contactMessages.filter(m => m.createdAt && new Date(m.createdAt) >= sevenDaysAgo).length
        };
        const requestsByCountry = {};
        const requestsByIndustry = {};
        const requestsByCompanySize = {};
        requests.forEach(r => {
            const country = r.country || 'Unknown';
            requestsByCountry[country] = (requestsByCountry[country] || 0) + 1;
            const industry = r.industry || 'Other';
            requestsByIndustry[industry] = (requestsByIndustry[industry] || 0) + 1;
            const size = r.companySize || 'Unknown';
            requestsByCompanySize[size] = (requestsByCompanySize[size] || 0) + 1;
        });
        const clientsByIndustry = {};
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
    formatDuration(ms) {
        if (ms <= 0)
            return '0h';
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0)
            return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }
    async exportRequestsCSV() {
        const requests = await this.clientRequestRepository.find({ where: { isDeleted: { $ne: true } } });
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
    async exportClientsCSV() {
        const clients = await this.clientRepository.find({ where: { isDeleted: { $ne: true } } });
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
    async exportContactMessagesCSV() {
        const messages = await this.contactUsRepository.find({ where: { isDeleted: { $ne: true } } });
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
};
exports.ClientManagementService = ClientManagementService;
exports.ClientManagementService = ClientManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_request_entity_1.ClientRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(4, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(5, (0, typeorm_1.InjectRepository)(contact_us_entity_1.ContactUs)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        jwt_1.JwtService,
        mail_service_1.MailService])
], ClientManagementService);
//# sourceMappingURL=client-management.service.js.map