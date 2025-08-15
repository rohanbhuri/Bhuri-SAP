import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  findAll(@Request() req) {
    return this.usersService.findAll(req.user);
  }

  @Post()
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  create(@Body() userData: any, @Request() req) {
    return this.usersService.create(userData, req.user);
  }

  @Post(':id/roles')
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  assignRole(@Param('id') id: string, @Body() { roleId }: any, @Request() req) {
    return this.usersService.assignRole(id, roleId, req.user);
  }
}