import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { UserManagementService } from './user-management.service';

@Controller('user-management')
export class UserManagementController {
  constructor(private userManagementService: UserManagementService) {}

  @Get('users')
  async getAllUsers() {
    return this.userManagementService.getAllUsers();
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

  @Post('permissions')
  async createPermission(@Body() permissionData: any) {
    return this.userManagementService.createPermission(permissionData);
  }

  @Post('setup-defaults')
  async setupDefaults() {
    return this.userManagementService.setupDefaults();
  }
}