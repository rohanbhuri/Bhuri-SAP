import { ActionType } from '../entities/permission.entity';

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: {
    module: string;
    action: ActionType;
    resource: string;
  }[];
}

export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: 'super-admin-full',
    name: 'Super Admin - Full Access',
    description: 'Complete access to all user management features',
    permissions: [
      // Users management
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.DELETE, resource: 'users' },
      
      // Roles management
      { module: 'user-management', action: ActionType.READ, resource: 'roles' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'roles' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'roles' },
      { module: 'user-management', action: ActionType.DELETE, resource: 'roles' },
      
      // Permissions management
      { module: 'user-management', action: ActionType.READ, resource: 'permissions' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'permissions' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'permissions' },
      { module: 'user-management', action: ActionType.DELETE, resource: 'permissions' },
      
      // Organizations management
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'organizations' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'organizations' },
      
      // Modules management
      { module: 'user-management', action: ActionType.READ, resource: 'modules' }
    ]
  },
  {
    id: 'admin-standard',
    name: 'Admin - Standard Access',
    description: 'Standard admin access without permissions management',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.DELETE, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'roles' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'roles' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'roles' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'staff-basic',
    name: 'Staff - Basic Access',
    description: 'Basic staff access to view users only',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' }
    ]
  },
  {
    id: 'hr-manager',
    name: 'HR Manager',
    description: 'Human resources focused user management',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'roles' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Educational institution teacher access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'employee',
    name: 'Employee',
    description: 'Basic employee access to view colleagues',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' }
    ]
  },
  {
    id: 'department-head',
    name: 'Department Head',
    description: 'Manage users within department',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'roles' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'team-lead',
    name: 'Team Lead',
    description: 'Lead team members and basic user management',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Supervise team members with limited user access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Management level access to users and roles',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'roles' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'coordinator',
    name: 'Coordinator',
    description: 'Coordinate between teams with user visibility',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Data analyst with read-only user access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'consultant',
    name: 'Consultant',
    description: 'External consultant with limited access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' }
    ]
  },
  {
    id: 'intern',
    name: 'Intern',
    description: 'Intern with minimal user visibility',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' }
    ]
  },
  {
    id: 'contractor',
    name: 'Contractor',
    description: 'External contractor with basic access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' }
    ]
  },
  {
    id: 'auditor',
    name: 'Auditor',
    description: 'Audit access to users and roles',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'roles' },
      { module: 'user-management', action: ActionType.READ, resource: 'permissions' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    description: 'Customer support with user assistance access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' }
    ]
  },
  {
    id: 'trainer',
    name: 'Trainer',
    description: 'Training coordinator with user access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'HR recruiter with user creation access',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  },
  {
    id: 'user-manager',
    name: 'User Manager',
    description: 'Can manage users but not roles or permissions',
    permissions: [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'user-management', action: ActionType.EDIT, resource: 'users' },
      { module: 'user-management', action: ActionType.READ, resource: 'organizations' }
    ]
  }
];