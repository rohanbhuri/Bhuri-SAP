import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ProjectsManagementService } from './projects-management.service';

@Controller('projects-management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsManagementController {
  constructor(private readonly projectsService: ProjectsManagementService) {}

  @Get('projects')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  getProjects() {
    return this.projectsService.getProjects();
  }

  @Get('stats')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  getStats() {
    return this.projectsService.getStats();
  }

  @Post('projects')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  createProject(@Body() projectData: any) {
    return this.projectsService.createProject(projectData);
  }
}