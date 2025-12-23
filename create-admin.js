// Script to create admin user for Racconti XRM
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function createAdminUser() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('racconti');
        const usersCollection = db.collection('users');

        // Check if admin already exists
        const existingAdmin = await usersCollection.findOne({ email: 'admin@racconti.com' });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create admin user
        const adminUser = {
            email: 'admin@racconti.com',
            password: hashedPassword,
            name: 'Racconti Admin',
            role: 'super_admin',
            organizationId: 'racconti-org-1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(adminUser);
        console.log('Admin user created successfully:', result.insertedId);
        console.log('Email: admin@racconti.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await client.close();
    }
}

createAdminUser();
