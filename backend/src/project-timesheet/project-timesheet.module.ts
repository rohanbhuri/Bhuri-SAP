import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTimesheetController } from './project-timesheet.controller';
import { ProjectTimesheetService } from './project-timesheet.service';
import { Timesheet } from '../entities/timesheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet])],
  controllers: [ProjectTimesheetController],
  providers: [ProjectTimesheetService],
  exports: [ProjectTimesheetService],
})
export class ProjectTimesheetModule {}