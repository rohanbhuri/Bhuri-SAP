import { OrganizationManagementService } from './organization-management.service';
export declare class OrganizationManagementController {
    private orgManagementService;
    constructor(orgManagementService: OrganizationManagementService);
    findAllOrganizations(): Promise<{
        userCount: number;
        _id: import("typeorm").ObjectId;
        name: string;
        code: string;
        description: string;
        isPublic: boolean;
        memberCount: number;
        activeModuleIds: import("typeorm").ObjectId[];
        createdAt: Date;
    }[]>;
    createOrganization(orgData: any): Promise<import("../entities/organization.entity").Organization[]>;
    updateOrganization(id: string, updateData: any): Promise<import("../entities/organization.entity").Organization>;
    deleteOrganization(id: string): Promise<import("typeorm").DeleteResult>;
    getOrganizationRequests(): Promise<{
        id: import("typeorm").ObjectId;
        user: {
            id: import("typeorm").ObjectId;
            name: string;
            email: string;
        };
        organization: {
            id: import("typeorm").ObjectId;
            name: string;
        };
        _id: import("typeorm").ObjectId;
        userId: import("typeorm").ObjectId;
        organizationId: import("typeorm").ObjectId;
        status: import("../entities/organization-request.entity").RequestStatus;
        requestedAt: Date;
        processedAt?: Date;
        processedBy?: import("typeorm").ObjectId;
        reason?: string;
    }[]>;
    approveRequest(id: string): Promise<{
        success: boolean;
    }>;
    rejectRequest(id: string): Promise<{
        success: boolean;
    }>;
    requestToJoinOrganization(req: any, body: {
        organizationId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    updateOrganizationModules(id: string, body: {
        moduleIds: string[];
    }): Promise<{
        success: boolean;
    }>;
    switchCurrentOrganization(req: any, organizationId: string): Promise<{
        success: boolean;
    }>;
}
