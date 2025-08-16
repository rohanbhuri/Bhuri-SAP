const { MongoClient } = require('mongodb');

async function initModules() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    const modules = [
      {
        name: 'crm',
        displayName: 'CRM',
        description: 'Customer Relationship Management - Manage contacts, leads, deals, and sales pipeline',
        isAvailable: true,
        permissionType: 'public',
        createdAt: new Date()
      },
      {
        name: 'user-management',
        displayName: 'User Management',
        description: 'Manage users, roles, and permissions within your organization',
        isAvailable: true,
        permissionType: 'require_permission',
        createdAt: new Date()
      },
      {
        name: 'reports',
        displayName: 'Reports & Analytics',
        description: 'Generate detailed reports and analytics for your business data',
        isAvailable: true,
        permissionType: 'public',
        createdAt: new Date()
      },
      {
        name: 'inventory',
        displayName: 'Inventory Management',
        description: 'Track and manage your product inventory, stock levels, and suppliers',
        isAvailable: true,
        permissionType: 'require_permission',
        createdAt: new Date()
      },
      {
        name: 'finance',
        displayName: 'Finance & Accounting',
        description: 'Manage invoices, expenses, and financial reporting',
        isAvailable: true,
        permissionType: 'require_permission',
        createdAt: new Date()
      }
    ];
    
    for (const module of modules) {
      const existing = await db.collection('module').findOne({ name: module.name });
      if (!existing) {
        await db.collection('module').insertOne(module);
        console.log(`Created module: ${module.displayName}`);
      } else {
        console.log(`Module already exists: ${module.displayName}`);
      }
    }
    
    console.log('Module initialization completed');
    
  } catch (error) {
    console.error('Error initializing modules:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  initModules();
}

module.exports = { initModules };