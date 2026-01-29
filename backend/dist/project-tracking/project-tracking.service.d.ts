import { MongoRepository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { ProjectDeliverable } from '../entities/project-deliverable.entity';
import { Task } from '../entities/task.entity';
export declare class ProjectTrackingService {
    private projectRepository;
    private milestoneRepository;
    private deliverableRepository;
    private taskRepository;
    constructor(projectRepository: MongoRepository<Project>, milestoneRepository: MongoRepository<ProjectMilestone>, deliverableRepository: MongoRepository<ProjectDeliverable>, taskRepository: MongoRepository<Task>);
    getMilestones(organizationId: string, projectId?: string): Promise<ProjectMilestone[]>;
    createMilestone(milestoneData: any, organizationId: string): Promise<ProjectMilestone[]>;
    updateMilestone(id: string, updateData: any): Promise<ProjectMilestone>;
    getTasks(organizationId: string, projectId?: string): Promise<Task[]>;
    createTask(taskData: any, organizationId: string): Promise<Task[]>;
    updateTask(id: string, updateData: any): Promise<Task>;
    getProjectProgress(projectId: string): Promise<{
        project: Project;
        progress: {
            overall: number;
            tasks: {
                total: number;
                completed: number;
                percentage: number;
            };
            milestones: {
                total: number;
                completed: number;
                percentage: number;
            };
            deliverables: {
                total: number;
                completed: number;
                percentage: number;
            };
        };
    }>;
    getStats(organizationId: string): Promise<{
        totalProjects: number;
        activeProjects: number;
        totalMilestones: number;
        overdueMilestones: number;
        totalTasks: number;
        completedTasks: number;
        taskCompletionRate: number;
    }>;
}
