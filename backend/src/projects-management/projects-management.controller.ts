import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ProjectsManagementService } from './projects-management.service';

@Controller('projects-management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsManagementController {
  constructor(private readonly projectsService: ProjectsManagementService) {}

  // Project CRUD
  @Get('projects')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getProjects(@Req() req: any) {
    console.log('Get projects - User object:', req.user);
    return this.projectsService.getProjects(req.user.organizationId, req.user.userId);
  }

  @Get('projects/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getProject(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Post('projects')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createProject(@Body() projectData: any, @Req() req: any) {
    console.log('User object:', req.user);
    return this.projectsService.createProject(projectData, req.user.organizationId, req.user.userId);
  }

  @Put('projects/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  updateProject(@Param('id') id: string, @Body() updateData: any) {
    return this.projectsService.updateProject(id, updateData);
  }

  @Delete('projects/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }

  // Lead to Project Conversion
  @Post('convert-lead')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  convertLeadToProject(@Body() conversionData: any, @Req() req: any) {
    const { leadId, projectData } = conversionData;
    return this.projectsService.convertLeadToProject(
      leadId, 
      projectData, 
      req.user.userId, 
      req.user.organizationId
    );
  }

  // Team Management
  @Patch('projects/:id/assign-users')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  assignUsersToProject(
    @Param('id') projectId: string,
    @Body() assignmentData: { userIds: string[] },
    @Req() req: any
  ) {
    return this.projectsService.assignUsersToProject(
      projectId,
      assignmentData.userIds,
      req.user.userId,
      req.user.organizationId
    );
  }

  // Pipeline Management
  @Get('pipelines')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  getPipelines(@Req() req: any) {
    return this.projectsService.getPipelines(req.user.organizationId);
  }

  @Post('pipelines')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createPipeline(@Body() pipelineData: any, @Req() req: any) {
    return this.projectsService.createPipeline(pipelineData, req.user.organizationId);
  }

  // Deliverables Management
  @Get('projects/:projectId/deliverables')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getProjectDeliverables(@Param('projectId') projectId: string) {
    return this.projectsService.getProjectDeliverables(projectId);
  }

  @Post('projects/:projectId/deliverables')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createDeliverable(
    @Param('projectId') projectId: string,
    @Body() deliverableData: any,
    @Req() req: any
  ) {
    return this.projectsService.createDeliverable(
      deliverableData,
      projectId,
      req.user.organizationId
    );
  }

  @Put('deliverables/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  updateDeliverable(@Param('id') id: string, @Body() updateData: any) {
    return this.projectsService.updateDeliverable(id, updateData);
  }

  @Delete('deliverables/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  deleteDeliverable(@Param('id') id: string) {
    return this.projectsService.deleteDeliverable(id);
  }

  // Statistics
  @Get('stats')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  getStats(@Req() req: any) {
    return this.projectsService.getStats(req.user.organizationId);
  }
}