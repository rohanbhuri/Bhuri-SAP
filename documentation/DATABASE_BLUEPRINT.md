# Bhuri SAP - Database Blueprint & Schema Design

## Overview
This document provides a comprehensive blueprint of the MongoDB database structure for the Bhuri SAP system, including all collections, their relationships, and data models.

## Database Architecture

### Core Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  isActive: Boolean (default: true),
  organizationIds: [ObjectId], // References to organizations
  currentOrganizationId: ObjectId, // Current active organization
  roleIds: [ObjectId], // References to roles
  permissionIds: [ObjectId], // Direct permissions
  activeModuleIds: [ObjectId], // User's active modules
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Roles Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  type: String (enum: ['super_admin', 'admin', 'staff', 'custom']),
  description: String,
  permissionIds: [ObjectId], // References to permissions
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Permissions Collection
```javascript
{
  _id: ObjectId,
  module: String (required), // e.g., 'users', 'hr-management', 'crm'
  action: String (enum: ['read', 'write', 'edit', 'delete']),
  resource: String (required), // e.g., 'all', 'own', 'organization'
  createdAt: Date
}
```

#### 4. Organizations Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  logo: String, // URL or file path
  website: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  isActive: Boolean (default: true),
  isPublic: Boolean (default: false),
  activeModuleIds: [ObjectId], // Organization's active modules
  settings: {
    theme: String,
    primaryColor: String,
    accentColor: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Modules Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  displayName: String,
  description: String,
  icon: String,
  category: String, // e.g., 'management', 'analytics', 'communication'
  version: String,
  isActive: Boolean (default: true),
  isPremium: Boolean (default: false),
  dependencies: [ObjectId], // Other modules this depends on
  permissions: [String], // Required permissions
  routes: [String], // Frontend routes
  createdAt: Date
}
```

### Management Collections

#### 6. HR Management Collections

##### Employees
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  userId: ObjectId, // Reference to user if they have system access
  employeeId: String (unique per organization),
  personalInfo: {
    firstName: String (required),
    lastName: String (required),
    email: String,
    phone: String,
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  employmentInfo: {
    departmentId: ObjectId,
    position: String,
    employmentType: String, // full-time, part-time, contract
    startDate: Date,
    endDate: Date,
    salary: Number,
    currency: String
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

##### Departments
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  name: String (required),
  description: String,
  managerId: ObjectId, // Reference to employee
  parentDepartmentId: ObjectId, // For hierarchical structure
  isActive: Boolean (default: true),
  createdAt: Date
}
```

##### Attendance
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  employeeId: ObjectId (required),
  date: Date (required),
  checkIn: Date,
  checkOut: Date,
  totalHours: Number,
  status: String, // present, absent, late, half-day
  notes: String,
  createdAt: Date
}
```

##### Leaves
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  employeeId: ObjectId (required),
  leaveType: String, // sick, vacation, personal, etc.
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number,
  reason: String,
  status: String, // pending, approved, rejected
  approvedBy: ObjectId, // Reference to employee/user
  approvedAt: Date,
  createdAt: Date
}
```

##### Payroll
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  employeeId: ObjectId (required),
  payPeriod: {
    month: Number,
    year: Number
  },
  basicSalary: Number,
  allowances: [{
    type: String,
    amount: Number
  }],
  deductions: [{
    type: String,
    amount: Number
  }],
  grossPay: Number,
  netPay: Number,
  status: String, // draft, processed, paid
  processedAt: Date,
  createdAt: Date
}
```

#### 7. CRM Collections

##### Contacts
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  type: String, // individual, company
  firstName: String,
  lastName: String,
  companyName: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  tags: [String],
  notes: String,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

##### Leads
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  contactId: ObjectId,
  title: String (required),
  description: String,
  value: Number,
  currency: String,
  source: String, // website, referral, cold-call, etc.
  status: String, // new, contacted, qualified, lost
  priority: String, // low, medium, high
  assignedTo: ObjectId, // Reference to user
  expectedCloseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

##### Deals
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  leadId: ObjectId,
  contactId: ObjectId,
  title: String (required),
  description: String,
  value: Number (required),
  currency: String,
  stage: String, // proposal, negotiation, closed-won, closed-lost
  probability: Number, // 0-100
  assignedTo: ObjectId,
  expectedCloseDate: Date,
  actualCloseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 8. Project Management Collections

##### Projects
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  name: String (required),
  description: String,
  status: String, // planning, active, on-hold, completed, cancelled
  priority: String, // low, medium, high, critical
  startDate: Date,
  endDate: Date,
  budget: Number,
  currency: String,
  managerId: ObjectId, // Project manager
  teamMembers: [ObjectId], // References to users/employees
  clientId: ObjectId, // Reference to contact
  createdAt: Date,
  updatedAt: Date
}
```

##### Tasks
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  projectId: ObjectId,
  title: String (required),
  description: String,
  status: String, // todo, in-progress, review, completed
  priority: String, // low, medium, high, critical
  assignedTo: ObjectId,
  assignedBy: ObjectId,
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  dependencies: [ObjectId], // Other tasks this depends on
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### System Collections

#### 9. Module Requests
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  moduleId: ObjectId (required),
  requestedBy: ObjectId (required),
  status: String, // pending, approved, rejected
  reason: String,
  approvedBy: ObjectId,
  approvedAt: Date,
  createdAt: Date
}
```

#### 10. Organization Requests
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (required),
  userId: ObjectId (required),
  status: String, // pending, approved, rejected
  message: String,
  approvedBy: ObjectId,
  approvedAt: Date,
  createdAt: Date
}
```

#### 11. User Preferences
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, unique),
  theme: String, // light, dark, auto
  primaryColor: String,
  accentColor: String,
  secondaryColor: String,
  language: String,
  timezone: String,
  pinnedModules: [ObjectId],
  dashboardLayout: {
    widgets: [{
      type: String,
      position: { x: Number, y: Number },
      size: { width: Number, height: Number },
      config: Object
    }]
  },
  notifications: {
    email: Boolean,
    push: Boolean,
    sms: Boolean
  },
  updatedAt: Date
}
```

#### 12. Audit Logs
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  organizationId: ObjectId,
  action: String, // create, update, delete, login, logout
  resource: String, // users, roles, organizations, etc.
  resourceId: ObjectId,
  details: Object, // Additional context
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

## Relationships & Indexes

### Primary Relationships
1. **Users ↔ Organizations**: Many-to-Many (via organizationIds array)
2. **Users ↔ Roles**: Many-to-Many (via roleIds array)
3. **Users ↔ Permissions**: Many-to-Many (via permissionIds array)
4. **Roles ↔ Permissions**: Many-to-Many (via permissionIds array)
5. **Organizations ↔ Modules**: Many-to-Many (via activeModuleIds array)
6. **Employees ↔ Departments**: Many-to-One
7. **Projects ↔ Tasks**: One-to-Many
8. **Contacts ↔ Leads**: One-to-Many
9. **Leads ↔ Deals**: One-to-One

### Recommended Indexes
```javascript
// Users Collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "organizationIds": 1 })
db.users.createIndex({ "roleIds": 1 })

// Organizations Collection
db.organizations.createIndex({ "name": 1 })
db.organizations.createIndex({ "isActive": 1 })

// Employees Collection
db.employees.createIndex({ "organizationId": 1, "employeeId": 1 }, { unique: true })
db.employees.createIndex({ "organizationId": 1, "isActive": 1 })

// Attendance Collection
db.attendance.createIndex({ "organizationId": 1, "employeeId": 1, "date": 1 })

// Projects Collection
db.projects.createIndex({ "organizationId": 1, "status": 1 })

// Tasks Collection
db.tasks.createIndex({ "organizationId": 1, "projectId": 1 })
db.tasks.createIndex({ "assignedTo": 1, "status": 1 })

// Audit Logs Collection
db.auditLogs.createIndex({ "userId": 1, "timestamp": -1 })
db.auditLogs.createIndex({ "organizationId": 1, "timestamp": -1 })
```

## Data Migration Scripts

### Initial Setup Script
```javascript
// Create default roles
db.roles.insertMany([
  {
    name: "Super Admin",
    type: "super_admin",
    description: "Full system access",
    permissionIds: [],
    createdAt: new Date()
  },
  {
    name: "Admin",
    type: "admin", 
    description: "Organization admin access",
    permissionIds: [],
    createdAt: new Date()
  },
  {
    name: "Staff",
    type: "staff",
    description: "Basic user access",
    permissionIds: [],
    createdAt: new Date()
  }
]);

// Create default modules
db.modules.insertMany([
  {
    name: "user-management",
    displayName: "User Management",
    description: "Manage users, roles, and permissions",
    icon: "people",
    category: "management",
    version: "1.0.0",
    isActive: true,
    isPremium: false,
    createdAt: new Date()
  },
  {
    name: "hr-management", 
    displayName: "HR Management",
    description: "Human resources management",
    icon: "business",
    category: "management",
    version: "1.0.0",
    isActive: true,
    isPremium: true,
    createdAt: new Date()
  },
  {
    name: "crm",
    displayName: "CRM",
    description: "Customer relationship management",
    icon: "contacts",
    category: "sales",
    version: "1.0.0", 
    isActive: true,
    isPremium: true,
    createdAt: new Date()
  }
]);
```

## Security Considerations

### Data Protection
1. **Password Hashing**: All passwords stored using bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **Role-Based Access**: Hierarchical permission system
4. **Data Isolation**: Organization-level data separation
5. **Audit Trail**: Complete action logging

### Performance Optimization
1. **Indexing Strategy**: Optimized indexes for common queries
2. **Data Aggregation**: Pre-calculated statistics
3. **Caching Layer**: Redis for session and frequently accessed data
4. **Connection Pooling**: Efficient database connections

## Backup & Recovery

### Backup Strategy
```bash
# Daily backup script
mongodump --host localhost:27017 --db bhuri_sap --out /backups/$(date +%Y%m%d)

# Weekly full backup with compression
mongodump --host localhost:27017 --db bhuri_sap --gzip --archive=/backups/weekly/bhuri_sap_$(date +%Y%m%d).gz
```

### Recovery Process
```bash
# Restore from backup
mongorestore --host localhost:27017 --db bhuri_sap /backups/20240101/bhuri_sap

# Restore from compressed archive
mongorestore --host localhost:27017 --db bhuri_sap --gzip --archive=/backups/weekly/bhuri_sap_20240101.gz
```

This blueprint provides a comprehensive foundation for the Bhuri SAP database architecture, ensuring scalability, security, and maintainability.

---
Last updated: 2025-08-17
Current status: Core collections and management collections defined; audit/logging and preferences modeled.
Future work:
- Add indexes/TTL policies for logs and sessions
- Provide sample aggregation pipelines and data validation schemas
Related docs:
- Index: documentation/README.md
- Database setup: documentation/database-setup.md
- Modules seeding: documentation/DATABASE_MODULES_SETUP.md