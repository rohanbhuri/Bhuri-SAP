import { MongoRepository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationRequest, RequestStatus } from '../entities/organization-request.entity';
import { User } from '../entities/user.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
export declare class OrganizationManagementService {
    private organizationRepository;
    private organizationRequestRepository;
    private userRepository;
    private moduleRepository;
    constructor(organizationRepository: MongoRepository<Organization>, organizationRequestRepository: MongoRepository<OrganizationRequest>, userRepository: MongoRepository<User>, moduleRepository: MongoRepository<ModuleEntity>);
    findAll(): Promise<{
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
    create(orgData: any): Promise<Organization[]>;
    update(id: string, updateData: any): Promise<Organization>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
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
        status: RequestStatus;
        requestedAt: Date;
        processedAt?: Date;
        processedBy?: import("typeorm").ObjectId;
        reason?: string;
    }[]>;
    approveRequest(requestId: string): Promise<{
        success: boolean;
    }>;
    rejectRequest(requestId: string): Promise<{
        success: boolean;
    }>;
    requestToJoin(userId: string, organizationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateOrganizationModules(orgId: string, moduleIds: string[]): Promise<{
        success: boolean;
    }>;
    switchUserOrganization(userId: string, organizationId: string): Promise<{
        success: boolean;
    }>;
}
