import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Organization } from './entities/organization.entity';

async function updateOrganizationName() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const organizationRepository = app.get<MongoRepository<Organization>>(
      getRepositoryToken(Organization)
    );

    const result = await organizationRepository.updateMany(
      { name: 'Racconti Corporation' },
      { $set: { name: 'RACCONTI' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} organization(s)`);
    console.log('Organization name changed from "Racconti Corporation" to "RACCONTI"');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

updateOrganizationName();
