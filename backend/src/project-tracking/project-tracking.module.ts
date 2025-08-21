import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTrackingController } from './project-tracking.controller';
import { ProjectTrackingService } from './project-tracking.service';
import { Project } from '../entities/project.entity';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { ProjectDeliverable } from '../entities/project-deliverable.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMilestone,
      ProjectDeliverable,
      Task,
      User,
      Role,
      Permission
    ]),
    AuthModule
  ],
  controllers: [ProjectTrackingController],
  providers: [ProjectTrackingService],
  exports: [ProjectTrackingService],
})
export class ProjectTrackingModule {}