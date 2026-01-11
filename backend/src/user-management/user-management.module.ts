import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';
import { ApiKey } from '../entities/api-key.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, ModuleEntity, Organization, ApiKey]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'rohanbhuri',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService],
  exports: [UserManagementService]
})
export class UserManagementModule {}
