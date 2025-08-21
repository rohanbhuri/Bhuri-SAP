import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsManagementController } from './projects-management.controller';
import { ProjectsManagementService } from './projects-management.service';
import { Project } from '../entities/project.entity';
import { ProjectPipeline } from '../entities/project-pipeline.entity';
import { ProjectDeliverable } from '../entities/project-deliverable.entity';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { LeadToProjectConversion } from '../entities/lead-to-project-conversion.entity';
import { ProjectTeamAssignment } from '../entities/project-team-assignment.entity';
import { Lead } from '../entities/lead.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectPipeline,
      ProjectDeliverable,
      ProjectMilestone,
      LeadToProjectConversion,
      ProjectTeamAssignment,
      Lead,
      User,
      Role,
      Permission
    ]),
    AuthModule
  ],
  controllers: [ProjectsManagementController],
  providers: [ProjectsManagementService],
  exports: [ProjectsManagementService]
})
export class ProjectsManagementModule {}