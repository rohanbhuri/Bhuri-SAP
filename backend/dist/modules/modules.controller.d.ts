import { ModulesService } from './modules.service';
export declare class ModulesController {
    private modulesService;
    constructor(modulesService: ModulesService);
    findAll(): Promise<{
        id: string;
        name: string;
        displayName: string;
        description: string;
        permissionType: string;
        createdAt: Date;
    }[]>;
    getActiveModules(req: any): Promise<{
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
    getPersonalModules(req: any): Promise<{
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
    getOrganizationModules(orgId: string, req: any): Promise<{
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
    activateModule(id: string, req: any): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    deactivateModule(id: string, req: any): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    getAvailableModules(req: any): Promise<{
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
    requestActivation(id: string, req: any): Promise<{
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
    getPendingRequests(req: any, status?: string): Promise<{
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
    approveRequest(id: string, req: any): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
    rejectRequest(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
