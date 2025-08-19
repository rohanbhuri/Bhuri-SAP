import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Timesheet } from '../entities/timesheet.entity';
import { ObjectId } from 'mongodb';

async function seedTimesheetData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const timesheetRepo = app.get(getRepositoryToken(Timesheet));

  const fakeData = [];
  const today = new Date();
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    fakeData.push({
      employeeId: new ObjectId(),
      projectId: new ObjectId(),
      organizationId: new ObjectId(),
      date,
      hoursWorked: Math.floor(Math.random() * 8) + 1,
      description: [
        'Frontend Development',
        'Backend API Work',
        'Database Design',
        'Testing & QA',
        'Code Review',
        'Client Meeting',
        'Documentation',
        'Bug Fixes'
      ][Math.floor(Math.random() * 8)],
      status: ['draft', 'submitted', 'approved', 'rejected'][Math.floor(Math.random() * 4)],
      createdAt: new Date(),
    });
  }

  await timesheetRepo.insertMany(fakeData);
  console.log('Timesheet data seeded successfully');
  await app.close();
}

seedTimesheetData().catch(console.error);