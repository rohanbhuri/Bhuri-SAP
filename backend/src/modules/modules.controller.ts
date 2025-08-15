import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
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
}