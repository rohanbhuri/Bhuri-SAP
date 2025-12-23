const { MongoClient, ObjectId } = require('mongodb');
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

        console.log('🎉 Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await client.close();
    }
}

seed();
