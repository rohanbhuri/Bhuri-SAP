import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { TasksManagementService } from './tasks-management.service';

@Controller('tasks-management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksManagementController {
  constructor(private readonly tasksService: TasksManagementService) {}

  @Get('tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getTasks() {
    return this.tasksService.getTasks();
  }

  @Get('stats')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  getStats() {
    return this.tasksService.getStats();
  }

  @Post('tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createTask(@Body() taskData: any) {
    return this.tasksService.createTask(taskData);
  }
}