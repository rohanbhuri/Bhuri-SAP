import { MongoClient, ObjectId } from 'mongodb';

async function assignOrgModules() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    // Get some default modules to assign to organization
    const modules = await db.collection('modules').find({
      name: { $in: ['user-management', 'crm', 'hr-management'] }
    }).toArray();
    
    console.log('Found modules to assign:', modules.map(m => m.name));
    
    const moduleIds = modules.map(m => m._id);
    
    // Assign modules to organization
    const result = await db.collection('organizations').updateOne(
      { name: 'Bhuri SAP Demo' },
      { $set: { activeModuleIds: moduleIds } }
    );
    
    console.log('Updated organization with modules:', result.modifiedCount);
    
    // Verify the update
    const org = await db.collection('organizations').findOne({ name: 'Bhuri SAP Demo' });
    console.log('Organization now has modules:', org.activeModuleIds?.length || 0);
    
  } finally {
    await client.close();
  }
}

assignOrgModules().catch(console.error);