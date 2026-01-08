const { MongoClient } = require('./backend/node_modules/mongodb');

const uri = 'mongodb://localhost:27017/raccontixrm';

async function updateOrganizationName() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    const organizations = database.collection('organizations');

    const result = await organizations.updateMany(
      { name: 'Racconti Corporation' },
      { $set: { name: 'RACCONTI' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} organization(s)`);
    console.log('Organization name changed from "Racconti Corporation" to "RACCONTI"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

updateOrganizationName();
