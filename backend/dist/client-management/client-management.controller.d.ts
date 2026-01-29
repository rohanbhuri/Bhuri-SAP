import { ClientManagementService } from './client-management.service';
import { RoleType } from '../entities/role.entity';
export declare class ClientManagementController {
    private clientManagementService;
    constructor(clientManagementService: ClientManagementService);
    apiLogin(body: {
        email: string;
        password: string;
        deviceId?: string;
    }, req: any): Promise<{
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
    apiLogout(body: {
        clientId: string;
        deviceId?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createClientRequest(requestData: any): Promise<import("../entities/client-request.entity").ClientRequest>;
    getAllClientRequests(): Promise<import("../entities/client-request.entity").ClientRequest[]>;
    getClientRequestById(requestId: string): Promise<import("../entities/client-request.entity").ClientRequest>;
    updateClientRequest(requestId: string, updateData: any, req: any): Promise<import("../entities/client-request.entity").ClientRequest>;
    convertToClient(requestId: string, conversionData: any, req: any): Promise<{
        client: import("../entities/client.entity").Client;
        user: any;
        organization: any;
        credentials: {
            email: any;
            password: any;
        };
    }>;
    deleteClientRequest(requestId: string, req: any): Promise<{
        message: string;
    }>;
    getAllClients(): Promise<import("../entities/client.entity").Client[]>;
    getClientById(clientId: string): Promise<import("../entities/client.entity").Client>;
    updateClient(clientId: string, updateData: any, req: any): Promise<import("../entities/client.entity").Client>;
    deleteClient(clientId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleClientStatus(clientId: string, body: {
        isActive: boolean;
    }): Promise<import("../entities/client.entity").Client>;
    requestLoginCredentials(clientId: string, credentialData: any): Promise<{
        success: boolean;
        message: string;
        credentials: {
            email: string;
            password: string;
            userId: import("typeorm").ObjectId;
        };
    }>;
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
    getAllContactMessages(): Promise<import("../entities/contact-us.entity").ContactUs[]>;
    getContactUnreadCount(): Promise<{
        count: number;
    }>;
    getContactMessageById(messageId: string): Promise<import("../entities/contact-us.entity").ContactUs>;
    markContactMessageAsRead(messageId: string): Promise<import("../entities/contact-us.entity").ContactUs>;
    deleteContactMessage(messageId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
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
    exportRequests(): Promise<string>;
    exportClients(): Promise<string>;
    exportContactMessages(): Promise<string>;
}
