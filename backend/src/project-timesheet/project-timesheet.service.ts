import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Timesheet, TimesheetEntry } from '../entities/timesheet.entity';
import { ProjectInvoice } from '../entities/project-invoice.entity';
import { Project } from '../entities/project.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectTimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepository: MongoRepository<Timesheet>,
    @InjectRepository(TimesheetEntry)
    private timesheetEntryRepository: MongoRepository<TimesheetEntry>,
    @InjectRepository(ProjectInvoice)
    private invoiceRepository: MongoRepository<ProjectInvoice>,
    @InjectRepository(Project)
    private projectRepository: MongoRepository<Project>,
  ) {}

  // Timesheet Entry Management
  async getEntries(organizationId: string, params?: any): Promise<TimesheetEntry[]> {
    try {
      const query: any = { organizationId: new ObjectId(organizationId) };
      
      if (params?.startDate && params?.endDate) {
        query.date = {
          $gte: new Date(params.startDate),
          $lte: new Date(params.endDate),
        };
      }
      
      if (params?.projectId) {
        query.projectId = new ObjectId(params.projectId);
      }
      
      if (params?.employeeId) {
        query.employeeId = new ObjectId(params.employeeId);
      }
      
      return await this.timesheetEntryRepository.find({ where: query });
    } catch (error) {
      return this.getJsonData(params);
    }
  }

  async createEntry(entryData: any, organizationId: string) {
    const entry = this.timesheetEntryRepository.create({
      ...entryData,
      organizationId: new ObjectId(organizationId),
      projectId: new ObjectId(entryData.projectId),
      employeeId: new ObjectId(entryData.employeeId),
      taskId: entryData.taskId ? new ObjectId(entryData.taskId) : null,
      deliverableId: entryData.deliverableId ? new ObjectId(entryData.deliverableId) : null,
      billingAmount: entryData.billable ? (entryData.totalHours * (entryData.hourlyRate || 0)) : 0
    });
    
    return this.timesheetEntryRepository.save(entry);
  }

  async updateEntry(id: string, updateData: any) {
    updateData.updatedAt = new Date();
    if (updateData.billable && updateData.totalHours && updateData.hourlyRate) {
      updateData.billingAmount = updateData.totalHours * updateData.hourlyRate;
    }
    
    await this.timesheetEntryRepository.update(new ObjectId(id), updateData);
    return this.timesheetEntryRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async approveEntries(entryIds: string[], approvedBy: string) {
    const updates = entryIds.map(id => 
      this.timesheetEntryRepository.update(new ObjectId(id), {
        status: 'approved',
        approvedBy: new ObjectId(approvedBy),
        approvedAt: new Date(),
        updatedAt: new Date()
      })
    );
    
    return Promise.all(updates);
  }

  // Billing & Invoice Generation
  async generateInvoice(projectId: string, organizationId: string, invoiceData: any) {
    const project = await this.projectRepository.findOne({
      where: { _id: new ObjectId(projectId) }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Get approved, billable, uninvoiced timesheet entries
    const entries = await this.timesheetEntryRepository.find({
      where: {
        projectId: new ObjectId(projectId),
        organizationId: new ObjectId(organizationId),
        status: 'approved',
        billable: true,
        invoiced: false
      }
    });

    if (entries.length === 0) {
      throw new Error('No billable entries found for this project');
    }

    // Calculate invoice items
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

    // Create invoice
    const invoice = this.invoiceRepository.create({
      organizationId: new ObjectId(organizationId),
      projectId: new ObjectId(projectId),
      clientId: project.clientId,
      invoiceNumber: await this.generateInvoiceNumber(organizationId),
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items,
      subtotal,
      tax,
      total
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Mark entries as invoiced
    await Promise.all(entries.map(entry => 
      this.timesheetEntryRepository.update(entry._id, {
        invoiced: true,
        invoiceId: savedInvoice._id,
        updatedAt: new Date()
      })
    ));

    return savedInvoice;
  }

  async getProjectBillingSummary(projectId: string, organizationId: string) {
    const entries = await this.timesheetEntryRepository.find({
      where: {
        projectId: new ObjectId(projectId),
        organizationId: new ObjectId(organizationId)
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

  // Statistics
  async getStats(organizationId: string): Promise<any> {
    const entries = await this.timesheetEntryRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });
    
    const totalHours = entries.reduce((sum, e) => sum + e.totalHours, 0);
    const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.totalHours, 0);
    const approvedEntries = entries.filter(e => e.status === 'approved');
    const totalRevenue = approvedEntries.reduce((sum, e) => sum + (e.billingAmount || 0), 0);
    
    // Get unique projects
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

  private calculateThisWeekHours(entries: TimesheetEntry[]): number {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
    
    return entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    }).reduce((sum, e) => sum + e.totalHours, 0);
  }

  private async generateInvoiceNumber(organizationId: string): Promise<string> {
    const count = await this.invoiceRepository.count({
      where: { organizationId: new ObjectId(organizationId) }
    });
    return `INV-${String(count + 1).padStart(4, '0')}`;
  }

  private getJsonData(params?: any): any[] {
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
    } catch (error) {
      return [];
    }
  }
}