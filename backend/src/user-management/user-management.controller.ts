import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user-management')
@UseGuards(JwtAuthGuard)
export class UserManagementController {
  constructor(private userManagementService: UserManagementService) {}

  @Get('users')
  async getAllUsers() {
    return this.userManagementService.getAllUsers();
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    return this.userManagementService.createUser(userData);
  }

  @Put('users/:userId')
  async updateUser(@Param('userId') userId: string, @Body() userData: any) {
    return this.userManagementService.updateUser(userId, userData);
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userManagementService.deleteUser(userId);
  }

  @Put('users/:userId/status')
  async toggleUserStatus(@Param('userId') userId: string, @Body() body: { isActive: boolean }) {
    return this.userManagementService.toggleUserStatus(userId, body.isActive);
  }

  @Get('organizations')
  async getAllOrganizations() {
    return this.userManagementService.getAllOrganizations();
  }

  @Get('roles')
  async getAllRoles() {
    return this.userManagementService.getAllRoles();
  }

  @Get('permissions')
  async getAllPermissions() {
    return this.userManagementService.getAllPermissions();
  }

  @Get('modules')
  async getAllModules() {
    return this.userManagementService.getAllModules();
  }

  @Put('users/:userId/roles')
  async updateUserRoles(@Param('userId') userId: string, @Body() body: { roleIds: string[] }) {
    return this.userManagementService.updateUserRoles(userId, body.roleIds);
  }

  @Put('users/:userId/permissions')
  async updateUserPermissions(@Param('userId') userId: string, @Body() body: { permissionIds: string[] }) {
    return this.userManagementService.updateUserPermissions(userId, body.permissionIds);
  }

  @Post('roles')
  async createRole(@Body() roleData: any) {
    return this.userManagementService.createRole(roleData);
  }

  @Put('roles/:roleId')
  async updateRole(@Param('roleId') roleId: string, @Body() roleData: any) {
    return this.userManagementService.updateRole(roleId, roleData);
  }

  @Post('permissions')
  async createPermission(@Body() permissionData: any) {
    return this.userManagementService.createPermission(permissionData);
  }

  @Put('permissions/:permissionId')
  async updatePermission(@Param('permissionId') permissionId: string, @Body() permissionData: any) {
    return this.userManagementService.updatePermission(permissionId, permissionData);
  }

  @Delete('permissions/:permissionId')
  async deletePermission(@Param('permissionId') permissionId: string) {
    return this.userManagementService.deletePermission(permissionId);
  }

  @Delete('roles/:roleId')
  async deleteRole(@Param('roleId') roleId: string) {
    return this.userManagementService.deleteRole(roleId);
  }

  @Post('setup-defaults')
  async setupDefaults() {
    return this.userManagementService.setupDefaults();
  }

  @Get('permission-templates')
  async getPermissionTemplates() {
    return this.userManagementService.getPermissionTemplates();
  }

  @Post('roles/:roleId/apply-template')
  async applyPermissionTemplate(@Param('roleId') roleId: string, @Body() body: { templateId: string }) {
    return this.userManagementService.applyPermissionTemplate(roleId, body.templateId);
  }
}