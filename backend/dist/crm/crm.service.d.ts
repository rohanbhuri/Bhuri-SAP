import { MongoRepository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { Lead } from '../entities/lead.entity';
import { Deal } from '../entities/deal.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
export declare class CrmService {
    private contactRepository;
    private leadRepository;
    private dealRepository;
    private taskRepository;
    private userRepository;
    constructor(contactRepository: MongoRepository<Contact>, leadRepository: MongoRepository<Lead>, dealRepository: MongoRepository<Deal>, taskRepository: MongoRepository<Task>, userRepository: MongoRepository<User>);
    getContacts(organizationId: string): Promise<Contact[]>;
    createContact(contactData: any, organizationId: string): Promise<Contact[]>;
    getLeads(organizationId: string): Promise<Lead[]>;
    createLead(leadData: any, organizationId: string): Promise<Lead[]>;
    getDeals(organizationId: string): Promise<Deal[]>;
    createDeal(dealData: any, organizationId: string): Promise<Deal[]>;
    getTasks(organizationId: string): Promise<Task[]>;
    createTask(taskData: any, organizationId: string): Promise<Task[]>;
    convertContactToLead(contactId: string, leadData: any, organizationId: string): Promise<Lead[]>;
    convertLeadToDeal(leadId: string, dealData: any, organizationId: string): Promise<Deal[]>;
    createTaskForDeal(dealId: string, taskData: any, organizationId: string): Promise<Task[]>;
    getContactsWithLeads(organizationId: string): Promise<Contact[]>;
    getLeadsWithDeals(organizationId: string): Promise<Lead[]>;
    getDealsWithTasks(organizationId: string): Promise<Deal[]>;
    getTasksWithRelations(organizationId: string): Promise<Task[]>;
    getConversionReport(organizationId: string): Promise<{
        totalContacts: number;
        totalLeads: number;
        convertedLeads: number;
        totalDeals: number;
        wonDeals: number;
        contactToLeadRate: number;
        leadToDealRate: number;
        dealWinRate: number;
    }>;
    updateContact(id: string, contactData: any, organizationId: string): Promise<Contact>;
    deleteContact(id: string, organizationId: string): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    updateLead(id: string, leadData: any, organizationId: string): Promise<Lead>;
    deleteLead(id: string, organizationId: string): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    updateDeal(id: string, dealData: any, organizationId: string): Promise<Deal>;
    deleteDeal(id: string, organizationId: string): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    updateTask(id: string, taskData: any, organizationId: string): Promise<Task>;
    deleteTask(id: string, organizationId: string): Promise<import("typeorm/driver/mongodb/typings").DeleteResult>;
    getDashboardStats(organizationId: string): Promise<{
        contacts: number;
        leads: number;
        deals: number;
        pendingTasks: number;
        pipelineValue: number;
    }>;
    getOrganizationUsers(organizationId: string): Promise<User[]>;
    assignContact(contactId: string, assignedToId: string, organizationId: string): Promise<Contact>;
    unassignContact(contactId: string, organizationId: string): Promise<Contact>;
    assignLead(leadId: string, assignedToId: string, organizationId: string): Promise<Lead>;
    unassignLead(leadId: string, organizationId: string): Promise<Lead>;
    assignDeal(dealId: string, assignedToId: string, organizationId: string): Promise<Deal>;
    unassignDeal(dealId: string, organizationId: string): Promise<Deal>;
    assignTask(taskId: string, assignedToId: string, organizationId: string): Promise<Task>;
    unassignTask(taskId: string, organizationId: string): Promise<Task>;
    getMyAssignments(userId: string, organizationId: string): Promise<{
        contacts: Contact[];
        leads: Lead[];
        deals: Deal[];
        tasks: Task[];
        summary: {
            totalContacts: number;
            totalLeads: number;
            totalDeals: number;
            totalTasks: number;
            pendingTasks: number;
            activePipeline: number;
        };
    }>;
    bulkAssignContacts(contactIds: string[], assignedToId: string, organizationId: string): Promise<{
        success: boolean;
        updated: number;
    }>;
    bulkAssignLeads(leadIds: string[], assignedToId: string, organizationId: string): Promise<{
        success: boolean;
        updated: number;
    }>;
    bulkAssignDeals(dealIds: string[], assignedToId: string, organizationId: string): Promise<{
        success: boolean;
        updated: number;
    }>;
    bulkAssignTasks(taskIds: string[], assignedToId: string, organizationId: string): Promise<{
        success: boolean;
        updated: number;
    }>;
}
