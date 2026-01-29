import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

export const userManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-management-layout.component').then(m => m.UserManagementLayoutComponent),
    canActivate: [authGuard],
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
        path: 'api-doc',
        loadComponent: () => import('./pages/api-docs-page.component').then(m => m.UserManagementApiDocsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics-page.component').then(m => m.UserAnalyticsPageComponent)
      }
    ]
  }
];
