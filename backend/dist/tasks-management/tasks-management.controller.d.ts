import { TasksManagementService } from './tasks-management.service';
export declare class TasksManagementController {
    private readonly tasksService;
    constructor(tasksService: TasksManagementService);
    getTasks(): Promise<import("../entities/task.entity").Task[]>;
    getStats(): Promise<{
        pending: number;
        inProgress: number;
        completed: number;
    }>;
    createTask(taskData: any): Promise<import("../entities/task.entity").Task[]>;
}
