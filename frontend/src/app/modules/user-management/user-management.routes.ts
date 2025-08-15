import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';

export const userManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-management.component').then(m => m.UserManagementComponent),
    canActivate: [roleGuard],
    data: { requiredRoles: ['admin', 'super_admin'] }
  }
];