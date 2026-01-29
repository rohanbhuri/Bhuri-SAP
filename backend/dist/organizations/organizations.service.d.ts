import { MongoRepository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
export declare class OrganizationsService {
    private organizationRepository;
    private userRepository;
    constructor(organizationRepository: MongoRepository<Organization>, userRepository: MongoRepository<User>);
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
    findUserOrganizations(userId: string): Promise<Organization[]>;
    findPublicOrganizations(): Promise<Organization[]>;
    createOrganization(orgData: any, creatorId: string): Promise<Organization>;
}
