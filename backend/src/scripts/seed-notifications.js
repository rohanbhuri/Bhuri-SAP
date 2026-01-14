const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const { getConfig } = require(path.join(__dirname, '../../../config.js'));
const config = getConfig('beax-rm');

async function seedNotifications() {
  console.log('🔔 Starting Notifications seeding...');

  let uri = config.database?.MONGODB_URI || 'mongodb://localhost:27017/bhuri-sap';
  
  if (uri.includes('?')) {
    uri = uri.replace(/\/[^/?]+\?/, '/racconti?');
  } else {
    uri = uri.substring(0, uri.lastIndexOf('/') + 1) + 'racconti';
  }

  console.log(`Using MongoDB URI (Target: racconti): ${uri.replace(/\/\/.*@/, '//***@')}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    console.log(`✅ Connected to database: ${db.databaseName}`);

    // Get users
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      console.log('⚠️ No users found. Please run seed-racconti-complete.js first');
      return;
    }

    console.log(`Found ${users.length} users`);

    // ============ SEED NOTIFICATIONS ============
    const notificationsCollection = db.collection('notifications');
    await notificationsCollection.deleteMany({});

    const notifications = [];
    
    // Create notifications for each user
    users.forEach((user, index) => {
      notifications.push(
        {
          userId: user._id,
          type: 'system',
          title: 'Welcome to Racconti XRM',
          message: `Welcome ${user.firstName}! Your account has been created successfully. Start exploring the platform!`,
          isRead: false,
          createdAt: new Date(Date.now() - 86400000 * (index + 1)),
          updatedAt: new Date(Date.now() - 86400000 * (index + 1))
        },
        {
          userId: user._id,
          type: 'module_approved',
          title: 'Module Access Granted',
          message: 'You now have access to Racconti modules',
          isRead: index > 1,
          createdAt: new Date(Date.now() - 43200000 * (index + 1)),
          updatedAt: new Date(Date.now() - 43200000 * (index + 1))
        }
      );
    });

    // Add some additional system notifications
    notifications.push(
      {
        userId: users[0]._id,
        type: 'system',
        title: 'System Update',
        message: 'The system has been updated with new features',
        isRead: true,
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 259200000)
      },
      {
        userId: users[0]._id,
        type: 'system',
        title: 'Backup Completed',
        message: 'Daily backup completed successfully',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000)
      }
    );

    await notificationsCollection.insertMany(notifications);
    console.log(`🔔 Seeded ${notifications.length} notifications`);

    // Show summary
    const unreadCount = notifications.filter(n => !n.isRead).length;
    console.log(`   - Unread: ${unreadCount}`);
    console.log(`   - Read: ${notifications.length - unreadCount}`);

    console.log('🎉 Notifications seeding finished successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seedNotifications();
