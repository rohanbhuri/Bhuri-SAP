import { MongoRepository } from 'typeorm';
import { Role, RoleType } from '../entities/role.entity';
import { Permission, ActionType } from '../entities/permission.entity';
export declare class RolesService {
    private roleRepository;
    private permissionRepository;
    constructor(roleRepository: MongoRepository<Role>, permissionRepository: MongoRepository<Permission>);
    findAll(): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: ActionType;
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
            action: ActionType;
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
            action: ActionType;
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
            action: ActionType;
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
    assignPermission(roleId: string, permissionId: string): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: ActionType;
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
    removePermission(roleId: string, permissionId: string): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: ActionType;
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
    getAllPermissions(): Promise<Permission[]>;
    createPermission(permissionData: any): Promise<Permission[]>;
    updatePermission(id: string, permissionData: any): Promise<Permission>;
    deletePermission(id: string): Promise<{
        message: string;
    }>;
    getPermissionTemplates(): Promise<{
        admin: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        hr_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        crm_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        project_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        sales_manager: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        staff: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        viewer: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
        form_builder: {
            name: string;
            description: string;
            permissions: {
                module: string;
                action: ActionType;
                resource: string;
            }[];
        };
    }>;
    applyPermissionTemplate(roleId: string, templateId: string): Promise<{
        permissions: {
            id: import("typeorm").ObjectId;
            module: string;
            action: ActionType;
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
