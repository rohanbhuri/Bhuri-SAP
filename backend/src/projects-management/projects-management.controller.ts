import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProjectsManagementService } from './projects-management.service';

@Controller('projects-management')
@UseGuards(JwtAuthGuard)
export class ProjectsManagementController {
  constructor(private readonly projectsService: ProjectsManagementService) {}

  @Get('projects')
  getProjects() {
    return this.projectsService.getProjects();
  }

  @Get('stats')
  getStats() {
    return this.projectsService.getStats();
  }

  @Post('projects')
  createProject(@Body() projectData: any) {
    return this.projectsService.createProject(projectData);
  }
}