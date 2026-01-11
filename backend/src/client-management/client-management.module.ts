import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClientManagementController } from './client-management.controller';
import { ClientManagementService } from './client-management.service';
import { ClientRequest } from '../entities/client-request.entity';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { ApiKey } from '../entities/api-key.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientRequest, Client, User, Organization, Role, Permission, ApiKey]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'rohanbhuri',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ClientManagementController],
  providers: [ClientManagementService],
  exports: [ClientManagementService]
})
export class ClientManagementModule {}
