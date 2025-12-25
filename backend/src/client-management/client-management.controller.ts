import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientManagementService } from './client-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';

@Controller('client-management')
export class ClientManagementController {
  constructor(private clientManagementService: ClientManagementService) {}

  @Post('requests')
  async createClientRequest(@Body() requestData: any) {
    return this.clientManagementService.createClientRequest(requestData);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllClientRequests() {
    return this.clientManagementService.getAllClientRequests();
  }

  @Get('requests/:requestId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getClientRequestById(@Param('requestId') requestId: string) {
    return this.clientManagementService.getClientRequestById(requestId);
  }

  @Put('requests/:requestId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateClientRequest(
    @Param('requestId') requestId: string,
    @Body() updateData: any,
    @Request() req
  ) {
    return this.clientManagementService.updateClientRequest(requestId, updateData, req.user.userId);
  }

  @Post('requests/:requestId/convert')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async convertToClient(
    @Param('requestId') requestId: string,
    @Body() conversionData: any,
    @Request() req
  ) {
    return this.clientManagementService.convertToClient(requestId, conversionData, req.user.userId);
  }

  @Get('clients')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllClients() {
    return this.clientManagementService.getAllClients();
  }

  @Get('clients/:clientId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getClientById(@Param('clientId') clientId: string) {
    return this.clientManagementService.getClientById(clientId);
  }

  @Put('clients/:clientId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateClient(@Param('clientId') clientId: string, @Body() updateData: any) {
    return this.clientManagementService.updateClient(clientId, updateData);
  }

  @Delete('clients/:clientId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deleteClient(@Param('clientId') clientId: string) {
    return this.clientManagementService.deleteClient(clientId);
  }

  @Put('clients/:clientId/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async toggleClientStatus(@Param('clientId') clientId: string, @Body() body: { isActive: boolean }) {
    return this.clientManagementService.toggleClientStatus(clientId, body.isActive);
  }
}
