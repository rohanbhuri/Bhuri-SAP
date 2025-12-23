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
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: catChairsId,
                name: 'Chairs',
                slug: 'chairs',
                description: 'Comfortable seating',
                parentId: catLivingRoomId,
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
                name: 'Astronaut Figure',
                sku: 'ASTRO-001',
                slug: 'astronaut-figure',
                description: 'A 3D model of an astronaut.',
                price: 150.00,
                currency: 'USD',
                images: ['https://modelviewer.dev/shared-assets/models/Astronaut.png'],
                model3d: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Public 3D Model
                categoryId: catChairsId,
                collectionId: null,
                isPublished: true,
                attributes: { material: 'Plastic' },
                seo: { title: 'Astronaut 3D', description: 'Cool astronaut model' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Modern Gray Sofa',
                sku: 'SOFA-GRY-002',
                slug: 'modern-gray-sofa',
                description: 'A comfortable modern gray sofa.',
                price: 899.99,
                currency: 'USD',
                images: [],
                model3d: null,
                categoryId: catLivingRoomId,
                collectionId: null,
                isPublished: true,
                attributes: { color: 'Gray', material: 'Fabric' },
                seo: { title: 'Modern Sofa', description: 'Best sofa' },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await productsCollection.insertMany(products);
        console.log(`🛋️ Seeded ${products.length} products`);

        // 3. Seed CMS Pages
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
                name: 'Racconti Corporation',
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
            { _id: new ObjectId(), name: 'quotations', displayName: 'Quotations', description: 'Manage quotations and client proposals', isActive: true, icon: 'request_quote', route: '/modules/quotations', category: 'Sales', permissionType: 'admin', createdAt: new Date() }
        ];

        await modulesCollection.insertMany(modules);
        console.log(`🧩 Seeded ${modules.length} modules`);

        // 9. Activate only these 5 modules for super admin user and organization
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
