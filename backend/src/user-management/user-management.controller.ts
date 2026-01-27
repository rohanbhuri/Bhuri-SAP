import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('user-management')
export class UserManagementController {
  constructor(private userManagementService: UserManagementService) {}

  @Post('login')
  @UseGuards(ApiKeyGuard)
  async apiLogin(@Body() body: { email: string; password: string }) {
    return this.userManagementService.apiLogin(body.email, body.password);
  }

  @Post('logout')
  @UseGuards(ApiKeyGuard)
  async apiLogout(@Body() body: { userId: string }) {
    return this.userManagementService.apiLogout(body.userId);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllUsers(@Request() req, @Query('search') search?: string) {
    if (search) {
      return this.userManagementService.searchUsers(search, req.user);
    }
    return this.userManagementService.getAllUsers(req.user);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createUser(@Body() userData: any) {
    return this.userManagementService.createUser(userData);
  }

  @Put('users/:userId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateUser(@Param('userId') userId: string, @Body() userData: any) {
    return this.userManagementService.updateUser(userId, userData);
  }

  @Delete('users/:userId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deleteUser(@Param('userId') userId: string, @Request() req) {
    return this.userManagementService.deleteUser(userId, req.user?.userId);
  }

  @Put('users/:userId/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async toggleUserStatus(@Param('userId') userId: string, @Body() body: { isActive: boolean }) {
    return this.userManagementService.toggleUserStatus(userId, body.isActive);
  }

  @Get('organizations')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllOrganizations() {
    return this.userManagementService.getAllOrganizations();
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllRoles(@Query('search') search?: string) {
    if (search) {
      return this.userManagementService.searchRoles(search);
    }
    return this.userManagementService.getAllRoles();
  }

  @Get('permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllPermissions(@Query('search') search?: string) {
    if (search) {
      return this.userManagementService.searchPermissions(search);
    }
    return this.userManagementService.getAllPermissions();
  }

  @Get('modules')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async getAllModules() {
    return this.userManagementService.getAllModules();
  }

  @Put('users/:userId/roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateUserRoles(@Param('userId') userId: string, @Body() body: { roleIds: string[] }) {
    return this.userManagementService.updateUserRoles(userId, body.roleIds);
  }

  @Post('roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async createRole(@Body() roleData: any, @Request() req) {
    return this.userManagementService.createRole(roleData, req.user?.userId);
  }

  @Put('roles/:roleId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async updateRole(@Param('roleId') roleId: string, @Body() roleData: any, @Request() req) {
    return this.userManagementService.updateRole(roleId, roleData, req.user?.userId);
  }

  @Post('permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async createPermission(@Body() permissionData: any, @Request() req) {
    return this.userManagementService.createPermission(permissionData, req.user?.userId);
  }

  @Put('permissions/:permissionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async updatePermission(@Param('permissionId') permissionId: string, @Body() permissionData: any, @Request() req) {
    return this.userManagementService.updatePermission(permissionId, permissionData, req.user?.userId);
  }

  @Delete('permissions/:permissionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deletePermission(@Param('permissionId') permissionId: string, @Request() req) {
    return this.userManagementService.deletePermission(permissionId, req.user?.userId);
  }

  @Delete('roles/:roleId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  async deleteRole(@Param('roleId') roleId: string, @Request() req) {
    return this.userManagementService.deleteRole(roleId, req.user?.userId);
  }
}
