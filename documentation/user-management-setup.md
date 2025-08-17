# User Management Setup

## API Endpoints (Public Access)

### Setup Default Data
```bash
POST /api/user-management/setup-defaults
```
Creates default modules, permissions, and super admin role.

### Get All Data
```bash
GET /api/user-management/users
GET /api/user-management/roles  
GET /api/user-management/permissions
GET /api/user-management/modules
```

### Update User Permissions
```bash
PUT /api/user-management/users/{userId}/roles
Body: { "roleIds": ["roleId1", "roleId2"] }

PUT /api/user-management/users/{userId}/permissions  
Body: { "permissionIds": ["permId1", "permId2"] }
```

### Create New Roles/Permissions
```bash
POST /api/user-management/roles
Body: {
  "name": "Manager",
  "type": "custom", 
  "description": "Manager role",
  "permissionIds": ["permId1"]
}

POST /api/user-management/permissions
Body: {
  "module": "reports",
  "action": "read",
  "resource": "financial-reports"
}
```

## Quick Setup Steps

1. **Start your backend server**
2. **Initialize default data:**
   ```bash
   curl -X POST http://localhost:3000/api/user-management/setup-defaults
   ```
3. **Get all users to find IDs:**
   ```bash
   curl http://localhost:3000/api/user-management/users
   ```
4. **Get all roles to find super admin role ID:**
   ```bash
   curl http://localhost:3000/api/user-management/roles
   ```
5. **Assign super admin role to your user:**
   ```bash
   curl -X PUT http://localhost:3000/api/user-management/users/{YOUR_USER_ID}/roles \
   -H "Content-Type: application/json" \
   -d '{"roleIds": ["{SUPER_ADMIN_ROLE_ID}"]}'
   ```

## Default Modules Created
- **user-management** (PUBLIC) - Manage users, roles, permissions
- **dashboard** (PUBLIC) - Main dashboard
- **reports** (REQUIRE_PERMISSION) - Generate reports  
- **settings** (REQUIRE_PERMISSION) - System settings

Users with super admin role can see all modules.