import { ObjectId } from 'typeorm';
export declare enum RoleType {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    STAFF = "staff",
    CLIENT = "client",
    CUSTOM = "custom"
}
export declare class Role {
    _id: ObjectId;
    name: string;
    type: RoleType;
    description: string;
    permissionIds: ObjectId[];
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
    constructor();
}
