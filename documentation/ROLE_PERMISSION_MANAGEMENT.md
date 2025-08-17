# Role & Permission Management System

## Overview
This document outlines the comprehensive role and permission management system for Bhuri SAP, including UI components, API endpoints, and implementation guidelines.

## System Architecture

### Role Hierarchy
```
Super Admin (super_admin)
├── Full system access
├── Manage all organizations
├── Create/edit/delete any role
└── Access all modules and features

Admin (admin)
├── Organization-level management
├── Manage users within organization
├── Limited role management
└── Access to most modules

Staff (staff)
├── Basic user access
├── Read-only for most features
├── Limited to assigned modules
└── Can manage own profile

Custom Roles
├── Configurable permissions
├── Template-based setup
└── Organization-specific
```

## API Endpoints

### Users Management (Super Admin Only)
```typescript
// Get all users
GET /api/users
Authorization: Bearer <super_admin_token>

// Get specific user
GET /api/users/:id
Authorization: Bearer <super_admin_token>

// Create new user
POST /api/users
Authorization: Bearer <super_admin_token>
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  organizationIds: string[],
  roleIds: string[]
}

// Update user
PUT /api/users/:id
Authorization: Bearer <super_admin_token>
Body: { ...updateData }

// Delete user
DELETE /api/users/:id
Authorization: Bearer <super_admin_token>

// Assign role to user
POST /api/users/:id/roles
Authorization: Bearer <super_admin_token>
Body: { roleId: string }

// Remove role from user
DELETE /api/users/:id/roles/:roleId
Authorization: Bearer <super_admin_token>

// Assign permission to user
POST /api/users/:id/permissions
Authorization: Bearer <super_admin_token>
Body: { permissionId: string }

// Remove permission from user
DELETE /api/users/:id/permissions/:permissionId
Authorization: Bearer <super_admin_token>

// Toggle user status
PUT /api/users/:id/status
Authorization: Bearer <super_admin_token>
Body: { isActive: boolean }
```

### Roles Management (Super Admin Only)
```typescript
// Get all roles
GET /api/roles
Authorization: Bearer <super_admin_token>

// Get specific role
GET /api/roles/:id
Authorization: Bearer <super_admin_token>

// Create new role
POST /api/roles
Authorization: Bearer <super_admin_token>
Body: {
  name: string,
  type: 'custom',
  description: string,
  permissionIds: string[]
}

// Update role
PUT /api/roles/:id
Authorization: Bearer <super_admin_token>
Body: { ...updateData }

// Delete role
DELETE /api/roles/:id
Authorization: Bearer <super_admin_token>

// Get all permissions
GET /api/roles/permissions/all
Authorization: Bearer <super_admin_token>

// Create permission
POST /api/roles/permissions
Authorization: Bearer <super_admin_token>
Body: {
  module: string,
  action: 'read' | 'write' | 'edit' | 'delete',
  resource: string
}

// Update permission
PUT /api/roles/permissions/:id
Authorization: Bearer <super_admin_token>
Body: { ...updateData }

// Delete permission
DELETE /api/roles/permissions/:id
Authorization: Bearer <super_admin_token>

// Assign permission to role
POST /api/roles/:id/permissions
Authorization: Bearer <super_admin_token>
Body: { permissionId: string }

// Remove permission from role
DELETE /api/roles/:id/permissions/:permissionId
Authorization: Bearer <super_admin_token>

// Get permission templates
GET /api/roles/templates/permission
Authorization: Bearer <super_admin_token>

// Apply permission template to role
POST /api/roles/:id/apply-template
Authorization: Bearer <super_admin_token>
Body: { templateId: string }
```

## Frontend UI Components

### 1. User Management Interface

#### User List Component
```typescript
// UserListComponent
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: Role[];
  permissions: Permission[];
  organizationIds: string[];
}

// Features:
- Data table with sorting and filtering
- Bulk actions (activate/deactivate, assign roles)
- Search by email, name, or role
- Export user list
- Real-time status updates
```

#### User Detail/Edit Component
```typescript
// UserDetailComponent
interface UserForm {
  personalInfo: {
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  organizationAccess: {
    organizationIds: string[];
    currentOrganizationId: string;
  };
  roleAssignment: {
    roleIds: string[];
  };
  directPermissions: {
    permissionIds: string[];
  };
  moduleAccess: {
    activeModuleIds: string[];
  };
}

// Features:
- Tabbed interface for different sections
- Role assignment with drag-and-drop
- Permission matrix view
- Organization access management
- Activity history
- Password reset functionality
```

### 2. Role Management Interface

#### Role List Component
```typescript
// RoleListComponent
interface Role {
  _id: string;
  name: string;
  type: RoleType;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: Date;
}

// Features:
- Card-based layout for roles
- Permission count and user count
- Quick actions (edit, delete, duplicate)
- Filter by role type
- Template application
```

#### Role Builder Component
```typescript
// RoleBuilderComponent
interface RoleBuilder {
  basicInfo: {
    name: string;
    description: string;
    type: RoleType;
  };
  permissionMatrix: {
    [module: string]: {
      [action: string]: boolean;
    };
  };
  templates: {
    selectedTemplate: string;
    availableTemplates: PermissionTemplate[];
  };
}

// Features:
- Visual permission matrix
- Module-based permission grouping
- Template selection and preview
- Permission inheritance visualization
- Bulk permission assignment
- Preview affected users
```

### 3. Permission Management Interface

#### Permission Matrix Component
```typescript
// PermissionMatrixComponent
interface PermissionMatrix {
  modules: string[];
  actions: ActionType[];
  resources: string[];
  matrix: {
    [module: string]: {
      [action: string]: {
        [resource: string]: boolean;
      };
    };
  };
}

// Features:
- Interactive grid layout
- Color-coded permission levels
- Bulk selection tools
- Export/import permissions
- Permission conflict detection
```

#### Permission Templates
```typescript
// Available Templates
const PERMISSION_TEMPLATES = {
  admin: {
    name: 'Admin Template',
    description: 'Full administrative access',
    permissions: [
      'users:read:all',
      'users:write:all',
      'users:edit:all',
      'roles:read:all',
      'organizations:read:all',
      'modules:read:all'
    ]
  },
  hr_manager: {
    name: 'HR Manager Template',
    description: 'Human resources management',
    permissions: [
      'hr-management:read:all',
      'hr-management:write:all',
      'hr-management:edit:all',
      'users:read:organization',
      'users:write:organization'
    ]
  },
  crm_manager: {
    name: 'CRM Manager Template',
    description: 'Customer relationship management',
    permissions: [
      'crm:read:all',
      'crm:write:all',
      'crm:edit:all',
      'crm:delete:all'
    ]
  },
  staff: {
    name: 'Staff Template',
    description: 'Basic user access',
    permissions: [
      'users:read:own',
      'organizations:read:own',
      'modules:read:own'
    ]
  }
};
```

## Implementation Guidelines

### 1. Frontend Implementation

#### Angular Services
```typescript
// UserManagementService
@Injectable()
export class UserManagementService {
  private apiUrl = '/api/users';

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(id: string, userData: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignRole(userId: string, roleId: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${userId}/roles`, { roleId });
  }

  removeRole(userId: string, roleId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${userId}/roles/${roleId}`);
  }
}

// RoleManagementService
@Injectable()
export class RoleManagementService {
  private apiUrl = '/api/roles';

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  createRole(roleData: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, roleData);
  }

  updateRole(id: string, roleData: UpdateRoleDto): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, roleData);
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions/all`);
  }

  getPermissionTemplates(): Observable<PermissionTemplate[]> {
    return this.http.get<PermissionTemplate[]>(`${this.apiUrl}/templates/permission`);
  }

  applyTemplate(roleId: string, templateId: string): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/${roleId}/apply-template`, { templateId });
  }
}
```

#### Angular Components
```typescript
// UserListComponent
@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-management-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Management</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="createUser()">
              <mat-icon>add</mat-icon> Add User
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <div class="filters">
            <mat-form-field>
              <mat-label>Search</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field>
              <mat-label>Filter by Role</mat-label>
              <mat-select [(value)]="selectedRole" (selectionChange)="applyFilter()">
                <mat-option value="">All Roles</mat-option>
                <mat-option *ngFor="let role of roles" [value]="role._id">
                  {{role.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <table mat-table [dataSource]="dataSource" class="user-table">
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{user.email}}</td>
            </ng-container>
            
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let user">
                {{user.firstName}} {{user.lastName}}
              </td>
            </ng-container>
            
            <ng-container matColumnDef="roles">
              <th mat-header-cell *matHeaderCellDef>Roles</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip-list>
                  <mat-chip *ngFor="let role of user.roles" 
                           [color]="getRoleColor(role.type)">
                    {{role.name}}
                  </mat-chip>
                </mat-chip-list>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let user">
                <mat-slide-toggle 
                  [checked]="user.isActive"
                  (change)="toggleUserStatus(user._id, $event.checked)">
                </mat-slide-toggle>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button (click)="editUser(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteUser(user._id)" 
                        color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['email', 'name', 'roles', 'status', 'actions'];
  searchTerm = '';
  selectedRole = '';

  constructor(
    private userService: UserManagementService,
    private roleService: RoleManagementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;
    });
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  applyFilter() {
    let filteredUsers = this.users;
    
    if (this.searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (this.selectedRole) {
      filteredUsers = filteredUsers.filter(user => 
        user.roles.some(role => role.id === this.selectedRole)
      );
    }
    
    this.dataSource.data = filteredUsers;
  }

  createUser() {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '800px',
      data: { mode: 'create', roles: this.roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '800px',
      data: { mode: 'edit', user, roles: this.roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(userId: string, isActive: boolean) {
    this.userService.toggleUserStatus(userId, isActive).subscribe(() => {
      this.snackBar.open('User status updated', 'Close', { duration: 3000 });
      this.loadUsers();
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      });
    }
  }

  getRoleColor(roleType: string): string {
    switch (roleType) {
      case 'super_admin': return 'warn';
      case 'admin': return 'primary';
      case 'staff': return 'accent';
      default: return '';
    }
  }
}
```

### 2. Security Implementation

#### Guard Enhancement
```typescript
// Enhanced PermissionsGuard
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private userRepository: MongoRepository<User>,
    @InjectRepository(Role) private roleRepository: MongoRepository<Role>,
    @InjectRepository(Permission) private permissionRepository: MongoRepository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const requiredRoles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    
    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Get full user data with roles and permissions
    const fullUser = await this.getUserWithRolesAndPermissions(user.userId);
    if (!fullUser) {
      return false;
    }

    // Super admin bypass
    if (this.isSuperAdmin(fullUser.roles)) {
      return true;
    }

    // Check role requirements
    if (requiredRoles && !this.hasRequiredRoles(fullUser.roles, requiredRoles)) {
      return false;
    }

    // Check permission requirements
    if (requiredPermissions && !await this.hasRequiredPermissions(fullUser, requiredPermissions)) {
      return false;
    }

    return true;
  }

  private async getUserWithRolesAndPermissions(userId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) return null;

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const directPermissions = await this.permissionRepository.find({
      where: { _id: { $in: user.permissionIds } }
    });

    // Get permissions from roles
    const rolePermissionIds = roles.flatMap(role => role.permissionIds);
    const rolePermissions = await this.permissionRepository.find({
      where: { _id: { $in: rolePermissionIds } }
    });

    return {
      ...user,
      roles,
      permissions: [...directPermissions, ...rolePermissions]
    };
  }

  private isSuperAdmin(roles: Role[]): boolean {
    return roles.some(role => role.type === RoleType.SUPER_ADMIN);
  }

  private hasRequiredRoles(userRoles: Role[], requiredRoles: RoleType[]): boolean {
    return requiredRoles.some(requiredRole => 
      userRoles.some(userRole => userRole.type === requiredRole)
    );
  }

  private async hasRequiredPermissions(user: any, requiredPermissions: string[]): Promise<boolean> {
    const userPermissionStrings = user.permissions.map(p => `${p.module}:${p.action}:${p.resource}`);
    
    return requiredPermissions.every(required => {
      // Check exact match
      if (userPermissionStrings.includes(required)) {
        return true;
      }
      
      // Check wildcard permissions (e.g., users:*:all covers users:read:all)
      const [module, action, resource] = required.split(':');
      return userPermissionStrings.some(userPerm => {
        const [userModule, userAction, userResource] = userPerm.split(':');
        return userModule === module && 
               (userAction === '*' || userAction === action) &&
               (userResource === 'all' || userResource === resource);
      });
    });
  }
}
```

## Database Setup Instructions

### 1. Run Database Setup Script
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run database setup
node src/scripts/database-setup.js

# Or with custom connection string
DATABASE_URI="mongodb://localhost:27017/bhuri_sap" node src/scripts/database-setup.js
```

### 2. Verify Setup
```bash
# Connect to MongoDB
mongo bhuri_sap

# Check collections
show collections

# Verify super admin user
db.users.findOne({email: "admin@bhuri-sap.com"})

# Check roles
db.roles.find().pretty()

# Check permissions
db.permissions.find().limit(5).pretty()
```

### 3. Post-Setup Configuration
1. Login with super admin credentials
2. Change default password
3. Create additional organizations
4. Set up custom roles as needed
5. Configure module permissions
6. Create additional admin users

This comprehensive system provides complete control over user access, role management, and permission assignment while maintaining security and scalability.