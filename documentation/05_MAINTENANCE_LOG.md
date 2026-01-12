# Bhuri-SAP Maintenance Log

**Last Updated**: 2026-01-13  
**Purpose**: Technical debt, critical fixes, schema changes, and migration history.

---

## 🛠️ System Health
- **Build Status**: ✅ Backend & Frontend compiling successfully.
- **Node Version**: LTS (v22).
- **Primary Auth**: JWT + API Keys.

---

## 🔧 Critical Fixes & Changes

### 1. Role-Based Permissions Migration (2025)
**Problem**: Permissions were stored directly on users, making it hard to manage at scale.  
**Fix**: Migrated to a Role-based system where permissions are linked to Roles, and Roles are linked to Users.
- **Removed**: `permissionIds` and `activeModuleIds` from User Entity.
- **Updated**: `ActionType` enum changed from `WRITE/EDIT` to standard CRUD `CREATE/UPDATE`.
- **Migration**: Unset `permissionIds` from all MongoDB user documents.

### 2. Product Field Standardization
**Problem**: Inconsistency between `price` and `basePrice` caused compilation errors in Quotations/Enquiries.  
**Fix**: Standardized on `basePrice` as the source of truth for all products.
- **Affected Files**: `enquiry.service.ts`, `quotations.service.ts`.

### 3. WebSocket Authentication Security
**Problem**: WebSocket connections were unauthenticated, causing "No authenticated user" errors.  
**Fix**: Implemented JWT validation in the Socket.io handshake.
- **Backend**: `messages.gateway.ts` now verifies JWT on `handleConnection`.
- **Frontend**: `auth.service.ts` auto-connects to socket only after successful login with token.

---

## 📦 Database Scripts
Common maintenance scripts for MongoDB.

### Unset Old Permissions
```javascript
db.users.updateMany(
  { permissionIds: { $exists: true } },
  { $unset: { permissionIds: "", activeModuleIds: "" } }
);
```

### Cleanup Duplicate Slugs
```javascript
db.cms_pages.aggregate([
  { $group: { _id: "$slug", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
]);
```

---

## 🏗️ Technical Debt & Roadmap
- [ ] **Token Refresh**: Implement automatic JWT rotation before expiration.
- [ ] **Performance**: Add Redis caching for Catalogue analytics.
- [ ] **Accessibility**: Full screen-reader audit for CRM widgets.
- [ ] **Stability**: Increase unit test coverage for `CrmFunnelService` beyond 60%.

---

## 🚀 Deployment Checklist
1. **Migration**: Run schema migration scripts if any.
2. **Environment**: Sync `JWT_SECRET` across all micro-modules.
3. **Build**: `npm run build` in both frontend/backend to check for TS errors.
4. **Indexes**: Ensure `organizationId` index exists on all multi-tenant collections.
