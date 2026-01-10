const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// Load config from root directory
const configPath = path.join(__dirname, '../../../config.js');
console.log('Loading config from:', configPath);
const { getConfig } = require(configPath);
const config = getConfig('beax-rm');

async function seedModulesOnly() {
    console.log('🚀 Starting Racconti XRM modules-only seeding...');

    // Use config URI or fallback
    let uri = config.database?.MONGODB_URI || 'mongodb://localhost:27017/bhuri-sap';

    // Switch database to 'racconti'
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

        // Seed Modules Only
        const modulesCollection = db.collection('modules');
        await modulesCollection.deleteMany({});

        const modules = [
            // Racconti XRM Core Modules Only
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

        // Update existing users and organizations with new module IDs
        const moduleIds = modules.map(m => m._id);
        
        const usersCollection = db.collection('users');
        const organizationsCollection = db.collection('organizations');
        
        // Update all users to have these modules
        const userUpdateResult = await usersCollection.updateMany(
            {},
            { $set: { activeModuleIds: moduleIds } }
        );
        console.log(`🔓 Updated ${userUpdateResult.modifiedCount} users with new modules`);
        
        // Update all organizations to have these modules
        const orgUpdateResult = await organizationsCollection.updateMany(
            {},
            { $set: { activeModuleIds: moduleIds } }
        );
        console.log(`🔓 Updated ${orgUpdateResult.modifiedCount} organizations with new modules`);

        console.log('🎉 Modules-only seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await client.close();
    }
}

seedModulesOnly();