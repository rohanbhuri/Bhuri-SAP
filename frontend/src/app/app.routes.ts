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
import { MoreComponent } from './pages/more/more.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'select-organization', component: SelectOrganizationComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'settings/preferences', component: PreferencesComponent, canActivate: [authGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: 'modules', component: ModulesComponent, canActivate: [authGuard] },
  { 
    path: 'modules/user-management', 
    loadChildren: () => import('./modules/user-management/user-management.routes').then(m => m.userManagementRoutes),
    canActivate: [authGuard]
  },
  { 
    path: 'modules/crm', 
    loadChildren: () => import('./modules/crm/crm.routes').then(m => m.CRM_ROUTES),
    canActivate: [authGuard]
  },
  { path: 'more', component: MoreComponent, canActivate: [authGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];
