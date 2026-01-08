const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');

// Load config from root directory
// Path from backend/src/scripts/seed-racconti.js to config.js in root
const configPath = path.join(__dirname, '../../../config.js');
console.log('Loading config from:', configPath);
const { getConfig } = require(configPath);
const config = getConfig('beax-rm');

async function seed() {
    console.log('🚀 Starting Racconti XRM seeding...');

    // Use config URI or fallback
    let uri = config.database?.MONGODB_URI || 'mongodb://localhost:27017/bhuri-sap';

    // Switch database to 'racconti'
    if (uri.includes('?')) {
        uri = uri.replace(/\/[^/?]+\?/, '/racconti?');
    } else {
        uri = uri.substring(0, uri.lastIndexOf('/') + 1) + 'racconti';
    }

    console.log(`Using MongoDB URI (Target: racconti): ${uri.replace(/\/\/.*@/, '//***@')}`); // log masked URI

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        console.log(`✅ Connected to database: ${db.databaseName}`);

        // 1. Seed Categories
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

        // 2. Seed Products
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
                currency: 'USD',
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
                currency: 'USD',
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

        // 3. Seed Collections
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

        // 4. Seed CMS Pages
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

        // 4. Seed Organizations
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

        // 5. Seed Roles
        const rolesCollection = db.collection('roles');
        await rolesCollection.deleteMany({});

        const superAdminRoleId = new ObjectId();
        const roles = [
            {
                _id: superAdminRoleId,
                name: 'Super Admin',
                description: 'Full system access',
                type: 'super_admin',
                createdAt: new Date()
            }
        ];

        await rolesCollection.insertMany(roles);
        console.log(`👥 Seeded ${roles.length} roles`);

        // 6. Seed Users
        const usersCollection = db.collection('users');
        await usersCollection.deleteMany({});

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const users = [
            {
                _id: new ObjectId(),
                email: 'admin@racconti.com',
                password: hashedPassword,
                firstName: 'Racconti',
                lastName: 'Admin',
                isActive: true,
                organizationIds: [orgId],
                organizationId: orgId,
                roleIds: [superAdminRoleId],
                permissionIds: [],
                activeModuleIds: [],
                createdAt: new Date()
            }
        ];

        await usersCollection.insertMany(users);
        console.log(`👤 Seeded ${users.length} users`);

        // 6.5. Seed User Preferences with Currency
        const preferencesCollection = db.collection('user-preferences');
        await preferencesCollection.deleteMany({});

        const preferences = [
            {
                userId: users[0]._id.toString(),
                theme: 'light',
                primaryColor: '#10B981',
                accentColor: '#EF4444',
                secondaryColor: '#374151',
                currency: 'USD',
                currencySymbol: '$',
                pinnedModules: [],
                dashboardPreferences: {}
            }
        ];

        await preferencesCollection.insertMany(preferences);
        console.log(`⚙️ Seeded ${preferences.length} user preferences`);

        // 7. Seed Permissions
        const permissionsCollection = db.collection('permissions');
        await permissionsCollection.deleteMany({});

        const permissions = [
            { name: 'user:read', description: 'View users' },
            { name: 'user:create', description: 'Create users' },
            { name: 'user:update', description: 'Update users' },
            { name: 'user:delete', description: 'Delete users' },
            { name: 'organization:read', description: 'View organizations' },
            { name: 'organization:create', description: 'Create organizations' },
            { name: 'organization:update', description: 'Update organizations' },
            { name: 'organization:delete', description: 'Delete organizations' },
            { name: 'hr:read', description: 'View HR data' },
            { name: 'hr:create', description: 'Create HR records' },
            { name: 'hr:update', description: 'Update HR records' },
            { name: 'hr:delete', description: 'Delete HR records' },
            { name: 'crm:manage', description: 'Manage CRM' }
        ];

        await permissionsCollection.insertMany(permissions);
        console.log(`📋 Seeded ${permissions.length} permissions`);

        // 8. Seed Modules
        const modulesCollection = db.collection('modules');
        await modulesCollection.deleteMany({});

        const modules = [
            // Racconti XRM Core Modules Only
            { _id: new ObjectId(), name: 'user-management', displayName: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, icon: 'people', route: '/modules/user-management', category: 'Core', permissionType: 'super_admin', createdAt: new Date() },
            { _id: new ObjectId(), name: 'crm', displayName: 'CRM', description: 'Customer relationship management', isActive: true, icon: 'business_center', route: '/modules/crm', category: 'Sales', permissionType: 'admin', createdAt: new Date() },
            { _id: new ObjectId(), name: 'catalogue', displayName: 'Catalogue Management', description: 'Manage product catalogue with 3D models', isActive: true, icon: 'view_in_ar', route: '/modules/catalogue', category: 'Catalogue', permissionType: 'admin', createdAt: new Date() },
            { _id: new ObjectId(), name: 'cms', displayName: 'CMS Management', description: 'Content management system for pages and blogs', isActive: true, icon: 'article', route: '/modules/cms', category: 'Content', permissionType: 'admin', createdAt: new Date() },
            { _id: new ObjectId(), name: 'quotations', displayName: 'Quotations', description: 'Manage quotations and client proposals', isActive: true, icon: 'request_quote', route: '/modules/quotations', category: 'Sales', permissionType: 'admin', createdAt: new Date() },
            { _id: new ObjectId(), name: 'client-management', displayName: 'Client Management', description: 'Manage client requests and accounts', isActive: true, icon: 'people_outline', route: '/modules/client-management', category: 'Core', permissionType: 'admin', createdAt: new Date() }
        ];

        await modulesCollection.insertMany(modules);
        console.log(`🧩 Seeded ${modules.length} modules`);

        // 9. Activate all modules for super admin user and organization
        const moduleIds = modules.map(m => m._id || new ObjectId());
        
        await usersCollection.updateMany(
            { roleIds: { $in: [superAdminRoleId] } },
            { $set: { activeModuleIds: moduleIds } }
        );
        
        await organizationsCollection.updateMany(
            { _id: orgId },
            { $set: { activeModuleIds: moduleIds } }
        );
        
        console.log(`🔓 Activated ${modules.length} modules for super admin and organization`);

        console.log('🎉 Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await client.close();
    }
}

seed();
