import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';

@Controller('user-management')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserManagementController {
  constructor(private userManagementService: UserManagementService) {}

  @Get('users')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllUsers() {
    return this.userManagementService.getAllUsers();
  }

  @Post('users')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createUser(@Body() userData: any) {
    return this.userManagementService.createUser(userData);
  }

  @Put('users/:userId')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateUser(@Param('userId') userId: string, @Body() userData: any) {
    return this.userManagementService.updateUser(userId, userData);
  }

  @Delete('users/:userId')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deleteUser(@Param('userId') userId: string) {
    return this.userManagementService.deleteUser(userId);
  }

  @Put('users/:userId/status')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async toggleUserStatus(@Param('userId') userId: string, @Body() body: { isActive: boolean }) {
    return this.userManagementService.toggleUserStatus(userId, body.isActive);
  }

  @Get('organizations')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllOrganizations() {
    return this.userManagementService.getAllOrganizations();
  }

  @Get('roles')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllRoles() {
    return this.userManagementService.getAllRoles();
  }

  @Get('permissions')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllPermissions() {
    return this.userManagementService.getAllPermissions();
  }

  @Get('modules')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllModules() {
    return this.userManagementService.getAllModules();
  }

  @Put('users/:userId/roles')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateUserRoles(@Param('userId') userId: string, @Body() body: { roleIds: string[] }) {
    return this.userManagementService.updateUserRoles(userId, body.roleIds);
  }

  @Put('users/:userId/permissions')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateUserPermissions(@Param('userId') userId: string, @Body() body: { permissionIds: string[] }) {
    return this.userManagementService.updateUserPermissions(userId, body.permissionIds);
  }

  @Post('roles')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async createRole(@Body() roleData: any) {
    return this.userManagementService.createRole(roleData);
  }

  @Put('roles/:roleId')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async updateRole(@Param('roleId') roleId: string, @Body() roleData: any) {
    return this.userManagementService.updateRole(roleId, roleData);
  }

  @Post('permissions')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async createPermission(@Body() permissionData: any) {
    return this.userManagementService.createPermission(permissionData);
  }

  @Put('permissions/:permissionId')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async updatePermission(@Param('permissionId') permissionId: string, @Body() permissionData: any) {
    return this.userManagementService.updatePermission(permissionId, permissionData);
  }

  @Delete('permissions/:permissionId')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deletePermission(@Param('permissionId') permissionId: string) {
    return this.userManagementService.deletePermission(permissionId);
  }

  @Delete('roles/:roleId')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deleteRole(@Param('roleId') roleId: string) {
    return this.userManagementService.deleteRole(roleId);
  }

  @Post('setup-defaults')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async setupDefaults() {
    return this.userManagementService.setupDefaults();
  }

  @Get('permission-templates')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getPermissionTemplates() {
    return this.userManagementService.getPermissionTemplates();
  }

  @Post('roles/:roleId/apply-template')
  @RequireRoles(RoleType.SUPER_ADMIN)
  async applyPermissionTemplate(@Param('roleId') roleId: string, @Body() body: { templateId: string }) {
    return this.userManagementService.applyPermissionTemplate(roleId, body.templateId);
  }
}