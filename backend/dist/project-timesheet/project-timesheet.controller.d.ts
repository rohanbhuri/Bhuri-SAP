import { ProjectTimesheetService } from './project-timesheet.service';
export declare class ProjectTimesheetController {
    private readonly timesheetService;
    constructor(timesheetService: ProjectTimesheetService);
    getEntries(query: any, req: any): Promise<import("../entities/timesheet.entity").TimesheetEntry[]>;
    createEntry(entryData: any, req: any): Promise<import("../entities/timesheet.entity").TimesheetEntry[]>;
    updateEntry(id: string, updateData: any): Promise<import("../entities/timesheet.entity").TimesheetEntry>;
    approveEntries(approvalData: {
        entryIds: string[];
    }, req: any): Promise<import("typeorm").UpdateResult[]>;
    generateInvoice(projectId: string, invoiceData: any, req: any): Promise<import("../entities/project-invoice.entity").ProjectInvoice>;
    getProjectBillingSummary(projectId: string, req: any): Promise<{
        totalHours: number;
        billableHours: number;
        approvedAmount: number;
        invoicedAmount: number;
        pendingAmount: number;
        entries: number;
    }>;
    getStats(req: any): Promise<any>;
}
