const { MongoClient } = require('mongodb');

async function removeIsActiveField() {
  const uri = 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('beaxrm');
    
    const result = await db.collection('modules').updateMany(
      {},
      { $unset: { isActive: 1 } }
    );
    
    console.log(`Updated ${result.modifiedCount} modules`);
  } finally {
    await client.close();
  }
}

removeIsActiveField().catch(console.error);