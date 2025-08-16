import { Type } from '@angular/core';

// Widget Components
import { UserManagementWidgetComponent } from './user-management/user-management-widget.component';
import { OrganizationManagementWidgetComponent } from './organization-management/organization-management-widget.component';
import { MyOrganizationsWidgetComponent } from './my-organizations/my-organizations-widget.component';
import { CrmWidgetComponent } from './crm/crm-widget.component';
import { HrManagementWidgetComponent } from './hr-management/hr-management-widget.component';
import { ProjectsManagementWidgetComponent } from './projects-management/projects-management-widget.component';
import { ProjectTrackingWidgetComponent } from './project-tracking/project-tracking-widget.component';
import { ProjectTimesheetWidgetComponent } from './project-timesheet/project-timesheet-widget.component';
import { TasksManagementWidgetComponent } from './tasks-management/tasks-management-widget.component';
import { InventoryManagementWidgetComponent } from './inventory-management/inventory-management-widget.component';
import { PayrollManagementWidgetComponent } from './payroll-management/payroll-management-widget.component';
import { SalesManagementWidgetComponent } from './sales-management/sales-management-widget.component';

// Main Components
import { UserManagementComponent } from './user-management/user-management.component';
import { MyOrganizationsComponent } from './my-organizations/my-organizations.component';
import { CrmComponent } from './crm/crm.component';
import { HrManagementComponent } from './hr-management/hr-management.component';
import { ProjectsManagementComponent } from './projects-management/projects-management.component';
import { ProjectTrackingComponent } from './project-tracking/project-tracking.component';
import { ProjectTimesheetComponent } from './project-timesheet/project-timesheet.component';

export interface ModuleConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  widgetComponent: Type<any>;
  mainComponent?: Type<any>;
  route?: string;
  isActive: boolean;
  category: 'core' | 'hr' | 'project' | 'sales' | 'finance' | 'operations';
}

export const MODULE_REGISTRY: ModuleConfig[] = [
  // Core Modules
  {
    id: 'user-management',
    name: 'user-management',
    displayName: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: 'people',
    color: '#2196F3',
    widgetComponent: UserManagementWidgetComponent,
    mainComponent: UserManagementComponent,
    route: '/modules/user-management',
    isActive: true,
    category: 'core',
  },
  {
    id: 'organization-management',
    name: 'organization-management',
    displayName: 'Organization Management',
    description: 'Manage organizations and membership requests',
    icon: 'business',
    color: '#FF5722',
    widgetComponent: OrganizationManagementWidgetComponent,
    route: '/modules/organization-management',
    isActive: true,
    category: 'core',
  },
  {
    id: 'my-organizations',
    name: 'my-organizations',
    displayName: 'My Organizations',
    description: 'View and join public organizations',
    icon: 'groups',
    color: '#9C27B0',
    widgetComponent: MyOrganizationsWidgetComponent,
    mainComponent: MyOrganizationsComponent,
    route: '/modules/my-organizations',
    isActive: true,
    category: 'core',
  },
  {
    id: 'crm',
    name: 'crm',
    displayName: 'CRM',
    description: 'Customer relationship management',
    icon: 'business_center',
    color: '#4CAF50',
    widgetComponent: CrmWidgetComponent,
    mainComponent: CrmComponent,
    route: '/modules/crm',
    isActive: true,
    category: 'sales',
  },

  // HR Modules
  {
    id: 'hr-management',
    name: 'hr-management',
    displayName: 'HR Management',
    description: 'Human resources management',
    icon: 'people',
    color: '#FF9800',
    widgetComponent: HrManagementWidgetComponent,
    mainComponent: HrManagementComponent,
    route: '/modules/hr-management',
    isActive: true,
    category: 'hr',
  },
  {
    id: 'staff-management',
    name: 'staff-management',
    displayName: 'Staff Management',
    description: 'Manage staff records and information',
    icon: 'badge',
    color: '#FF5722',
    widgetComponent: HrManagementWidgetComponent,
    isActive: false,
    category: 'hr',
  },
  {
    id: 'payroll-management',
    name: 'payroll-management',
    displayName: 'Payroll Management',
    description: 'Manage employee payroll and compensation',
    icon: 'payments',
    color: '#795548',
    widgetComponent: PayrollManagementWidgetComponent,
    isActive: false,
    category: 'hr',
  },
  {
    id: 'assigning-roles',
    name: 'assigning-roles',
    displayName: 'Role Assignment',
    description: 'Assign roles and responsibilities',
    icon: 'assignment_ind',
    color: '#607D8B',
    widgetComponent: UserManagementWidgetComponent,
    isActive: false,
    category: 'hr',
  },

  // Project Management
  {
    id: 'tasks-management',
    name: 'tasks-management',
    displayName: 'Tasks Management',
    description: 'Manage tasks and assignments',
    icon: 'task',
    color: '#9C27B0',
    widgetComponent: TasksManagementWidgetComponent,
    isActive: false,
    category: 'project',
  },
  {
    id: 'projects-management',
    name: 'projects-management',
    displayName: 'Projects Management',
    description: 'Manage projects and deliverables',
    icon: 'work',
    color: '#3F51B5',
    widgetComponent: ProjectsManagementWidgetComponent,
    mainComponent: ProjectsManagementComponent,
    route: '/modules/projects-management',
    isActive: true,
    category: 'project',
  },
  {
    id: 'project-tracking',
    name: 'project-tracking',
    displayName: 'Project Tracking',
    description: 'Track project progress and milestones',
    icon: 'track_changes',
    color: '#009688',
    widgetComponent: ProjectTrackingWidgetComponent,
    mainComponent: ProjectTrackingComponent,
    route: '/modules/project-tracking',
    isActive: true,
    category: 'project',
  },
  {
    id: 'project-timesheet',
    name: 'project-timesheet',
    displayName: 'Project Timesheet',
    description: 'Track time spent on projects',
    icon: 'schedule',
    color: '#FFC107',
    widgetComponent: ProjectTimesheetWidgetComponent,
    mainComponent: ProjectTimesheetComponent,
    route: '/modules/project-timesheet',
    isActive: true,
    category: 'project',
  },

  // Sales & CRM
  {
    id: 'leads-management',
    name: 'leads-management',
    displayName: 'Leads Management',
    description: 'Manage sales leads and prospects',
    icon: 'person_add',
    color: '#E91E63',
    widgetComponent: SalesManagementWidgetComponent,
    isActive: false,
    category: 'sales',
  },
  {
    id: 'sales-management',
    name: 'sales-management',
    displayName: 'Sales Management',
    description: 'Manage sales processes and pipeline',
    icon: 'trending_up',
    color: '#4CAF50',
    widgetComponent: SalesManagementWidgetComponent,
    isActive: false,
    category: 'sales',
  },
  {
    id: 'deal-management',
    name: 'deal-management',
    displayName: 'Deal Management',
    description: 'Manage deals and opportunities',
    icon: 'handshake',
    color: '#2196F3',
    widgetComponent: SalesManagementWidgetComponent,
    isActive: false,
    category: 'sales',
  },

  // Operations
  {
    id: 'inventory-management',
    name: 'inventory-management',
    displayName: 'Inventory Management',
    description: 'Manage inventory and stock levels',
    icon: 'inventory',
    color: '#FF9800',
    widgetComponent: InventoryManagementWidgetComponent,
    isActive: false,
    category: 'operations',
  },
  {
    id: 'item-management',
    name: 'item-management',
    displayName: 'Item Management',
    description: 'Manage items and products',
    icon: 'category',
    color: '#795548',
    widgetComponent: InventoryManagementWidgetComponent,
    isActive: false,
    category: 'operations',
  },

  // Finance
  {
    id: 'budget-planner',
    name: 'budget-planner',
    displayName: 'Budget Planner',
    description: 'Plan and manage budgets',
    icon: 'account_balance',
    color: '#4CAF50',
    widgetComponent: PayrollManagementWidgetComponent,
    isActive: false,
    category: 'finance',
  },
  {
    id: 'estimates-management',
    name: 'estimates-management',
    displayName: 'Estimates Management',
    description: 'Create and manage estimates',
    icon: 'receipt',
    color: '#FF5722',
    widgetComponent: PayrollManagementWidgetComponent,
    isActive: false,
    category: 'finance',
  },
  {
    id: 'contract-module',
    name: 'contract-module',
    displayName: 'Contract Management',
    description: 'Manage contracts and agreements',
    icon: 'description',
    color: '#607D8B',
    widgetComponent: PayrollManagementWidgetComponent,
    isActive: false,
    category: 'finance',
  },
];

export function getModuleById(id: string): ModuleConfig | undefined {
  return MODULE_REGISTRY.find((module) => module.id === id);
}

export function getModulesByCategory(category: string): ModuleConfig[] {
  return MODULE_REGISTRY.filter((module) => module.category === category);
}

export function getActiveModules(): ModuleConfig[] {
  return MODULE_REGISTRY.filter((module) => module.isActive);
}
