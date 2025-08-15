import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, ModuleEntity, Organization])
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService],
  exports: [UserManagementService]
})
export class UserManagementModule {}