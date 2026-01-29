import { ObjectId } from 'typeorm';
export declare enum ModulePermissionType {
    PUBLIC = "public",
    REQUIRE_PERMISSION = "require_permission"
}
export declare class Module {
    _id: ObjectId;
    id: string;
    name: string;
    displayName: string;
    description: string;
    isActive: boolean;
    permissionType: string;
    category: string;
    icon: string;
    color: string;
    createdAt: Date;
    constructor();
}
