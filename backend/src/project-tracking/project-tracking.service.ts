import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Project } from '../entities/project.entity';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { ProjectDeliverable } from '../entities/project-deliverable.entity';
import { Task } from '../entities/task.entity';

@Injectable()
export class ProjectTrackingService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: MongoRepository<Project>,
    @InjectRepository(ProjectMilestone)
    private milestoneRepository: MongoRepository<ProjectMilestone>,
    @InjectRepository(ProjectDeliverable)
    private deliverableRepository: MongoRepository<ProjectDeliverable>,
    @InjectRepository(Task)
    private taskRepository: MongoRepository<Task>,
  ) {}

  // Milestone Management
  async getMilestones(organizationId: string, projectId?: string) {
    const query: any = { organizationId: new ObjectId(organizationId) };
    if (projectId) {
      query.projectId = new ObjectId(projectId);
    }
    return this.milestoneRepository.find({ where: query });
  }

  async createMilestone(milestoneData: any, organizationId: string) {
    const milestone = this.milestoneRepository.create({
      ...milestoneData,
      organizationId: new ObjectId(organizationId),
      projectId: new ObjectId(milestoneData.projectId)
    });
    return this.milestoneRepository.save(milestone);
  }

  async updateMilestone(id: string, updateData: any) {
    updateData.updatedAt = new Date();
    await this.milestoneRepository.update(new ObjectId(id), updateData);
    return this.milestoneRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  // Task Management
  async getTasks(organizationId: string, projectId?: string) {
    const query: any = { organizationId: new ObjectId(organizationId) };
    if (projectId) {
      query.projectId = new ObjectId(projectId);
    }
    return this.taskRepository.find({ where: query });
  }

  async createTask(taskData: any, organizationId: string) {
    const task = this.taskRepository.create({
      ...taskData,
      organizationId: new ObjectId(organizationId),
      projectId: new ObjectId(taskData.projectId),
      assignedTo: taskData.assignedTo ? new ObjectId(taskData.assignedTo) : null,
      assignedBy: taskData.assignedBy ? new ObjectId(taskData.assignedBy) : null
    });
    return this.taskRepository.save(task);
  }

  async updateTask(id: string, updateData: any) {
    updateData.updatedAt = new Date();
    await this.taskRepository.update(new ObjectId(id), updateData);
    return this.taskRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  // Progress Tracking
  async getProjectProgress(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: { _id: new ObjectId(projectId) }
    });

    const milestones = await this.milestoneRepository.find({
      where: { projectId: new ObjectId(projectId) }
    });

    const tasks = await this.taskRepository.find({
      where: { projectId: new ObjectId(projectId) }
    });

    const deliverables = await this.deliverableRepository.find({
      where: { projectId: new ObjectId(projectId) }
    });

    // Calculate overall progress
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

  // Statistics
  async getStats(organizationId: string) {
    const orgId = new ObjectId(organizationId);
    
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
}