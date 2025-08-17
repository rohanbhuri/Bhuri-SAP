import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { CrmService } from './crm.service';

@Controller('crm')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getDashboard(@Request() req) {
    return this.crmService.getDashboardStats(req.user.organizationId);
  }

  @Get('contacts')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getContacts(@Request() req) {
    return this.crmService.getContacts(req.user.organizationId);
  }

  @Post('contacts')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createContact(@Body() contactData: any, @Request() req) {
    return this.crmService.createContact(contactData, req.user.organizationId);
  }

  @Get('leads')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getLeads(@Request() req) {
    return this.crmService.getLeads(req.user.organizationId);
  }

  @Post('leads')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createLead(@Body() leadData: any, @Request() req) {
    return this.crmService.createLead(leadData, req.user.organizationId);
  }

  @Get('deals')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getDeals(@Request() req) {
    return this.crmService.getDeals(req.user.organizationId);
  }

  @Post('deals')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createDeal(@Body() dealData: any, @Request() req) {
    return this.crmService.createDeal(dealData, req.user.organizationId);
  }

  @Get('tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getTasks(@Request() req) {
    return this.crmService.getTasks(req.user.organizationId);
  }

  @Post('tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createTask(@Body() taskData: any, @Request() req) {
    return this.crmService.createTask(taskData, req.user.organizationId);
  }
}