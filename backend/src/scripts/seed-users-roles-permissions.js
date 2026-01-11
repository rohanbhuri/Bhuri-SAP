const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');

const { getConfig } = require(path.join(__dirname, '../../../config.js'));
const config = getConfig('beax-rm');

async function seedUsersRolesPermissions() {
  console.log('🚀 Starting Users, Roles & Permissions seeding...');

  let uri = config.database?.MONGODB_URI || 'mongodb://localhost:27017/bhuri-sap';
  
  if (uri.includes('?')) {
    uri = uri.replace(/\/[^/?]+\?/, '/racconti?');
  } else {
    uri = uri.substring(0, uri.lastIndexOf('/') + 1) + 'racconti';
  }

  console.log(`Using MongoDB URI (Target: racconti): ${uri.replace(/\/\/.*@/, '//***@')}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    console.log(`✅ Connected to database: ${db.databaseName}`);

    // ============ SEED PERMISSIONS ============
    const permissionsCollection = db.collection('permissions');
    await permissionsCollection.deleteMany({});

    const permissions = [
      // User Management - Racconti only
      { module: 'user-management', action: 'read', resource: 'users', description: 'View users' },
      { module: 'user-management', action: 'create', resource: 'users', description: 'Create users' },
      { module: 'user-management', action: 'update', resource: 'users', description: 'Update users' },
      { module: 'user-management', action: 'delete', resource: 'users', description: 'Delete users' },
      { module: 'user-management', action: 'read', resource: 'roles', description: 'View roles' },
      { module: 'user-management', action: 'create', resource: 'roles', description: 'Create roles' },
      { module: 'user-management', action: 'update', resource: 'roles', description: 'Update roles' },
      { module: 'user-management', action: 'delete', resource: 'roles', description: 'Delete roles' },
      { module: 'user-management', action: 'read', resource: 'permissions', description: 'View permissions' },
      { module: 'user-management', action: 'create', resource: 'permissions', description: 'Create permissions' },
      { module: 'user-management', action: 'update', resource: 'permissions', description: 'Update permissions' },
      { module: 'user-management', action: 'delete', resource: 'permissions', description: 'Delete permissions' },
      { module: 'user-management', action: 'read', resource: 'organizations', description: 'View organizations' },
      { module: 'user-management', action: 'create', resource: 'organizations', description: 'Create organizations' },
      { module: 'user-management', action: 'update', resource: 'organizations', description: 'Update organizations' },
      { module: 'user-management', action: 'read', resource: 'modules', description: 'View modules' },
      
      // CRM - Racconti only
      { module: 'crm', action: 'read', resource: 'organization', description: 'View CRM' },
      { module: 'crm', action: 'create', resource: 'organization', description: 'Create CRM records' },
      { module: 'crm', action: 'update', resource: 'organization', description: 'Update CRM records' },
      { module: 'crm', action: 'delete', resource: 'organization', description: 'Delete CRM records' },
      
      // Client Management - Racconti only
      { module: 'client-management', action: 'read', resource: 'organization', description: 'View clients' },
      { module: 'client-management', action: 'create', resource: 'organization', description: 'Create clients' },
      { module: 'client-management', action: 'update', resource: 'organization', description: 'Update clients' },
      { module: 'client-management', action: 'delete', resource: 'organization', description: 'Delete clients' },
      
      // Reports & Analytics - Racconti only
      { module: 'reports', action: 'read', resource: 'organization', description: 'View reports' },
      { module: 'reports', action: 'create', resource: 'organization', description: 'Create reports' },
      { module: 'reports', action: 'update', resource: 'organization', description: 'Update reports' },
      
      // Catalogue Management - Racconti only
      { module: 'catalogue', action: 'read', resource: 'organization', description: 'View catalogue' },
      { module: 'catalogue', action: 'create', resource: 'organization', description: 'Create catalogue items' },
      { module: 'catalogue', action: 'update', resource: 'organization', description: 'Update catalogue items' },
      { module: 'catalogue', action: 'delete', resource: 'organization', description: 'Delete catalogue items' },
      
      // CMS Management - Racconti only
      { module: 'cms', action: 'read', resource: 'organization', description: 'View CMS' },
      { module: 'cms', action: 'create', resource: 'organization', description: 'Create CMS content' },
      { module: 'cms', action: 'update', resource: 'organization', description: 'Update CMS content' },
      { module: 'cms', action: 'delete', resource: 'organization', description: 'Delete CMS content' },
      
      // Quotations - Racconti only
      { module: 'quotations', action: 'read', resource: 'organization', description: 'View quotations' },
      { module: 'quotations', action: 'create', resource: 'organization', description: 'Create quotations' },
      { module: 'quotations', action: 'update', resource: 'organization', description: 'Update quotations' },
      { module: 'quotations', action: 'delete', resource: 'organization', description: 'Delete quotations' },
      
      // Dashboard
      { module: 'dashboard', action: 'read', resource: 'organization', description: 'View dashboard' }
    ];

    const insertedPerms = await permissionsCollection.insertMany(permissions);
    const permMap = {};
    permissions.forEach((p, i) => {
      permMap[`${p.module}:${p.action}:${p.resource}`] = insertedPerms.insertedIds[i];
    });
    console.log(`📋 Seeded ${permissions.length} permissions`);

    // ============ SEED ROLES ============
    const rolesCollection = db.collection('roles');
    await rolesCollection.deleteMany({});

    const roles = [
      {
        name: 'Super Admin',
        description: 'Full system access - Racconti modules only',
        type: 'super_admin',
        hierarchyLevel: 4,
        permissionIds: Object.values(permMap)
      },
      {
        name: 'Admin',
        description: 'Administrative access - Racconti modules only',
        type: 'admin',
        hierarchyLevel: 3,
        permissionIds: Object.entries(permMap)
          .filter(([key]) => !key.includes('delete'))
          .map(([, id]) => id)
      },
      {
        name: 'HR Manager',
        description: 'Manage HR operations',
        type: 'staff',
        hierarchyLevel: 2,
        permissionIds: [
          'crm:read:organization', 'crm:create:organization', 'crm:update:organization',
          'client-management:read:organization', 'client-management:create:organization', 'client-management:update:organization',
          'reports:read:organization', 'reports:create:organization',
          'dashboard:read:organization'
        ].map(key => permMap[key]).filter(Boolean)
      },
      {
        name: 'Manager',
        description: 'Manage operations and staff',
        type: 'staff',
        hierarchyLevel: 2,
        permissionIds: [
          'crm:read:organization', 'crm:create:organization', 'crm:update:organization',
          'client-management:read:organization', 'client-management:create:organization', 'client-management:update:organization',
          'reports:read:organization', 'reports:create:organization',
          'catalogue:read:organization', 'quotations:read:organization', 'quotations:create:organization',
          'dashboard:read:organization'
        ].map(key => permMap[key]).filter(Boolean)
      },
      {
        name: 'Staff',
        description: 'Standard staff access',
        type: 'staff',
        hierarchyLevel: 1,
        permissionIds: [
          'crm:read:organization', 'crm:create:organization', 'crm:update:organization',
          'client-management:read:organization', 'client-management:create:organization',
          'catalogue:read:organization', 'quotations:read:organization',
          'dashboard:read:organization'
        ].map(key => permMap[key]).filter(Boolean)
      },
      {
        name: 'Employee',
        description: 'Basic employee access',
        type: 'staff',
        hierarchyLevel: 0,
        permissionIds: [
          'crm:read:organization',
          'client-management:read:organization',
          'catalogue:read:organization', 'quotations:read:organization',
          'dashboard:read:organization'
        ].map(key => permMap[key]).filter(Boolean)
      }
    ];

    const insertedRoles = await rolesCollection.insertMany(roles);
    console.log(`👥 Seeded ${roles.length} roles`);

    // ============ SEED USERS ============
    const usersCollection = db.collection('users');
    const organizationsCollection = db.collection('organizations');
    
    const orgs = await organizationsCollection.find({}).toArray();
    if (orgs.length === 0) {
      console.log('⚠️ No organizations found. Skipping user seeding.');
    } else {
      const org = orgs[0];
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const superAdminRole = insertedRoles.insertedIds[0];
      const adminRole = insertedRoles.insertedIds[1];
      const hrManagerRole = insertedRoles.insertedIds[2];
      const managerRole = insertedRoles.insertedIds[3];
      const staffRole = insertedRoles.insertedIds[4];
      const employeeRole = insertedRoles.insertedIds[5];

      const users = [
        {
          email: 'superadmin@racconti.in',
          password: hashedPassword,
          firstName: 'Super',
          lastName: 'Admin',
          isActive: true,
          organizationIds: [org._id],
          organizationId: org._id,
          roleIds: [superAdminRole],
          permissionIds: [],
          activeModuleIds: [],
          forcePasswordChange: true,
          requireTwoFactor: true,
          createdAt: new Date()
        },
        {
          email: 'admin@racconti.in',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          isActive: true,
          organizationIds: [org._id],
          organizationId: org._id,
          roleIds: [adminRole],
          permissionIds: [],
          activeModuleIds: [],
          forcePasswordChange: true,
          requireTwoFactor: true,
          createdAt: new Date()
        },
        {
          email: 'hr@racconti.in',
          password: hashedPassword,
          firstName: 'HR',
          lastName: 'Manager',
          isActive: true,
          organizationIds: [org._id],
          organizationId: org._id,
          roleIds: [hrManagerRole],
          permissionIds: [],
          activeModuleIds: [],
          forcePasswordChange: true,
          createdAt: new Date()
        },
        {
          email: 'manager@racconti.in',
          password: hashedPassword,
          firstName: 'Operations',
          lastName: 'Manager',
          isActive: true,
          organizationIds: [org._id],
          organizationId: org._id,
          roleIds: [managerRole],
          permissionIds: [],
          activeModuleIds: [],
          forcePasswordChange: true,
          createdAt: new Date()
        },
        {
          email: 'staff@racconti.in',
          password: hashedPassword,
          firstName: 'Staff',
          lastName: 'Member',
          isActive: true,
          organizationIds: [org._id],
          organizationId: org._id,
          roleIds: [staffRole],
          permissionIds: [],
          activeModuleIds: [],
          createdAt: new Date()
        },
        {
          email: 'employee@racconti.in',
          password: hashedPassword,
          firstName: 'Employee',
          lastName: 'User',
          isActive: true,
          organizationIds: [org._id],
          organizationId: org._id,
          roleIds: [employeeRole],
          permissionIds: [],
          activeModuleIds: [],
          createdAt: new Date()
        }
      ];
      
      await usersCollection.insertMany(users);
      console.log(`👤 Seeded ${users.length} users with roles`);
    }

    console.log('🎉 Users, Roles & Permissions seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seedUsersRolesPermissions();
