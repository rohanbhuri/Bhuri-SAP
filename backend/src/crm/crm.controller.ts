import { Controller, Get, Post, Put, Delete, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
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

  // Conversion endpoints
  @Post('contacts/:id/convert-to-lead')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async convertContactToLead(@Body() leadData: any, @Request() req, @Param('id') contactId: string) {
    return this.crmService.convertContactToLead(contactId, leadData, req.user.organizationId);
  }

  @Post('leads/:id/convert-to-deal')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async convertLeadToDeal(@Body() dealData: any, @Request() req, @Param('id') leadId: string) {
    return this.crmService.convertLeadToDeal(leadId, dealData, req.user.organizationId);
  }

  @Post('deals/:id/create-task')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createTaskForDeal(@Body() taskData: any, @Request() req, @Param('id') dealId: string) {
    return this.crmService.createTaskForDeal(dealId, taskData, req.user.organizationId);
  }

  // Enhanced endpoints with relationships
  @Get('contacts-with-leads')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getContactsWithLeads(@Request() req) {
    return this.crmService.getContactsWithLeads(req.user.organizationId);
  }

  @Get('leads-with-deals')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getLeadsWithDeals(@Request() req) {
    return this.crmService.getLeadsWithDeals(req.user.organizationId);
  }

  @Get('deals-with-tasks')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getDealsWithTasks(@Request() req) {
    return this.crmService.getDealsWithTasks(req.user.organizationId);
  }

  @Get('tasks-with-relations')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getTasksWithRelations(@Request() req) {
    return this.crmService.getTasksWithRelations(req.user.organizationId);
  }

  @Get('conversion-report')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getConversionReport(@Request() req) {
    return this.crmService.getConversionReport(req.user.organizationId);
  }

  // Update and Delete endpoints
  @Put('contacts/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateContact(@Param('id') id: string, @Body() contactData: any, @Request() req) {
    return this.crmService.updateContact(id, contactData, req.user.organizationId);
  }

  @Delete('contacts/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async deleteContact(@Param('id') id: string, @Request() req) {
    return this.crmService.deleteContact(id, req.user.organizationId);
  }

  @Put('leads/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateLead(@Param('id') id: string, @Body() leadData: any, @Request() req) {
    return this.crmService.updateLead(id, leadData, req.user.organizationId);
  }

  @Delete('leads/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async deleteLead(@Param('id') id: string, @Request() req) {
    return this.crmService.deleteLead(id, req.user.organizationId);
  }

  @Put('deals/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateDeal(@Param('id') id: string, @Body() dealData: any, @Request() req) {
    return this.crmService.updateDeal(id, dealData, req.user.organizationId);
  }

  @Delete('deals/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async deleteDeal(@Param('id') id: string, @Request() req) {
    return this.crmService.deleteDeal(id, req.user.organizationId);
  }

  @Put('tasks/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateTask(@Param('id') id: string, @Body() taskData: any, @Request() req) {
    return this.crmService.updateTask(id, taskData, req.user.organizationId);
  }

  @Delete('tasks/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async deleteTask(@Param('id') id: string, @Request() req) {
    return this.crmService.deleteTask(id, req.user.organizationId);
  }

  // Assignment Management Endpoints
  @Get('users')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getOrganizationUsers(@Request() req) {
    return this.crmService.getOrganizationUsers(req.user.organizationId);
  }

  @Get('my-assignments')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getMyAssignments(@Request() req) {
    return this.crmService.getMyAssignments(req.user.userId, req.user.organizationId);
  }

  // Contact Assignment
  @Put('contacts/:id/assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async assignContact(@Param('id') id: string, @Body() body: { assignedToId: string }, @Request() req) {
    return this.crmService.assignContact(id, body.assignedToId, req.user.organizationId);
  }

  @Put('contacts/:id/unassign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async unassignContact(@Param('id') id: string, @Request() req) {
    return this.crmService.unassignContact(id, req.user.organizationId);
  }

  // Lead Assignment
  @Put('leads/:id/assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async assignLead(@Param('id') id: string, @Body() body: { assignedToId: string }, @Request() req) {
    return this.crmService.assignLead(id, body.assignedToId, req.user.organizationId);
  }

  @Put('leads/:id/unassign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async unassignLead(@Param('id') id: string, @Request() req) {
    return this.crmService.unassignLead(id, req.user.organizationId);
  }

  // Deal Assignment
  @Put('deals/:id/assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async assignDeal(@Param('id') id: string, @Body() body: { assignedToId: string }, @Request() req) {
    return this.crmService.assignDeal(id, body.assignedToId, req.user.organizationId);
  }

  @Put('deals/:id/unassign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async unassignDeal(@Param('id') id: string, @Request() req) {
    return this.crmService.unassignDeal(id, req.user.organizationId);
  }

  // Task Assignment
  @Put('tasks/:id/assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async assignTask(@Param('id') id: string, @Body() body: { assignedToId: string }, @Request() req) {
    return this.crmService.assignTask(id, body.assignedToId, req.user.organizationId);
  }

  @Put('tasks/:id/unassign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async unassignTask(@Param('id') id: string, @Request() req) {
    return this.crmService.unassignTask(id, req.user.organizationId);
  }

  // Bulk Assignment Operations
  @Put('contacts/bulk-assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async bulkAssignContacts(@Body() body: { contactIds: string[], assignedToId: string }, @Request() req) {
    return this.crmService.bulkAssignContacts(body.contactIds, body.assignedToId, req.user.organizationId);
  }

  @Put('leads/bulk-assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async bulkAssignLeads(@Body() body: { leadIds: string[], assignedToId: string }, @Request() req) {
    return this.crmService.bulkAssignLeads(body.leadIds, body.assignedToId, req.user.organizationId);
  }

  @Put('deals/bulk-assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async bulkAssignDeals(@Body() body: { dealIds: string[], assignedToId: string }, @Request() req) {
    return this.crmService.bulkAssignDeals(body.dealIds, body.assignedToId, req.user.organizationId);
  }

  @Put('tasks/bulk-assign')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async bulkAssignTasks(@Body() body: { taskIds: string[], assignedToId: string }, @Request() req) {
    return this.crmService.bulkAssignTasks(body.taskIds, body.assignedToId, req.user.organizationId);
  }
}