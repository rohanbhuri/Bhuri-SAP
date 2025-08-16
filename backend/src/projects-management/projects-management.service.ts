import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsManagementService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async getProjects() {
    return this.projectRepository.find();
  }

  async getStats() {
    const total = await this.projectRepository.count();
    const active = await this.projectRepository.count({ where: { status: 'active' } });
    return { total, active, completed: 0 };
  }

  async createProject(projectData: any) {
    const project = this.projectRepository.create(projectData);
    return this.projectRepository.save(project);
  }
}