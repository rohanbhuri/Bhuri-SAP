import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequireRoles(RoleType.SUPER_ADMIN)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() userData: any, @Request() req) {
    return this.usersService.create(userData, req.user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userData: any) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Post(':id/roles')
  assignRole(@Param('id') id: string, @Body() { roleId }: any, @Request() req) {
    return this.usersService.assignRole(id, roleId, req.user);
  }

  @Delete(':id/roles/:roleId')
  removeRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.removeRole(id, roleId);
  }

  @Post(':id/permissions')
  assignPermission(@Param('id') id: string, @Body() { permissionId }: any) {
    return this.usersService.assignPermission(id, permissionId);
  }

  @Delete(':id/permissions/:permissionId')
  removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.usersService.removePermission(id, permissionId);
  }

  @Put(':id/status')
  toggleStatus(@Param('id') id: string, @Body() { isActive }: any) {
    return this.usersService.toggleStatus(id, isActive);
  }
}