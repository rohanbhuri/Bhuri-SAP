import { MongoClient, ObjectId } from 'mongodb';

async function debugUserOrg() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    // Get user data
    const users = await db.collection('users').find({}).toArray();
    console.log('Users:', JSON.stringify(users, null, 2));
    
    // Get organization data
    const orgs = await db.collection('organizations').find({}).toArray();
    console.log('Organizations:', JSON.stringify(orgs, null, 2));
    
    // Test the query that's failing
    const orgId = new ObjectId("68a21f9f2529ab94cf8197a1");
    const userCount = await db.collection('users').countDocuments({
      organizationIds: orgId
    });
    console.log('User count for org:', userCount);
    
  } finally {
    await client.close();
  }
}

debugUserOrg().catch(console.error);