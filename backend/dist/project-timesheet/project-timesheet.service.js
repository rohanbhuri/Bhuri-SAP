"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTimesheetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const timesheet_entity_1 = require("../entities/timesheet.entity");
const project_invoice_entity_1 = require("../entities/project-invoice.entity");
const project_entity_1 = require("../entities/project.entity");
const fs = require("fs");
const path = require("path");
let ProjectTimesheetService = class ProjectTimesheetService {
    constructor(timesheetRepository, timesheetEntryRepository, invoiceRepository, projectRepository) {
        this.timesheetRepository = timesheetRepository;
        this.timesheetEntryRepository = timesheetEntryRepository;
        this.invoiceRepository = invoiceRepository;
        this.projectRepository = projectRepository;
    }
    async getEntries(organizationId, params) {
        try {
            const query = { organizationId: new mongodb_1.ObjectId(organizationId) };
            if (params?.startDate && params?.endDate) {
                query.date = {
                    $gte: new Date(params.startDate),
                    $lte: new Date(params.endDate),
                };
            }
            if (params?.projectId) {
                query.projectId = new mongodb_1.ObjectId(params.projectId);
            }
            if (params?.employeeId) {
                query.employeeId = new mongodb_1.ObjectId(params.employeeId);
            }
            return await this.timesheetEntryRepository.find({ where: query });
        }
        catch (error) {
            return this.getJsonData(params);
        }
    }
    async createEntry(entryData, organizationId) {
        const entry = this.timesheetEntryRepository.create({
            ...entryData,
            organizationId: new mongodb_1.ObjectId(organizationId),
            projectId: new mongodb_1.ObjectId(entryData.projectId),
            employeeId: new mongodb_1.ObjectId(entryData.employeeId),
            taskId: entryData.taskId ? new mongodb_1.ObjectId(entryData.taskId) : null,
            deliverableId: entryData.deliverableId ? new mongodb_1.ObjectId(entryData.deliverableId) : null,
            billingAmount: entryData.billable ? (entryData.totalHours * (entryData.hourlyRate || 0)) : 0
        });
        return this.timesheetEntryRepository.save(entry);
    }
    async updateEntry(id, updateData) {
        updateData.updatedAt = new Date();
        if (updateData.billable && updateData.totalHours && updateData.hourlyRate) {
            updateData.billingAmount = updateData.totalHours * updateData.hourlyRate;
        }
        await this.timesheetEntryRepository.update(new mongodb_1.ObjectId(id), updateData);
        return this.timesheetEntryRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async approveEntries(entryIds, approvedBy) {
        const updates = entryIds.map(id => this.timesheetEntryRepository.update(new mongodb_1.ObjectId(id), {
            status: 'approved',
            approvedBy: new mongodb_1.ObjectId(approvedBy),
            approvedAt: new Date(),
            updatedAt: new Date()
        }));
        return Promise.all(updates);
    }
    async generateInvoice(projectId, organizationId, invoiceData) {
        const project = await this.projectRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(projectId) }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        const entries = await this.timesheetEntryRepository.find({
            where: {
                projectId: new mongodb_1.ObjectId(projectId),
                organizationId: new mongodb_1.ObjectId(organizationId),
                status: 'approved',
                billable: true,
                invoiced: false
            }
        });
        if (entries.length === 0) {
            throw new Error('No billable entries found for this project');
        }
        const items = entries.map(entry => ({
            type: 'timesheet',
            description: `${entry.workType || 'Work'} - ${entry.description}`,
            quantity: entry.totalHours,
            rate: entry.hourlyRate || 0,
            amount: entry.billingAmount || 0,
            timesheetEntryIds: [entry._id]
        }));
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const tax = subtotal * (invoiceData.taxRate || 0) / 100;
        const total = subtotal + tax;
        const invoice = this.invoiceRepository.create({
            organizationId: new mongodb_1.ObjectId(organizationId),
            projectId: new mongodb_1.ObjectId(projectId),
            clientId: project.clientId,
            invoiceNumber: await this.generateInvoiceNumber(organizationId),
            invoiceDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            items,
            subtotal,
            tax,
            total
        });
        const savedInvoice = await this.invoiceRepository.save(invoice);
        await Promise.all(entries.map(entry => this.timesheetEntryRepository.update(entry._id, {
            invoiced: true,
            invoiceId: savedInvoice._id,
            updatedAt: new Date()
        })));
        return savedInvoice;
    }
    async getProjectBillingSummary(projectId, organizationId) {
        const entries = await this.timesheetEntryRepository.find({
            where: {
                projectId: new mongodb_1.ObjectId(projectId),
                organizationId: new mongodb_1.ObjectId(organizationId)
            }
        });
        const totalHours = entries.reduce((sum, e) => sum + e.totalHours, 0);
        const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.totalHours, 0);
        const approvedAmount = entries.filter(e => e.status === 'approved' && e.billable)
            .reduce((sum, e) => sum + (e.billingAmount || 0), 0);
        const invoicedAmount = entries.filter(e => e.invoiced)
            .reduce((sum, e) => sum + (e.billingAmount || 0), 0);
        return {
            totalHours,
            billableHours,
            approvedAmount,
            invoicedAmount,
            pendingAmount: approvedAmount - invoicedAmount,
            entries: entries.length
        };
    }
    async getStats(organizationId) {
        const entries = await this.timesheetEntryRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        const totalHours = entries.reduce((sum, e) => sum + e.totalHours, 0);
        const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.totalHours, 0);
        const approvedEntries = entries.filter(e => e.status === 'approved');
        const totalRevenue = approvedEntries.reduce((sum, e) => sum + (e.billingAmount || 0), 0);
        const projectIds = [...new Set(entries.map(e => e.projectId.toString()))];
        return {
            totalHours,
            billableHours,
            totalProjects: projectIds.length,
            pendingApprovals: entries.filter(e => e.status === 'submitted').length,
            thisWeekHours: this.calculateThisWeekHours(entries),
            totalRevenue,
        };
    }
    calculateThisWeekHours(entries) {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
        return entries.filter(e => {
            const entryDate = new Date(e.date);
            return entryDate >= startOfWeek && entryDate <= endOfWeek;
        }).reduce((sum, e) => sum + e.totalHours, 0);
    }
    async generateInvoiceNumber(organizationId) {
        const count = await this.invoiceRepository.count({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        return `INV-${String(count + 1).padStart(4, '0')}`;
    }
    getJsonData(params) {
        try {
            const filePath = path.join(__dirname, '../data/timesheet-data.json');
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (params?.startDate && params?.endDate) {
                const startDate = new Date(params.startDate);
                const endDate = new Date(params.endDate);
                return data.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate >= startDate && itemDate <= endDate;
                });
            }
            return data;
        }
        catch (error) {
            return [];
        }
    }
};
exports.ProjectTimesheetService = ProjectTimesheetService;
exports.ProjectTimesheetService = ProjectTimesheetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(timesheet_entity_1.Timesheet)),
    __param(1, (0, typeorm_1.InjectRepository)(timesheet_entity_1.TimesheetEntry)),
    __param(2, (0, typeorm_1.InjectRepository)(project_invoice_entity_1.ProjectInvoice)),
    __param(3, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], ProjectTimesheetService);
//# sourceMappingURL=project-timesheet.service.js.map