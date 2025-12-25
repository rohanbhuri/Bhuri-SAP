import { Routes } from '@angular/router';
import { ClientManagementComponent } from './client-management.component';
import { PublicClientRequestComponent } from './components/public-client-request.component';

export const CLIENT_MANAGEMENT_ROUTES: Routes = [
  { path: '', component: ClientManagementComponent },
  { path: 'request-access', component: PublicClientRequestComponent }
];
