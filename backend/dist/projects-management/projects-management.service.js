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
exports.ProjectsManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const project_entity_1 = require("../entities/project.entity");
const project_pipeline_entity_1 = require("../entities/project-pipeline.entity");
const project_deliverable_entity_1 = require("../entities/project-deliverable.entity");
const project_milestone_entity_1 = require("../entities/project-milestone.entity");
const lead_to_project_conversion_entity_1 = require("../entities/lead-to-project-conversion.entity");
const project_team_assignment_entity_1 = require("../entities/project-team-assignment.entity");
const lead_entity_1 = require("../entities/lead.entity");
let ProjectsManagementService = class ProjectsManagementService {
    constructor(projectRepository, pipelineRepository, deliverableRepository, milestoneRepository, conversionRepository, teamAssignmentRepository, leadRepository) {
        this.projectRepository = projectRepository;
        this.pipelineRepository = pipelineRepository;
        this.deliverableRepository = deliverableRepository;
        this.milestoneRepository = milestoneRepository;
        this.conversionRepository = conversionRepository;
        this.teamAssignmentRepository = teamAssignmentRepository;
        this.leadRepository = leadRepository;
    }
    async getProjects(organizationId, userId) {
        console.log('Getting projects for organizationId:', organizationId, 'userId:', userId);
        let whereClause;
        if (organizationId) {
            whereClause = { organizationId: new mongodb_1.ObjectId(organizationId) };
        }
        else {
            whereClause = { createdBy: new mongodb_1.ObjectId(userId), organizationId: null };
        }
        const projects = await this.projectRepository.find({ where: whereClause });
        console.log('Found projects:', projects.length);
        return projects;
    }
    async getProjectById(id) {
        return this.projectRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) }
        });
    }
    async createProject(projectData, organizationId, userId) {
        console.log('Creating project for organizationId:', organizationId, 'userId:', userId);
        const project = this.projectRepository.create({
            ...projectData,
            organizationId: organizationId ? new mongodb_1.ObjectId(organizationId) : null,
            createdBy: new mongodb_1.ObjectId(userId),
            managerId: projectData.managerId ? new mongodb_1.ObjectId(projectData.managerId) : new mongodb_1.ObjectId(userId),
            code: await this.generateProjectCode(organizationId || userId)
        });
        const savedProject = await this.projectRepository.save(project);
        console.log('Project created:', savedProject);
        return savedProject;
    }
    async updateProject(id, updateData) {
        updateData.updatedAt = new Date();
        await this.projectRepository.update(new mongodb_1.ObjectId(id), updateData);
        return this.getProjectById(id);
    }
    async deleteProject(id) {
        return this.projectRepository.delete(new mongodb_1.ObjectId(id));
    }
    async convertLeadToProject(leadId, projectData, userId, organizationId) {
        const lead = await this.leadRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(leadId) }
        });
        if (!lead) {
            throw new Error('Lead not found');
        }
        const project = await this.createProject({
            ...projectData,
            leadId: new mongodb_1.ObjectId(leadId),
            convertedFromLead: true,
            conversionDate: new Date(),
            clientId: lead.contactId
        }, organizationId, userId);
        const conversion = this.conversionRepository.create({
            organizationId: new mongodb_1.ObjectId(organizationId),
            leadId: new mongodb_1.ObjectId(leadId),
            projectId: project._id,
            convertedBy: new mongodb_1.ObjectId(userId),
            conversionDate: new Date(),
            conversionReason: 'Lead qualified and converted',
            leadValue: lead.estimatedValue || 0,
            projectBudget: projectData.budget || 0,
            estimatedDuration: projectData.estimatedDuration || 30
        });
        await this.conversionRepository.save(conversion);
        await this.leadRepository.update(new mongodb_1.ObjectId(leadId), { status: 'converted' });
        return project;
    }
    async assignUsersToProject(projectId, userIds, assignedBy, organizationId) {
        const assignments = userIds.map(userId => this.teamAssignmentRepository.create({
            organizationId: new mongodb_1.ObjectId(organizationId),
            projectId: new mongodb_1.ObjectId(projectId),
            userId: new mongodb_1.ObjectId(userId),
            role: 'developer',
            assignedBy: new mongodb_1.ObjectId(assignedBy),
            assignedDate: new Date(),
            startDate: new Date(),
            permissions: ['view', 'edit']
        }));
        return this.teamAssignmentRepository.save(assignments);
    }
    async getPipelines(organizationId) {
        return this.pipelineRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
    }
    async createPipeline(pipelineData, organizationId) {
        const pipeline = this.pipelineRepository.create({
            ...pipelineData,
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
        return this.pipelineRepository.save(pipeline);
    }
    async getProjectDeliverables(projectId) {
        return this.deliverableRepository.find({
            where: { projectId: new mongodb_1.ObjectId(projectId) }
        });
    }
    async createDeliverable(deliverableData, projectId, organizationId) {
        const deliverable = this.deliverableRepository.create({
            ...deliverableData,
            projectId: new mongodb_1.ObjectId(projectId),
            organizationId: new mongodb_1.ObjectId(organizationId)
        });
        return this.deliverableRepository.save(deliverable);
    }
    async updateDeliverable(id, updateData) {
        updateData.updatedAt = new Date();
        await this.deliverableRepository.update(new mongodb_1.ObjectId(id), updateData);
        return this.deliverableRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async deleteDeliverable(id) {
        return this.deliverableRepository.delete(new mongodb_1.ObjectId(id));
    }
    async getStats(organizationId) {
        const orgId = new mongodb_1.ObjectId(organizationId);
        const total = await this.projectRepository.count({ where: { organizationId: orgId } });
        const active = await this.projectRepository.count({ where: { organizationId: orgId, status: 'active' } });
        const completed = await this.projectRepository.count({ where: { organizationId: orgId, status: 'completed' } });
        const conversions = await this.conversionRepository.count({ where: { organizationId: orgId } });
        return { total, active, completed, conversions };
    }
    async generateProjectCode(contextId) {
        const count = await this.projectRepository.count();
        return `PRJ-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.ProjectsManagementService = ProjectsManagementService;
exports.ProjectsManagementService = ProjectsManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_pipeline_entity_1.ProjectPipeline)),
    __param(2, (0, typeorm_1.InjectRepository)(project_deliverable_entity_1.ProjectDeliverable)),
    __param(3, (0, typeorm_1.InjectRepository)(project_milestone_entity_1.ProjectMilestone)),
    __param(4, (0, typeorm_1.InjectRepository)(lead_to_project_conversion_entity_1.LeadToProjectConversion)),
    __param(5, (0, typeorm_1.InjectRepository)(project_team_assignment_entity_1.ProjectTeamAssignment)),
    __param(6, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], ProjectsManagementService);
//# sourceMappingURL=projects-management.service.js.map