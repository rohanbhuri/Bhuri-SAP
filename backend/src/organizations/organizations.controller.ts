import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get('my-organizations')
  @UseGuards(JwtAuthGuard)
  findMyOrganizations(@Request() req) {
    return this.organizationsService.findUserOrganizations(req.user.userId);
  }

  @Get('public')
  findPublicOrganizations() {
    return this.organizationsService.findPublicOrganizations();
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  create(@Body() orgData: any) {
    return this.organizationsService.create(orgData);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createMyOrganization(@Body() orgData: any, @Request() req) {
    return this.organizationsService.createOrganization(orgData, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.organizationsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequireRoles(RoleType.SUPER_ADMIN)
  delete(@Param('id') id: string) {
    return this.organizationsService.delete(id);
  }


}