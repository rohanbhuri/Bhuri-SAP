"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const organization_entity_1 = require("../entities/organization.entity");
const organization_request_entity_1 = require("../entities/organization-request.entity");
const user_entity_1 = require("../entities/user.entity");
const module_entity_1 = require("../entities/module.entity");
let OrganizationManagementService = class OrganizationManagementService {
    constructor(organizationRepository, organizationRequestRepository, userRepository, moduleRepository) {
        this.organizationRepository = organizationRepository;
        this.organizationRequestRepository = organizationRequestRepository;
        this.userRepository = userRepository;
        this.moduleRepository = moduleRepository;
    }
    async findAll() {
        const organizations = await this.organizationRepository.find();
        const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db('beaxrm');
            const orgsWithUserCount = await Promise.all(organizations.map(async (org) => {
                const userCount = await db.collection('users').countDocuments({
                    organizationIds: { $in: [org._id] }
                });
                return { ...org, userCount };
            }));
            return orgsWithUserCount;
        }
        finally {
            await client.close();
        }
    }
    async create(orgData) {
        const existingOrg = await this.organizationRepository.findOne({
            where: { code: orgData.code }
        });
        if (existingOrg) {
            throw new common_1.BadRequestException('Organization code already exists');
        }
        const organization = this.organizationRepository.create({
            ...orgData,
            activeModuleIds: orgData.activeModuleIds?.map(id => new mongodb_1.ObjectId(id)) || [],
            createdAt: new Date()
        });
        return this.organizationRepository.save(organization);
    }
    async update(id, updateData) {
        const organization = await this.organizationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) }
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        if (updateData.code && updateData.code !== organization.code) {
            const existingOrg = await this.organizationRepository.findOne({
                where: { code: updateData.code }
            });
            if (existingOrg) {
                throw new common_1.BadRequestException('Organization code already exists');
            }
        }
        const updatePayload = {
            ...updateData,
            activeModuleIds: updateData.activeModuleIds?.map(id => new mongodb_1.ObjectId(id)) || organization.activeModuleIds
        };
        await this.organizationRepository.update(new mongodb_1.ObjectId(id), updatePayload);
        return this.organizationRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async delete(id) {
        const organization = await this.organizationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) }
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        const userCount = await this.userRepository.count({
            where: { organizationIds: new mongodb_1.ObjectId(id) }
        });
        if (userCount > 0) {
            throw new common_1.BadRequestException('Cannot delete organization with existing users');
        }
        return this.organizationRepository.delete(new mongodb_1.ObjectId(id));
    }
    async getOrganizationRequests() {
        const requests = await this.organizationRequestRepository.find();
        const populatedRequests = await Promise.all(requests.map(async (request) => {
            const user = await this.userRepository.findOne({
                where: { _id: request.userId }
            });
            const organization = await this.organizationRepository.findOne({
                where: { _id: request.organizationId }
            });
            return {
                ...request,
                id: request._id,
                user: user ? { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email } : null,
                organization: organization ? { id: organization._id, name: organization.name } : null
            };
        }));
        return populatedRequests;
    }
    async approveRequest(requestId) {
        if (!mongodb_1.ObjectId.isValid(requestId)) {
            throw new common_1.BadRequestException('Invalid request ID');
        }
        const request = await this.organizationRequestRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(requestId) }
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        const user = await this.userRepository.findOne({
            where: { _id: request.userId }
        });
        if (user && !user.organizationIds.some(id => id.toString() === request.organizationId.toString())) {
            user.organizationIds.push(request.organizationId);
            if (!user.organizationId) {
                user.organizationId = request.organizationId;
            }
            await this.userRepository.save(user);
        }
        await this.organizationRequestRepository.update(new mongodb_1.ObjectId(requestId), {
            status: organization_request_entity_1.RequestStatus.APPROVED,
            processedAt: new Date()
        });
        return { success: true };
    }
    async rejectRequest(requestId) {
        if (!mongodb_1.ObjectId.isValid(requestId)) {
            throw new common_1.BadRequestException('Invalid request ID');
        }
        const request = await this.organizationRequestRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(requestId) }
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        await this.organizationRequestRepository.update(new mongodb_1.ObjectId(requestId), {
            status: organization_request_entity_1.RequestStatus.REJECTED,
            processedAt: new Date()
        });
        return { success: true };
    }
    async requestToJoin(userId, organizationId) {
        if (!userId || !organizationId) {
            throw new common_1.BadRequestException('User ID and Organization ID are required');
        }
        const organization = await this.organizationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(organizationId) }
        });
        if (!organization) {
            throw new common_1.BadRequestException('Organization not found');
        }
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.organizationIds?.some(id => id.toString() === organizationId)) {
            throw new common_1.BadRequestException('User already in organization');
        }
        const existingRequest = await this.organizationRequestRepository.findOne({
            where: {
                userId: new mongodb_1.ObjectId(userId),
                organizationId: new mongodb_1.ObjectId(organizationId),
                status: organization_request_entity_1.RequestStatus.PENDING
            }
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('Request already pending');
        }
        const request = this.organizationRequestRepository.create({
            userId: new mongodb_1.ObjectId(userId),
            organizationId: new mongodb_1.ObjectId(organizationId),
            status: organization_request_entity_1.RequestStatus.PENDING,
            requestedAt: new Date()
        });
        await this.organizationRequestRepository.save(request);
        return { success: true, message: 'Request submitted' };
    }
    async updateOrganizationModules(orgId, moduleIds) {
        const organization = await this.organizationRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(orgId) }
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        await this.organizationRepository.update(new mongodb_1.ObjectId(orgId), { activeModuleIds: moduleIds.map(id => new mongodb_1.ObjectId(id)) });
        return { success: true };
    }
    async switchUserOrganization(userId, organizationId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const orgObjectId = new mongodb_1.ObjectId(organizationId);
        if (!user.organizationIds.some(id => id.toString() === organizationId)) {
            throw new common_1.BadRequestException('User not member of this organization');
        }
        await this.userRepository.update(new mongodb_1.ObjectId(userId), { organizationId: orgObjectId });
        return { success: true };
    }
};
exports.OrganizationManagementService = OrganizationManagementService;
exports.OrganizationManagementService = OrganizationManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(organization_request_entity_1.OrganizationRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], OrganizationManagementService);
//# sourceMappingURL=organization-management.service.js.map