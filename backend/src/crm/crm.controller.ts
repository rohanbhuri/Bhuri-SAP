import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CrmService } from './crm.service';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.crmService.getDashboardStats(req.user.organizationId);
  }

  @Get('contacts')
  async getContacts(@Request() req) {
    return this.crmService.getContacts(req.user.organizationId);
  }

  @Post('contacts')
  async createContact(@Body() contactData: any, @Request() req) {
    return this.crmService.createContact(contactData, req.user.organizationId);
  }

  @Get('leads')
  async getLeads(@Request() req) {
    return this.crmService.getLeads(req.user.organizationId);
  }

  @Post('leads')
  async createLead(@Body() leadData: any, @Request() req) {
    return this.crmService.createLead(leadData, req.user.organizationId);
  }

  @Get('deals')
  async getDeals(@Request() req) {
    return this.crmService.getDeals(req.user.organizationId);
  }

  @Post('deals')
  async createDeal(@Body() dealData: any, @Request() req) {
    return this.crmService.createDeal(dealData, req.user.organizationId);
  }

  @Get('tasks')
  async getTasks(@Request() req) {
    return this.crmService.getTasks(req.user.organizationId);
  }

  @Post('tasks')
  async createTask(@Body() taskData: any, @Request() req) {
    return this.crmService.createTask(taskData, req.user.organizationId);
  }
}