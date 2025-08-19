import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timesheet } from '../entities/timesheet.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectTimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepository: Repository<Timesheet>,
  ) {}

  async getEntries(params?: any): Promise<Timesheet[]> {
    try {
      const query: any = {};
      if (params?.startDate && params?.endDate) {
        query.date = {
          $gte: new Date(params.startDate),
          $lte: new Date(params.endDate),
        };
      }
      return await this.timesheetRepository.find(query);
    } catch (error) {
      // Fallback to JSON data
      return this.getJsonData(params);
    }
  }

  async getStats(): Promise<any> {
    const entries = await this.timesheetRepository.find();
    return {
      totalHours: entries.reduce((sum, e) => sum + e.hoursWorked, 0),
      billableHours: entries.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.hoursWorked, 0),
      totalProjects: 0,
      pendingApprovals: entries.filter(e => e.status === 'submitted').length,
      thisWeekHours: 0,
      totalRevenue: 0,
    };
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