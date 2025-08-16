import { Routes } from '@angular/router';
import { ProjectsManagementComponent } from './projects-management.component';
import { ProjectsManagementLayoutComponent } from './projects-management-layout.component';

export const PROJECTS_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsManagementLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        component: ProjectsManagementComponent,
        title: 'Projects Management',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects.page').then((m) => m.ProjectsPageComponent),
        title: 'Projects',
      },
      {
        path: 'deliverables',
        loadComponent: () =>
          import('./pages/deliverables.page').then((m) => m.DeliverablesPageComponent),
        title: 'Deliverables',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics.page').then((m) => m.AnalyticsPageComponent),
        title: 'Project Analytics',
      },
    ],
  },
];