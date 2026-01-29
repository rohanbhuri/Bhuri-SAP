import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
export declare class TasksManagementService {
    private taskRepository;
    constructor(taskRepository: Repository<Task>);
    getTasks(): Promise<Task[]>;
    getStats(): Promise<{
        pending: number;
        inProgress: number;
        completed: number;
    }>;
    createTask(taskData: any): Promise<Task[]>;
}
