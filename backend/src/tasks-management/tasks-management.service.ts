import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksManagementService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks() {
    return this.taskRepository.find();
  }

  async getStats() {
    const pending = await this.taskRepository.count({ where: { status: 'pending' } });
    const inProgress = await this.taskRepository.count({ where: { status: 'in-progress' } });
    const completed = await this.taskRepository.count({ where: { status: 'completed' } });
    return { pending, inProgress, completed };
  }

  async createTask(taskData: any) {
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }
}