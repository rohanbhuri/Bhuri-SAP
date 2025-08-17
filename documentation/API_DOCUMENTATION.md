# Beax RM API Documentation

## Overview
ERP/SAP-like tool with user management and module-based permissions system.

**Base URL:** `http://localhost:3000/api`

## Authentication
All endpoints except `/auth/login` require JWT Bearer token in Authorization header.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": { ... }
}
```

## Users Management

### Get All Users
```http
GET /users
Authorization: Bearer {token}
```
**Permissions:** Admin, SuperAdmin

### Create User
```http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "org_id"
}
```
**Permissions:** Admin, SuperAdmin

### Assign Role to User
```http
POST /users/{userId}/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "roleId": "role_id"
}
```
**Permissions:** Admin, SuperAdmin

## Organizations Management

### Get All Organizations
```http
GET /organizations
Authorization: Bearer {token}
```
**Permissions:** SuperAdmin only

### Create Organization
```http
POST /organizations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Acme Corp",
  "code": "ACME"
}
```
**Permissions:** SuperAdmin only

### Update Organization
```http
PATCH /organizations/{orgId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Corp Name"
}
```
**Permissions:** SuperAdmin only

### Delete Organization
```http
DELETE /organizations/{orgId}
Authorization: Bearer {token}
```
**Permissions:** SuperAdmin only

## Roles Management

### Get All Roles
```http
GET /roles
Authorization: Bearer {token}
```
**Permissions:** Admin, SuperAdmin

### Create Role
```http
POST /roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Manager",
  "type": "custom",
  "description": "Department manager role"
}
```
**Permissions:** Admin, SuperAdmin

### Update Role
```http
PATCH /roles/{roleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated role description"
}
```
**Permissions:** Admin, SuperAdmin

### Get All Permissions
```http
GET /roles/permissions
Authorization: Bearer {token}
```
**Permissions:** Admin, SuperAdmin

### Assign Permission to Role
```http
POST /roles/{roleId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permissionId": "permission_id"
}
```
**Permissions:** Admin, SuperAdmin

## Modules Management

### Get All Modules
```http
GET /modules
Authorization: Bearer {token}
```

### Get Active Modules for Organization
```http
GET /modules/active
Authorization: Bearer {token}
```

### Activate Module
```http
PATCH /modules/{moduleId}/activate
Authorization: Bearer {token}
```
**Permissions:** Admin, SuperAdmin

### Deactivate Module
```http
PATCH /modules/{moduleId}/deactivate
Authorization: Bearer {token}
```
**Permissions:** Admin, SuperAdmin

## Role Types
- `super_admin`: Full access across all organizations
- `admin`: Manage users/modules within their organization
- `staff`: Limited access based on assigned permissions
- `custom`: Custom role with specific permissions

## Permission Actions
- `read`: View data
- `write`: Create new data
- `edit`: Modify existing data
- `delete`: Remove data

## Error Responses
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---
Last updated: 2025-08-17
Current status: API surface documented for auth, users, organizations, roles, permissions, modules; CRM/HR/Projects endpoints in progress.
Future work:
- Add endpoints coverage for HR, CRM, and Project modules
- Include error schemas and pagination examples
- Generate OpenAPI spec from NestJS decorators
Related docs:
- Index: documentation/README.md
- Setup: documentation/SETUP_GUIDE.md
- Blueprint: documentation/blueprint.md