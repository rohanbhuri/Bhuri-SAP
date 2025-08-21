import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Project } from '../entities/project.entity';
import { ProjectPipeline } from '../entities/project-pipeline.entity';
import { ProjectDeliverable } from '../entities/project-deliverable.entity';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { LeadToProjectConversion } from '../entities/lead-to-project-conversion.entity';
import { ProjectTeamAssignment } from '../entities/project-team-assignment.entity';
import { Lead } from '../entities/lead.entity';

@Injectable()
export class ProjectsManagementService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: MongoRepository<Project>,
    @InjectRepository(ProjectPipeline)
    private pipelineRepository: MongoRepository<ProjectPipeline>,
    @InjectRepository(ProjectDeliverable)
    private deliverableRepository: MongoRepository<ProjectDeliverable>,
    @InjectRepository(ProjectMilestone)
    private milestoneRepository: MongoRepository<ProjectMilestone>,
    @InjectRepository(LeadToProjectConversion)
    private conversionRepository: MongoRepository<LeadToProjectConversion>,
    @InjectRepository(ProjectTeamAssignment)
    private teamAssignmentRepository: MongoRepository<ProjectTeamAssignment>,
    @InjectRepository(Lead)
    private leadRepository: MongoRepository<Lead>,
  ) {}

  // Project CRUD
  async getProjects(organizationId: string, userId: string) {
    console.log('Getting projects for organizationId:', organizationId, 'userId:', userId);
    
    let whereClause: any;
    if (organizationId) {
      // Get organizational projects
      whereClause = { organizationId: new ObjectId(organizationId) };
    } else {
      // Get personal projects
      whereClause = { createdBy: new ObjectId(userId), organizationId: null };
    }
    
    const projects = await this.projectRepository.find({ where: whereClause });
    console.log('Found projects:', projects.length);
    return projects;
  }

  async getProjectById(id: string) {
    return this.projectRepository.findOne({
      where: { _id: new ObjectId(id) }
    });
  }

  async createProject(projectData: any, organizationId: string, userId: string) {
    console.log('Creating project for organizationId:', organizationId, 'userId:', userId);
    
    const project = this.projectRepository.create({
      ...projectData,
      organizationId: organizationId ? new ObjectId(organizationId) : null,
      createdBy: new ObjectId(userId),
      managerId: projectData.managerId ? new ObjectId(projectData.managerId) : new ObjectId(userId),
      code: await this.generateProjectCode(organizationId || userId)
    });
    
    const savedProject = await this.projectRepository.save(project);
    console.log('Project created:', savedProject);
    return savedProject as any;
  }

  async updateProject(id: string, updateData: any) {
    updateData.updatedAt = new Date();
    await this.projectRepository.update(new ObjectId(id), updateData);
    return this.getProjectById(id);
  }

  async deleteProject(id: string) {
    return this.projectRepository.delete(new ObjectId(id));
  }

  // Lead to Project Conversion
  async convertLeadToProject(leadId: string, projectData: any, userId: string, organizationId: string) {
    const lead = await this.leadRepository.findOne({
      where: { _id: new ObjectId(leadId) }
    });
    
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Create project from lead
    const project = await this.createProject({
      ...projectData,
      leadId: new ObjectId(leadId),
      convertedFromLead: true,
      conversionDate: new Date(),
      clientId: lead.contactId
    }, organizationId, userId);

    // Create conversion record
    const conversion = this.conversionRepository.create({
      organizationId: new ObjectId(organizationId),
      leadId: new ObjectId(leadId),
      projectId: project._id,
      convertedBy: new ObjectId(userId),
      conversionDate: new Date(),
      conversionReason: 'Lead qualified and converted',
      leadValue: lead.estimatedValue || 0,
      projectBudget: projectData.budget || 0,
      estimatedDuration: projectData.estimatedDuration || 30
    });
    
    await this.conversionRepository.save(conversion);
    
    // Update lead status
    await this.leadRepository.update(new ObjectId(leadId), { status: 'converted' });
    
    return project;
  }

  // Team Management
  async assignUsersToProject(projectId: string, userIds: string[], assignedBy: string, organizationId: string) {
    const assignments = userIds.map(userId => 
      this.teamAssignmentRepository.create({
        organizationId: new ObjectId(organizationId),
        projectId: new ObjectId(projectId),
        userId: new ObjectId(userId),
        role: 'developer',
        assignedBy: new ObjectId(assignedBy),
        assignedDate: new Date(),
        startDate: new Date(),
        permissions: ['view', 'edit']
      })
    );
    
    return this.teamAssignmentRepository.save(assignments);
  }

  // Pipeline Management
  async getPipelines(organizationId: string) {
    return this.pipelineRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
  }

  async createPipeline(pipelineData: any, organizationId: string) {
    const pipeline = this.pipelineRepository.create({
      ...pipelineData,
      organizationId: new ObjectId(organizationId)
    });
    return this.pipelineRepository.save(pipeline);
  }

  // Deliverables Management
  async getProjectDeliverables(projectId: string) {
    return this.deliverableRepository.find({
      where: { projectId: new ObjectId(projectId) }
    });
  }

  async createDeliverable(deliverableData: any, projectId: string, organizationId: string) {
    const deliverable = this.deliverableRepository.create({
      ...deliverableData,
      projectId: new ObjectId(projectId),
      organizationId: new ObjectId(organizationId)
    });
    return this.deliverableRepository.save(deliverable);
  }

  async updateDeliverable(id: string, updateData: any) {
    updateData.updatedAt = new Date();
    await this.deliverableRepository.update(new ObjectId(id), updateData);
    return this.deliverableRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async deleteDeliverable(id: string) {
    return this.deliverableRepository.delete(new ObjectId(id));
  }

  // Statistics
  async getStats(organizationId: string) {
    const orgId = new ObjectId(organizationId);
    const total = await this.projectRepository.count({ where: { organizationId: orgId } });
    const active = await this.projectRepository.count({ where: { organizationId: orgId, status: 'active' } });
    const completed = await this.projectRepository.count({ where: { organizationId: orgId, status: 'completed' } });
    const conversions = await this.conversionRepository.count({ where: { organizationId: orgId } });
    
    return { total, active, completed, conversions };
  }

  private async generateProjectCode(contextId: string): Promise<string> {
    const count = await this.projectRepository.count();
    return `PRJ-${String(count + 1).padStart(4, '0')}`;
  }
}