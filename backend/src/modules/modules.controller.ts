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
  async getAvailableModules(@Request() req) {
    return this.modulesService.getAllAvailable(req.user.organizationId, req.user.userId);
  }

  @Post(':id/request')
  requestActivation(@Param('id') id: string, @Request() req) {
    return this.modulesService.requestActivation(id, req.user.userId, req.user.organizationId);
  }

  @Get('requests')
  getPendingRequests(@Request() req) {
    console.log('User data in requests:', req.user);
    const isSuperAdmin = req.user.roles?.includes('super_admin');
    const orgId = req.user.organizationId || req.user.userId; // Fallback to userId if orgId missing
    return this.modulesService.getPendingRequests(orgId, isSuperAdmin);
  }

  @Patch('requests/:id/approve')
  approveRequest(@Param('id') id: string, @Request() req) {
    console.log('Approving request with user:', req.user);
    return this.modulesService.approveRequest(id, req.user.userId);
  }

  @Patch('requests/:id/reject')
  rejectRequest(@Param('id') id: string, @Request() req) {
    return this.modulesService.rejectRequest(id, req.user.userId);
  }
}