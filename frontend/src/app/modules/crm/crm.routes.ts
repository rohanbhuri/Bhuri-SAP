import { Routes } from '@angular/router';
import { CrmComponent } from './crm.component';
import { ContactsPageComponent } from './pages/contacts-page.component';
import { LeadsPageComponent } from './pages/leads-page.component';
import { DealsPageComponent } from './pages/deals-page.component';
import { TasksPageComponent } from './pages/tasks-page.component';
import { ReportsPageComponent } from './pages/reports-page.component';
import { FunnelDashboardComponent } from './pages/funnel-dashboard.component';
import { PipelineViewComponent } from './pages/pipeline-view.component';
import { EnquiriesListComponent } from './pages/enquiries-list.component';
import { OrdersListComponent } from './pages/orders-list.component';

export const CRM_ROUTES: Routes = [
  {
    path: '',
    component: CrmComponent
  },
  {
    path: 'funnel',
    component: FunnelDashboardComponent
  },
  {
    path: 'pipeline',
    component: PipelineViewComponent
  },
  {
    path: 'enquiries',
    component: EnquiriesListComponent
  },
  {
    path: 'orders',
    component: OrdersListComponent
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