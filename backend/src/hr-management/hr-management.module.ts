import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrManagementController } from './hr-management.controller';
import { HrManagementService } from './hr-management.service';
import { Employee } from '../entities/employee.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User, Organization]),
    AuthModule
  ],
  controllers: [HrManagementController],
  providers: [HrManagementService],
  exports: [HrManagementService]
})
export class HrManagementModule {}