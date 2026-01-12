import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientManagementService } from './client-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('client-management')
export class ClientManagementController {
  constructor(private clientManagementService: ClientManagementService) {}

  @Post('login')
  @UseGuards(ApiKeyGuard)
  async apiLogin(@Body() body: { email: string; password: string }) {
    return this.clientManagementService.apiLogin(body.email, body.password);
  }

  @Post('logout')
  @UseGuards(ApiKeyGuard)
  async apiLogout(@Body() body: { clientId: string }) {
    return this.clientManagementService.apiLogout(body.clientId);
  }

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

  @Post('clients/:clientId/request-credentials')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async requestLoginCredentials(
    @Param('clientId') clientId: string,
    @Body() credentialData: any
  ) {
    return this.clientManagementService.requestLoginCredentials(clientId, credentialData);
  }

  @Get('clients/:clientId/security-settings')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getSecuritySettings(@Param('clientId') clientId: string) {
    return this.clientManagementService.getSecuritySettings(clientId);
  }

  @Put('clients/:clientId/security-settings')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateSecuritySettings(
    @Param('clientId') clientId: string,
    @Body() settings: any
  ) {
    return this.clientManagementService.updateSecuritySettings(clientId, settings);
  }

  @Post('contact-us')
  async createContactMessage(@Body() messageData: any) {
    return this.clientManagementService.createContactMessage(messageData);
  }

  @Get('contact-us')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllContactMessages() {
    return this.clientManagementService.getAllContactMessages();
  }

  @Get('contact-us/unread-count')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getContactUnreadCount() {
    const count = await this.clientManagementService.getContactUnreadCount();
    return { count };
  }

  @Get('contact-us/:messageId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getContactMessageById(@Param('messageId') messageId: string) {
    return this.clientManagementService.getContactMessageById(messageId);
  }

  @Put('contact-us/:messageId/read')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async markContactMessageAsRead(@Param('messageId') messageId: string) {
    return this.clientManagementService.markContactMessageAsRead(messageId);
  }

  @Delete('contact-us/:messageId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async deleteContactMessage(@Param('messageId') messageId: string) {
    return this.clientManagementService.deleteContactMessage(messageId);
  }
}
