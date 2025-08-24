import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/auth/login.component';
import { SignupComponent } from './pages/auth/signup.component';
import { SelectOrganizationComponent } from './pages/auth/select-organization.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/profile/edit-profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PreferencesComponent } from './pages/settings/preferences.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { SearchComponent } from './pages/search/search.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ModulesComponent } from './pages/modules/modules.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'select-organization',
    component: SelectOrganizationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'profile/edit',
    component: EditProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  {
    path: 'settings/preferences',
    component: PreferencesComponent,
    canActivate: [authGuard],
  },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [authGuard],
  },
  { path: 'modules', component: ModulesComponent, canActivate: [authGuard] },
  {
    path: 'modules/user-management',
    loadChildren: () =>
      import('./modules/user-management/user-management.routes').then(
        (m) => m.userManagementRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'modules/organization-management',
    loadChildren: () =>
      import(
        './modules/organization-management/organization-management.routes'
      ).then((m) => m.organizationManagementRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'modules/crm',
    loadChildren: () =>
      import('./modules/crm/crm.routes').then((m) => m.CRM_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'modules/my-organizations',
    loadChildren: () =>
      import('./modules/my-organizations/my-organizations.routes').then(
        (m) => m.MY_ORGANIZATIONS_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'modules/hr-management',
    loadChildren: () =>
      import('./modules/hr-management/hr-management.routes').then(
        (m) => m.HR_MANAGEMENT_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'modules/projects-management',
    loadChildren: () =>
      import('./modules/projects-management/projects-management.routes').then(
        (m) => m.PROJECTS_MANAGEMENT_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'modules/project-tracking',
    loadChildren: () =>
      import('./modules/project-tracking/project-tracking.routes').then(
        (m) => m.PROJECT_TRACKING_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'modules/project-timesheet',
    loadChildren: () =>
      import('./modules/project-timesheet/project-timesheet.routes').then(
        (m) => m.PROJECT_TIMESHEET_ROUTES
      ),
    canActivate: [authGuard],
  },

  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
