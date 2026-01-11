# Client to User Conversion & Login Credentials Request

## Overview

This document outlines how clients can become users in the system when login credentials are requested.

## Current Architecture

### User Entity
- **Email**: Unique identifier for authentication
- **Password**: Hashed password for login
- **FirstName/LastName**: User identity
- **OrganizationIds**: Array of organizations the user belongs to
- **RoleIds**: Array of roles assigned to the user
- **PermissionIds**: Array of permissions
- **IsActive**: Account status
- **ActiveModuleIds**: Modules accessible to the user

### Client Entity
- **UserId**: Reference to the User entity (nullable initially)
- **Email**: Client contact email
- **CompanyName**: Client organization name
- **ContactPerson**: Primary contact name
- **Phone**: Contact phone number
- **IsActive**: Client status
- **Security Fields**: maxDevices, sessionTimeout, expiryDate, ipWhitelist, requireTwoFactor, etc.

### Client Request Entity
- **Status**: PENDING → APPROVED → CONVERTED
- **ConvertedUserId**: Reference to created User
- **ConvertedOrganizationId**: Reference to created Organization

## Conversion Flow

### 1. Client Request Creation
- Client submits a request via public endpoint
- Request stored with PENDING status
- Admin reviews the request

### 2. Conversion to Client
- Admin approves and converts request to Client
- Creates: User, Organization, Client record
- Generates temporary password
- Links User → Client via userId

### 3. Request Login Credentials (NEW)
- Existing Client requests login credentials
- Creates/updates User account if not exists
- Generates new password
- Returns credentials to client

## Implementation

### New Endpoint: Request Login Credentials

**POST** `/client-management/clients/:clientId/request-credentials`

**Request Body:**
```json
{
  "email": "client@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login credentials created successfully",
  "credentials": {
    "email": "client@example.com",
    "password": "GeneratedPassword123!",
    "userId": "ObjectId"
  }
}
```

### Service Method: requestLoginCredentials

```typescript
async requestLoginCredentials(clientId: string, credentialData: any): Promise<any>
```

**Logic:**
1. Find Client by ID
2. Check if User exists for this Client
3. If User exists: Update password
4. If User doesn't exist: Create new User
5. Link User to Client
6. Generate temporary password
7. Return credentials

## Key Relationships

```
ClientRequest
    ↓ (on conversion)
Client ←→ User (via userId)
    ↓
Organization
```

## Security Considerations

1. **Password Generation**: Use secure random generation
2. **Email Verification**: Send credentials via email (recommended)
3. **Force Password Change**: Set `forcePasswordChange: true` on first login
4. **Session Management**: Respect client's sessionTimeout setting
5. **IP Whitelist**: Enforce if configured
6. **Two-Factor Auth**: Require if configured

## Database Indexes

Recommended indexes for performance:
- `clients.userId` - For quick user lookup
- `clients.email` - For email-based queries
- `users.email` - For authentication
- `client_requests.email` - For duplicate prevention

## Migration Path

For existing clients without users:
1. Identify clients with null userId
2. Create User records for each
3. Link via userId
4. Send credentials via email
5. Require password change on first login
