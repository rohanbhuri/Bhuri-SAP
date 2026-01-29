import { MongoRepository } from 'typeorm';
import { Module } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';
import { ModuleRequest } from '../entities/module-request.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ModulesService {
    private moduleRepository;
    private organizationRepository;
    private moduleRequestRepository;
    private userRepository;
    private notificationsService;
    constructor(moduleRepository: MongoRepository<Module>, organizationRepository: MongoRepository<Organization>, moduleRequestRepository: MongoRepository<ModuleRequest>, userRepository: MongoRepository<User>, notificationsService: NotificationsService);
    private getDbConfig;
    findAll(): Promise<{
        id: string;
        name: string;
        displayName: string;
        description: string;
        permissionType: string;
        createdAt: Date;
    }[]>;
    getActiveModulesForOrg(orgId: string, userId?: string): Promise<{
        id: any;
        name: any;
        displayName: any;
        description: any;
        isActive: boolean;
        permissionType: any;
        category: any;
        icon: any;
        color: any;
    }[]>;
    activateModule(moduleId: string, orgId: string, userId?: string): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    deactivateModule(moduleId: string, orgId: string, userId?: string): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    getAllAvailable(orgId: string, userId: string): Promise<{
        id: string;
        name: any;
        displayName: any;
        description: any;
        isActive: boolean;
        canActivate: boolean;
        isPending: boolean;
        permissionType: any;
        category: any;
        icon: any;
        color: any;
    }[]>;
    requestActivation(moduleId: string, userId: string, orgId: string, requesterRoles?: string[]): Promise<{
        approverType: string;
        message: string;
        success: boolean;
        requiresApproval?: undefined;
    } | {
        success: boolean;
        message: string;
        approverType?: undefined;
        requiresApproval?: undefined;
    } | {
        success: boolean;
        message: string;
        approverType: string;
        requiresApproval: boolean;
    }>;
    getPendingRequests(orgId: string, isSuperAdmin?: boolean, currentUserId?: string, status?: string): Promise<{
        _id: any;
        moduleId: any;
        userId: any;
        organizationId: any;
        status: any;
        requestedAt: any;
        userName: any;
        moduleName: any;
        approverType: any;
        priority: any;
        canApprove: any;
    }[]>;
    approveRequest(requestId: string, adminId: string): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
    rejectRequest(requestId: string, adminId: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    getPersonalModules(userId: string): Promise<{
        id: any;
        name: any;
        displayName: any;
        description: any;
        isActive: boolean;
        permissionType: any;
        category: any;
        icon: any;
        color: any;
    }[]>;
    private determineApprover;
    private notifyApproversAboutModuleRequest;
    private createAuditLog;
    private notifyRequesterAboutApproval;
    private filterModulesByPermissions;
}
