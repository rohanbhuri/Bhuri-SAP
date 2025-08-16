import { Routes } from '@angular/router';

export const MY_ORGANIZATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./my-organizations.component').then(m => m.MyOrganizationsComponent)
  }
];