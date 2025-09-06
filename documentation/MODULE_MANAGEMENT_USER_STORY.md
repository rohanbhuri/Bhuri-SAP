# Module Management System - User Story & Database Design

## Overview
The Module Management system allows organizations and users to activate/deactivate application modules based on permissions and approval workflows.

## Database Collections

### 1. modules
```javascript
{
  _id: ObjectId,
  name: "crm",
  displayName: "Customer Relationship Management",
  description: "Manage customer relationships and sales",
  permissionType: "public" | "require_permission",
  category: "sales",
  icon: "people",
  color: "#2196f3",
  createdAt: Date
}
```

### 2. organizations
```javascript
{
  _id: ObjectId,
  name: "Company Name",
  activeModuleIds: [ObjectId, ObjectId], // Array of module IDs
  // other org fields...
}
```

### 3. users
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@company.com",
  organizationId: ObjectId,
  activeModuleIds: [ObjectId, ObjectId], // Array of module IDs (fallback)
  // other user fields...
}
```

### 4. module-requests
```javascript
{
  _id: ObjectId,
  moduleId: ObjectId,
  userId: ObjectId,
  organizationId: ObjectId | null,
  status: "pending" | "approved" | "rejected",
  requestedAt: Date,
  processedAt: Date,
  processedBy: ObjectId,
  approverType: "org_admin" | "super_admin" | "system",
  approverId: ObjectId | null,
  priority: "high" | "normal"
}
```

### 5. audit_logs
```javascript
{
  _id: ObjectId,
  action: String,
  data: Object,
  timestamp: Date,
  source: String
}
```

## User Stories

### Story 1: View Available Modules
**As a user, I want to see all available modules with their activation status**

**Process:**
1. System checks user's organization `activeModuleIds`
2. If no organization, checks user's `activeModuleIds`
3. Module is "Active" if its ID exists in the relevant `activeModuleIds` array
4. Shows module status: Active, Public, Restricted, or Pending

### Story 2: Activate Public Module
**As a user, I want to instantly activate public modules**

**Process:**
1. User clicks "Activate" on public module
2. System adds module ID to organization's `activeModuleIds` (or user's if no org)
3. Module immediately shows as "Active"
4. User can now access the module

### Story 3: Request Restricted Module
**As a user, I want to request access to restricted modules**

**Process:**
1. User clicks "Request Access" on restricted module
2. System determines appropriate approver based on:
   - Organization admins (for org users)
   - Super admins (for critical modules or no org)
   - System fallback (for edge cases)
3. System creates entry in `module-requests` collection with approver information
4. Module shows as "Pending" for the user
5. Appropriate approvers receive notification based on request priority

### Story 4: Approve Module Request
**As an admin, I want to approve/reject module requests**

**Process:**
1. Admin views pending requests with approver information and priority levels
2. System validates admin permissions before allowing approval/rejection
3. On approval:
   - Adds module ID to organization's `activeModuleIds`
   - Updates request status to "approved"
   - Creates audit log entry
   - Notifies requester of approval
   - Module becomes active for the organization
4. On rejection:
   - Updates request status to "rejected"
   - Creates audit log entry
   - Notifies requester of rejection
   - Module remains inactive

### Story 5: Deactivate Module
**As a user, I want to deactivate modules I no longer need**

**Process:**
1. User clicks "Deactivate" on active module
2. System removes module ID from organization's `activeModuleIds`
3. Module shows as inactive
4. User loses access to the module

## Key Business Rules

### Module Activation Logic
- **Priority**: Organization `activeModuleIds` > User `activeModuleIds`
- **Public Modules**: Instant activation without approval
- **Restricted Modules**: Require admin approval via intelligent routing
- **Super Admin Requests**: Auto-approved (bypass approval workflow)
- **Status Determination**: Only based on presence in `activeModuleIds` arrays

### Request Routing Logic
- **Organization Users**: Requests routed to organization admins first
- **Critical Modules**: Always routed to super admins regardless of organization
- **No Organization**: Requests routed to super admins
- **Priority Levels**: Core modules and super admin requests marked as high priority

### Permission Types
- **public**: Anyone can activate instantly
- **require_permission**: Needs admin approval via intelligent routing system

### Data Consistency
- Module status is determined ONLY by `activeModuleIds` arrays
- No module-level `isActive` field is used
- Requests are organization/user specific with approver routing
- Super admins see all pending requests
- Regular admins see only their organization's requests
- All approval/rejection actions are logged for audit purposes

## API Endpoints

### GET /modules/available
Returns all modules with activation status for current user/org

### PATCH /modules/:id/activate
Activates public module or creates request for restricted module

### PATCH /modules/:id/deactivate  
Deactivates module by removing from activeModuleIds

### GET /modules/requests
Gets pending requests (with user names via aggregation)

### PATCH /modules/requests/:id/approve
Approves request and activates module

### PATCH /modules/requests/:id/reject
Rejects request

## Frontend Components

### Module Management Page
- **Available Modules Tab**: Grid of all modules with status and actions
- **Pending Requests Tab**: List of requests awaiting approval (with badge count)
- **Search**: Filter modules by name/description
- **Actions**: Activate, Deactivate, Request Access, Approve, Reject

### Module Status Display
- **Active**: Green chip with checkmark, shows "Open" and "Deactivate" buttons
- **Public**: Blue chip, shows "Activate" button  
- **Restricted**: Orange chip with lock, shows "Request Access" button
- **Pending**: Orange chip with clock, shows "Request Pending" (disabled)

## Error Handling
- Invalid module IDs return 404
- Duplicate requests are prevented
- Missing authentication returns 401
- Database connection errors are logged and return 500

## Security Considerations
- All endpoints require JWT authentication
- Organization isolation (users only see their org's data)
- Super admin role can see all requests
- Input validation on all module operations