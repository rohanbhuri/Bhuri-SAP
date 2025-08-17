import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @RequireRoles(RoleType.SUPER_ADMIN)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @RequireRoles(RoleType.SUPER_ADMIN)
  create(@Body() roleData: any) {
    return this.rolesService.create(roleData);
  }

  @Put(':id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.rolesService.update(id, updateData);
  }

  @Delete(':id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  delete(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }

  @Get('permissions/all')
  @RequireRoles(RoleType.SUPER_ADMIN)
  getAllPermissions() {
    return this.rolesService.getAllPermissions();
  }

  @Post('permissions')
  @RequireRoles(RoleType.SUPER_ADMIN)
  createPermission(@Body() permissionData: any) {
    return this.rolesService.createPermission(permissionData);
  }

  @Put('permissions/:id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  updatePermission(@Param('id') id: string, @Body() permissionData: any) {
    return this.rolesService.updatePermission(id, permissionData);
  }

  @Delete('permissions/:id')
  @RequireRoles(RoleType.SUPER_ADMIN)
  deletePermission(@Param('id') id: string) {
    return this.rolesService.deletePermission(id);
  }

  @Post(':id/permissions')
  @RequireRoles(RoleType.SUPER_ADMIN)
  assignPermission(@Param('id') id: string, @Body() { permissionId }: any) {
    return this.rolesService.assignPermission(id, permissionId);
  }

  @Delete(':id/permissions/:permissionId')
  @RequireRoles(RoleType.SUPER_ADMIN)
  removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePermission(id, permissionId);
  }

  @Get('templates/permission')
  @RequireRoles(RoleType.SUPER_ADMIN)
  getPermissionTemplates() {
    return this.rolesService.getPermissionTemplates();
  }

  @Post(':id/apply-template')
  @RequireRoles(RoleType.SUPER_ADMIN)
  applyPermissionTemplate(@Param('id') id: string, @Body() { templateId }: any) {
    return this.rolesService.applyPermissionTemplate(id, templateId);
  }
}