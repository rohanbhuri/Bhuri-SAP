import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { ModuleRequest } from '../entities/module-request.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity, Organization, User, Role, Permission, ModuleRequest]),
    NotificationsModule
  ],
  providers: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}