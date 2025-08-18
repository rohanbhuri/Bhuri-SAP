import { MongoClient, ObjectId } from 'mongodb';

async function fixUserOrganizations() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    console.log('Found users:', users.length);
    
    // Get all organizations
    const organizations = await db.collection('organizations').find({}).toArray();
    console.log('Found organizations:', organizations.length);
    
    if (organizations.length > 0) {
      const defaultOrgId = organizations[0]._id;
      
      // Update users who don't have organizationIds
      for (const user of users) {
        if (!user.organizationIds || user.organizationIds.length === 0) {
          await db.collection('users').updateOne(
            { _id: user._id },
            { 
              $set: { 
                organizationIds: [defaultOrgId],
                currentOrganizationId: defaultOrgId
              } 
            }
          );
          console.log(`Updated user: ${user.email}`);
        }
      }
    }
    
    console.log('User organizations fixed');
  } finally {
    await client.close();
  }
}

fixUserOrganizations().catch(console.error);