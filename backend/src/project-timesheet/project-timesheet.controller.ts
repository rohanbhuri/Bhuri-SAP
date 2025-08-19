import { Controller, Get, Query } from '@nestjs/common';
import { ProjectTimesheetService } from './project-timesheet.service';

@Controller('project-timesheet')
export class ProjectTimesheetController {
  constructor(private readonly timesheetService: ProjectTimesheetService) {}

  @Get('entries')
  async getEntries(@Query() query: any) {
    return this.timesheetService.getEntries(query);
  }

  @Get('stats')
  async getStats() {
    return this.timesheetService.getStats();
  }
}