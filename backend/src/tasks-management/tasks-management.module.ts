import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksManagementController } from './tasks-management.controller';
import { TasksManagementService } from './tasks-management.service';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Role, Permission]),
    AuthModule
  ],
  controllers: [TasksManagementController],
  providers: [TasksManagementService],
  exports: [TasksManagementService]
})
export class TasksManagementModule {}