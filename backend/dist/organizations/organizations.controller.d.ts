import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private organizationsService;
    constructor(organizationsService: OrganizationsService);
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
    findMyOrganizations(req: any): Promise<import("../entities/organization.entity").Organization[]>;
    findPublicOrganizations(): Promise<import("../entities/organization.entity").Organization[]>;
    create(orgData: any): Promise<import("../entities/organization.entity").Organization[]>;
    createMyOrganization(orgData: any, req: any): Promise<import("../entities/organization.entity").Organization>;
    update(id: string, updateData: any): Promise<import("../entities/organization.entity").Organization>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
