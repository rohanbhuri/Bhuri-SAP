import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { OrganizationManagementService } from './organization-management.service';

@Controller('organization-management')
export class OrganizationManagementController {
  constructor(private orgManagementService: OrganizationManagementService) {}

  @Get('organizations')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  findAllOrganizations() {
    return this.orgManagementService.findAll();
  }

  @Post('organizations')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  createOrganization(@Body() orgData: any) {
    return this.orgManagementService.create(orgData);
  }

  @Put('organizations/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  updateOrganization(@Param('id') id: string, @Body() updateData: any) {
    return this.orgManagementService.update(id, updateData);
  }

  @Delete('organizations/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  deleteOrganization(@Param('id') id: string) {
    return this.orgManagementService.delete(id);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  getOrganizationRequests() {
    return this.orgManagementService.getOrganizationRequests();
  }

  @Put('requests/:id/approve')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  approveRequest(@Param('id') id: string) {
    if (!id || id === 'undefined') {
      throw new BadRequestException('Valid request ID is required');
    }
    return this.orgManagementService.approveRequest(id);
  }

  @Put('requests/:id/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  rejectRequest(@Param('id') id: string) {
    if (!id || id === 'undefined') {
      throw new BadRequestException('Valid request ID is required');
    }
    return this.orgManagementService.rejectRequest(id);
  }

  @Post('requests')
  @UseGuards(JwtAuthGuard)
  requestToJoinOrganization(@Request() req, @Body() body: { organizationId: string }) {
    console.log('Request body:', body);
    console.log('User:', req.user);
    
    if (!body.organizationId) {
      throw new BadRequestException('Organization ID is required');
    }
    
    return this.orgManagementService.requestToJoin(req.user.userId, body.organizationId);
  }

  @Put('organizations/:id/modules')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  updateOrganizationModules(@Param('id') id: string, @Body() body: { moduleIds: string[] }) {
    return this.orgManagementService.updateOrganizationModules(id, body.moduleIds);
  }

  @Put('switch-organization/:id')
  @UseGuards(JwtAuthGuard)
  switchCurrentOrganization(@Request() req, @Param('id') organizationId: string) {
    return this.orgManagementService.switchUserOrganization(req.user.userId, organizationId);
  }
}