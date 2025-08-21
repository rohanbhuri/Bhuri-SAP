import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ProjectTimesheetService } from './project-timesheet.service';

@Controller('project-timesheet')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectTimesheetController {
  constructor(private readonly timesheetService: ProjectTimesheetService) {}

  // Timesheet Entry Management
  @Get('entries')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getEntries(@Query() query: any, @Req() req: any) {
    return this.timesheetService.getEntries(req.user.organizationId, query);
  }

  @Post('entries')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async createEntry(@Body() entryData: any, @Req() req: any) {
    return this.timesheetService.createEntry(entryData, req.user.organizationId);
  }

  @Put('entries/:id')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async updateEntry(@Param('id') id: string, @Body() updateData: any) {
    return this.timesheetService.updateEntry(id, updateData);
  }

  @Patch('entries/approve')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async approveEntries(@Body() approvalData: { entryIds: string[] }, @Req() req: any) {
    return this.timesheetService.approveEntries(approvalData.entryIds, req.user.userId);
  }

  // Billing & Invoice Management
  @Post('projects/:projectId/generate-invoice')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async generateInvoice(
    @Param('projectId') projectId: string,
    @Body() invoiceData: any,
    @Req() req: any
  ) {
    return this.timesheetService.generateInvoice(
      projectId,
      req.user.organizationId,
      invoiceData
    );
  }

  @Get('projects/:projectId/billing-summary')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getProjectBillingSummary(
    @Param('projectId') projectId: string,
    @Req() req: any
  ) {
    return this.timesheetService.getProjectBillingSummary(
      projectId,
      req.user.organizationId
    );
  }

  // Statistics
  @Get('stats')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getStats(@Req() req: any) {
    return this.timesheetService.getStats(req.user.organizationId);
  }
}