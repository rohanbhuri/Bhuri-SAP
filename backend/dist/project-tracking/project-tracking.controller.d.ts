import { ProjectTrackingService } from './project-tracking.service';
export declare class ProjectTrackingController {
    private readonly trackingService;
    constructor(trackingService: ProjectTrackingService);
    getMilestones(projectId: string, req: any): Promise<import("../entities/project-milestone.entity").ProjectMilestone[]>;
    createMilestone(milestoneData: any, req: any): Promise<import("../entities/project-milestone.entity").ProjectMilestone[]>;
    updateMilestone(id: string, updateData: any): Promise<import("../entities/project-milestone.entity").ProjectMilestone>;
    getTasks(projectId: string, req: any): Promise<import("../entities/task.entity").Task[]>;
    createTask(taskData: any, req: any): Promise<import("../entities/task.entity").Task[]>;
    updateTask(id: string, updateData: any): Promise<import("../entities/task.entity").Task>;
    getProjectProgress(projectId: string): Promise<{
        project: import("../entities/project.entity").Project;
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
    getStats(req: any): Promise<{
        totalProjects: number;
        activeProjects: number;
        totalMilestones: number;
        overdueMilestones: number;
        totalTasks: number;
        completedTasks: number;
        taskCompletionRate: number;
    }>;
}
