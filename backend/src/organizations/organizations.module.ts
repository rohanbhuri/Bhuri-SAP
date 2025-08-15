import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Role, Permission])],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}