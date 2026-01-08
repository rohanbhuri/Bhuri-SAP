import { Routes } from '@angular/router';
import { ClientManagementComponent } from './client-management.component';
import { PublicClientRequestComponent } from './components/public-client-request.component';
import { RequestLoginListComponent } from './components/request-login-list.component';
import { ClientsListComponent } from './components/clients-list.component';

export const CLIENT_MANAGEMENT_ROUTES: Routes = [
  { path: '', component: ClientManagementComponent },
  { path: 'request-access', component: PublicClientRequestComponent },
  { path: 'requests', component: RequestLoginListComponent },
  { path: 'clients', component: ClientsListComponent }
];
