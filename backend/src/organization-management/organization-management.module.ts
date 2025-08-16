import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationManagementController } from './organization-management.controller';
import { OrganizationManagementService } from './organization-management.service';
import { Organization } from '../entities/organization.entity';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { User } from '../entities/user.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationRequest, User, ModuleEntity, Role, Permission])
  ],
  controllers: [OrganizationManagementController],
  providers: [OrganizationManagementService],
  exports: [OrganizationManagementService]
})
export class OrganizationManagementModule {}