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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
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
  ],
})
export class AppModule {}