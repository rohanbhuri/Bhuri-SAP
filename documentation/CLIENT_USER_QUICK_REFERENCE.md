# Client to User Conversion - Quick Reference

## Three Ways to Create a User from a Client

### 1. Convert Client Request to Client (Admin Action)
**Endpoint:** `POST /client-management/requests/:requestId/convert`

Creates User + Organization + Client in one action.

```bash
curl -X POST http://localhost:3000/api/client-management/requests/123/convert \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corp",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@acme.com",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "client": { "_id": "...", "userId": "...", ... },
  "user": { "_id": "...", "email": "john@acme.com", ... },
  "organization": { "_id": "...", "name": "Acme Corp", ... },
  "credentials": {
    "email": "john@acme.com",
    "password": "GeneratedPassword123!"
  }
}
```

---

### 2. Request Login Credentials for Existing Client (NEW)
**Endpoint:** `POST /client-management/clients/:clientId/request-credentials`

Creates or updates User for an existing Client.

```bash
curl -X POST http://localhost:3000/api/client-management/clients/456/request-credentials \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login credentials created successfully",
  "credentials": {
    "email": "john@acme.com",
    "password": "NewPassword456!",
    "userId": "..."
  }
}
```

---

### 3. Update Client Status (Sync with User)
**Endpoint:** `PUT /client-management/clients/:clientId/status`

Activates/deactivates both Client and User.

```bash
curl -X PUT http://localhost:3000/api/client-management/clients/456/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "isActive": true }'
```

---

## Database Schema Relationships

```
┌─────────────────────┐
│  ClientRequest      │
│  (PENDING/APPROVED) │
└──────────┬──────────┘
           │ convert
           ↓
┌─────────────────────┐      ┌──────────────────┐
│  Client             │◄─────┤  User            │
│  - userId (FK)      │      │  - email         │
│  - organizationId   │      │  - password      │
│  - email            │      │  - roleIds       │
│  - companyName      │      │  - organizationId│
└─────────────────────┘      └──────────────────┘
           │                         ▲
           └─────────────────────────┘
           (linked via userId)
```

---

## Key Fields

### User Entity
- `email` - Login identifier
- `password` - Hashed password
- `firstName`, `lastName` - User name
- `organizationId` - Primary organization
- `organizationIds` - All organizations
- `roleIds` - Assigned roles (e.g., CLIENT)
- `forcePasswordChange` - Require password change on first login
- `isActive` - Account status

### Client Entity
- `userId` - Reference to User (nullable until credentials requested)
- `email` - Client contact email
- `companyName` - Organization name
- `contactPerson` - Primary contact
- `organizationId` - Client's organization
- `isActive` - Client status
- Security fields: `requireTwoFactor`, `sessionTimeout`, `ipWhitelist`, etc.

---

## Workflow Example

1. **Client submits request** (public endpoint)
   - Creates ClientRequest with PENDING status

2. **Admin reviews and approves**
   - Updates ClientRequest status to APPROVED

3. **Admin converts to Client** (Option A)
   - Creates User, Organization, Client
   - Generates temporary password
   - Sends credentials to client

4. **OR Admin requests credentials** (Option B)
   - For existing Client without User
   - Creates/updates User
   - Generates new password
   - Sends credentials to client

5. **Client logs in**
   - Uses email + password
   - Prompted to change password (forcePasswordChange = true)
   - Gains access to assigned modules

---

## Security Features

- ✅ Password hashing with bcrypt
- ✅ Force password change on first login
- ✅ Two-factor authentication support
- ✅ Session timeout configuration
- ✅ IP whitelist enforcement
- ✅ Device limit control
- ✅ Role-based access control (CLIENT role)
- ✅ Organization isolation

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/client-management/requests` | Create client request |
| GET | `/client-management/requests` | List all requests |
| POST | `/client-management/requests/:id/convert` | Convert request to client |
| GET | `/client-management/clients` | List all clients |
| POST | `/client-management/clients/:id/request-credentials` | Request login credentials |
| PUT | `/client-management/clients/:id` | Update client |
| PUT | `/client-management/clients/:id/status` | Toggle client status |
