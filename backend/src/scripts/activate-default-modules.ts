import { MongoClient, ObjectId } from 'mongodb';

async function activateDefaultModules() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    // Get the default modules (user-management and crm)
    const defaultModules = await db.collection('modules').find({
      name: { $in: ['user-management', 'crm'] }
    }).toArray();
    
    console.log('Found default modules:', defaultModules.map(m => m.name));
    
    // Get all organizations
    const organizations = await db.collection('organizations').find({}).toArray();
    console.log('Found organizations:', organizations.length);
    
    // Activate default modules for all organizations
    for (const org of organizations) {
      const moduleIds = defaultModules.map(m => m._id);
      
      await db.collection('organizations').updateOne(
        { _id: org._id },
        { $addToSet: { activeModuleIds: { $each: moduleIds } } }
      );
      
      console.log(`Activated default modules for organization: ${org.name || org._id}`);
    }
    
    console.log('Default modules activation completed');
  } finally {
    await client.close();
  }
}

activateDefaultModules().catch(console.error);