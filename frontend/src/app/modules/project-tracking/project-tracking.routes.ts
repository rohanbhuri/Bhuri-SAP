import { Routes } from '@angular/router';
import { ProjectTrackingComponent } from './project-tracking.component';
import { ProjectTrackingLayoutComponent } from './project-tracking-layout.component';

export const PROJECT_TRACKING_ROUTES: Routes = [
  {
    path: '',
    component: ProjectTrackingLayoutComponent,
    children: [
      { path: '', redirectTo: 'gantt', pathMatch: 'full' },
      {
        path: 'gantt',
        loadComponent: () =>
          import('./pages/gantt.page').then((m) => m.TrackingGanttPageComponent),
        title: 'Tracking Gantt Chart',
      },
      {
        path: 'overview',
        component: ProjectTrackingComponent,
        title: 'Project Tracking',
      },
      {
        path: 'milestones',
        loadComponent: () =>
          import('./pages/milestones.page').then((m) => m.MilestonesPageComponent),
        title: 'Milestones',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks.page').then((m) => m.TasksPageComponent),
        title: 'Tasks',
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./pages/progress.page').then((m) => m.ProgressPageComponent),
        title: 'Progress Tracking',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics.page').then((m) => m.AnalyticsPageComponent),
        title: 'Tracking Analytics',
      },
    ],
  },
];