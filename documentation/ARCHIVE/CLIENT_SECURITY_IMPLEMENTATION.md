# Client Security Settings Sync - Implementation Guide

## Overview
When a client becomes a user, all security settings are automatically synced from the Client entity to the User entity. This ensures security policies are enforced during login and can be managed from user settings.

## What Was Implemented

### 1. User Entity Updates
Added security fields to User entity:
```typescript
requireTwoFactor: boolean
sessionTimeout?: number (in minutes)
restrictToBusinessHours: boolean
allowApiAccess: boolean
expiryDate?: Date
ipWhitelist?: string (comma-separated)
maxDevices?: number
```

### 2. Sync Mechanism
**Private method**: `syncClientSecurityToUser(client, user)`
- Copies all security settings from Client to User
- Called automatically when:
  - Client is converted from request
  - Login credentials are requested
  - Client is updated

### 3. New Endpoints

#### Get Security Settings
```
GET /client-management/clients/:clientId/security-settings
```
Returns current security configuration for a client.

**Response:**
```json
{
  "requireTwoFactor": true,
  "sessionTimeout": 30,
  "restrictToBusinessHours": true,
  "allowApiAccess": false,
  "expiryDate": "2025-12-31T23:59:59Z",
  "ipWhitelist": "192.168.1.1,10.0.0.1",
  "maxDevices": 3
}
```

#### Update Security Settings
```
PUT /client-management/clients/:clientId/security-settings
```
Updates security settings for a client and syncs to user.

**Request Body:**
```json
{
  "requireTwoFactor": true,
  "sessionTimeout": 30,
  "restrictToBusinessHours": true,
  "allowApiAccess": false,
  "expiryDate": "2025-12-31T23:59:59Z",
  "ipWhitelist": "192.168.1.1,10.0.0.1",
  "maxDevices": 3
}
```

### 4. Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Admin Updates Client Security Settings                      │
│ PUT /clients/:id/security-settings                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────────────────┐
        │ updateSecuritySettings()               │
        │ • Update Client entity                 │
        │ • Call syncClientSecurityToUser()      │
        └────────────┬───────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────────────────┐
        │ syncClientSecurityToUser()             │
        │ • Copy all security fields             │
        │ • Save to User entity                  │
        └────────────┬───────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────────────────┐
        │ Client Login                           │
        │ • Check expiryDate                     │
        │ • Check businessHours                  │
        │ • Check 2FA requirement                │
        │ • Validate IP whitelist                │
        └────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Create Client with Security Settings
```bash
curl -X POST http://localhost:3000/api/client-management/requests/123/convert \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corp",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@acme.com",
    "phone": "+1234567890",
    "requireTwoFactor": true,
    "sessionTimeout": 30,
    "restrictToBusinessHours": true,
    "allowApiAccess": false,
    "expiryDate": "2025-12-31T23:59:59Z",
    "ipWhitelist": "192.168.1.1,10.0.0.1",
    "maxDevices": 3
  }'
```

**Result:**
- Client created with security settings
- User created with same security settings
- Organization created
- Credentials generated

### Example 2: Update Security Settings
```bash
curl -X PUT http://localhost:3000/api/client-management/clients/456/security-settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "requireTwoFactor": true,
    "sessionTimeout": 60,
    "restrictToBusinessHours": false,
    "allowApiAccess": true
  }'
```

**Result:**
- Client security settings updated
- User security settings automatically synced
- Changes take effect on next login

### Example 3: Get Current Security Settings
```bash
curl -X GET http://localhost:3000/api/client-management/clients/456/security-settings \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "requireTwoFactor": true,
  "sessionTimeout": 60,
  "restrictToBusinessHours": false,
  "allowApiAccess": true,
  "expiryDate": "2025-12-31T23:59:59Z",
  "ipWhitelist": "192.168.1.1,10.0.0.1",
  "maxDevices": 3
}
```

## Login Validation (To Be Implemented in Auth Service)

When user logs in, check these settings:

```typescript
async login(email: string, password: string) {
  const user = await this.validateUser(email, password);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  // Check expiry
  if (user.expiryDate && new Date() > user.expiryDate) {
    throw new UnauthorizedException('Account has expired');
  }

  // Check business hours
  if (user.restrictToBusinessHours) {
    const hour = new Date().getHours();
    if (hour < 9 || hour >= 18) {
      throw new UnauthorizedException('Login restricted to business hours (9 AM - 6 PM)');
    }
  }

  // Check 2FA requirement
  if (user.requireTwoFactor) {
    return { requiresTwoFactor: true, userId: user._id };
  }

  // ... continue with normal login
}
```

## Security Settings Reference

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `requireTwoFactor` | boolean | Require 2FA for login | false |
| `sessionTimeout` | number | Session timeout in minutes | null |
| `restrictToBusinessHours` | boolean | Restrict login to 9 AM - 6 PM | false |
| `allowApiAccess` | boolean | Allow API key access | false |
| `expiryDate` | Date | Account expiration date | null |
| `ipWhitelist` | string | Comma-separated allowed IPs | null |
| `maxDevices` | number | Max concurrent devices | null |

## Database Schema

### User Entity
```typescript
{
  _id: ObjectId,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  organizationIds: ObjectId[],
  roleIds: ObjectId[],
  isActive: boolean,
  forcePasswordChange: boolean,
  
  // Security Settings (synced from Client)
  requireTwoFactor: boolean,
  sessionTimeout?: number,
  restrictToBusinessHours: boolean,
  allowApiAccess: boolean,
  expiryDate?: Date,
  ipWhitelist?: string,
  maxDevices?: number,
  
  createdAt: Date
}
```

### Client Entity
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  organizationId: ObjectId,
  companyName: string,
  contactPerson: string,
  email: string,
  phone: string,
  
  // Security Settings (source of truth)
  requireTwoFactor: boolean,
  sessionTimeout?: number,
  restrictToBusinessHours: boolean,
  allowApiAccess: boolean,
  expiryDate?: Date,
  ipWhitelist?: string,
  maxDevices?: number,
  
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Sync Points

Security settings are synced from Client to User at these points:

1. **convertToClient()** - When converting request to client
2. **requestLoginCredentials()** - When requesting credentials
3. **updateClient()** - When updating client details
4. **updateSecuritySettings()** - When updating security settings

## Benefits

✅ **Single Source of Truth**: Client is master for security settings
✅ **Automatic Sync**: No manual sync needed
✅ **Fast Login**: All settings available in User (no joins)
✅ **Consistency**: User always has latest settings
✅ **Flexibility**: Update via Client or User endpoints
✅ **Audit Trail**: Changes tracked in both entities
✅ **Performance**: Optimized for login checks

## Next Steps

1. Implement login validation in Auth Service
2. Add 2FA verification endpoint
3. Add IP whitelist validation middleware
4. Add session timeout enforcement
5. Add business hours validation
6. Create admin dashboard for security settings
7. Add audit logging for security changes
