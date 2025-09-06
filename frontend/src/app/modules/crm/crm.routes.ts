import { Routes } from '@angular/router';
import { CrmComponent } from './crm.component';
import { ContactsPageComponent } from './pages/contacts-page.component';
import { LeadsPageComponent } from './pages/leads-page.component';
import { DealsPageComponent } from './pages/deals-page.component';
import { TasksPageComponent } from './pages/tasks-page.component';
import { ReportsPageComponent } from './pages/reports-page.component';

export const CRM_ROUTES: Routes = [
  {
    path: '',
    component: CrmComponent
  },
  {
    path: 'contacts',
    component: ContactsPageComponent
  },
  {
    path: 'leads',
    component: LeadsPageComponent
  },
  {
    path: 'deals',
    component: DealsPageComponent
  },
  {
    path: 'tasks',
    component: TasksPageComponent
  },
  {
    path: 'reports',
    component: ReportsPageComponent
  }
];