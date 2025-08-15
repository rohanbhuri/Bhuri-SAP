import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';

export const userManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-management-layout.component').then(m => m.UserManagementLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/roles.component').then(m => m.RolesComponent)
      },
      {
        path: 'permissions',
        loadComponent: () => import('./pages/permissions.component').then(m => m.PermissionsComponent)
      },
      {
        path: 'permission-templates',
        loadComponent: () => import('./pages/permission-templates.component').then(m => m.PermissionTemplatesComponent)
      }
    ]
  }
];