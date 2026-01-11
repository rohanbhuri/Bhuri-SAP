# Schema Corrections - Backend & Frontend

## Summary of Changes

All schemas have been corrected according to the security review findings. Permissions are now derived from roles instead of being stored directly on users.

---

## Backend Changes

### 1. User Entity (`backend/src/entities/user.entity.ts`)
**Removed:**
- `permissionIds: ObjectId[]` - Permissions should be derived from roles
- `activeModuleIds: ObjectId[]` - Should be computed from role permissions

**Updated Constructor:**
- Removed initialization of `permissionIds` and `activeModuleIds`

**Result:** User entity now only stores `roleIds`, permissions are computed from roles.

---

### 2. Permission Entity (`backend/src/entities/permission.entity.ts`)
**Updated ActionType Enum:**
```typescript
// Before
export enum ActionType {
  READ = 'read',
  WRITE = 'write',      // ❌ Ambiguous
  EDIT = 'edit',        // ❌ Ambiguous
  DELETE = 'delete'
}

// After
export enum ActionType {
  READ = 'read',
  CREATE = 'create',    // ✅ Standard CRUD
  UPDATE = 'update',    // ✅ Standard CRUD
  DELETE = 'delete'
}
```

**Benefit:** Follows standard CRUD conventions, eliminates semantic overlap.

---

### 3. User Management Service (`backend/src/user-management/user-management.service.ts`)
**Removed:**
- `updateUserPermissions()` method - No longer needed
- `permissionIds` handling in `createUser()` method
- `permissionIds` handling in `updateUser()` method

**Result:** Service now only manages user roles; permissions are derived from roles.

---

### 4. User Management Controller (`backend/src/user-management/user-management.controller.ts`)
**Removed:**
- `PUT /users/:userId/permissions` endpoint - No longer needed

**Result:** Only role assignment endpoints remain.

---

## Frontend Changes

### 1. User Management Service (`frontend/src/app/modules/user-management/user-management.service.ts`)
**Removed:**
- `updateUserPermissions()` method - No longer needed

**Result:** Service only manages user roles.

---

### 2. Permissions Component (`frontend/src/app/modules/user-management/pages/permissions.component.ts`)
**Updated Mock Permissions:**
```typescript
// Before
{ _id: '2', id: '2', module: 'user-management', action: 'write', resource: 'users' },
{ _id: '3', id: '3', module: 'user-management', action: 'edit', resource: 'users' },

// After
{ _id: '2', id: '2', module: 'user-management', action: 'create', resource: 'users' },
{ _id: '3', id: '3', module: 'user-management', action: 'update', resource: 'users' },
```

---

### 3. Permission Dialog Component (`frontend/src/app/modules/user-management/dialogs/permission-dialog.component.ts`)
**Updated Action Dropdown:**
```typescript
// Before
<mat-option value="write">Write</mat-option>
<mat-option value="edit">Edit</mat-option>

// After
<mat-option value="create">Create</mat-option>
<mat-option value="update">Update</mat-option>
```

---

## Security Improvements

✅ **Principle of Least Privilege** - Users only have permissions through roles
✅ **Single Source of Truth** - Permissions defined in roles, not duplicated on users
✅ **Standard CRUD Naming** - Clear, unambiguous permission actions
✅ **Reduced Data Redundancy** - No duplicate permission storage
✅ **Easier Auditing** - Permission changes tracked through role modifications

---

## Migration Notes

### For Existing Data
If you have existing users with `permissionIds`, they should be migrated to role-based permissions:

```javascript
// Migration script example
db.users.updateMany(
  { permissionIds: { $exists: true } },
  { $unset: { permissionIds: "", activeModuleIds: "" } }
);
```

### API Compatibility
- Old permission assignment endpoints are removed
- All permission management now goes through role assignment
- Clients should update to use role-based permission assignment

---

## Testing Checklist

- [ ] User creation without `permissionIds`
- [ ] User update without `permissionIds`
- [ ] Role assignment works correctly
- [ ] Permissions derived from roles in auth checks
- [ ] Permission dialog shows CREATE/UPDATE/DELETE/READ
- [ ] No permission assignment UI in user dialogs
- [ ] Seed file runs successfully with new enum values

---

## Files Modified

**Backend:**
1. `backend/src/entities/user.entity.ts`
2. `backend/src/entities/permission.entity.ts`
3. `backend/src/user-management/user-management.service.ts`
4. `backend/src/user-management/user-management.controller.ts`

**Frontend:**
1. `frontend/src/app/modules/user-management/user-management.service.ts`
2. `frontend/src/app/modules/user-management/pages/permissions.component.ts`
3. `frontend/src/app/modules/user-management/dialogs/permission-dialog.component.ts`

**Seed File:**
1. `backend/src/scripts/seed-users-roles-permissions.js` (Created)

**Documentation:**
1. `documentation/SCHEMA_REVIEW_SECURITY.md` (Created)
