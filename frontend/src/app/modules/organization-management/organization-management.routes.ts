import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';

export const organizationManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./organization-management-layout.component').then(m => m.OrganizationManagementLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'organizations',
        pathMatch: 'full'
      },
      {
        path: 'organizations',
        loadComponent: () => import('./pages/organizations.component').then(m => m.OrganizationsComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./pages/organization-requests.component').then(m => m.OrganizationRequestsComponent)
      }
    ]
  }
];