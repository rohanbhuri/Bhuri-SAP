import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ProjectTrackingService } from './project-tracking.service';

@Controller('project-tracking')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectTrackingController {
  constructor(private readonly trackingService: ProjectTrackingService) {}

  // Milestone Management
  @Get('milestones')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getMilestones(@Query('projectId') projectId: string, @Req() req: any) {
    return this.trackingService.getMilestones(req.user.organizationId, projectId);
  }

  @Post('milestones')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createMilestone(@Body() milestoneData: any, @Req() req: any) {
    return this.trackingService.createMilestone(milestoneData, req.user.organizationId);
  }

  @Put('milestones/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  updateMilestone(@Param('id') id: string, @Body() updateData: any) {
    return this.trackingService.updateMilestone(id, updateData);
  }

  // Task Management
  @Get('tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getTasks(@Query('projectId') projectId: string, @Req() req: any) {
    return this.trackingService.getTasks(req.user.organizationId, projectId);
  }

  @Post('tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createTask(@Body() taskData: any, @Req() req: any) {
    return this.trackingService.createTask(taskData, req.user.organizationId);
  }

  @Put('tasks/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  updateTask(@Param('id') id: string, @Body() updateData: any) {
    return this.trackingService.updateTask(id, updateData);
  }

  // Progress Tracking
  @Get('progress/:projectId')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getProjectProgress(@Param('projectId') projectId: string) {
    return this.trackingService.getProjectProgress(projectId);
  }

  // Statistics
  @Get('stats')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  getStats(@Req() req: any) {
    return this.trackingService.getStats(req.user.organizationId);
  }
}