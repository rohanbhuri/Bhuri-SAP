import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { OrganizationManagementService } from './organization-management.service';

@Controller('organization-management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrganizationManagementController {
  constructor(private orgManagementService: OrganizationManagementService) {}

  @Get('organizations')
  @RequireRoles(RoleType.SUPER_ADMIN)
  findAllOrganizations() {
    return this.orgManagementService.findAll();
  }

  @Post('organizations')
  @RequireRoles(RoleType.SUPER_ADMIN)
  createOrganization(@Body() orgData: any) {
    return this.orgManagementService.create(orgData);
  }

  @Put('organizations/:id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  updateOrganization(@Param('id') id: string, @Body() updateData: any) {
    return this.orgManagementService.update(id, updateData);
  }

  @Delete('organizations/:id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  deleteOrganization(@Param('id') id: string) {
    return this.orgManagementService.delete(id);
  }

  @Get('requests')
  @RequireRoles(RoleType.SUPER_ADMIN)
  getOrganizationRequests() {
    return this.orgManagementService.getOrganizationRequests();
  }

  @Put('requests/:id/approve')
  @RequireRoles(RoleType.SUPER_ADMIN)
  approveRequest(@Param('id') id: string) {
    return this.orgManagementService.approveRequest(id);
  }

  @Put('requests/:id/reject')
  @RequireRoles(RoleType.SUPER_ADMIN)
  rejectRequest(@Param('id') id: string) {
    return this.orgManagementService.rejectRequest(id);
  }

  @Post('requests')
  requestToJoinOrganization(@Request() req, @Body() body: { organizationId: string }) {
    return this.orgManagementService.requestToJoin(req.user.userId, body.organizationId);
  }

  @Put('organizations/:id/modules')
  @RequireRoles(RoleType.SUPER_ADMIN)
  updateOrganizationModules(@Param('id') id: string, @Body() body: { moduleIds: string[] }) {
    return this.orgManagementService.updateOrganizationModules(id, body.moduleIds);
  }

  @Put('switch-organization/:id')
  switchCurrentOrganization(@Request() req, @Param('id') organizationId: string) {
    return this.orgManagementService.switchUserOrganization(req.user.userId, organizationId);
  }
}