/**
 * User Management Module Trainer Content
 * 
 * Comprehensive training content for the User Management module.
 * Covers: Users, Roles, Permissions, Analytics
 */

import { TrainerContent } from '../../services/xrm-trainer.service';

export const USER_MANAGEMENT_TRAINER_CONTENT: Record<string, TrainerContent> = {
  '/modules/user-management': {
    title: 'User Management - Overview',
    description: 'Complete user, role, and permission management system. Control access, define roles, manage permissions, and monitor user activity with powerful administrative tools.',
    features: [
      {
        icon: 'people',
        title: 'User Management',
        description: 'Create, edit, and manage user accounts with full control over status, roles, and access.',
        steps: [
          'View all users in your organization',
          'Create new user accounts with email and details',
          'Assign roles to control access levels',
          'Activate or deactivate user accounts',
          'Search and filter users quickly',
          'Update user information anytime',
        ],
      },
      {
        icon: 'admin_panel_settings',
        title: 'Role Management',
        description: 'Define and manage roles that determine what users can access and do in the system.',
        steps: [
          'Create custom roles for your organization',
          'Assign permissions to each role',
          'View all defined roles and their permissions',
          'Edit role names and descriptions',
          'Delete unused roles (with safeguards)',
          'System roles (Super Admin, Admin) are protected',
        ],
      },
      {
        icon: 'security',
        title: 'Permission System',
        description: 'Granular permission control for modules, features, and actions across the platform.',
        steps: [
          'View all available permissions',
          'Understand permission structure (module.action)',
          'Create custom permissions for specific needs',
          'Assign permissions to roles',
          'Track which roles have which permissions',
          'Manage access at a granular level',
        ],
      },
      {
        icon: 'verified_user',
        title: 'Security Features',
        description: 'Multi-factor authentication, account status control, and security monitoring.',
        steps: [
          'Track MFA adoption across users',
          'Monitor active vs inactive accounts',
          'Control user account status',
          'View security analytics',
          'Enforce security policies',
        ],
      },
      {
        icon: 'analytics',
        title: 'User Analytics',
        description: 'Track user activity, role distribution, permission usage, and system adoption metrics.',
        steps: [
          'View total user count and active users',
          'Monitor role distribution',
          'Track permission assignments',
          'Analyze MFA adoption rates',
          'Review user activity patterns',
        ],
      },
      {
        icon: 'search',
        title: 'Search & Filter',
        description: 'Quickly find users, roles, and permissions with powerful search capabilities.',
        steps: [
          'Search users by name or email',
          'Filter by role or status',
          'Search roles by name',
          'Find permissions by module',
          'Results update instantly',
        ],
      },
      {
        icon: 'group_add',
        title: 'Bulk Operations',
        description: 'Manage multiple users efficiently with bulk actions and role assignments.',
        steps: [
          'Select multiple users',
          'Assign roles to multiple users',
          'Activate/deactivate in bulk',
          'Export user lists',
        ],
      },
      {
        icon: 'history',
        title: 'Audit Trail',
        description: 'Complete history of user management actions for compliance and security.',
        steps: [
          'Track who created users',
          'Monitor role changes',
          'Review permission modifications',
          'View timestamps for all actions',
          'Export audit logs',
        ],
      },
      {
        icon: 'business',
        title: 'Organization Context',
        description: 'Manage users within organizational boundaries with proper scoping.',
        steps: [
          'Users are scoped to organizations',
          'View users by organization',
          'Assign users to organizations',
          'Organization admins manage their users',
          'Super admins see all organizations',
        ],
      },
      {
        icon: 'shield',
        title: 'Access Control',
        description: 'Role-based access control (RBAC) ensures users only see what they should.',
        steps: [
          'Permissions control feature access',
          'Roles group permissions logically',
          'Users inherit permissions from roles',
          'Multiple roles per user supported',
          'Hierarchical permission system',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between roles and permissions?',
        answer: 'Permissions are specific access rights (e.g., "users.create", "cms.edit"). Roles are collections of permissions (e.g., "Admin" role has many permissions). Users are assigned roles, and inherit all permissions from those roles.',
      },
      {
        question: 'Who can access User Management?',
        answer: 'Only Super Admins and Admins can access User Management. Super Admins have full control including creating/deleting roles and permissions. Admins can manage users and assign existing roles.',
      },
      {
        question: 'Can I create custom roles?',
        answer: 'Yes! Super Admins can create custom roles with specific permission sets. This allows you to tailor access control to your organization\'s needs. System roles (Super Admin, Admin) cannot be modified.',
      },
      {
        question: 'How do I create a new user?',
        answer: 'Go to the Users tab, click "New User" button, fill in email, name, and other details, assign one or more roles, and click "Create". The user will receive an email to set their password.',
      },
      {
        question: 'What happens when I deactivate a user?',
        answer: 'Deactivated users cannot log in and lose access to all features. Their data remains in the system. You can reactivate them anytime. This is useful for temporary access removal without deleting the account.',
      },
      {
        question: 'Can a user have multiple roles?',
        answer: 'Yes! Users can be assigned multiple roles. They inherit permissions from all assigned roles. For example, a user could be both "Editor" and "Analyst" to access content management and analytics.',
      },
      {
        question: 'How do permissions work?',
        answer: 'Permissions follow the format "module.action" (e.g., "users.create", "cms.edit"). They control access to specific features. Permissions are assigned to roles, and users get permissions through their roles.',
      },
      {
        question: 'Can I delete a role that\'s assigned to users?',
        answer: 'No, you cannot delete a role that\'s currently assigned to users. First remove the role from all users, then you can delete it. This prevents accidentally removing access from active users.',
      },
      {
        question: 'What is MFA and should I enable it?',
        answer: 'MFA (Multi-Factor Authentication) adds an extra security layer requiring a second verification method (like a phone code) beyond just a password. We strongly recommend enabling MFA for all users, especially admins.',
      },
      {
        question: 'How do I reset a user\'s password?',
        answer: 'Click on the user, select "Reset Password" from the actions menu. The user will receive an email with instructions to set a new password. For security, admins cannot see or set passwords directly.',
      },
      {
        question: 'Can I export the user list?',
        answer: 'Yes! Use the export button to download user data as CSV. This includes names, emails, roles, and status. Useful for reporting and auditing. Sensitive data like passwords are never exported.',
      },
      {
        question: 'What\'s the difference between Admin and Super Admin?',
        answer: 'Super Admins have complete system control including creating/deleting roles and permissions. Admins can manage users and assign existing roles but cannot modify the permission system. Super Admin is the highest privilege level.',
      },
      {
        question: 'How do I search for a specific user?',
        answer: 'Use the search box at the top of the Users tab. Type name or email, and results filter instantly. You can also filter by role or status using the filter dropdowns.',
      },
      {
        question: 'Are user management actions logged?',
        answer: 'Yes! All user management actions are logged with timestamps and the admin who performed them. This audit trail is essential for security and compliance. View logs in the Analytics tab.',
      },
      {
        question: 'Can users change their own roles?',
        answer: 'No, users cannot change their own roles or permissions. Only admins can assign roles. Users can update their profile information but not their access level.',
      },
      {
        question: 'What happens if I delete a user?',
        answer: 'Deleted users are permanently removed from the system. Their data may be retained for audit purposes depending on your configuration. Consider deactivating instead of deleting to preserve the account.',
      },
    ],
  },

  // Users screen specific trainer
  'users': {
    title: 'Users - Account Management',
    description: 'Create, manage, and monitor user accounts. Control access, assign roles, and maintain user information with comprehensive user management tools.',
    features: [
      {
        icon: 'person_add',
        title: 'Create New User',
        description: 'Add new users to your organization with email, name, and role assignments.',
        steps: [
          'Click "New User" button in top-right',
          'Enter email address (required, must be unique)',
          'Enter first name and last name',
          'Add phone number (optional)',
          'Select organization (if multi-org)',
          'Assign one or more roles',
          'Set initial status (active/inactive)',
          'Click "Create User"',
          'User receives email to set password',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit User Details',
        description: 'Update user information, roles, and settings after account creation.',
        steps: [
          'Click on any user in the list',
          'Edit name, email, or phone',
          'Update organization assignment',
          'Modify assigned roles',
          'Change account status',
          'Click "Save Changes"',
          'Changes take effect immediately',
        ],
      },
      {
        icon: 'toggle_on',
        title: 'Activate/Deactivate Users',
        description: 'Control user access by activating or deactivating accounts.',
        steps: [
          'Click on user to open details',
          'Toggle "Active" switch',
          'Confirm the status change',
          'Deactivated users cannot log in',
          'Reactivate anytime to restore access',
          'User data is preserved when deactivated',
        ],
      },
      {
        icon: 'admin_panel_settings',
        title: 'Assign Roles',
        description: 'Grant access by assigning roles that define what users can do.',
        steps: [
          'Open user details',
          'Click "Manage Roles" button',
          'Select roles from available list',
          'Users can have multiple roles',
          'Permissions combine from all roles',
          'Click "Save" to apply changes',
          'User access updates immediately',
        ],
      },
      {
        icon: 'search',
        title: 'Search Users',
        description: 'Quickly find users by name, email, or other criteria.',
        steps: [
          'Type in search box at top',
          'Search by name or email',
          'Results filter instantly',
          'Clear search to see all users',
          'Combine with filters for precision',
        ],
      },
      {
        icon: 'filter_list',
        title: 'Filter Users',
        description: 'Filter user list by role, status, organization, or other attributes.',
        steps: [
          'Click filter icon',
          'Select filter criteria (role, status, org)',
          'Apply multiple filters',
          'View filtered results',
          'Clear filters to reset',
        ],
      },
      {
        icon: 'lock_reset',
        title: 'Reset Password',
        description: 'Send password reset email to users who need to change their password.',
        steps: [
          'Click on user',
          'Select "Reset Password" from menu',
          'Confirm the action',
          'User receives reset email',
          'They set new password via link',
          'Old password becomes invalid',
        ],
      },
      {
        icon: 'email',
        title: 'Resend Invitation',
        description: 'Resend welcome email to users who haven\'t completed setup.',
        steps: [
          'Find user who hasn\'t activated',
          'Click "Resend Invitation"',
          'New email sent with setup link',
          'Previous link remains valid',
          'Track invitation status',
        ],
      },
      {
        icon: 'verified_user',
        title: 'MFA Status',
        description: 'View and manage multi-factor authentication status for users.',
        steps: [
          'MFA status shown in user list',
          'Green badge = MFA enabled',
          'Gray badge = MFA not enabled',
          'Users enable MFA in their profile',
          'Admins can view but not disable MFA',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete User',
        description: 'Permanently remove user accounts (use with caution).',
        steps: [
          'Click on user',
          'Select "Delete User" from menu',
          'Confirm deletion (cannot be undone)',
          'User is permanently removed',
          'Consider deactivating instead',
          'Audit logs are preserved',
        ],
      },
    ],
    faqs: [
      {
        question: 'What information is required to create a user?',
        answer: 'Email address is required and must be unique. First name and last name are also required. Phone number and organization are optional. You must assign at least one role to the user.',
      },
      {
        question: 'Can users have the same email address?',
        answer: 'No, email addresses must be unique across the system. Each user needs their own email for login and communication. If you need multiple accounts for one person, use different email addresses.',
      },
      {
        question: 'How do new users set their password?',
        answer: 'When you create a user, they receive an email with a secure link to set their password. The link expires after 24 hours. If they don\'t complete setup, use "Resend Invitation" to send a new link.',
      },
      {
        question: 'What\'s the difference between deactivate and delete?',
        answer: 'Deactivate: User cannot log in but account and data remain. Can be reactivated anytime. Delete: User is permanently removed. Cannot be undone. We recommend deactivating unless you\'re certain you want to delete.',
      },
      {
        question: 'Can I change a user\'s email address?',
        answer: 'Yes, you can update the email address in user details. The user will need to verify the new email. They\'ll use the new email for future logins. Old email becomes invalid.',
      },
      {
        question: 'How do I assign multiple roles to a user?',
        answer: 'Open user details, click "Manage Roles", and select multiple roles from the list. Users inherit permissions from all assigned roles. This is useful when users need access to multiple areas.',
      },
      {
        question: 'What happens to a user\'s data when they\'re deleted?',
        answer: 'User account is removed but their activity history and audit logs are preserved for compliance. Content they created remains in the system. Deletion is permanent and cannot be undone.',
      },
      {
        question: 'Can I bulk import users?',
        answer: 'Bulk import via CSV is available for Super Admins. Contact your system administrator or check the import documentation. You can also use the API for programmatic user creation.',
      },
      {
        question: 'How do I know if a user has logged in?',
        answer: 'User details show "Last Login" timestamp. You can also view login history in the Analytics tab. This helps identify inactive accounts and monitor user engagement.',
      },
      {
        question: 'Can users update their own information?',
        answer: 'Yes, users can update their profile information (name, phone, photo) in their profile settings. They cannot change their email, roles, or organization without admin approval.',
      },
      {
        question: 'What does the user status badge mean?',
        answer: 'Green badge = Active user, can log in. Red badge = Inactive, cannot log in. Gray badge = Pending, hasn\'t completed setup. Yellow badge = Locked, temporarily blocked.',
      },
      {
        question: 'How do I export the user list?',
        answer: 'Click the "Export" button above the user list. Choose CSV or Excel format. Export includes name, email, roles, status, and last login. Passwords are never exported for security.',
      },
      {
        question: 'Can I see which permissions a user has?',
        answer: 'Yes! Open user details and click "View Permissions". This shows all permissions inherited from their assigned roles. Useful for troubleshooting access issues.',
      },
      {
        question: 'How do I filter users by role?',
        answer: 'Click the filter icon, select "Role" filter, choose one or more roles. The list updates to show only users with those roles. Combine with other filters for more specific results.',
      },
      {
        question: 'What if a user forgets their password?',
        answer: 'Users can use "Forgot Password" on the login page. As an admin, you can also send a password reset email from the user details page. They\'ll receive a secure link to set a new password.',
      },
    ],
  },

  // Roles screen specific trainer
  'roles': {
    title: 'Roles - Access Control',
    description: 'Define and manage roles that determine user access levels. Create custom roles, assign permissions, and control what users can do in the system.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create New Role',
        description: 'Define custom roles tailored to your organization\'s needs.',
        steps: [
          'Click "New Role" button',
          'Enter role name (e.g., "Content Editor")',
          'Add description explaining the role',
          'Select permissions to assign',
          'Choose from available permission list',
          'Assign multiple permissions',
          'Click "Create Role"',
          'Role is immediately available',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Role',
        description: 'Modify role names, descriptions, and permission assignments.',
        steps: [
          'Click on any role in the list',
          'Update role name or description',
          'Add or remove permissions',
          'Changes affect all users with this role',
          'Click "Save Changes"',
          'Updates apply immediately',
        ],
      },
      {
        icon: 'security',
        title: 'Assign Permissions',
        description: 'Grant specific access rights to roles by assigning permissions.',
        steps: [
          'Open role details',
          'Click "Manage Permissions"',
          'Browse available permissions by module',
          'Select permissions to grant',
          'Permissions are grouped logically',
          'Save to apply changes',
          'All users with role get new permissions',
        ],
      },
      {
        icon: 'people',
        title: 'View Role Users',
        description: 'See which users are assigned to each role.',
        steps: [
          'Click on role',
          'View "Users" tab',
          'See all users with this role',
          'Click user to view details',
          'Track role adoption',
        ],
      },
      {
        icon: 'content_copy',
        title: 'Duplicate Role',
        description: 'Create new roles based on existing ones to save time.',
        steps: [
          'Click on role to duplicate',
          'Select "Duplicate" from menu',
          'Enter new role name',
          'Permissions are copied',
          'Modify as needed',
          'Save new role',
        ],
      },
      {
        icon: 'shield',
        title: 'System Roles',
        description: 'Built-in roles with predefined permissions that cannot be modified.',
        steps: [
          'Super Admin: Full system access',
          'Admin: User and role management',
          'User: Basic access',
          'System roles cannot be edited',
          'Cannot be deleted',
          'Serve as templates for custom roles',
        ],
      },
      {
        icon: 'search',
        title: 'Search Roles',
        description: 'Find roles quickly by name or description.',
        steps: [
          'Type in search box',
          'Search by role name',
          'Results filter instantly',
          'Clear to see all roles',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Role',
        description: 'Remove unused roles from the system.',
        steps: [
          'Click on role',
          'Select "Delete" from menu',
          'Cannot delete if assigned to users',
          'Remove from all users first',
          'Confirm deletion',
          'System roles cannot be deleted',
        ],
      },
      {
        icon: 'visibility',
        title: 'Role Details',
        description: 'View comprehensive information about each role.',
        steps: [
          'Click role to open details',
          'See role name and description',
          'View all assigned permissions',
          'See user count',
          'Check creation and update dates',
          'View who created/modified role',
        ],
      },
      {
        icon: 'compare',
        title: 'Compare Roles',
        description: 'Compare permissions between roles to understand differences.',
        steps: [
          'Select multiple roles',
          'Click "Compare" button',
          'View side-by-side comparison',
          'See unique and shared permissions',
          'Helps design new roles',
        ],
      },
    ],
    faqs: [
      {
        question: 'What\'s the difference between a role and a permission?',
        answer: 'A permission is a specific access right (e.g., "users.create"). A role is a collection of permissions (e.g., "Admin" role has many permissions). Roles make it easier to manage access by grouping related permissions.',
      },
      {
        question: 'Can I modify system roles like Super Admin?',
        answer: 'No, system roles (Super Admin, Admin, User) are protected and cannot be modified or deleted. They ensure core system functionality. Create custom roles if you need different permission sets.',
      },
      {
        question: 'How many permissions should a role have?',
        answer: 'It depends on the role\'s purpose. Follow the principle of least privilege: grant only the permissions needed for the role\'s function. A content editor might have 5-10 permissions, while an admin might have 50+.',
      },
      {
        question: 'Can I delete a role that users are assigned to?',
        answer: 'No, you must first remove the role from all users before deleting it. This prevents accidentally removing access from active users. The system will show which users have the role.',
      },
      {
        question: 'What happens when I change a role\'s permissions?',
        answer: 'Changes apply immediately to all users with that role. If you add permissions, users gain new access. If you remove permissions, users lose that access. Test changes carefully before applying to production roles.',
      },
      {
        question: 'How do I create a role for content editors?',
        answer: 'Click "New Role", name it "Content Editor", add description, then assign permissions like "cms.create", "cms.edit", "cms.publish". You can also duplicate an existing role and modify it.',
      },
      {
        question: 'Can a user have multiple roles?',
        answer: 'Yes! Users can have multiple roles and inherit permissions from all of them. For example, a user could be both "Editor" and "Analyst" to access content management and analytics.',
      },
      {
        question: 'How do I know which permissions to assign?',
        answer: 'Think about what the role needs to do. Content editors need CMS permissions. Analysts need analytics permissions. Start with minimal permissions and add more as needed. Review existing roles for guidance.',
      },
      {
        question: 'What\'s the best way to organize roles?',
        answer: 'Create roles based on job functions (e.g., "Content Editor", "Sales Manager", "Analyst"). Keep roles focused and specific. Avoid creating too many similar roles. Use clear, descriptive names.',
      },
      {
        question: 'Can I export the role list?',
        answer: 'Yes, use the export button to download roles and their permissions as CSV. Useful for documentation and auditing. You can also use this to plan new roles.',
      },
      {
        question: 'How do I duplicate a role?',
        answer: 'Click on the role, select "Duplicate" from the menu, enter a new name, and save. All permissions are copied. This is faster than creating a role from scratch when you need similar permissions.',
      },
      {
        question: 'What does "role hierarchy" mean?',
        answer: 'Some systems have role hierarchies where higher roles inherit lower role permissions. XRM uses flat roles - each role has exactly the permissions you assign. Users can have multiple roles to combine permissions.',
      },
      {
        question: 'Can I see which users have a specific role?',
        answer: 'Yes! Open the role details and click the "Users" tab. You\'ll see all users assigned to that role. This helps track role usage and plan changes.',
      },
      {
        question: 'How do I rename a role?',
        answer: 'Click on the role, edit the name field, and save. The role ID remains the same, so user assignments are preserved. Only the display name changes.',
      },
      {
        question: 'What if I accidentally delete a role?',
        answer: 'Role deletion is permanent and cannot be undone. The system prevents deleting roles assigned to users. If you delete an unused role, you\'ll need to recreate it with the same permissions.',
      },
    ],
  },

  // Permissions screen specific trainer
  'permissions': {
    title: 'Permissions - Granular Access Control',
    description: 'Manage individual permissions that control access to specific features and actions. Create custom permissions and understand the permission structure.',
    features: [
      {
        icon: 'add_circle',
        title: 'Create Permission',
        description: 'Define new permissions for custom features or specific access needs.',
        steps: [
          'Click "New Permission" button',
          'Enter permission key (e.g., "reports.export")',
          'Add display name (e.g., "Export Reports")',
          'Write description explaining what it controls',
          'Select module category',
          'Click "Create Permission"',
          'Permission available for role assignment',
        ],
      },
      {
        icon: 'list',
        title: 'Permission Structure',
        description: 'Understand how permissions are organized and named.',
        steps: [
          'Format: "module.action" (e.g., "users.create")',
          'Module: Feature area (users, cms, crm)',
          'Action: What can be done (create, edit, delete, view)',
          'Consistent naming for clarity',
          'Grouped by module in UI',
        ],
      },
      {
        icon: 'category',
        title: 'Permission Categories',
        description: 'Permissions are organized by module for easy management.',
        steps: [
          'User Management: users.*, roles.*, permissions.*',
          'CMS: cms.create, cms.edit, cms.publish',
          'CRM: crm.view, crm.edit, crm.delete',
          'Analytics: analytics.view, analytics.export',
          'Custom: Your organization\'s permissions',
        ],
      },
      {
        icon: 'edit',
        title: 'Edit Permission',
        description: 'Update permission names, descriptions, and categories.',
        steps: [
          'Click on permission',
          'Update display name or description',
          'Cannot change permission key',
          'Save changes',
          'Updates appear in role management',
        ],
      },
      {
        icon: 'admin_panel_settings',
        title: 'View Permission Usage',
        description: 'See which roles have each permission assigned.',
        steps: [
          'Click on permission',
          'View "Roles" tab',
          'See all roles with this permission',
          'Track permission adoption',
          'Identify unused permissions',
        ],
      },
      {
        icon: 'search',
        title: 'Search Permissions',
        description: 'Find permissions by name, key, or module.',
        steps: [
          'Type in search box',
          'Search by permission name or key',
          'Filter by module category',
          'Results update instantly',
          'Clear to see all permissions',
        ],
      },
      {
        icon: 'filter_list',
        title: 'Filter by Module',
        description: 'View permissions for specific modules.',
        steps: [
          'Click module filter dropdown',
          'Select module (Users, CMS, CRM, etc.)',
          'View only that module\'s permissions',
          'Combine with search',
          'Clear filter to see all',
        ],
      },
      {
        icon: 'delete',
        title: 'Delete Permission',
        description: 'Remove unused custom permissions from the system.',
        steps: [
          'Click on permission',
          'Select "Delete" from menu',
          'Cannot delete if assigned to roles',
          'Remove from roles first',
          'Confirm deletion',
          'System permissions cannot be deleted',
        ],
      },
      {
        icon: 'info',
        title: 'Permission Details',
        description: 'View comprehensive information about each permission.',
        steps: [
          'Click permission to open details',
          'See permission key and name',
          'Read description',
          'View module category',
          'See which roles have it',
          'Check creation date',
        ],
      },
      {
        icon: 'verified',
        title: 'System Permissions',
        description: 'Built-in permissions that control core system features.',
        steps: [
          'System permissions are predefined',
          'Cannot be modified or deleted',
          'Essential for system operation',
          'Serve as examples for custom permissions',
          'Marked with system badge',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a permission?',
        answer: 'A permission is a specific access right that controls what users can do. For example, "users.create" allows creating users, "cms.edit" allows editing content. Permissions are assigned to roles, and users get permissions through their roles.',
      },
      {
        question: 'How do I create a custom permission?',
        answer: 'Click "New Permission", enter a key following the "module.action" format (e.g., "reports.export"), add a display name and description, select the module category, and save. The permission is then available for role assignment.',
      },
      {
        question: 'What\'s the naming convention for permissions?',
        answer: 'Use "module.action" format. Module is the feature area (users, cms, crm). Action is what can be done (create, edit, delete, view, export). Examples: "users.create", "cms.publish", "analytics.view".',
      },
      {
        question: 'Can I modify system permissions?',
        answer: 'No, system permissions are protected and cannot be modified or deleted. They ensure core functionality works correctly. Create custom permissions if you need different access controls.',
      },
      {
        question: 'How do I know which permissions to create?',
        answer: 'Create permissions for specific features or actions that need access control. Think about what users should be able to do and create permissions accordingly. Start with broad permissions and add granular ones as needed.',
      },
      {
        question: 'Can I delete a permission that\'s assigned to roles?',
        answer: 'No, you must first remove the permission from all roles before deleting it. This prevents accidentally breaking role configurations. The system shows which roles have the permission.',
      },
      {
        question: 'What happens if I delete a permission?',
        answer: 'The permission is permanently removed. Any roles that had it will lose that permission. Users with those roles will lose the associated access. Deletion cannot be undone, so be careful.',
      },
      {
        question: 'How do permissions relate to roles?',
        answer: 'Permissions are assigned to roles. Roles are assigned to users. Users inherit all permissions from their roles. This hierarchy makes access management scalable and maintainable.',
      },
      {
        question: 'Can I have permissions without roles?',
        answer: 'Permissions must be assigned to roles to be useful. You can create permissions that aren\'t assigned to any role yet, but they won\'t grant access until added to a role.',
      },
      {
        question: 'How do I find unused permissions?',
        answer: 'Click on a permission and check the "Roles" tab. If no roles are listed, the permission is unused. You can safely delete unused custom permissions (system permissions cannot be deleted).',
      },
      {
        question: 'What\'s the difference between "view" and "read" permissions?',
        answer: 'Both typically mean the same thing - ability to see data. Use consistent naming in your organization. We recommend "view" for consistency with system permissions.',
      },
      {
        question: 'Can I export the permission list?',
        answer: 'Yes, use the export button to download all permissions as CSV. This includes permission keys, names, descriptions, and module categories. Useful for documentation and planning.',
      },
      {
        question: 'How do I organize custom permissions?',
        answer: 'Follow the "module.action" naming convention. Group related permissions under the same module prefix. Use clear, descriptive action names. Document what each permission controls.',
      },
      {
        question: 'What if two permissions conflict?',
        answer: 'Permissions are additive - having multiple permissions grants more access, never less. There\'s no concept of "deny" permissions. If a user has "cms.edit" from one role, they can edit CMS content regardless of other roles.',
      },
      {
        question: 'Can I rename a permission?',
        answer: 'You can change the display name and description, but not the permission key. The key is used in code and cannot be changed. If you need a different key, create a new permission and migrate roles to use it.',
      },
    ],
  },

  // Analytics screen specific trainer
  'analytics': {
    title: 'User Management Analytics - Insights & Reports',
    description: 'Monitor user activity, role distribution, permission usage, and security metrics. Make data-driven decisions about access control and user management.',
    features: [
      {
        icon: 'dashboard',
        title: 'Overview Statistics',
        description: 'Get a quick snapshot of your user management metrics.',
        steps: [
          'View total user count',
          'See active vs inactive users',
          'Track total roles defined',
          'Monitor permission count',
          'Check MFA adoption rate',
          'All stats update in real-time',
        ],
      },
      {
        icon: 'people',
        title: 'User Activity Metrics',
        description: 'Track user engagement and login patterns.',
        steps: [
          'View daily active users',
          'Monitor login frequency',
          'Track last login dates',
          'Identify inactive accounts',
          'Analyze user growth trends',
        ],
      },
      {
        icon: 'admin_panel_settings',
        title: 'Role Distribution',
        description: 'Understand how roles are distributed across your user base.',
        steps: [
          'View users per role',
          'See role adoption rates',
          'Identify most/least used roles',
          'Visual charts show distribution',
          'Track role changes over time',
        ],
      },
      {
        icon: 'security',
        title: 'Permission Usage',
        description: 'Analyze which permissions are most commonly assigned.',
        steps: [
          'View permissions by role count',
          'Identify unused permissions',
          'Track permission assignments',
          'See permission coverage',
          'Plan permission cleanup',
        ],
      },
      {
        icon: 'verified_user',
        title: 'Security Metrics',
        description: 'Monitor security-related statistics and compliance.',
        steps: [
          'Track MFA adoption percentage',
          'View accounts without MFA',
          'Monitor password reset frequency',
          'Track failed login attempts',
          'Identify security risks',
        ],
      },
      {
        icon: 'trending_up',
        title: 'Growth Trends',
        description: 'Track user and role growth over time.',
        steps: [
          'View user growth by month',
          'Track new user registrations',
          'Monitor role creation trends',
          'Analyze adoption patterns',
          'Forecast future needs',
        ],
      },
      {
        icon: 'business',
        title: 'Organization Breakdown',
        description: 'View user distribution across organizations.',
        steps: [
          'Users per organization',
          'Organization-specific metrics',
          'Compare across organizations',
          'Track org growth',
        ],
      },
      {
        icon: 'history',
        title: 'Audit Logs',
        description: 'Complete history of user management actions.',
        steps: [
          'View all user management actions',
          'Filter by action type',
          'See who performed actions',
          'Track timestamps',
          'Export audit logs',
        ],
      },
      {
        icon: 'refresh',
        title: 'Real-Time Updates',
        description: 'Analytics refresh automatically when you switch to the tab.',
        steps: [
          'Data loads on tab switch',
          'Click refresh for manual update',
          'Last updated timestamp shown',
          'All metrics update together',
        ],
      },
      {
        icon: 'download',
        title: 'Export Reports',
        description: 'Download analytics data for external analysis.',
        steps: [
          'Click export button',
          'Choose format (CSV, Excel, PDF)',
          'Select date range',
          'Download report',
          'Use for presentations or audits',
        ],
      },
    ],
    faqs: [
      {
        question: 'How often do analytics update?',
        answer: 'Analytics update automatically when you switch to the Analytics tab. You can also click the refresh button for manual updates. Data is pulled from the database in real-time.',
      },
      {
        question: 'What does MFA adoption rate mean?',
        answer: 'MFA adoption rate is the percentage of users who have enabled multi-factor authentication. Higher is better for security. Target 80%+ adoption for strong security posture.',
      },
      {
        question: 'How do I identify inactive users?',
        answer: 'Look at the "Last Login" data in user activity metrics. Users who haven\'t logged in for 30+ days are considered inactive. Consider deactivating accounts inactive for 90+ days.',
      },
      {
        question: 'Can I see which roles are most used?',
        answer: 'Yes! The role distribution chart shows users per role. This helps identify popular roles and unused roles. Use this data to optimize your role structure.',
      },
      {
        question: 'What are audit logs used for?',
        answer: 'Audit logs track all user management actions (create, edit, delete users/roles/permissions). Essential for security, compliance, and troubleshooting. Shows who did what and when.',
      },
      {
        question: 'How do I export analytics data?',
        answer: 'Click the "Export" button, choose your format (CSV, Excel, PDF), select date range if applicable, and download. Use exported data for reports, presentations, or external analysis.',
      },
      {
        question: 'Can I filter analytics by date range?',
        answer: 'Yes, most analytics views support date range filtering. Select start and end dates to view metrics for specific periods. Useful for monthly or quarterly reports.',
      },
      {
        question: 'What does "permission coverage" mean?',
        answer: 'Permission coverage shows what percentage of available permissions are actually assigned to roles. Low coverage might indicate unused permissions that can be cleaned up.',
      },
      {
        question: 'How do I track user growth?',
        answer: 'View the "Growth Trends" section which shows new user registrations by month. Compare month-over-month to understand growth patterns and forecast future needs.',
      },
      {
        question: 'Can I see failed login attempts?',
        answer: 'Yes, security metrics include failed login attempts. High numbers might indicate brute force attacks or users forgetting passwords. Monitor this for security.',
      },
      {
        question: 'What should I do with unused permissions?',
        answer: 'Review unused permissions in the permission usage section. If they\'re truly not needed, consider deleting them to keep the system clean. Document why you\'re keeping any unused permissions.',
      },
      {
        question: 'How do I compare analytics across organizations?',
        answer: 'Use the organization breakdown view to see metrics per organization. Compare user counts, role distribution, and MFA adoption. Helps identify organizations needing attention.',
      },
      {
        question: 'Can I schedule automated reports?',
        answer: 'Automated report scheduling is not currently available but planned for future updates. You can manually export reports on a regular schedule.',
      },
      {
        question: 'What\'s a good MFA adoption rate?',
        answer: 'Target 80%+ MFA adoption for strong security. 100% is ideal, especially for admin accounts. If adoption is low, consider making MFA mandatory for certain roles.',
      },
      {
        question: 'How do I use analytics to improve security?',
        answer: 'Monitor MFA adoption, track failed logins, identify inactive accounts, review permission assignments, and check for accounts with excessive permissions. Address any red flags promptly.',
      },
    ],
  },
};
