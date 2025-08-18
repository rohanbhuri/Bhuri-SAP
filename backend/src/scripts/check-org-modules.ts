import { MongoClient, ObjectId } from 'mongodb';

async function checkOrgModules() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    // Get organization data
    const orgs = await db.collection('organizations').find({}).toArray();
    console.log('Organizations:');
    orgs.forEach(org => {
      console.log(`- ${org.name}: activeModuleIds = ${org.activeModuleIds?.length || 0} modules`);
      console.log(`  IDs: ${org.activeModuleIds?.map(id => id.toString()) || []}`);
    });
    
    // Get user data
    const users = await db.collection('users').find({}).toArray();
    console.log('\nUsers:');
    users.forEach(user => {
      console.log(`- ${user.email}: activeModuleIds = ${user.activeModuleIds?.length || 0} modules`);
      console.log(`  IDs: ${user.activeModuleIds?.map(id => id.toString()) || []}`);
      console.log(`  organizationIds: ${user.organizationIds?.map(id => id.toString()) || []}`);
      console.log(`  currentOrganizationId: ${user.currentOrganizationId?.toString() || 'none'}`);
    });
    
  } finally {
    await client.close();
  }
}

checkOrgModules().catch(console.error);