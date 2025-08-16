import { DataSource } from 'typeorm';
import { Module } from '../entities/module.entity';

const modules = [
  // Core Modules
  { id: 'user-management', name: 'user-management', displayName: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, permissionType: 'public', category: 'core', icon: 'people', color: '#2196F3' },
  { id: 'crm', name: 'crm', displayName: 'CRM', description: 'Customer relationship management', isActive: true, permissionType: 'public', category: 'sales', icon: 'business_center', color: '#4CAF50' },
  
  // HR Modules
  { id: 'hr-management', name: 'hr-management', displayName: 'HR Management', description: 'Human resources management', isActive: false, permissionType: 'require_permission', category: 'hr', icon: 'people', color: '#FF9800' },
  { id: 'staff-management', name: 'staff-management', displayName: 'Staff Management', description: 'Manage staff records and information', isActive: false, permissionType: 'require_permission', category: 'hr', icon: 'badge', color: '#FF5722' },
  { id: 'payroll-management', name: 'payroll-management', displayName: 'Payroll Management', description: 'Manage employee payroll and compensation', isActive: false, permissionType: 'require_permission', category: 'hr', icon: 'payments', color: '#795548' },
  { id: 'assigning-roles', name: 'assigning-roles', displayName: 'Role Assignment', description: 'Assign roles and responsibilities', isActive: false, permissionType: 'require_permission', category: 'hr', icon: 'assignment_ind', color: '#607D8B' },
  
  // Project Management
  { id: 'tasks-management', name: 'tasks-management', displayName: 'Tasks Management', description: 'Manage tasks and assignments', isActive: false, permissionType: 'require_permission', category: 'project', icon: 'task', color: '#9C27B0' },
  { id: 'projects-management', name: 'projects-management', displayName: 'Projects Management', description: 'Manage projects and deliverables', isActive: false, permissionType: 'require_permission', category: 'project', icon: 'work', color: '#3F51B5' },
  { id: 'project-tracking', name: 'project-tracking', displayName: 'Project Tracking', description: 'Track project progress and milestones', isActive: false, permissionType: 'require_permission', category: 'project', icon: 'track_changes', color: '#009688' },
  { id: 'project-timesheet', name: 'project-timesheet', displayName: 'Project Timesheet', description: 'Track time spent on projects', isActive: false, permissionType: 'require_permission', category: 'project', icon: 'schedule', color: '#FFC107' },
  
  // Sales & CRM
  { id: 'leads-management', name: 'leads-management', displayName: 'Leads Management', description: 'Manage sales leads and prospects', isActive: false, permissionType: 'require_permission', category: 'sales', icon: 'person_add', color: '#E91E63' },
  { id: 'sales-management', name: 'sales-management', displayName: 'Sales Management', description: 'Manage sales processes and pipeline', isActive: false, permissionType: 'require_permission', category: 'sales', icon: 'trending_up', color: '#4CAF50' },
  { id: 'deal-management', name: 'deal-management', displayName: 'Deal Management', description: 'Manage deals and opportunities', isActive: false, permissionType: 'require_permission', category: 'sales', icon: 'handshake', color: '#2196F3' },
  
  // Operations
  { id: 'inventory-management', name: 'inventory-management', displayName: 'Inventory Management', description: 'Manage inventory and stock levels', isActive: false, permissionType: 'require_permission', category: 'operations', icon: 'inventory', color: '#FF9800' },
  { id: 'item-management', name: 'item-management', displayName: 'Item Management', description: 'Manage items and products', isActive: false, permissionType: 'require_permission', category: 'operations', icon: 'category', color: '#795548' },
  
  // Finance
  { id: 'budget-planner', name: 'budget-planner', displayName: 'Budget Planner', description: 'Plan and manage budgets', isActive: false, permissionType: 'require_permission', category: 'finance', icon: 'account_balance', color: '#4CAF50' },
  { id: 'estimates-management', name: 'estimates-management', displayName: 'Estimates Management', description: 'Create and manage estimates', isActive: false, permissionType: 'require_permission', category: 'finance', icon: 'receipt', color: '#FF5722' },
  { id: 'contract-module', name: 'contract-module', displayName: 'Contract Management', description: 'Manage contracts and agreements', isActive: false, permissionType: 'require_permission', category: 'finance', icon: 'description', color: '#607D8B' },
  
  // Additional
  { id: 'reports-management', name: 'reports-management', displayName: 'Reports Management', description: 'Generate and manage reports', isActive: false, permissionType: 'require_permission', category: 'operations', icon: 'assessment', color: '#673AB7' },
  { id: 'goal-tracking', name: 'goal-tracking', displayName: 'Goal Tracking', description: 'Track goals and objectives', isActive: false, permissionType: 'require_permission', category: 'hr', icon: 'flag', color: '#009688' },
  { id: 'events-notice-board', name: 'events-notice-board', displayName: 'Events & Notice Board', description: 'Manage events and announcements', isActive: false, permissionType: 'require_permission', category: 'core', icon: 'event', color: '#FF5722' },
  { id: 'messages-module', name: 'messages-module', displayName: 'Messages Module', description: 'Internal messaging system', isActive: false, permissionType: 'require_permission', category: 'core', icon: 'message', color: '#2196F3' },
  { id: 'form-builder', name: 'form-builder', displayName: 'Form Builder', description: 'Create and manage forms', isActive: false, permissionType: 'require_permission', category: 'operations', icon: 'dynamic_form', color: '#9C27B0' }
];

export async function seedModules(dataSource: DataSource) {
  const moduleRepository = dataSource.getRepository(Module);
  
  for (const moduleData of modules) {
    const existing = await moduleRepository.findOne({ where: { id: moduleData.id } });
    if (!existing) {
      const module = moduleRepository.create(moduleData);
      await moduleRepository.save(module);
      console.log(`Created module: ${moduleData.displayName}`);
    }
  }
}