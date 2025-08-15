import { Controller, Get, Patch, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ModulesService } from './modules.service';

@Controller('modules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get('active')
  getActiveModules(@Request() req) {
    return this.modulesService.getActiveModulesForOrg(req.user.organizationId);
  }

  @Patch(':id/activate')
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  activateModule(@Param('id') id: string, @Request() req) {
    return this.modulesService.activateModule(id, req.user.organizationId);
  }

  @Patch(':id/deactivate')
  @RequireRoles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  deactivateModule(@Param('id') id: string, @Request() req) {
    return this.modulesService.deactivateModule(id, req.user.organizationId);
  }

  @Get('available')
  getAvailableModules(@Request() req) {
    return this.modulesService.getAllAvailable(req.user.organizationId);
  }

  @Post(':id/request')
  requestActivation(@Param('id') id: string, @Request() req) {
    return this.modulesService.requestActivation(id, req.user.userId, req.user.organizationId);
  }

  @Get('requests')
  @RequireRoles(RoleType.SUPER_ADMIN)
  getPendingRequests(@Request() req) {
    return this.modulesService.getPendingRequests(req.user.organizationId);
  }

  @Patch('requests/:id/approve')
  @RequireRoles(RoleType.SUPER_ADMIN)
  approveRequest(@Param('id') id: string, @Request() req) {
    return this.modulesService.approveRequest(id, req.user.userId);
  }

  @Patch('requests/:id/reject')
  @RequireRoles(RoleType.SUPER_ADMIN)
  rejectRequest(@Param('id') id: string, @Request() req) {
    return this.modulesService.rejectRequest(id, req.user.userId);
  }
}