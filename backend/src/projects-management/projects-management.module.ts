import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsManagementController } from './projects-management.controller';
import { ProjectsManagementService } from './projects-management.service';
import { Project } from '../entities/project.entity';
import { Timesheet } from '../entities/timesheet.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Timesheet, User, Role, Permission]),
    AuthModule
  ],
  controllers: [ProjectsManagementController],
  providers: [ProjectsManagementService],
  exports: [ProjectsManagementService]
})
export class ProjectsManagementModule {}