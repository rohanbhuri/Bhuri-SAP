import { Routes } from '@angular/router';
import { ProjectTimesheetComponent } from './project-timesheet.component';
import { ProjectTimesheetLayoutComponent } from './project-timesheet-layout.component';

export const PROJECT_TIMESHEET_ROUTES: Routes = [
  {
    path: '',
    component: ProjectTimesheetLayoutComponent,
    children: [
      { path: '', redirectTo: 'gantt', pathMatch: 'full' },
      {
        path: 'gantt',
        loadComponent: () =>
          import('./pages/gantt.page').then((m) => m.TimesheetGanttPageComponent),
        title: 'Timesheet Gantt Chart',
      },
      {
        path: 'overview',
        component: ProjectTimesheetComponent,
        title: 'Project Timesheet',
      },
      {
        path: 'entries',
        loadComponent: () =>
          import('./pages/entries.page').then((m) => m.EntriesPageComponent),
        title: 'Time Entries',
      },
      {
        path: 'timesheets',
        loadComponent: () =>
          import('./pages/timesheets.page').then((m) => m.TimesheetsPageComponent),
        title: 'Timesheets',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports.page').then((m) => m.ReportsPageComponent),
        title: 'Time Reports',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics.page').then((m) => m.AnalyticsPageComponent),
        title: 'Timesheet Analytics',
      },
    ],
  },
];