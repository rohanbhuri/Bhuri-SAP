const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');

const { getConfig } = require(path.join(__dirname, '../../../config.js'));
const config = getConfig('beax-rm');

async function seedRaccontiComplete() {
  console.log('🚀 Starting Racconti XRM Complete seeding...');

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

    // ============ SEED CATEGORIES ============
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.deleteMany({});

    const catLivingRoomId = new ObjectId();
    const catChairsId = new ObjectId();

    const categories = [
      {
        _id: catLivingRoomId,
        name: 'Living Room',
        slug: 'living-room',
        description: 'Furniture for your living space',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        seo: { title: 'Living Room Furniture', description: 'Browse our living room collection', keywords: 'living room, furniture, home' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: catChairsId,
        name: 'Chairs',
        slug: 'chairs',
        description: 'Comfortable seating',
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
        parentId: catLivingRoomId,
        seo: { title: 'Chairs Collection', description: 'Comfortable seating solutions', keywords: 'chairs, seating, furniture' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await categoriesCollection.insertMany(categories);
    console.log(`📦 Seeded ${categories.length} categories`);

    // ============ SEED COLLECTIONS ============
    const collectionsCollection = db.collection('collections');
    await collectionsCollection.deleteMany({});

    const summerCollectionId = new ObjectId();
    const collections = [
      {
        _id: summerCollectionId,
        name: 'Summer Collection 2024',
        slug: 'summer-2024',
        description: 'Fresh and vibrant furniture for summer',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400',
        seo: { title: 'Summer Collection 2024', description: 'Fresh summer furniture collection', keywords: 'summer, furniture, collection' },
        isActive: true,
        productIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        name: 'Modern Classics',
        slug: 'modern-classics',
        description: 'Timeless modern furniture pieces',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
        seo: { title: 'Modern Classics Collection', description: 'Timeless modern furniture', keywords: 'modern, classics, furniture' },
        isActive: true,
        productIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await collectionsCollection.insertMany(collections);
    console.log(`🎨 Seeded ${collections.length} collections`);

    // ============ SEED PRODUCTS ============
    const productsCollection = db.collection('products');
    await productsCollection.deleteMany({});

    const products = [
      {
        name: 'Marble Coffee Table',
        productCode: 'MCT-001',
        slug: 'marble-coffee-table',
        description: 'Elegant marble coffee table with brass accents',
        descriptionHtml: '<p>An <strong>elegant</strong> marble coffee table featuring premium materials and exquisite craftsmanship.</p>',
        basePrice: 1200.00,
        currency: 'INR',
        featuredImage: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800',
        imageGallery: [
          'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
        ],
        videos: [],
        models3d: [],
        categoryId: catLivingRoomId,
        collectionId: summerCollectionId,
        tags: ['Coffee Table', 'Marble', 'Luxury'],
        isPublished: true,
        dimensionType: { type: 'hwl', unit: 'cm' },
        variations: [
          {
            _id: new ObjectId().toString(),
            name: 'White Marble with Brass',
            sku: 'MCT-001-WMB',
            material: 'White Marble',
            color: 'White',
            finish: 'Brass Lining',
            featuredImage: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800',
            imageGallery: [
              'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800',
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
            ],
            dimensions: {
              height: 45,
              width: 120,
              length: 60
            },
            price: 1200.00,
            priceModifier: 0,
            stock: 10,
            isAvailable: true
          },
          {
            _id: new ObjectId().toString(),
            name: 'Green Marble with Gold',
            sku: 'MCT-001-GMG',
            material: 'Green Marble',
            color: 'Green',
            finish: 'Gold Lining',
            featuredImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
            imageGallery: [
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
            ],
            dimensions: {
              height: 45,
              width: 120,
              length: 60
            },
            price: 1500.00,
            priceModifier: 300,
            stock: 5,
            isAvailable: true
          },
          {
            _id: new ObjectId().toString(),
            name: 'Black Marble',
            sku: 'MCT-001-BM',
            material: 'Black Marble',
            color: 'Black',
            finish: 'None',
            featuredImage: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800',
            imageGallery: [],
            dimensions: {
              height: 45,
              width: 120,
              length: 60
            },
            price: 1350.00,
            priceModifier: 150,
            stock: 8,
            isAvailable: true
          }
        ],
        attributes: { style: 'Modern', weight: '50kg' },
        seo: { title: 'Marble Coffee Table', description: 'Luxury marble coffee table', keywords: 'marble, coffee table, luxury' },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cylindrical Side Table',
        productCode: 'CST-002',
        slug: 'cylindrical-side-table',
        description: 'Modern cylindrical side table',
        descriptionHtml: '<p>A <strong>modern</strong> cylindrical side table perfect for any space.</p>',
        basePrice: 450.00,
        currency: 'INR',
        featuredImage: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
        imageGallery: [
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
        ],
        videos: [],
        models3d: [],
        categoryId: catLivingRoomId,
        collectionId: null,
        tags: ['Side Table', 'Modern', 'Cylindrical'],
        isPublished: true,
        dimensionType: { type: 'hd', unit: 'cm' },
        variations: [
          {
            _id: new ObjectId().toString(),
            name: 'Oak Wood Natural',
            sku: 'CST-002-OWN',
            material: 'Oak Wood',
            color: 'Natural',
            finish: 'Matte',
            featuredImage: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
            imageGallery: [],
            dimensions: {
              height: 55,
              diameter: 40
            },
            price: 450.00,
            priceModifier: 0,
            stock: 15,
            isAvailable: true
          },
          {
            _id: new ObjectId().toString(),
            name: 'Walnut Dark',
            sku: 'CST-002-WD',
            material: 'Walnut',
            color: 'Dark Brown',
            finish: 'Glossy',
            featuredImage: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
            imageGallery: [],
            dimensions: {
              height: 55,
              diameter: 40
            },
            price: 550.00,
            priceModifier: 100,
            stock: 12,
            isAvailable: true
          }
        ],
        attributes: { style: 'Contemporary', weight: '15kg' },
        seo: { title: 'Cylindrical Side Table', description: 'Modern side table', keywords: 'side table, cylindrical, modern' },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await productsCollection.insertMany(products);
    console.log(`🛋️ Seeded ${products.length} products`);

    // ============ SEED CMS PAGES ============
    const pagesCollection = db.collection('pages');
    await pagesCollection.deleteMany({});

    const pages = [
      {
        title: 'Home',
        slug: 'home',
        content: '<h1>Welcome to Racconti XRM</h1><p>Your premium furniture catalogue.</p>',
        status: 'published',
        seo: { title: 'Home - Racconti', description: 'Welcome' },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'About Us',
        slug: 'about-us',
        content: '<h1>About Racconti</h1><p>We are a luxury furniture brand.</p>',
        status: 'published',
        seo: { title: 'About - Racconti', description: 'Our story' },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await pagesCollection.insertMany(pages);
    console.log(`📄 Seeded ${pages.length} pages`);

    // ============ SEED ORGANIZATIONS ============
    const organizationsCollection = db.collection('organizations');
    await organizationsCollection.deleteMany({});

    const orgId = new ObjectId();
    const organizations = [
      {
        _id: orgId,
        name: 'Racconti',
        code: 'RACCONTI',
        description: 'Your Organisation\'s only dashboard for everything',
        isPublic: false,
        memberCount: 1,
        createdAt: new Date()
      }
    ];

    await organizationsCollection.insertMany(organizations);
    console.log(`🏢 Seeded ${organizations.length} organizations`);

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
      { module: 'client-management', action: 'read', resource: 'contact-us', description: 'View contact messages' },
      { module: 'client-management', action: 'update', resource: 'contact-us', description: 'Mark contact messages as read' },
      { module: 'client-management', action: 'delete', resource: 'contact-us', description: 'Delete contact messages' },

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
          permMap['crm:read:organization'], permMap['crm:create:organization'], permMap['crm:update:organization'],
          permMap['client-management:read:organization'], permMap['client-management:create:organization'], permMap['client-management:update:organization'],
          permMap['reports:read:organization'], permMap['reports:create:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Manager',
        description: 'Manage operations and staff',
        type: 'staff',
        hierarchyLevel: 2,
        permissionIds: [
          permMap['crm:read:organization'], permMap['crm:create:organization'], permMap['crm:update:organization'],
          permMap['client-management:read:organization'], permMap['client-management:create:organization'], permMap['client-management:update:organization'],
          permMap['client-management:read:contact-us'], permMap['client-management:update:contact-us'], permMap['client-management:delete:contact-us'],
          permMap['reports:read:organization'], permMap['reports:create:organization'],
          permMap['catalogue:read:organization'], permMap['quotations:read:organization'], permMap['quotations:create:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Staff',
        description: 'Standard staff access',
        type: 'staff',
        hierarchyLevel: 1,
        permissionIds: [
          permMap['crm:read:organization'], permMap['crm:create:organization'], permMap['crm:update:organization'],
          permMap['client-management:read:organization'], permMap['client-management:create:organization'],
          permMap['catalogue:read:organization'], permMap['quotations:read:organization'],
          permMap['dashboard:read:organization']
        ].filter(Boolean)
      },
      {
        name: 'Employee',
        description: 'Basic employee access',
        type: 'staff',
        hierarchyLevel: 0,
        permissionIds: [
          permMap['crm:read:organization'],
          permMap['client-management:read:organization'],
          permMap['catalogue:read:organization'], permMap['quotations:read:organization'],
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
      { _id: new ObjectId(), name: 'client-management', displayName: 'Client Management', description: 'Manage client requests and accounts', isActive: true, icon: 'people_outline', route: '/modules/client-management', category: 'Core', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'crm', displayName: 'CRM', description: 'Customer relationship management', isActive: true, icon: 'business_center', route: '/modules/crm', category: 'Sales', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'reports-management', displayName: 'Reports & Analytics', description: 'Generate and manage business reports', isActive: true, icon: 'assessment', route: '/modules/reports-management', category: 'Operations', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'catalogue', displayName: 'Catalogue Management', description: 'Manage product catalogue with 3D models', isActive: true, icon: 'view_in_ar', route: '/modules/catalogue', category: 'Catalogue', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'cms', displayName: 'CMS Management', description: 'Content management system for pages and blogs', isActive: true, icon: 'article', route: '/modules/cms', category: 'Content', permissionType: 'admin', createdAt: new Date() },
      { _id: new ObjectId(), name: 'quotations', displayName: 'Quotations', description: 'Manage quotations and client proposals', isActive: true, icon: 'request_quote', route: '/modules/quotations', category: 'Sales', permissionType: 'admin', createdAt: new Date() }
    ];

    await modulesCollection.insertMany(modules);
    console.log(`🧩 Seeded ${modules.length} modules`);

    // ============ SEED USERS ============
    const usersCollection = db.collection('users');
    await usersCollection.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    const roleIds = Object.values(insertedRoles.insertedIds);
    const superAdminRole = roleIds[0];
    const adminRole = roleIds[1];
    const hrManagerRole = roleIds[2];
    const managerRole = roleIds[3];
    const staffRole = roleIds[4];
    const employeeRole = roleIds[5];

    const moduleIds = modules.map(m => m._id);

    const users = [
      {
        email: 'superadmin@racconti.in',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [superAdminRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: true,
        requireTwoFactor: true,
        allowApiAccess: true,
        createdAt: new Date()
      },
      {
        email: 'admin@racconti.in',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [adminRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: true,
        requireTwoFactor: true,
        allowApiAccess: true,
        createdAt: new Date()
      },
      {
        email: 'hr@racconti.in',
        password: hashedPassword,
        firstName: 'HR',
        lastName: 'Manager',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [hrManagerRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: true,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'manager@racconti.in',
        password: hashedPassword,
        firstName: 'Operations',
        lastName: 'Manager',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [managerRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        forcePasswordChange: true,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'staff@racconti.in',
        password: hashedPassword,
        firstName: 'Staff',
        lastName: 'Member',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [staffRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      },
      {
        email: 'employee@racconti.in',
        password: hashedPassword,
        firstName: 'Employee',
        lastName: 'User',
        isActive: true,
        organizationIds: [orgId],
        organizationId: orgId,
        roleIds: [employeeRole],
        permissionIds: [],
        activeModuleIds: moduleIds,
        allowApiAccess: false,
        createdAt: new Date()
      }
    ];

    await usersCollection.insertMany(users);
    console.log(`👤 Seeded ${users.length} users with roles`);

    // ============ SEED USER PREFERENCES ============
    const preferencesCollection = db.collection('user-preferences');
    await preferencesCollection.deleteMany({});

    const preferences = [
      {
        userId: users[0]._id.toString(),
        theme: 'light',
        primaryColor: '#10B981',
        accentColor: '#EF4444',
        secondaryColor: '#374151',
        currency: 'INR',
        currencySymbol: '₹',
        pinnedModules: [],
        dashboardPreferences: {}
      }
    ];

    await preferencesCollection.insertMany(preferences);
    console.log(`⚙️ Seeded ${preferences.length} user preferences`);

    // ============ UPDATE ORGANIZATION WITH MODULES ============
    await organizationsCollection.updateOne(
      { _id: orgId },
      { $set: { activeModuleIds: moduleIds } }
    );
    console.log(`🔓 Updated organization with ${modules.length} modules`);

    console.log('🎉 Racconti XRM Complete seeding finished successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seedRaccontiComplete();
