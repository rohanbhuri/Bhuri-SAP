const { MongoClient } = require('mongodb');

// MongoDB connection URI - update this with your actual connection string
const uri = process.env.DATABASE_URI || 'mongodb://localhost:27017/beax-rm';

async function updateOrganizationName() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    const organizations = database.collection('organizations');

    // Update the organization name
    const result = await organizations.updateMany(
      { name: 'Racconti Corporation' },
      { $set: { name: 'RACCONTI' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} organization(s)`);
    console.log('Organization name changed from "Racconti Corporation" to "RACCONTI"');

  } catch (error) {
    console.error('❌ Error updating organization:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

updateOrganizationName();
