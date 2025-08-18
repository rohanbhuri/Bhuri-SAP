import { MongoClient, ObjectId } from 'mongodb';

async function testQueries() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    const orgId = new ObjectId("68a21f9f2529ab94cf8197a1");
    
    // Test different query variations
    console.log('Testing queries:');
    
    // 1. Direct ObjectId
    const count1 = await db.collection('users').countDocuments({
      organizationIds: orgId
    });
    console.log('1. ObjectId query:', count1);
    
    // 2. String version
    const count2 = await db.collection('users').countDocuments({
      organizationIds: orgId.toString()
    });
    console.log('2. String query:', count2);
    
    // 3. Using $in with ObjectId
    const count3 = await db.collection('users').countDocuments({
      organizationIds: { $in: [orgId] }
    });
    console.log('3. $in ObjectId query:', count3);
    
    // 4. Using $in with string
    const count4 = await db.collection('users').countDocuments({
      organizationIds: { $in: [orgId.toString()] }
    });
    console.log('4. $in String query:', count4);
    
    // Check actual data format
    const user = await db.collection('users').findOne({});
    console.log('User organizationIds type:', typeof user.organizationIds[0]);
    console.log('User organizationIds value:', user.organizationIds[0]);
    
  } finally {
    await client.close();
  }
}

testQueries().catch(console.error);