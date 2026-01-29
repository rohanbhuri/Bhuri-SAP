import { CrmService } from './crm.service';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    getDashboard(req: any): Promise<{
        contacts: number;
        leads: number;
        deals: number;
        pendingTasks: number;
        pipelineValue: number;
    }>;
    getContacts(req: any): Promise<import("../entities/contact.entity").Contact[]>;
    createContact(contactData: any, req: any): Promise<import("../entities/contact.entity").Contact[]>;
    getLeads(req: any): Promise<import("../entities/lead.entity").Lead[]>;
    createLead(leadData: any, req: any): Promise<import("../entities/lead.entity").Lead[]>;
    getDeals(req: any): Promise<import("../entities/deal.entity").Deal[]>;
    createDeal(dealData: any, req: any): Promise<import("../entities/deal.entity").Deal[]>;
    getTasks(req: any): Promise<import("../entities/task.entity").Task[]>;
    createTask(taskData: any, req: any): Promise<import("../entities/task.entity").Task[]>;
    convertContactToLead(leadData: any, req: any, contactId: string): Promise<import("../entities/lead.entity").Lead[]>;
    convertLeadToDeal(dealData: any, req: any, leadId: string): Promise<import("../entities/deal.entity").Deal[]>;
    createTaskForDeal(taskData: any, req: any, dealId: string): Promise<import("../entities/task.entity").Task[]>;
    getContactsWithLeads(req: any): Promise<import("../entities/contact.entity").Contact[]>;
    getLeadsWithDeals(req: any): Promise<import("../entities/lead.entity").Lead[]>;
    getDealsWithTasks(req: any): Promise<import("../entities/deal.entity").Deal[]>;
    getTasksWithRelations(req: any): Promise<import("../entities/task.entity").Task[]>;
    getConversionReport(req: any): Promise<{
        totalContacts: number;
        totalLeads: number;
        convertedLeads: number;
        totalDeals: number;
        wonDeals: number;
        contactToLeadRate: number;
        leadToDealRate: number;
        dealWinRate: number;
    }>;
    updateContact(id: string, contactData: any, req: any): Promise<import("../entities/contact.entity").Contact>;
    deleteContact(id: string, req: any): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    updateLead(id: string, leadData: any, req: any): Promise<import("../entities/lead.entity").Lead>;
    deleteLead(id: string, req: any): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    updateDeal(id: string, dealData: any, req: any): Promise<import("../entities/deal.entity").Deal>;
    deleteDeal(id: string, req: any): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    updateTask(id: string, taskData: any, req: any): Promise<import("../entities/task.entity").Task>;
    deleteTask(id: string, req: any): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    getOrganizationUsers(req: any): Promise<import("../entities/user.entity").User[]>;
    getMyAssignments(req: any): Promise<{
        contacts: import("../entities/contact.entity").Contact[];
        leads: import("../entities/lead.entity").Lead[];
        deals: import("../entities/deal.entity").Deal[];
        tasks: import("../entities/task.entity").Task[];
        summary: {
            totalContacts: number;
            totalLeads: number;
            totalDeals: number;
            totalTasks: number;
            pendingTasks: number;
            activePipeline: number;
        };
    }>;
    assignContact(id: string, body: {
        assignedToId: string;
    }, req: any): Promise<import("../entities/contact.entity").Contact>;
    unassignContact(id: string, req: any): Promise<import("../entities/contact.entity").Contact>;
    assignLead(id: string, body: {
        assignedToId: string;
    }, req: any): Promise<import("../entities/lead.entity").Lead>;
    unassignLead(id: string, req: any): Promise<import("../entities/lead.entity").Lead>;
    assignDeal(id: string, body: {
        assignedToId: string;
    }, req: any): Promise<import("../entities/deal.entity").Deal>;
    unassignDeal(id: string, req: any): Promise<import("../entities/deal.entity").Deal>;
    assignTask(id: string, body: {
        assignedToId: string;
    }, req: any): Promise<import("../entities/task.entity").Task>;
    unassignTask(id: string, req: any): Promise<import("../entities/task.entity").Task>;
    bulkAssignContacts(body: {
        contactIds: string[];
        assignedToId: string;
    }, req: any): Promise<{
        success: boolean;
        updated: number;
    }>;
    bulkAssignLeads(body: {
        leadIds: string[];
        assignedToId: string;
    }, req: any): Promise<{
        success: boolean;
        updated: number;
    }>;
    bulkAssignDeals(body: {
        dealIds: string[];
        assignedToId: string;
    }, req: any): Promise<{
        success: boolean;
        updated: number;
    }>;
    bulkAssignTasks(body: {
        taskIds: string[];
        assignedToId: string;
    }, req: any): Promise<{
        success: boolean;
        updated: number;
    }>;
}
