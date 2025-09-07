import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { User } from '../entities/user.entity';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { Employee } from '../entities/employee.entity';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Contact } from '../entities/contact.entity';
import { Lead } from '../entities/lead.entity';
import { Deal } from '../entities/deal.entity';
import { Department } from '../entities/department.entity';
import { Module as ModuleEntity } from '../entities/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Permission,
      Role,
      Organization,
      Employee,
      Project,
      Task,
      Contact,
      Lead,
      Deal,
      Department,
      ModuleEntity,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}