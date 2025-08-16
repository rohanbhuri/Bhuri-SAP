const { MongoClient } = require('mongodb');

async function initCrmModule() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // Check if CRM module already exists
    const existingModule = await db.collection('module').findOne({ name: 'crm' });
    
    if (!existingModule) {
      // Insert CRM module
      const crmModule = {
        name: 'crm',
        displayName: 'CRM',
        description: 'Customer Relationship Management - Manage contacts, leads, deals, and sales pipeline',
        isAvailable: true,
        permissionType: 'public',
        createdAt: new Date()
      };
      
      const result = await db.collection('module').insertOne(crmModule);
      console.log('CRM module created with ID:', result.insertedId);
    } else {
      console.log('CRM module already exists');
    }
    
  } catch (error) {
    console.error('Error initializing CRM module:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  initCrmModule();
}

module.exports = { initCrmModule };