const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');

const { getConfig } = require(path.join(__dirname, '../../../config.js'));
const config = getConfig('schoolOS');

async function seedSchoolOSComplete() {
  console.log('🚀 Starting SchoolOS Complete seeding...');

  let uri = config.database?.MONGODB_URI || 'mongodb://localhost:27017/schoolos';

  // Handle URI with query parameters
  if (uri.includes('?')) {
    uri = uri.replace(/\/[^/?]+\?/, '/schoolOS?');
  } else {
    uri = uri.substring(0, uri.lastIndexOf('/') + 1) + 'schoolOS';
  }

  console.log(`Using MongoDB URI (Target: schoolos): ${uri.replace(/\/\/.*@/, '//***@')}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    console.log(`✅ Connected to database: ${db.databaseName}`);

    // ============ SEED ORGANIZATIONS ============
    const organizationsCollection = db.collection('organizations');
    await organizationsCollection.deleteMany({});

    const edushaId = new ObjectId();
    const orionId = new ObjectId();
    const shriAnandId = new ObjectId();
    const brightFutureId = new ObjectId();

    const organizations = [
      {
        _id: edushaId,
        name: 'Edusha University',
        code: 'EDUSHA',
        description: 'Leading educational institution for higher learning',
        isPublic: false,
        memberCount: 1,
        createdAt: new Date()
      },
      {
        _id: orionId,
        name: 'Orion Schools',
        code: 'ORION',
        description: 'Excellence in K-12 education',
        isPublic: false,
        memberCount: 1,
        createdAt: new Date()
      },
      {
        _id: shriAnandId,
        name: 'Shri Anand School',
        code: 'SHRIANAND',
        description: 'Traditional values, modern education',
        isPublic: false,
        memberCount: 1,
        createdAt: new Date()
      },
      {
        _id: brightFutureId,
        name: 'Bright Future Academy',
        code: 'BRIGHTFUTURE',
        description: 'Nurturing young minds for tomorrow',
        isPublic: false,
        memberCount: 1,
        createdAt: new Date()
      }
    ];

    await organizationsCollection.insertMany(organizations);
    console.log(`🏢 Seeded ${organizations.length} school organizations`);

    // ============ SEED PERMISSIONS ============
    const permissionsCollection = db.collection('permissions');
    await permissionsCollection.deleteMany({});

    const permissions = [
      // User Management
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

      // CRM (Admissions & Parent Relations)
      { module: 'crm', action: 'read', resource: 'organization', description: 'View CRM' },
      { module: 'crm', action: 'create', resource: 'organization', description: 'Create CRM records' },
      { module: 'crm', action: 'update', resource: 'organization', description: 'Update CRM records' },
      { module: 'crm', action: 'delete', resource: 'organization', description: 'Delete CRM records' },

      // CMS (School Website & Announcements)
      { module: 'cms', action: 'read', resource: 'organization', description: 'View CMS' },
      { module: 'cms', action: 'create', resource: 'organization', description: 'Create CMS content' },
      { module: 'cms', action: 'update', resource: 'organization', description: 'Update CMS content' },
      { module: 'cms', action: 'delete', resource: 'organization', description: 'Delete CMS content' },

      // HR Management (Staff Management)
      { module: 'hr-management', action: 'read', resource: 'organization', description: 'View HR data' },
      { module: 'hr-management', action: 'create', resource: 'organization', description: 'Create HR records' },
      { module: 'hr-management', action: 'update', resource: 'organization', description: 'Update HR records' },
      { module: 'hr-management', action: 'delete', resource: 'organization', description: 'Delete HR records' },

      // Student Management
      { module: 'student-management', action: 'read', resource: 'organization', description: 'View students' },
      { module: 'student-management', action: 'create', resource: 'organization', description: 'Create student records' },
      { module: 'student-management', action: 'update', resource: 'organization', description: 'Update student records' },
      { module: 'student-management', action: 'delete', resource: 'organization', description: 'Delete student records' },

      // Attendance Management
      { module: 'attendance', action: 'read', resource: 'organization', description: 'View attendance' },
      { module: 'attendance', action: 'create', resource: 'organization', description: 'Mark attendance' },
      { module: 'attendance', action: 'update', resource: 'organization', description: 'Update attendance' },
      { module: 'attendance', action: 'delete', resource: 'organization', description: 'Delete attendance records' },

      // Reports & Analytics
      { module: 'reports', action: 'read', resource: 'organization', description: 'View reports' },
      { module: 'reports', action: 'create', resource: 'organization', description: 'Create reports' },
      { module: 'reports', action: 'update', resource: 'organization', description: 'Update reports' },

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
        description: 'Full system access - All modules',
        type: 'super_admin',
        hierarchyLevel: 5,
        permissionIds: Object.values(permMap)
      },
      {
        name: 'Principal',
        description: 'School Principal - Full administrative access',
        type: 'admin',
        hierarchyLevel: 4,
        permissionIds: Object.entries(permMap)
          .filter(([key]) => !key.includes('user-management:delete') && !key.includes('user-management:create:organizations'))
          .map(([, id]) => id)
      },
      {
        name: 'Vice Principal',
        description: 'Vice Principal - Administrative access',
        type: 'admin',
        hierarchyLevel: 3,
        permissionIds: [
          permMap['user-management:read:users'], permMap['user-management:update:users'],
          permMap['crm:read:organization'], permMap['crm:create:organization'], permMap['crm:update:organization'],
          permMap['cms:read:organization'], permMap['cms:create:organization'], permMap['cms:update:organization'],
          permMap['hr-management:read:organization'], permMap['hr-management:update:organization'],
          permMap['student-management:read:organization'], permMap['student-management:create:organization'], permMap['student-management:update:organization'],
          permMap['attendance:read:organization'], permMap['attendance:create:organization'], permMap['attendance:update:organization'],
          permMap['reports:read:organization'], permMap['reports:create:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Admin',
        description: 'Administrative staff - Manage operations',
        type: 'admin',
        hierarchyLevel: 2,
        permissionIds: [
          permMap['user-management:read:users'],
          permMap['crm:read:organization'], permMap['crm:create:organization'], permMap['crm:update:organization'],
          permMap['cms:read:organization'], permMap['cms:update:organization'],
          permMap['student-management:read:organization'], permMap['student-management:create:organization'], permMap['student-management:update:organization'],
          permMap['attendance:read:organization'], permMap['attendance:create:organization'], permMap['attendance:update:organization'],
          permMap['reports:read:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Teacher',
        description: 'Teaching staff - Manage classes and students',
        type: 'staff',
        hierarchyLevel: 1,
        permissionIds: [
          permMap['student-management:read:organization'], permMap['student-management:update:organization'],
          permMap['attendance:read:organization'], permMap['attendance:create:organization'], permMap['attendance:update:organization'],
          permMap['cms:read:organization'],
          permMap['reports:read:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Student',
        description: 'Student access - View own information',
        type: 'custom',
        hierarchyLevel: 0,
        permissionIds: [
          permMap['cms:read:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Parent',
        description: 'Parent access - View child information',
        type: 'custom',
        hierarchyLevel: 0,
        permissionIds: [
          permMap['student-management:read:organization'],
          permMap['attendance:read:organization'],
          permMap['cms:read:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      }
    ];

    const insertedRoles = await rolesCollection.insertMany(roles);
    console.log(`👥 Seeded ${roles.length} roles`);

    // ============ SEED MODULES ============
    const modulesCollection = db.collection('modules');
    await modulesCollection.deleteMany({});

    const modules = [
      { _id: new ObjectId(), name: 'user-management', displayName: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, icon: 'people', route: '/modules/user-management', category: 'Core', permissionType: 'super_admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'student-management', displayName: 'Student Management', description: 'Manage student records and information', isActive: true, icon: 'school', route: '/modules/student-management', category: 'Academic', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'crm', displayName: 'Admissions & Relations', description: 'Manage admissions and parent relations', isActive: true, icon: 'business_center', route: '/modules/crm', category: 'Operations', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'cms', displayName: 'CMS Management', description: 'Manage school website and announcements', isActive: true, icon: 'article', route: '/modules/cms', category: 'Content', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'hr-management', displayName: 'Staff Management', description: 'Manage teaching and non-teaching staff', isActive: true, icon: 'badge', route: '/modules/hr-management', category: 'HR', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'attendance', displayName: 'Attendance Management', description: 'Track student and staff attendance', isActive: true, icon: 'event_available', route: '/modules/attendance', category: 'Academic', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'reports-management', displayName: 'Reports & Analytics', description: 'Generate academic and administrative reports', isActive: true, icon: 'assessment', route: '/modules/reports-management', category: 'Analytics', permissionType: 'admin', createdAt: new Date() }
    ];

    await modulesCollection.insertMany(modules);
    console.log(`🧩 Seeded ${modules.length} modules`);

    // ============ SEED USERS ============
    const usersCollection = db.collection('users');
    await usersCollection.deleteMany({});

    const hashedPassword = await bcrypt.hash('school123', 10);

    const roleIds = Object.values(insertedRoles.insertedIds);
    const superAdminRole = roleIds[0];
    const principalRole = roleIds[1];
    const vicePrincipalRole = roleIds[2];
    const adminRole = roleIds[3];
    const teacherRole = roleIds[4];
    const studentRole = roleIds[5];
    const parentRole = roleIds[6];

    const moduleIds = modules.map(m => m._id);

    const users = [];

    // Edusha University Users
    users.push(
      {
        email: 'admin@edusha.in',
        password: hashedPassword,
        firstName: 'Edusha',
        lastName: 'Admin',
        isActive: true,
        organizationIds: [edushaId],
        organizationId: edushaId,
        roleIds: [superAdminRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        requireTwoFactor: false,
        allowApiAccess: true,
        createdAt: new Date()
      },
      {
        email: 'principal@edusha.in',
        password: hashedPassword,
        firstName: 'Dr. Rajesh',
        lastName: 'Kumar',
        isActive: true,
        organizationIds: [edushaId],
        organizationId: edushaId,
        roleIds: [principalRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'viceprincipal@edusha.in',
        password: hashedPassword,
        firstName: 'Prof. Meera',
        lastName: 'Sharma',
        isActive: true,
        organizationIds: [edushaId],
        organizationId: edushaId,
        roleIds: [vicePrincipalRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'teacher@edusha.in',
        password: hashedPassword,
        firstName: 'Priya',
        lastName: 'Verma',
        isActive: true,
        organizationIds: [edushaId],
        organizationId: edushaId,
        roleIds: [teacherRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'student@edusha.in',
        password: hashedPassword,
        firstName: 'Rahul',
        lastName: 'Patel',
        isActive: true,
        organizationIds: [edushaId],
        organizationId: edushaId,
        roleIds: [studentRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      }
    );

    // Orion Schools Users
    users.push(
      {
        email: 'admin@orion.in',
        password: hashedPassword,
        firstName: 'Orion',
        lastName: 'Admin',
        isActive: true,
        organizationIds: [orionId],
        organizationId: orionId,
        roleIds: [superAdminRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        requireTwoFactor: false,
        allowApiAccess: true,
        createdAt: new Date()
      },
      {
        email: 'principal@orion.in',
        password: hashedPassword,
        firstName: 'Mrs. Anjali',
        lastName: 'Desai',
        isActive: true,
        organizationIds: [orionId],
        organizationId: orionId,
        roleIds: [principalRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'teacher@orion.in',
        password: hashedPassword,
        firstName: 'Amit',
        lastName: 'Singh',
        isActive: true,
        organizationIds: [orionId],
        organizationId: orionId,
        roleIds: [teacherRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'parent@orion.in',
        password: hashedPassword,
        firstName: 'Suresh',
        lastName: 'Gupta',
        isActive: true,
        organizationIds: [orionId],
        organizationId: orionId,
        roleIds: [parentRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      }
    );

    // Shri Anand School Users
    users.push(
      {
        email: 'admin@shrianand.in',
        password: hashedPassword,
        firstName: 'Shri Anand',
        lastName: 'Admin',
        isActive: true,
        organizationIds: [shriAnandId],
        organizationId: shriAnandId,
        roleIds: [superAdminRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        requireTwoFactor: false,
        allowApiAccess: true,
        createdAt: new Date()
      },
      {
        email: 'principal@shrianand.in',
        password: hashedPassword,
        firstName: 'Mr. Ramesh',
        lastName: 'Iyer',
        isActive: true,
        organizationIds: [shriAnandId],
        organizationId: shriAnandId,
        roleIds: [principalRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'teacher@shrianand.in',
        password: hashedPassword,
        firstName: 'Kavita',
        lastName: 'Nair',
        isActive: true,
        organizationIds: [shriAnandId],
        organizationId: shriAnandId,
        roleIds: [teacherRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      }
    );

    // Bright Future Academy Users
    users.push(
      {
        email: 'admin@brightfuture.in',
        password: hashedPassword,
        firstName: 'Bright Future',
        lastName: 'Admin',
        isActive: true,
        organizationIds: [brightFutureId],
        organizationId: brightFutureId,
        roleIds: [superAdminRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        requireTwoFactor: false,
        allowApiAccess: true,
        createdAt: new Date()
      },
      {
        email: 'principal@brightfuture.in',
        password: hashedPassword,
        firstName: 'Dr. Sunita',
        lastName: 'Reddy',
        isActive: true,
        organizationIds: [brightFutureId],
        organizationId: brightFutureId,
        roleIds: [principalRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: false,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'teacher@brightfuture.in',
        password: hashedPassword,
        firstName: 'Vikram',
        lastName: 'Malhotra',
        isActive: true,
        organizationIds: [brightFutureId],
        organizationId: brightFutureId,
        roleIds: [teacherRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      }
    );

    await usersCollection.insertMany(users);
    console.log(`👤 Seeded ${users.length} users across all schools`);

    // ============ SEED USER PREFERENCES ============
    const preferencesCollection = db.collection('user-preferences');
    await preferencesCollection.deleteMany({});

    const preferences = users.slice(0, 4).map(user => ({
      userId: user.email,
      theme: 'light',
      primaryColor: '#6B46C1',
      accentColor: '#9F7AEA',
      secondaryColor: '#553C9A',
      currency: 'INR',
      currencySymbol: '₹',
      pinnedModules: [],
      dashboardPreferences: {}
    }));

    await preferencesCollection.insertMany(preferences);
    console.log(`⚙️ Seeded ${preferences.length} user preferences`);

    // ============ UPDATE ORGANIZATIONS WITH MODULES ============
    await organizationsCollection.updateMany(
      {},
      { $set: { activeModuleIds: moduleIds } }
    );
    console.log(`🔓 Updated all organizations with ${modules.length} modules`);

    // ============ SEED DEPARTMENTS ============
    const departmentsCollection = db.collection('departments');
    await departmentsCollection.deleteMany({});

    const departments = [];
    const departmentNames = [
      { name: 'Science', description: 'Science Department' },
      { name: 'Mathematics', description: 'Mathematics Department' },
      { name: 'English', description: 'English Department' },
      { name: 'Social Studies', description: 'Social Studies Department' },
      { name: 'Physical Education', description: 'Physical Education Department' },
      { name: 'Arts', description: 'Arts Department' },
      { name: 'Administration', description: 'Administrative Department' }
    ];

    for (const org of organizations) {
      for (const dept of departmentNames) {
        departments.push({
          _id: new ObjectId(),
          name: dept.name,
          description: dept.description,
          organizationId: org._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await departmentsCollection.insertMany(departments);
    console.log(`🏛️ Seeded ${departments.length} departments`);

    console.log('\n🎉 SchoolOS Complete seeding finished successfully!');
    console.log('\n📝 Demo Login Credentials (Password: school123):');
    console.log('\n   Edusha University:');
    console.log('   - admin@edusha.in (Super Admin)');
    console.log('   - principal@edusha.in (Principal)');
    console.log('   - teacher@edusha.in (Teacher)');
    console.log('   - student@edusha.in (Student)');
    console.log('\n   Orion Schools:');
    console.log('   - admin@orion.in (Super Admin)');
    console.log('   - principal@orion.in (Principal)');
    console.log('   - teacher@orion.in (Teacher)');
    console.log('   - parent@orion.in (Parent)');
    console.log('\n   Shri Anand School:');
    console.log('   - admin@shrianand.in (Super Admin)');
    console.log('   - principal@shrianand.in (Principal)');
    console.log('   - teacher@shrianand.in (Teacher)');
    console.log('\n   Bright Future Academy:');
    console.log('   - admin@brightfuture.in (Super Admin)');
    console.log('   - principal@brightfuture.in (Principal)');
    console.log('   - teacher@brightfuture.in (Teacher)');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seedSchoolOSComplete();
