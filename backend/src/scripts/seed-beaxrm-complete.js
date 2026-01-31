const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');

const { getConfig } = require(path.join(__dirname, '../../../config.js'));
const config = getConfig('beaxrm');

async function seedBeaxRMComplete() {
  console.log('🚀 Starting BeaX RM Complete seeding...');

  const uri = config.database?.MONGODB_URI || 'mongodb://localhost:27017/beaxrm';
  console.log(`Using MongoDB URI (Target: beaxrm): ${uri.replace(/\/\/.*@/, '//***@')}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    console.log(`✅ Connected to database: ${db.databaseName}`);

    // ============ CLEAR EXISTING DATA ============
    const collections = [
      'users', 'organizations', 'roles', 'permissions', 'modules', 'departments',
      'projects', 'contacts', 'leads', 'deals', 'tasks', 'employees', 'conversations',
      'messages', 'attendance', 'leaverequests', 'goals', 'payrollruns',
      'complianceitems', 'complianceevents', 'documentrecords', 'assets',
      'user-preferences', 'invoices', 'orders', 'budgets'
    ];

    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).deleteMany({});
        console.log(`🗑️ Cleared ${collectionName} collection`);
      } catch (error) {
        console.log(`⚠️ Collection ${collectionName} doesn't exist or couldn't be cleared`);
      }
    }

    // ============ SEED ORGANIZATIONS ============
    const organizationsCollection = db.collection('organizations');
    const orgId = new ObjectId();
    const techCorpId = new ObjectId();
    const startupId = new ObjectId();

    const organizations = [
      {
        _id: orgId,
        name: 'Beax Technologies',
        code: 'BEAX',
        description: 'Leading resource management solutions provider',
        isPublic: false,
        memberCount: 1,
        activeModuleIds: [],
        createdAt: new Date()
      },
      {
        _id: techCorpId,
        name: 'TechCorp Solutions',
        code: 'TECH',
        description: 'Enterprise software solutions',
        isPublic: true,
        memberCount: 1,
        activeModuleIds: [],
        createdAt: new Date()
      },
      {
        _id: startupId,
        name: 'StartupHub Inc',
        code: 'STARTUP',
        description: 'Innovative startup solutions',
        isPublic: true,
        memberCount: 1,
        activeModuleIds: [],
        createdAt: new Date()
      }
    ];

    await organizationsCollection.insertMany(organizations);
    console.log(`🏢 Seeded ${organizations.length} organizations`);

    // ============ SEED PERMISSIONS ============
    const permissionsCollection = db.collection('permissions');
    const permissions = [
      // Core System Permissions
      { name: 'user:read', description: 'View users', module: 'user-management', action: 'read', resource: 'users' },
      { name: 'user:create', description: 'Create users', module: 'user-management', action: 'create', resource: 'users' },
      { name: 'user:update', description: 'Update users', module: 'user-management', action: 'update', resource: 'users' },
      { name: 'user:delete', description: 'Delete users', module: 'user-management', action: 'delete', resource: 'users' },
      { name: 'organization:read', description: 'View organizations', module: 'organization-management', action: 'read', resource: 'organizations' },
      { name: 'organization:create', description: 'Create organizations', module: 'organization-management', action: 'create', resource: 'organizations' },
      { name: 'organization:update', description: 'Update organizations', module: 'organization-management', action: 'update', resource: 'organizations' },
      { name: 'organization:delete', description: 'Delete organizations', module: 'organization-management', action: 'delete', resource: 'organizations' },

      // Project Management Permissions
      { name: 'project:read', description: 'View projects', module: 'projects-management', action: 'read', resource: 'projects' },
      { name: 'project:create', description: 'Create projects', module: 'projects-management', action: 'create', resource: 'projects' },
      { name: 'project:update', description: 'Update projects', module: 'projects-management', action: 'update', resource: 'projects' },
      { name: 'project:delete', description: 'Delete projects', module: 'projects-management', action: 'delete', resource: 'projects' },
      { name: 'project:track', description: 'Track project progress', module: 'project-tracking', action: 'read', resource: 'projects' },
      { name: 'timesheet:read', description: 'View timesheets', module: 'project-timesheet', action: 'read', resource: 'timesheets' },
      { name: 'timesheet:create', description: 'Create timesheets', module: 'project-timesheet', action: 'create', resource: 'timesheets' },
      { name: 'timesheet:update', description: 'Update timesheets', module: 'project-timesheet', action: 'update', resource: 'timesheets' },

      // CRM Permissions
      { name: 'crm:read', description: 'View CRM data', module: 'crm', action: 'read', resource: 'crm' },
      { name: 'crm:create', description: 'Create CRM records', module: 'crm', action: 'create', resource: 'crm' },
      { name: 'crm:update', description: 'Update CRM records', module: 'crm', action: 'update', resource: 'crm' },
      { name: 'crm:delete', description: 'Delete CRM records', module: 'crm', action: 'delete', resource: 'crm' },

      // HR Management Permissions
      { name: 'hr:read', description: 'View HR data', module: 'hr-management', action: 'read', resource: 'hr' },
      { name: 'hr:create', description: 'Create HR records', module: 'hr-management', action: 'create', resource: 'hr' },
      { name: 'hr:update', description: 'Update HR records', module: 'hr-management', action: 'update', resource: 'hr' },
      { name: 'hr:delete', description: 'Delete HR records', module: 'hr-management', action: 'delete', resource: 'hr' },

      // Finance Permissions
      { name: 'finance:read', description: 'View financial data', module: 'finance', action: 'read', resource: 'finance' },
      { name: 'finance:create', description: 'Create financial records', module: 'finance', action: 'create', resource: 'finance' },
      { name: 'finance:update', description: 'Update financial records', module: 'finance', action: 'update', resource: 'finance' },
      { name: 'finance:delete', description: 'Delete financial records', module: 'finance', action: 'delete', resource: 'finance' },

      // Order Management Permissions
      { name: 'order:read', description: 'View orders', module: 'order-management', action: 'read', resource: 'orders' },
      { name: 'order:create', description: 'Create orders', module: 'order-management', action: 'create', resource: 'orders' },
      { name: 'order:update', description: 'Update orders', module: 'order-management', action: 'update', resource: 'orders' },
      { name: 'order:delete', description: 'Delete orders', module: 'order-management', action: 'delete', resource: 'orders' },

      // Dashboard Permission
      { name: 'dashboard:read', description: 'View dashboard', module: 'dashboard', action: 'read', resource: 'dashboard' }
    ];

    const insertedPerms = await permissionsCollection.insertMany(permissions);
    const permMap = {};
    permissions.forEach((p, i) => {
      permMap[p.name] = insertedPerms.insertedIds[i];
    });
    console.log(`📋 Seeded ${permissions.length} permissions`);

    // ============ SEED ROLES ============
    const rolesCollection = db.collection('roles');
    const roles = [
      {
        name: 'Super Admin',
        description: 'Full system access for BeaX RM',
        type: 'super_admin',
        hierarchyLevel: 4,
        permissionIds: Object.values(permMap)
      },
      {
        name: 'Admin',
        description: 'Administrative access for BeaX RM',
        type: 'admin',
        hierarchyLevel: 3,
        permissionIds: Object.entries(permMap)
          .filter(([key]) => !key.includes('delete'))
          .map(([, id]) => id)
      },
      {
        name: 'Project Manager',
        description: 'Manage projects and resources',
        type: 'admin',
        hierarchyLevel: 3,
        permissionIds: [
          permMap['project:read'], permMap['project:create'], permMap['project:update'],
          permMap['project:track'], permMap['timesheet:read'], permMap['timesheet:create'], permMap['timesheet:update'],
          permMap['crm:read'], permMap['crm:create'], permMap['crm:update'],
          permMap['hr:read'], permMap['finance:read'], permMap['order:read'], permMap['dashboard:read']
        ].filter(Boolean)
      },
      {
        name: 'HR Manager',
        description: 'Manage HR operations',
        type: 'admin',
        hierarchyLevel: 3,
        permissionIds: [
          permMap['hr:read'], permMap['hr:create'], permMap['hr:update'], permMap['hr:delete'],
          permMap['user:read'], permMap['user:create'], permMap['user:update'],
          permMap['dashboard:read']
        ].filter(Boolean)
      },
      {
        name: 'Team Lead',
        description: 'Lead project teams',
        type: 'staff',
        hierarchyLevel: 2,
        permissionIds: [
          permMap['project:read'], permMap['project:update'], permMap['project:track'],
          permMap['timesheet:read'], permMap['timesheet:create'], permMap['timesheet:update'],
          permMap['crm:read'], permMap['crm:create'], permMap['crm:update'],
          permMap['dashboard:read']
        ].filter(Boolean)
      },
      {
        name: 'Developer',
        description: 'Work on assigned projects',
        type: 'staff',
        hierarchyLevel: 1,
        permissionIds: [
          permMap['project:read'], permMap['project:track'],
          permMap['timesheet:read'], permMap['timesheet:create'], permMap['timesheet:update'],
          permMap['dashboard:read']
        ].filter(Boolean)
      },
      {
        name: 'Resource Manager',
        description: 'Manage resources and assignments',
        type: 'staff',
        hierarchyLevel: 2,
        permissionIds: [
          permMap['project:read'], permMap['project:create'], permMap['project:update'],
          permMap['hr:read'], permMap['hr:create'], permMap['hr:update'],
          permMap['dashboard:read']
        ].filter(Boolean)
      },
      {
        name: 'Client',
        description: 'View project progress',
        type: 'custom',
        hierarchyLevel: 0,
        permissionIds: [
          permMap['project:read'], permMap['dashboard:read']
        ].filter(Boolean)
      }
    ];

    const insertedRoles = await rolesCollection.insertMany(roles);
    console.log(`👥 Seeded ${roles.length} roles`);

    // ============ SEED MODULES ============
    const modulesCollection = db.collection('modules');
    const modules = [
      // Core Modules - using exact names from module-registry.ts
      { _id: new ObjectId(), name: 'user-management', displayName: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, icon: 'people', route: '/modules/user-management', category: 'Core', permissionType: 'super_admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'organization-management', displayName: 'Organization Management', description: 'Manage organizations and membership requests', isActive: true, icon: 'business', route: '/modules/organization-management', category: 'Core', permissionType: 'super_admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'my-organizations', displayName: 'My Organizations', description: 'View and join public organizations', isActive: true, icon: 'groups', route: '/modules/my-organizations', category: 'Core', permissionType: 'public', createdAt: new Date() },

      // Project Management
      { _id: new ObjectId(), name: 'projects-management', displayName: 'Projects Management', description: 'Manage projects and deliverables', isActive: true, icon: 'work', route: '/modules/projects-management', category: 'Project', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'project-tracking', displayName: 'Project Tracking', description: 'Track project progress and milestones', isActive: true, icon: 'track_changes', route: '/modules/project-tracking', category: 'Project', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'project-timesheet', displayName: 'Project Timesheet', description: 'Track time spent on projects', isActive: true, icon: 'schedule', route: '/modules/project-timesheet', category: 'Project', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'tasks-management', displayName: 'Tasks Management', description: 'Manage tasks and assignments', isActive: false, icon: 'task', route: '/modules/tasks-management', category: 'Project', permissionType: 'admin', createdAt: new Date() },

      // CRM & Sales
      { _id: new ObjectId(), name: 'crm', displayName: 'CRM', description: 'Customer relationship management', isActive: true, icon: 'business_center', route: '/modules/crm', category: 'Sales', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'leads-management', displayName: 'Leads Management', description: 'Manage sales leads and prospects', isActive: false, icon: 'person_add', route: '/modules/leads-management', category: 'Sales', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'sales-management', displayName: 'Sales Management', description: 'Manage sales processes and pipeline', isActive: false, icon: 'trending_up', route: '/modules/sales-management', category: 'Sales', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'deal-management', displayName: 'Deal Management', description: 'Manage deals and opportunities', isActive: false, icon: 'handshake', route: '/modules/deal-management', category: 'Sales', permissionType: 'admin', createdAt: new Date() },

      // HR Modules
      { _id: new ObjectId(), name: 'hr-management', displayName: 'HR Management', description: 'Human resources management', isActive: true, icon: 'people', route: '/modules/hr-management', category: 'HR', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'staff-management', displayName: 'Staff Management', description: 'Manage staff records and information', isActive: false, icon: 'badge', route: '/modules/staff-management', category: 'HR', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'payroll-management', displayName: 'Payroll Management', description: 'Manage employee payroll and compensation', isActive: false, icon: 'payments', route: '/modules/payroll-management', category: 'HR', permissionType: 'admin', createdAt: new Date() },

      // Finance & Operations
      { _id: new ObjectId(), name: 'finance', displayName: 'Finance Management', description: 'Manage invoices, receipts, and payments', isActive: true, icon: 'account_balance_wallet', route: '/modules/finance', category: 'Finance', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'order-management', displayName: 'Order Management', description: 'Manage orders, track status, and monitor fulfillment', isActive: true, icon: 'shopping_cart', route: '/modules/order-management', category: 'Operations', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'inventory-management', displayName: 'Inventory Management', description: 'Manage inventory and stock levels', isActive: false, icon: 'inventory', route: '/modules/inventory-management', category: 'Operations', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'budget-planner', displayName: 'Budget Planner', description: 'Plan and manage budgets', isActive: false, icon: 'account_balance', route: '/modules/budget-planner', category: 'Finance', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'contract-module', displayName: 'Contract Management', description: 'Manage contracts and agreements', isActive: false, icon: 'description', route: '/modules/contract-module', category: 'Finance', permissionType: 'admin', createdAt: new Date() }
    ];

    await modulesCollection.insertMany(modules);
    const moduleIds = modules.map(m => m._id);
    console.log(`🧩 Seeded ${modules.length} modules`);

    // ============ SEED USERS ============
    const usersCollection = db.collection('users');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const roleIds = Object.values(insertedRoles.insertedIds);
    const superAdminRole = roleIds[0];
    const adminRole = roleIds[1];
    const projectManagerRole = roleIds[2];
    const hrManagerRole = roleIds[3];
    const teamLeadRole = roleIds[4];
    const developerRole = roleIds[5];
    const resourceManagerRole = roleIds[6];
    const clientRole = roleIds[7];

    const users = [
      {
        _id: new ObjectId(),
        email: 'superadmin@beaxrm.in',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [superAdminRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: true,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'admin@beaxrm.in',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [adminRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: true,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'pm@beaxrm.in',
        password: hashedPassword,
        firstName: 'Project',
        lastName: 'Manager',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [projectManagerRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'hr@beaxrm.in',
        password: hashedPassword,
        firstName: 'HR',
        lastName: 'Manager',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [hrManagerRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'lead@beaxrm.in',
        password: hashedPassword,
        firstName: 'Team',
        lastName: 'Lead',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [teamLeadRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'dev1@beaxrm.in',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Developer',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [developerRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'dev2@beaxrm.in',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Developer',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [developerRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'resource@beaxrm.in',
        password: hashedPassword,
        firstName: 'Resource',
        lastName: 'Manager',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [resourceManagerRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'client@beaxrm.in',
        password: hashedPassword,
        firstName: 'Client',
        lastName: 'User',
        avatar: null,
        currency: 'INR',
        currencySymbol: '₹',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [clientRole],
        activeModuleIds: moduleIds,
        isOnline: false,
        lastSeen: null,
        forcePasswordChange: false,
        requireTwoFactor: false,
        sessionTimeout: null,
        restrictToBusinessHours: false,
        allowApiAccess: false,
        expiryDate: null,
        ipWhitelist: null,
        maxDevices: null,
        activeDevices: [],
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        changeLog: [],
        enableEmailNotifications: true,
        createdAt: new Date()
      }
    ];

    await usersCollection.insertMany(users);
    console.log(`👤 Seeded ${users.length} users with roles`);

    // ============ SEED DEPARTMENTS ============
    const departmentsCollection = db.collection('departments');
    const departments = [
      { _id: new ObjectId(), name: 'Engineering', description: 'Software development team', code: 'ENG', isActive: true, organizationId: orgId, createdAt: new Date() },
      { _id: new ObjectId(), name: 'Product Management', description: 'Product strategy and management', code: 'PM', isActive: true, organizationId: orgId, createdAt: new Date() },
      { _id: new ObjectId(), name: 'Sales', description: 'Sales and business development', code: 'SALES', isActive: true, organizationId: orgId, createdAt: new Date() },
      { _id: new ObjectId(), name: 'Marketing', description: 'Marketing and communications', code: 'MKT', isActive: true, organizationId: orgId, createdAt: new Date() },
      { _id: new ObjectId(), name: 'Human Resources', description: 'HR and people operations', code: 'HR', isActive: true, organizationId: orgId, createdAt: new Date() },
      { _id: new ObjectId(), name: 'Finance', description: 'Financial operations and accounting', code: 'FIN', isActive: true, organizationId: orgId, createdAt: new Date() }
    ];

    await departmentsCollection.insertMany(departments);
    console.log(`🏛️ Seeded ${departments.length} departments`);

    // ============ SEED PROJECTS ============
    const projectsCollection = db.collection('projects');
    const projects = [
      {
        _id: new ObjectId(),
        organizationId: orgId,
        createdBy: users[0]._id,
        name: 'BeaX RM Platform Development',
        description: 'Complete development of the BeaX Resource Management platform',
        code: 'PRJ-BEAX-001',
        status: 'active',
        stage: 'execution',
        priority: 'high',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        budget: 500000,
        currency: 'INR',
        spent: 150000,
        billingType: 'fixed',
        managerId: users[2]._id, // Project Manager
        clientId: users[8]._id, // Client
        teamMemberIds: [users[4]._id, users[5]._id, users[6]._id], // Team Lead, Developers
        progress: 45,
        health: 'green',
        tags: ['platform', 'development', 'resource-management'],
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        organizationId: orgId,
        createdBy: users[0]._id,
        name: 'Mobile App Development',
        description: 'Native mobile application for BeaX RM',
        code: 'PRJ-BEAX-002',
        status: 'planning',
        stage: 'planning',
        priority: 'medium',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-11-30'),
        budget: 200000,
        currency: 'INR',
        spent: 0,
        billingType: 'fixed',
        managerId: users[2]._id,
        clientId: users[8]._id,
        teamMemberIds: [users[5]._id, users[6]._id],
        progress: 10,
        health: 'yellow',
        tags: ['mobile', 'ios', 'android'],
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        organizationId: orgId,
        createdBy: users[0]._id,
        name: 'Client Portal Integration',
        description: 'Integration of client portal with main platform',
        code: 'PRJ-BEAX-003',
        status: 'completed',
        stage: 'completed',
        priority: 'high',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-31'),
        budget: 100000,
        currency: 'INR',
        spent: 95000,
        billingType: 'fixed',
        managerId: users[2]._id,
        clientId: users[8]._id,
        teamMemberIds: [users[4]._id, users[5]._id],
        progress: 100,
        health: 'green',
        tags: ['integration', 'portal', 'client'],
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await projectsCollection.insertMany(projects);
    console.log(`📁 Seeded ${projects.length} projects`);

    // ============ SEED CONTACTS ============
    const contactsCollection = db.collection('contacts');
    const contacts = [
      {
        _id: new ObjectId(),
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp.com',
        phone: '+91-9876543210',
        company: 'TechCorp Solutions',
        position: 'CEO',
        organizationId: orgId,
        status: 'active',
        notes: 'Key decision maker for enterprise solutions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@startup.com',
        phone: '+91-9876543211',
        company: 'StartupHub Inc',
        position: 'CTO',
        organizationId: orgId,
        status: 'active',
        notes: 'Interested in resource management solutions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        firstName: 'Mike',
        lastName: 'Brown',
        email: 'mike.brown@enterprise.com',
        phone: '+91-9876543212',
        company: 'Enterprise Corp',
        position: 'VP Operations',
        organizationId: orgId,
        status: 'active',
        notes: 'Looking for project management tools',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await contactsCollection.insertMany(contacts);
    console.log(`📞 Seeded ${contacts.length} contacts`);

    // ============ SEED LEADS ============
    const leadsCollection = db.collection('leads');
    const leads = [
      {
        _id: new ObjectId(),
        title: 'Enterprise Resource Management Solution',
        description: 'Large enterprise looking for comprehensive resource management',
        status: 'qualified',
        estimatedValue: 1000000,
        source: 'Website',
        expectedCloseDate: new Date('2024-06-30'),
        contactId: contacts[0]._id,
        organizationId: orgId,
        assignedToId: users[2]._id, // Project Manager
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Startup Project Management Tool',
        description: 'Growing startup needs project management solution',
        status: 'new',
        estimatedValue: 250000,
        source: 'Referral',
        expectedCloseDate: new Date('2024-05-15'),
        contactId: contacts[1]._id,
        organizationId: orgId,
        assignedToId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await leadsCollection.insertMany(leads);
    console.log(`🎯 Seeded ${leads.length} leads`);

    // ============ SEED DEALS ============
    const dealsCollection = db.collection('deals');
    const deals = [
      {
        _id: new ObjectId(),
        title: 'BeaX RM Enterprise License',
        description: 'Enterprise license for BeaX Resource Management platform',
        value: 750000,
        stage: 'proposal',
        probability: 75,
        expectedCloseDate: new Date('2024-07-31'),
        actualCloseDate: null,
        contactId: contacts[0]._id,
        leadId: leads[0]._id,
        organizationId: orgId,
        assignedToId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Project Management Suite',
        description: 'Complete project management solution for startup',
        value: 180000,
        stage: 'negotiation',
        probability: 60,
        expectedCloseDate: new Date('2024-06-15'),
        actualCloseDate: null,
        contactId: contacts[1]._id,
        leadId: leads[1]._id,
        organizationId: orgId,
        assignedToId: users[2]._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await dealsCollection.insertMany(deals);
    console.log(`🤝 Seeded ${deals.length} deals`);

    // ============ SEED TASKS ============
    const tasksCollection = db.collection('tasks');
    const tasks = [
      {
        _id: new ObjectId(),
        title: 'Backend API Development',
        description: 'Develop REST APIs for project management module',
        status: 'in-progress',
        priority: 'high',
        type: 'project',
        projectId: projects[0]._id,
        assigneeId: users[5]._id, // Developer
        organizationId: orgId,
        dueDate: new Date('2024-03-15'),
        estimatedHours: 40,
        actualHours: 25,
        tags: ['backend', 'api', 'development'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Frontend UI Implementation',
        description: 'Implement user interface for project dashboard',
        status: 'todo',
        priority: 'medium',
        type: 'project',
        projectId: projects[0]._id,
        assigneeId: users[6]._id, // Developer
        organizationId: orgId,
        dueDate: new Date('2024-03-20'),
        estimatedHours: 32,
        actualHours: 0,
        tags: ['frontend', 'ui', 'dashboard'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Follow up with Enterprise Client',
        description: 'Schedule follow-up call with TechCorp CEO',
        status: 'pending',
        priority: 'high',
        type: 'crm',
        dealId: deals[0]._id,
        contactId: contacts[0]._id,
        organizationId: orgId,
        assignedToId: users[2]._id, // Project Manager
        dueDate: new Date('2024-02-10'),
        reminderDate: new Date('2024-02-09'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await tasksCollection.insertMany(tasks);
    console.log(`✅ Seeded ${tasks.length} tasks`);

    // ============ SEED EMPLOYEES ============
    const employeesCollection = db.collection('employees');
    const employees = [
      {
        _id: new ObjectId(),
        employeeId: 'EMP001',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@beax.com',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        salary: 120000,
        status: 'active',
        hireDate: new Date('2023-01-15'),
        organizationId: orgId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        employeeId: 'EMP002',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@beax.com',
        position: 'Product Manager',
        department: 'Product Management',
        salary: 140000,
        status: 'active',
        hireDate: new Date('2023-02-01'),
        organizationId: orgId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        employeeId: 'EMP003',
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol.davis@beax.com',
        position: 'UX Designer',
        department: 'Engineering',
        salary: 100000,
        status: 'active',
        hireDate: new Date('2023-03-10'),
        organizationId: orgId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await employeesCollection.insertMany(employees);
    console.log(`👥 Seeded ${employees.length} employees`);

    // ============ SEED USER PREFERENCES ============
    const preferencesCollection = db.collection('user-preferences');
    const preferences = [
      {
        _id: new ObjectId(),
        userId: users[0]._id.toString(),
        theme: 'light',
        primaryColor: '#3B82F6',
        accentColor: '#F59E0B',
        secondaryColor: '#6B7280',
        currency: 'INR',
        currencySymbol: '₹',
        pinnedModules: ['projects-management', 'crm', 'hr-management'],
        dashboardPreferences: {
          showProjectStats: true,
          showRecentTasks: true,
          showTeamActivity: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        userId: users[1]._id.toString(),
        theme: 'light',
        primaryColor: '#3B82F6',
        accentColor: '#F59E0B',
        secondaryColor: '#6B7280',
        currency: 'INR',
        currencySymbol: '₹',
        pinnedModules: ['projects-management', 'finance', 'order-management'],
        dashboardPreferences: {
          showProjectStats: true,
          showFinancialSummary: true,
          showOrderStatus: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await preferencesCollection.insertMany(preferences);
    console.log(`⚙️ Seeded ${preferences.length} user preferences`);

    // ============ UPDATE ORGANIZATIONS WITH MODULES ============
    await organizationsCollection.updateMany(
      {},
      { $set: { activeModuleIds: moduleIds } }
    );
    console.log(`🔓 Updated organizations with ${modules.length} active modules`);

    // ============ SEED SAMPLE MESSAGES ============
    const conversationsCollection = db.collection('conversations');
    const messagesCollection = db.collection('messages');

    const conversationId = new ObjectId();
    const conversations = [
      {
        _id: conversationId,
        organizationId: orgId,
        type: 'dm',
        memberIds: [users[0]._id, users[2]._id], // Super Admin and Project Manager
        lastMessagePreview: [{
          senderId: users[2]._id,
          content: 'The project is progressing well. We should be on track for the deadline.',
          at: new Date()
        }],
        createdAt: new Date()
      }
    ];

    const messages = [
      {
        _id: new ObjectId(),
        conversationId: conversationId,
        organizationId: orgId,
        senderId: users[0]._id,
        content: 'How is the BeaX RM platform development going?',
        readBy: [users[0]._id],
        reactions: [],
        createdAt: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        _id: new ObjectId(),
        conversationId: conversationId,
        organizationId: orgId,
        senderId: users[2]._id,
        content: 'The project is progressing well. We should be on track for the deadline.',
        readBy: [users[2]._id],
        reactions: [],
        createdAt: new Date()
      }
    ];

    await conversationsCollection.insertMany(conversations);
    await messagesCollection.insertMany(messages);
    console.log(`💬 Seeded ${conversations.length} conversations and ${messages.length} messages`);

    console.log('🎉 BeaX RM Complete seeding finished successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('🔐 Super Admin: superadmin@beaxrm.in / password123');
    console.log('🔐 Admin: admin@beaxrm.in / password123');
    console.log('🔐 Project Manager: pm@beaxrm.in / password123');
    console.log('🔐 HR Manager: hr@beaxrm.in / password123');
    console.log('🔐 Team Lead: lead@beaxrm.in / password123');
    console.log('🔐 Developer 1: dev1@beaxrm.in / password123');
    console.log('🔐 Developer 2: dev2@beaxrm.in / password123');
    console.log('🔐 Resource Manager: resource@beaxrm.in / password123');
    console.log('🔐 Client: client@beaxrm.in / password123');
    console.log('');
    console.log('🚀 Start BeaX RM: npm run start:beaxrm');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.close();
  }
}

// Run the seeder
if (require.main === module) {
  seedBeaxRMComplete().catch(console.error);
}

module.exports = { seedBeaxRMComplete };