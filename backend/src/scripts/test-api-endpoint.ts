import { MongoClient, ObjectId } from 'mongodb';

async function testApiEndpoint() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    const orgId = '68a21f9f2529ab94cf8197a1';
    
    // Test the exact logic from getActiveModulesForOrg
    console.log('Testing organization modules API logic...');
    
    const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
    console.log('Organization found:', !!org);
    console.log('Organization activeModuleIds:', org?.activeModuleIds?.length || 0);
    
    const activeIds = org?.activeModuleIds || [];
    console.log('Active IDs:', activeIds.map(id => id.toString()));
    
    if (activeIds.length > 0) {
      const modules = await db.collection('modules').find({
        _id: { $in: activeIds }
      }).toArray();
      
      console.log('Found modules:', modules.length);
      console.log('Module details:', modules.map(m => ({
        name: m.name,
        displayName: m.displayName
      })));
      
      const result = modules.map(module => ({
        id: module._id.toString(),
        name: module.name,
        displayName: module.displayName,
        description: module.description,
        isActive: true,
        permissionType: module.permissionType,
        category: module.category,
        icon: module.icon,
        color: module.color
      }));
      
      console.log('API would return:', result);
    } else {
      console.log('No active modules found');
    }
    
  } finally {
    await client.close();
  }
}

testApiEndpoint().catch(console.error);