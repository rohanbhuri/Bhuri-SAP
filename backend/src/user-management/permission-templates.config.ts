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