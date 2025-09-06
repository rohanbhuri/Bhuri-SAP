import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { RolesModule } from './roles/roles.module';
import { ModulesModule } from './modules/modules.module';
import { PreferencesModule } from './preferences/preferences.module';
import { UserManagementModule } from './user-management/user-management.module';
import { OrganizationManagementModule } from './organization-management/organization-management.module';
import { CrmModule } from './crm/crm.module';
import { HrManagementModule } from './hr-management/hr-management.module';
import { ProjectsManagementModule } from './projects-management/projects-management.module';
import { ProjectTrackingModule } from './project-tracking/project-tracking.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectTimesheetModule } from './project-timesheet/project-timesheet.module';
import { OrderManagementModule } from './order-management/order-management.module';
import { FinanceModule } from './finance/finance.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    RolesModule,
    ModulesModule,
    PreferencesModule,
    UserManagementModule,
    OrganizationManagementModule,
    CrmModule,
    HrManagementModule,
    ProjectsManagementModule,
    ProjectTrackingModule,
    MessagesModule,
    NotificationsModule,
    ProjectTimesheetModule,
    OrderManagementModule,
    FinanceModule,
  ],
})
export class AppModule {}