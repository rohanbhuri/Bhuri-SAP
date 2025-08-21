import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTimesheetController } from './project-timesheet.controller';
import { ProjectTimesheetService } from './project-timesheet.service';
import { Timesheet, TimesheetEntry } from '../entities/timesheet.entity';
import { ProjectInvoice } from '../entities/project-invoice.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Timesheet,
      TimesheetEntry,
      ProjectInvoice,
      Project,
      User,
      Role,
      Permission
    ]),
    AuthModule
  ],
  controllers: [ProjectTimesheetController],
  providers: [ProjectTimesheetService],
  exports: [ProjectTimesheetService],
})
export class ProjectTimesheetModule {}