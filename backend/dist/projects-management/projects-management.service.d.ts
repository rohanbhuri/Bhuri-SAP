import { MongoRepository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectPipeline } from '../entities/project-pipeline.entity';
import { ProjectDeliverable } from '../entities/project-deliverable.entity';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { LeadToProjectConversion } from '../entities/lead-to-project-conversion.entity';
import { ProjectTeamAssignment } from '../entities/project-team-assignment.entity';
import { Lead } from '../entities/lead.entity';
export declare class ProjectsManagementService {
    private projectRepository;
    private pipelineRepository;
    private deliverableRepository;
    private milestoneRepository;
    private conversionRepository;
    private teamAssignmentRepository;
    private leadRepository;
    constructor(projectRepository: MongoRepository<Project>, pipelineRepository: MongoRepository<ProjectPipeline>, deliverableRepository: MongoRepository<ProjectDeliverable>, milestoneRepository: MongoRepository<ProjectMilestone>, conversionRepository: MongoRepository<LeadToProjectConversion>, teamAssignmentRepository: MongoRepository<ProjectTeamAssignment>, leadRepository: MongoRepository<Lead>);
    getProjects(organizationId: string, userId: string): Promise<Project[]>;
    getProjectById(id: string): Promise<Project>;
    createProject(projectData: any, organizationId: string, userId: string): Promise<any>;
    updateProject(id: string, updateData: any): Promise<Project>;
    deleteProject(id: string): Promise<import("typeorm").DeleteResult>;
    convertLeadToProject(leadId: string, projectData: any, userId: string, organizationId: string): Promise<any>;
    assignUsersToProject(projectId: string, userIds: string[], assignedBy: string, organizationId: string): Promise<ProjectTeamAssignment[]>;
    getPipelines(organizationId: string): Promise<ProjectPipeline[]>;
    createPipeline(pipelineData: any, organizationId: string): Promise<ProjectPipeline[]>;
    getProjectDeliverables(projectId: string): Promise<ProjectDeliverable[]>;
    createDeliverable(deliverableData: any, projectId: string, organizationId: string): Promise<ProjectDeliverable[]>;
    updateDeliverable(id: string, updateData: any): Promise<ProjectDeliverable>;
    deleteDeliverable(id: string): Promise<import("typeorm").DeleteResult>;
    getStats(organizationId: string): Promise<{
        total: number;
        active: number;
        completed: number;
        conversions: number;
    }>;
    private generateProjectCode;
}
