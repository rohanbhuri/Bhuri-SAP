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
exports.ProjectTrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const project_entity_1 = require("../entities/project.entity");
const project_milestone_entity_1 = require("../entities/project-milestone.entity");
const project_deliverable_entity_1 = require("../entities/project-deliverable.entity");
const task_entity_1 = require("../entities/task.entity");
let ProjectTrackingService = class ProjectTrackingService {
    constructor(projectRepository, milestoneRepository, deliverableRepository, taskRepository) {
        this.projectRepository = projectRepository;
        this.milestoneRepository = milestoneRepository;
        this.deliverableRepository = deliverableRepository;
        this.taskRepository = taskRepository;
    }
    async getMilestones(organizationId, projectId) {
        const query = { organizationId: new mongodb_1.ObjectId(organizationId) };
        if (projectId) {
            query.projectId = new mongodb_1.ObjectId(projectId);
        }
        return this.milestoneRepository.find({ where: query });
    }
    async createMilestone(milestoneData, organizationId) {
        const milestone = this.milestoneRepository.create({
            ...milestoneData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            projectId: new mongodb_1.ObjectId(milestoneData.projectId)
        });
        return this.milestoneRepository.save(milestone);
    }
    async updateMilestone(id, updateData) {
        updateData.updatedAt = new Date();
        await this.milestoneRepository.update(new mongodb_1.ObjectId(id), updateData);
        return this.milestoneRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async getTasks(organizationId, projectId) {
        const query = { organizationId: new mongodb_1.ObjectId(organizationId) };
        if (projectId) {
            query.projectId = new mongodb_1.ObjectId(projectId);
        }
        return this.taskRepository.find({ where: query });
    }
    async createTask(taskData, organizationId) {
        const task = this.taskRepository.create({
            ...taskData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            projectId: new mongodb_1.ObjectId(taskData.projectId),
            assignedTo: taskData.assignedTo ? new mongodb_1.ObjectId(taskData.assignedTo) : null,
            assignedBy: taskData.assignedBy ? new mongodb_1.ObjectId(taskData.assignedBy) : null
        });
        return this.taskRepository.save(task);
    }
    async updateTask(id, updateData) {
        updateData.updatedAt = new Date();
        await this.taskRepository.update(new mongodb_1.ObjectId(id), updateData);
        return this.taskRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async getProjectProgress(projectId) {
        const project = await this.projectRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(projectId) }
        });
        const milestones = await this.milestoneRepository.find({
            where: { projectId: new mongodb_1.ObjectId(projectId) }
        });
        const tasks = await this.taskRepository.find({
            where: { projectId: new mongodb_1.ObjectId(projectId) }
        });
        const deliverables = await this.deliverableRepository.find({
            where: { projectId: new mongodb_1.ObjectId(projectId) }
        });
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const completedMilestones = milestones.filter(m => m.status === 'completed').length;
        const completedDeliverables = deliverables.filter(d => d.status === 'completed').length;
        const totalItems = tasks.length + milestones.length + deliverables.length;
        const completedItems = completedTasks + completedMilestones + completedDeliverables;
        const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        return {
            project,
            progress: {
                overall: overallProgress,
                tasks: {
                    total: tasks.length,
                    completed: completedTasks,
                    percentage: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
                },
                milestones: {
                    total: milestones.length,
                    completed: completedMilestones,
                    percentage: milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0
                },
                deliverables: {
                    total: deliverables.length,
                    completed: completedDeliverables,
                    percentage: deliverables.length > 0 ? Math.round((completedDeliverables / deliverables.length) * 100) : 0
                }
            }
        };
    }
    async getStats(organizationId) {
        const orgId = new mongodb_1.ObjectId(organizationId);
        const totalProjects = await this.projectRepository.count({ where: { organizationId: orgId } });
        const activeProjects = await this.projectRepository.count({ where: { organizationId: orgId, status: 'active' } });
        const totalMilestones = await this.milestoneRepository.count({ where: { organizationId: orgId } });
        const overdueMilestones = await this.milestoneRepository.count({
            where: {
                organizationId: orgId,
                status: { $ne: 'completed' },
                dueDate: { $lt: new Date() }
            }
        });
        const totalTasks = await this.taskRepository.count({ where: { organizationId: orgId } });
        const completedTasks = await this.taskRepository.count({ where: { organizationId: orgId, status: 'completed' } });
        return {
            totalProjects,
            activeProjects,
            totalMilestones,
            overdueMilestones,
            totalTasks,
            completedTasks,
            taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    }
};
exports.ProjectTrackingService = ProjectTrackingService;
exports.ProjectTrackingService = ProjectTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_milestone_entity_1.ProjectMilestone)),
    __param(2, (0, typeorm_1.InjectRepository)(project_deliverable_entity_1.ProjectDeliverable)),
    __param(3, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], ProjectTrackingService);
//# sourceMappingURL=project-tracking.service.js.map