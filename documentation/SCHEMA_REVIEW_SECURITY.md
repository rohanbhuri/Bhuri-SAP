# Users, Roles & Permissions Schema Review

## Security & Optimization Analysis

### ✅ Findings Summary

#### User Entity
**Security Strengths:**
- 2FA support (`requireTwoFactor`)
- IP whitelist capability
- Session timeout control
- Account expiry date
- Force password change flag
- API access control
- Business hours restriction

**Issues Found:**
- ⚠️ **Redundant Field**: `permissionIds` - Permissions should be derived from roles, not stored directly on users
- ⚠️ **Redundant Field**: `activeModuleIds` - Should be computed from role permissions, not stored separately

**Recommendation:** Remove `permissionIds` and `activeModuleIds` from User entity. Compute these dynamically from the user's roles.

---

#### Role Entity
**Status:** ✅ Optimal
- Clean, minimal design
- Proper relationship to permissions
- No unused fields

---

#### Permission Entity
**Issues Found:**
- ⚠️ **Naming Ambiguity**: `WRITE` and `EDIT` actions are semantically overlapping
  - `WRITE` typically means CREATE in CRUD operations
  - `EDIT` typically means UPDATE in CRUD operations
  - This causes confusion in permission management

**Recommendation:** Rename ActionType enum to follow standard CRUD conventions:
```typescript
export enum ActionType {
  READ = 'read',
  CREATE = 'create',    // was WRITE
  UPDATE = 'update',    // was EDIT
  DELETE = 'delete'
}
```

---

## Seed File Details

### File Location
`backend/src/scripts/seed-users-roles-permissions.js`

### Seeded Data

#### Permissions (Racconti Modules Only)
- **User Management**: read, create, update, delete (users, roles, permissions, organizations, modules)
- **CRM**: read, create, update, delete
- **Client Management**: read, create, update, delete
- **Reports & Analytics**: read, create, update
- **Catalogue Management**: read, create, update, delete
- **CMS Management**: read, create, update, delete
- **Quotations**: read, create, update, delete
- **Dashboard**: read

#### Roles (6 Total)
1. **Super Admin** - Full access to all Racconti modules
2. **Admin** - All permissions except delete operations
3. **HR Manager** - CRM, Client Management, Reports, Dashboard
4. **Manager** - CRM, Client Management, Reports, Catalogue, Quotations, Dashboard
5. **Staff** - CRM, Client Management, Catalogue, Quotations, Dashboard (read/create only)
6. **Employee** - Read-only access to CRM, Client Management, Catalogue, Quotations, Dashboard

#### Users (6 Total)
| Email | Role | 2FA | Force Password Change |
|-------|------|-----|----------------------|
| superadmin@racconti.in | Super Admin | ✅ | ✅ |
| admin@racconti.in | Admin | ✅ | ✅ |
| hr@racconti.in | HR Manager | ❌ | ✅ |
| manager@racconti.in | Manager | ❌ | ✅ |
| staff@racconti.in | Staff | ❌ | ❌ |
| employee@racconti.in | Employee | ❌ | ❌ |

**Default Password:** `SecurePass123!` (must be changed on first login)

---

## Security Best Practices Implemented

1. ✅ **Role-Based Access Control (RBAC)** - Proper role hierarchy
2. ✅ **Principle of Least Privilege** - Employees have minimal permissions
3. ✅ **2FA for Admins** - Super Admin and Admin require 2FA
4. ✅ **Force Password Change** - Admin users must change password on first login
5. ✅ **Module Isolation** - Only Racconti modules seeded (other apps have separate seeds)
6. ✅ **Clear Permission Naming** - Standard CRUD operations
7. ✅ **Audit Trail Ready** - `createdAt` timestamps for all entities

---

## Usage

```bash
# Run the seed script
node backend/src/scripts/seed-users-roles-permissions.js
```

---

## Next Steps

1. Update Permission entity to use standard CRUD enum
2. Remove `permissionIds` and `activeModuleIds` from User entity
3. Update permission checking logic to derive from roles
4. Add audit logging for permission changes
