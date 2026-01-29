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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const organization_entity_1 = require("../entities/organization.entity");
const user_entity_1 = require("../entities/user.entity");
let OrganizationsService = class OrganizationsService {
    constructor(organizationRepository, userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }
    async findAll() {
        const organizations = await this.organizationRepository.find();
        const orgsWithUserCount = await Promise.all(organizations.map(async (org) => {
            const userCount = await this.userRepository.count({
                where: { organizationIds: (0, typeorm_2.In)([org._id]) }
            });
            return {
                ...org,
                userCount
            };
        }));
        return orgsWithUserCount;
    }
    async create(orgData) {
        const organization = this.organizationRepository.create(orgData);
        return this.organizationRepository.save(organization);
    }
    async update(id, updateData) {
        await this.organizationRepository.update(new mongodb_1.ObjectId(id), updateData);
        return this.organizationRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async delete(id) {
        return this.organizationRepository.delete(new mongodb_1.ObjectId(id));
    }
    async findUserOrganizations(userId) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(userId) }
        });
        if (!user || user.organizationIds.length === 0) {
            return [];
        }
        return this.organizationRepository.find({
            where: { _id: { $in: user.organizationIds } }
        });
    }
    async findPublicOrganizations() {
        return this.organizationRepository.find({
            where: { isPublic: true }
        });
    }
    async createOrganization(orgData, creatorId) {
        const existingOrg = await this.organizationRepository.findOne({
            where: { code: orgData.code }
        });
        if (existingOrg) {
            throw new Error('Organization code already exists');
        }
        const organization = this.organizationRepository.create({
            ...orgData,
            memberCount: 1,
            activeModuleIds: [],
            createdAt: new Date()
        });
        const savedOrg = await this.organizationRepository.save(organization);
        const creator = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(creatorId) }
        });
        if (creator) {
            if (!creator.organizationIds)
                creator.organizationIds = [];
            creator.organizationIds.push(savedOrg._id);
            if (!creator.organizationId) {
                creator.organizationId = savedOrg._id;
            }
            await this.userRepository.save(creator);
        }
        return savedOrg;
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map