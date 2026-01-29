import { ProjectsManagementService } from './projects-management.service';
export declare class ProjectsManagementController {
    private readonly projectsService;
    constructor(projectsService: ProjectsManagementService);
    getProjects(req: any): Promise<import("../entities/project.entity").Project[]>;
    getProject(id: string): Promise<import("../entities/project.entity").Project>;
    createProject(projectData: any, req: any): Promise<any>;
    updateProject(id: string, updateData: any): Promise<import("../entities/project.entity").Project>;
    deleteProject(id: string): Promise<import("typeorm").DeleteResult>;
    convertLeadToProject(conversionData: any, req: any): Promise<any>;
    assignUsersToProject(projectId: string, assignmentData: {
        userIds: string[];
    }, req: any): Promise<import("../entities/project-team-assignment.entity").ProjectTeamAssignment[]>;
    getPipelines(req: any): Promise<import("../entities/project-pipeline.entity").ProjectPipeline[]>;
    createPipeline(pipelineData: any, req: any): Promise<import("../entities/project-pipeline.entity").ProjectPipeline[]>;
    getProjectDeliverables(projectId: string): Promise<import("../entities/project-deliverable.entity").ProjectDeliverable[]>;
    createDeliverable(projectId: string, deliverableData: any, req: any): Promise<import("../entities/project-deliverable.entity").ProjectDeliverable[]>;
    updateDeliverable(id: string, updateData: any): Promise<import("../entities/project-deliverable.entity").ProjectDeliverable>;
    deleteDeliverable(id: string): Promise<import("typeorm").DeleteResult>;
    getStats(req: any): Promise<{
        total: number;
        active: number;
        completed: number;
        conversions: number;
    }>;
}
