import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrManagementController } from './hr-management.controller';
import { HrManagementService } from './hr-management.service';
import { Employee } from '../entities/employee.entity';
import { Department } from '../entities/department.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { AuthModule } from '../auth/auth.module';
import { Attendance } from '../entities/attendance.entity';
import { LeaveRequest } from '../entities/leave.entity';
import { Shift } from '../entities/shift.entity';
import { Holiday } from '../entities/holiday.entity';
import { SalaryStructure, PayrollRun } from '../entities/payroll.entity';
import { Goal, ReviewCycle, Feedback } from '../entities/performance.entity';
import { ComplianceItem, ComplianceEvent, AuditLog } from '../entities/compliance.entity';
import { DocumentRecord } from '../entities/document.entity';
import { Asset, AssetAssignment } from '../entities/asset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Department,
      User,
      Organization,
      Role,
      Permission,
      Attendance,
      LeaveRequest,
      Shift,
      Holiday,
      SalaryStructure,
      PayrollRun,
      Goal,
      ReviewCycle,
      Feedback,
      ComplianceItem,
      ComplianceEvent,
      AuditLog,
      DocumentRecord,
      Asset,
      AssetAssignment,
    ]),
    AuthModule,
  ],
  controllers: [HrManagementController],
  providers: [HrManagementService],
  exports: [HrManagementService],
})
export class HrManagementModule {}