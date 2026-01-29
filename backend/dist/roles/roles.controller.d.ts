import { RoleType } from '../entities/role.entity';
import { RolesService } from './roles.service';
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }[]>;
    findOne(id: string): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }>;
    create(roleData: any): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }>;
    update(id: string, updateData: any): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getAllPermissions(): Promise<import("../entities/permission.entity").Permission[]>;
    createPermission(permissionData: any): Promise<import("../entities/permission.entity").Permission[]>;
    updatePermission(id: string, permissionData: any): Promise<import("../entities/permission.entity").Permission>;
    deletePermission(id: string): Promise<{
        message: string;
    }>;
    assignPermission(id: string, { permissionId }: any): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }>;
    removePermission(id: string, permissionId: string): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }>;
    getPermissionTemplates(): Promise<{
        admin: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        hr_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        crm_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        project_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        sales_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        staff: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        viewer: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
        form_builder: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: import("../entities/permission.entity").ActionType;
                resource: string;
            }[];
        };
    }>;
    applyPermissionTemplate(id: string, { templateId }: any): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: import("../entities/permission.entity").ActionType;
            resource: string;
        }[];
        _id: import("typeorm").ObjectId;
        name: string;
        type: RoleType;
        description: string;
        permissionIds: import("typeorm").ObjectId[];
        hierarchyLevel: number;
        createdAt: Date;
        isDeleted: boolean;
        deletedAt: Date;
        deletedBy: string;
        changeLog: Array<{
            userId: string;
            action: string;
            timestamp: Date;
            details?: string;
        }>;
    }>;
}
