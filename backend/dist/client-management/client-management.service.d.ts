import { MongoRepository } from 'typeorm';
import { ClientRequest } from '../entities/client-request.entity';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role, RoleType } from '../entities/role.entity';
import { ContactUs } from '../entities/contact-us.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../notifications/mail.service';
export declare class ClientManagementService {
    private clientRequestRepository;
    private clientRepository;
    private userRepository;
    private organizationRepository;
    private roleRepository;
    private contactUsRepository;
    private jwtService;
    private mailService;
    constructor(clientRequestRepository: MongoRepository<ClientRequest>, clientRepository: MongoRepository<Client>, userRepository: MongoRepository<User>, organizationRepository: MongoRepository<Organization>, roleRepository: MongoRepository<Role>, contactUsRepository: MongoRepository<ContactUs>, jwtService: JwtService, mailService: MailService);
    apiLogin(email: string, password: string, deviceId?: string, userAgent?: string, ip?: string): Promise<{
        access_token: string;
        user: {
            _id: import("typeorm").ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            avatar?: string;
            currency: string;
            currencySymbol: string;
            isActive: boolean;
            organizationIds: import("typeorm").ObjectId[];
            organizationId?: import("typeorm").ObjectId;
            roleIds: import("typeorm").ObjectId[];
            activeModuleIds: import("typeorm").ObjectId[];
            isOnline: boolean;
            lastSeen?: Date;
            forcePasswordChange: boolean;
            requireTwoFactor: boolean;
            sessionTimeout?: number;
            restrictToBusinessHours: boolean;
            allowApiAccess: boolean;
            expiryDate?: Date;
            ipWhitelist?: string;
            maxDevices?: number;
            activeDevices: {
                deviceId: string;
                lastActive: Date;
                userAgent?: string;
            }[];
            isDeleted: boolean;
            deletedAt: Date;
            deletedBy: string;
            changeLog: Array<{
                userId: string;
                action: string;
                timestamp: Date;
                details?: string;
            }>;
            enableEmailNotifications: boolean;
            createdAt: Date;
            passwordResetToken?: string;
            passwordResetExpires?: Date;
            passwordResetUsed?: boolean;
        };
        client: {
            id: string;
            companyName: string;
            email: string;
        };
        roles: {
            id: string;
            name: string;
            type: RoleType;
        }[];
    }>;
    private handleSession;
    apiLogout(clientId: string, deviceId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createClientRequest(requestData: any): Promise<ClientRequest>;
    getAllClientRequests(): Promise<ClientRequest[]>;
    getClientRequestById(requestId: string): Promise<ClientRequest>;
    updateClientRequest(requestId: string, updateData: any, userId: string): Promise<ClientRequest>;
    convertToClient(requestId: string, conversionData: any, adminUserId: string): Promise<{
        client: Client;
        user: any;
        organization: any;
        credentials: {
            email: any;
            password: any;
        };
    }>;
    deleteClientRequest(requestId: string, userId?: string): Promise<{
        message: string;
    }>;
    getAllClients(): Promise<Client[]>;
    getClientById(clientId: string): Promise<Client>;
    updateClient(clientId: string, updateData: any, userId?: string): Promise<Client>;
    deleteClient(clientId: string, deletedBy?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleClientStatus(clientId: string, isActive: boolean): Promise<Client>;
    requestLoginCredentials(clientId: string, credentialData: any): Promise<{
        success: boolean;
        message: string;
        credentials: {
            email: string;
            password: string;
            userId: import("typeorm").ObjectId;
        };
    }>;
    private syncClientSecurityToUser;
    private generatePassword;
    getSecuritySettings(clientId: string): Promise<{
        requireTwoFactor: boolean;
        sessionTimeout: number;
        restrictToBusinessHours: boolean;
        allowApiAccess: boolean;
        expiryDate: Date;
        ipWhitelist: string;
        maxDevices: number;
    }>;
    updateSecuritySettings(clientId: string, settings: any): Promise<{
        requireTwoFactor: boolean;
        sessionTimeout: number;
        restrictToBusinessHours: boolean;
        allowApiAccess: boolean;
        expiryDate: Date;
        ipWhitelist: string;
        maxDevices: number;
    }>;
    createContactMessage(messageData: any): Promise<any>;
    getAllContactMessages(organizationId?: string): Promise<ContactUs[]>;
    getContactMessageById(messageId: string): Promise<ContactUs>;
    markContactMessageAsRead(messageId: string): Promise<ContactUs>;
    deleteContactMessage(messageId: string, userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getContactUnreadCount(organizationId?: string): Promise<number>;
    getAnalytics(): Promise<{
        totalRequests: number;
        pendingRequests: number;
        approvedRequests: number;
        convertedRequests: number;
        totalClients: number;
        activeClients: number;
        totalContact: number;
        unreadContact: number;
        avgReadTime: string;
        avgConversionTime: string;
        recentChanges: {
            requests: number;
            clients: number;
            contactMessages: number;
        };
        requestsByCountry: {
            name: string;
            count: number;
        }[];
        requestsByIndustry: {
            name: string;
            count: number;
        }[];
        requestsByCompanySize: {
            name: string;
            count: number;
        }[];
        clientsByIndustry: {
            name: string;
            count: number;
        }[];
    }>;
    private formatDuration;
    exportRequestsCSV(): Promise<string>;
    exportClientsCSV(): Promise<string>;
    exportContactMessagesCSV(): Promise<string>;
}
