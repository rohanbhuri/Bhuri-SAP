import { MongoRepository } from 'typeorm';
import { Timesheet, TimesheetEntry } from '../entities/timesheet.entity';
import { ProjectInvoice } from '../entities/project-invoice.entity';
import { Project } from '../entities/project.entity';
export declare class ProjectTimesheetService {
    private timesheetRepository;
    private timesheetEntryRepository;
    private invoiceRepository;
    private projectRepository;
    constructor(timesheetRepository: MongoRepository<Timesheet>, timesheetEntryRepository: MongoRepository<TimesheetEntry>, invoiceRepository: MongoRepository<ProjectInvoice>, projectRepository: MongoRepository<Project>);
    getEntries(organizationId: string, params?: any): Promise<TimesheetEntry[]>;
    createEntry(entryData: any, organizationId: string): Promise<TimesheetEntry[]>;
    updateEntry(id: string, updateData: any): Promise<TimesheetEntry>;
    approveEntries(entryIds: string[], approvedBy: string): Promise<import("typeorm").UpdateResult[]>;
    generateInvoice(projectId: string, organizationId: string, invoiceData: any): Promise<ProjectInvoice>;
    getProjectBillingSummary(projectId: string, organizationId: string): Promise<{
        totalHours: number;
        billableHours: number;
        approvedAmount: number;
        invoicedAmount: number;
        pendingAmount: number;
        entries: number;
    }>;
    getStats(organizationId: string): Promise<any>;
    private calculateThisWeekHours;
    private generateInvoiceNumber;
    private getJsonData;
}
