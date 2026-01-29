import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModulesService } from '../services/modules.service';
import { MODULE_REGISTRY, getModulesByBrand } from '../modules/module-registry';
import { BrandConfigService } from '../services/brand-config.service';

export const authGuard = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const modulesService = inject(ModulesService);
  const brandConfig = inject(BrandConfigService);
  const router = inject(Router);

  // Check authentication first
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check role-based access if required
  const requiredRoles = route.data['requiredRoles'] as string[];
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));
    if (!hasRequiredRole) {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  // Check module access permission for module routes
  const url = route.url.map(segment => segment.path).join('/');
  if (url.startsWith('modules/')) {
    const modulePath = url.replace('modules/', '');
    const moduleId = modulePath.split('/')[0]; // Get first part (e.g., 'user-management' from 'user-management/users')
    
    try {
      // Get user's accessible modules
      const accessibleModules = await authService.getUserAccessibleModules(modulesService);
      
      // Check if user has access to this specific module
      const hasAccess = accessibleModules.some(m => 
        m.id === moduleId || m.name === moduleId
      );
      
      if (!hasAccess) {
        router.navigate(['/dashboard']);
        return false;
      }
      
      // Additional brand-based filtering
      const brandKey = brandConfig.getBrandKey();
      const allowedModules = getModulesByBrand(brandKey);
      const brandAllowed = allowedModules.some(am => 
        am.id === moduleId || am.name === moduleId
      );
      
      if (!brandAllowed) {
        router.navigate(['/dashboard']);
        return false;
      }
      
    } catch (error) {
      console.error('Error checking module access:', error);
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};