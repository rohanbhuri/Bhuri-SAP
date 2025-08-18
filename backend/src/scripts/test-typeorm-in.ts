import { DataSource, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { ObjectId } from 'mongodb';

const dataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db',
  database: 'beaxrm',
  entities: [User, Organization],
  synchronize: false,
});

async function testTypeORMQuery() {
  try {
    await dataSource.initialize();
    
    const userRepo = dataSource.getRepository(User);
    const orgRepo = dataSource.getRepository(Organization);
    
    const orgs = await orgRepo.find();
    console.log('Found orgs:', orgs.length);
    
    for (const org of orgs) {
      console.log(`Testing org: ${org.name} (${org._id})`);
      
      // Test the exact query from the service
      const count = await userRepo.count({
        where: { organizationIds: In([org._id]) }
      });
      console.log(`User count: ${count}`);
      
      // Also test direct find
      const users = await userRepo.find({
        where: { organizationIds: In([org._id]) }
      });
      console.log(`Found users: ${users.length}`);
      users.forEach(u => console.log(`- ${u.email}: ${u.organizationIds}`));
    }
    
  } finally {
    await dataSource.destroy();
  }
}

testTypeORMQuery().catch(console.error);