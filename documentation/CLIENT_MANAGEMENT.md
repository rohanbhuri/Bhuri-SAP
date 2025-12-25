# Client Management Module

## Overview
The Client Management module handles public account creation requests and allows administrators to convert these requests into full client accounts with login credentials.

## Features

### 1. Public Account Requests
- **Public Endpoint**: `/api/client-management/requests` (POST) - No authentication required
- Clients can submit account creation requests from any frontend website/landing page
- Captures comprehensive company and contact information

### 2. Request Management (Admin Only)
- View all client requests
- Filter by status: PENDING, APPROVED, REJECTED, CONVERTED
- Update request details and add notes
- Review and approve/reject requests

### 3. Client Conversion
- Convert approved requests into full client accounts
- Automatically creates:
  - User account with CLIENT role
  - Organization record
  - Client profile with extended information
- Generates secure credentials (auto-generated or custom password)
- Returns credentials to admin for sharing with client

### 4. Client Management
- View all converted clients
- Update client information
- Toggle client active/inactive status
- Delete client accounts
- Manage additional client details (tax ID, billing address, tags, custom fields)

## Database Entities

### ClientRequest Entity
```typescript
{
  _id: ObjectId
  companyName: string
  contactPerson: string
  email: string (unique)
  phone: string
  website?: string
  industry?: string
  companySize?: string
  address?: string
  city?: string
  country?: string
  message?: string
  status: PENDING | APPROVED | REJECTED | CONVERTED
  notes?: string
  convertedUserId?: ObjectId
  convertedOrganizationId?: ObjectId
  reviewedBy?: ObjectId
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Client Entity
```typescript
{
  _id: ObjectId
  userId: ObjectId
  organizationId: ObjectId
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  industry?: string
  companySize?: string
  address?: string
  city?: string
  country?: string
  taxId?: string
  billingAddress?: string
  isActive: boolean
  notes?: string
  tags?: string[]
  customFields?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Public Endpoints
- `POST /api/client-management/requests` - Submit client account request

### Protected Endpoints (Admin/Super Admin)
- `GET /api/client-management/requests` - Get all requests
- `GET /api/client-management/requests/:requestId` - Get request by ID
- `PUT /api/client-management/requests/:requestId` - Update request
- `POST /api/client-management/requests/:requestId/convert` - Convert to client
- `GET /api/client-management/clients` - Get all clients
- `GET /api/client-management/clients/:clientId` - Get client by ID
- `PUT /api/client-management/clients/:clientId` - Update client
- `DELETE /api/client-management/clients/:clientId` - Delete client
- `PUT /api/client-management/clients/:clientId/status` - Toggle client status

## Frontend Routes

- `/modules/client-management/requests` - View all client requests (Admin)
- `/modules/client-management/clients` - View all clients (Admin)
- `/modules/client-management/request-access` - Public request form

## Usage

### For Website Integration
Embed the public request form on any landing page:

```typescript
// In your landing page component
import { PublicClientRequestComponent } from './modules/client-management/components/public-client-request.component';

// Use in template
<app-public-client-request></app-public-client-request>
```

### For Admin Users
1. Navigate to Client Management module
2. View pending requests in "Requests" tab
3. Review request details
4. Click "Convert to Client" to create account
5. System generates credentials automatically
6. Share credentials with client
7. Manage clients in "Clients" tab

## Security

- Public endpoint rate-limited to prevent abuse
- Email uniqueness enforced
- Admin-only access for request management
- Super Admin required for client deletion
- Passwords auto-generated with strong complexity
- Client status toggle affects user login access

## Module Configuration

Add to modules collection:
```javascript
{
  id: 'client-management',
  name: 'client-management',
  displayName: 'Client Management',
  description: 'Manage client account requests and client profiles',
  permissionType: 'public',
  category: 'administration',
  icon: 'people_outline',
  color: '#00BCD4',
  isActive: true
}
```

## Integration with RaccontiXRM

The Client Management module is designed to work seamlessly with RaccontiXRM:
- Clients can be linked to CRM contacts
- Client requests can trigger CRM lead creation
- Client organizations sync with CRM accounts
- Client activity tracked in CRM timeline

## Future Enhancements

- Email notifications for request status changes
- Client portal access for self-service
- Document upload for verification
- Multi-step approval workflow
- Client onboarding checklist
- Integration with payment systems
- Client analytics dashboard
