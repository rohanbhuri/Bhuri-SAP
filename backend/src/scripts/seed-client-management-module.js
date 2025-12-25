// Run this script to add Client Management module to the database
// node backend/src/scripts/seed-client-management-module.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beax-rm';

async function seedClientManagementModule() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const modulesCollection = db.collection('modules');

    // Check if module already exists
    const existing = await modulesCollection.findOne({ name: 'client-management' });
    
    if (existing) {
      console.log('Client Management module already exists');
      return;
    }

    // Insert Client Management module
    const module = {
      id: 'client-management',
      name: 'client-management',
      displayName: 'Client Management',
      description: 'Manage client account requests and client profiles. Public endpoint for account creation requests.',
      permissionType: 'public',
      category: 'administration',
      icon: 'people_outline',
      color: '#00BCD4',
      isActive: true,
      createdAt: new Date()
    };

    await modulesCollection.insertOne(module);
    console.log('✅ Client Management module added successfully');

    // Create CLIENT role if it doesn't exist
    const rolesCollection = db.collection('roles');
    const clientRole = await rolesCollection.findOne({ type: 'CLIENT' });
    
    if (!clientRole) {
      await rolesCollection.insertOne({
        name: 'Client',
        type: 'CLIENT',
        description: 'Client user with limited access to client portal',
        permissionIds: [],
        createdAt: new Date()
      });
      console.log('✅ CLIENT role created successfully');
    } else {
      console.log('CLIENT role already exists');
    }

  } catch (error) {
    console.error('Error seeding Client Management module:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedClientManagementModule();
