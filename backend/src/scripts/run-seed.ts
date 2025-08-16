import { DataSource } from 'typeorm';
import { seedModules } from './seed-modules';

const dataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db',
  database: 'beaxrm',
  entities: ['src/entities/*.entity.ts'],
  synchronize: true,
});

async function runSeed() {
  try {
    await dataSource.initialize();
    console.log('Database connected');
    
    await seedModules(dataSource);
    console.log('Modules seeded successfully');
    
    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding modules:', error);
    process.exit(1);
  }
}

runSeed();