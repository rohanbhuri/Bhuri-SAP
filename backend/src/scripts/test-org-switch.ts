import { MongoClient, ObjectId } from 'mongodb';

async function testOrgSwitch() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    // Get user and org data
    const user = await db.collection('users').findOne({});
    const org = await db.collection('organizations').findOne({});
    
    console.log('User:', {
      email: user.email,
      organizationIds: user.organizationIds?.map(id => id.toString()),
      currentOrganizationId: user.currentOrganizationId?.toString()
    });
    
    console.log('Organization:', {
      id: org._id.toString(),
      name: org.name,
      activeModuleIds: org.activeModuleIds?.length || 0
    });
    
    // Test organization modules endpoint
    console.log('\nTesting organization modules...');
    const orgModules = await db.collection('modules').find({
      _id: { $in: org.activeModuleIds || [] }
    }).toArray();
    
    console.log('Organization modules:', orgModules.map(m => ({
      name: m.name,
      displayName: m.displayName
    })));
    
  } finally {
    await client.close();
  }
}

testOrgSwitch().catch(console.error);