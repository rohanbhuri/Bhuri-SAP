const { MongoClient, ObjectId } = require('mongodb');

async function seedTimesheetData() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beax_rm';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('timesheets');

    const fakeData = [];
    const today = new Date();
    const tasks = [
      'Frontend Development',
      'Backend API Work',
      'Database Design',
      'Testing & QA',
      'Code Review',
      'Client Meeting',
      'Documentation',
      'Bug Fixes',
      'UI/UX Design',
      'Performance Optimization'
    ];
    const statuses = ['draft', 'submitted', 'approved', 'rejected'];

    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      fakeData.push({
        employeeId: new ObjectId().toString(),
        projectId: new ObjectId().toString(),
        organizationId: new ObjectId().toString(),
        date,
        hoursWorked: Math.floor(Math.random() * 8) + 1,
        description: tasks[Math.floor(Math.random() * tasks.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(),
      });
    }

    await collection.insertMany(fakeData);
    console.log(`${fakeData.length} timesheet entries inserted successfully`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seedTimesheetData();