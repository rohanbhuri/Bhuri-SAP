import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TasksManagementService } from './tasks-management.service';

@Controller('tasks-management')
@UseGuards(JwtAuthGuard)
export class TasksManagementController {
  constructor(private readonly tasksService: TasksManagementService) {}

  @Get('tasks')
  getTasks() {
    return this.tasksService.getTasks();
  }

  @Get('stats')
  getStats() {
    return this.tasksService.getStats();
  }

  @Post('tasks')
  createTask(@Body() taskData: any) {
    return this.tasksService.createTask(taskData);
  }
}