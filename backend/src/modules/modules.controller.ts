import { Controller, Get, Patch, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { ModulesService } from './modules.service';

@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  getActiveModules(@Request() req) {
    return this.modulesService.getActiveModulesForOrg(req.user.organizationId, req.user.userId);
  }

  @Get('personal')
  @UseGuards(JwtAuthGuard)
  getPersonalModules(@Request() req) {
    return this.modulesService.getPersonalModules(req.user.userId);
  }

  @Get('organization/:orgId')
  @UseGuards(JwtAuthGuard)
  getOrganizationModules(@Param('orgId') orgId: string, @Request() req) {
    return this.modulesService.getActiveModulesForOrg(orgId, req.user.userId);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard)
  activateModule(@Param('id') id: string, @Request() req) {
    const orgId = req.user.organizationId || 'personal';
    return this.modulesService.activateModule(id, orgId, req.user.userId);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  deactivateModule(@Param('id') id: string, @Request() req) {
    const orgId = req.user.organizationId || 'personal';
    return this.modulesService.deactivateModule(id, orgId, req.user.userId);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  async getAvailableModules(@Request() req) {
    const orgId = req.user.organizationId || 'personal';
    console.log('Getting available modules for context:', orgId, 'user:', req.user.userId);
    return this.modulesService.getAllAvailable(orgId, req.user.userId);
  }

  @Post(':id/request')
  @UseGuards(JwtAuthGuard)
  requestActivation(@Param('id') id: string, @Request() req) {
    const orgId = req.user.organizationId || 'personal';
    return this.modulesService.requestActivation(id, req.user.userId, orgId, req.user.roles);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(@Request() req) {
    console.log('=== MODULE REQUESTS ENDPOINT ===');
    console.log('User data:', req.user);
    console.log('User roles:', req.user.roles);
    
    // Check if user has admin or super_admin role
    const userRoles = req.user.roles || [];
    const isSuperAdmin = userRoles.includes('super_admin');
    const isAdmin = userRoles.includes('admin');
    
    if (!isSuperAdmin && !isAdmin) {
      console.log('User lacks required permissions');
      throw new Error('Insufficient permissions to view module requests');
    }
    
    const orgId = req.user.organizationId;
    console.log('Organization ID:', orgId);
    console.log('Is Super Admin:', isSuperAdmin);
    
    return this.modulesService.getPendingRequests(orgId, isSuperAdmin, req.user.userId);
  }

  @Patch('requests/:id/approve')
  @UseGuards(JwtAuthGuard)
  async approveRequest(@Param('id') id: string, @Request() req) {
    console.log('=== APPROVE REQUEST ===');
    console.log('Request ID:', id);
    console.log('User:', req.user);
    
    const userRoles = req.user.roles || [];
    const isSuperAdmin = userRoles.includes('super_admin');
    const isAdmin = userRoles.includes('admin');
    
    if (!isSuperAdmin && !isAdmin) {
      throw new Error('Insufficient permissions to approve module requests');
    }
    
    return this.modulesService.approveRequest(id, req.user.userId);
  }

  @Patch('requests/:id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectRequest(@Param('id') id: string, @Request() req) {
    console.log('=== REJECT REQUEST ===');
    console.log('Request ID:', id);
    console.log('User:', req.user);
    
    const userRoles = req.user.roles || [];
    const isSuperAdmin = userRoles.includes('super_admin');
    const isAdmin = userRoles.includes('admin');
    
    if (!isSuperAdmin && !isAdmin) {
      throw new Error('Insufficient permissions to reject module requests');
    }
    
    return this.modulesService.rejectRequest(id, req.user.userId);
  }
}