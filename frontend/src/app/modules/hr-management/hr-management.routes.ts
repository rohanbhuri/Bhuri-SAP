import { Routes } from '@angular/router';
import { HrManagementComponent } from './hr-management.component';
import { authGuard } from '../../guards/auth.guard';

export const HR_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    component: HrManagementComponent,
    title: 'HR Management',
  },
];

// Legacy routes for backward compatibility
export const HR_MANAGEMENT_LEGACY_ROUTES: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./pages/employees.page').then((m) => m.EmployeesPageComponent),
    title: 'Employees',
  },
  {
    path: 'attendance',
    loadComponent: () => import('./pages/attendance.page').then((m) => m.AttendancePageComponent),
    title: 'Attendance',
  },
  {
    path: 'leaves',
    loadComponent: () => import('./pages/leaves.page').then((m) => m.LeavesPageComponent),
    title: 'Leaves',
  },
  {
    path: 'payroll',
    loadComponent: () => import('./pages/payroll.page').then((m) => m.PayrollPageComponent),
    canActivate: [authGuard],
    data: { requiredRoles: ['hr_admin', 'super_admin'] },
    title: 'Payroll',
  },
  {
    path: 'performance',
    loadComponent: () =>
      import('./pages/performance.page').then(
        (m) => m.PerformancePageComponent
      ),
    title: 'Performance',
  },
  {
    path: 'compliance',
    loadComponent: () =>
      import('./pages/compliance.page').then(
        (m) => m.CompliancePageComponent
      ),
    canActivate: [authGuard],
    data: { requiredRoles: ['hr_admin', 'super_admin'] },
    title: 'Compliance',
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('./pages/documents.page').then(
        (m) => m.DocumentsPageComponent
      ),
    canActivate: [authGuard],
    data: { requiredRoles: ['hr_admin', 'super_admin'] },
    title: 'Documents',
  },
  {
    path: 'assets',
    loadComponent: () =>
      import('./pages/assets.page').then((m) => m.AssetsPageComponent),
    canActivate: [authGuard],
    data: { requiredRoles: ['hr_admin', 'super_admin'] },
    title: 'Assets',
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./pages/analytics.page').then(
        (m) => m.AnalyticsPageComponent
      ),
    canActivate: [authGuard],
    data: { requiredRoles: ['hr_admin', 'super_admin'] },
    title: 'HR Analytics',
  },
];
