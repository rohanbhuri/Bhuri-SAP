import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
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
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  create(@Body() roleData: any) {
    return this.rolesService.create(roleData);
  }

  @Patch(':id')
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.rolesService.update(id, updateData);
  }

  @Get('permissions')
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  getPermissions() {
    return this.rolesService.getPermissions();
  }

  @Post(':id/permissions')
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  assignPermission(@Param('id') id: string, @Body() { permissionId }: any) {
    return this.rolesService.assignPermission(id, permissionId);
  }
}