import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { ContactsPageComponent } from './pages/contacts-page.component';
import { LeadsPageComponent } from './pages/leads-page.component';
import { DealsPageComponent } from './pages/deals-page.component';
import { TasksPageComponent } from './pages/tasks-page.component';
import { ReportsPageComponent } from './pages/reports-page.component';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
    ContactsPageComponent,
    LeadsPageComponent,
    DealsPageComponent,
    TasksPageComponent,
    ReportsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">CRM</span>
        </nav>
        <h1>Customer Relationship Management</h1>
        <p class="subtitle">Manage your contacts, leads, deals, and sales pipeline</p>
      </div>

      <mat-tab-group class="crm-tabs">
        <mat-tab label="Contacts">
          <app-contacts-page></app-contacts-page>
        </mat-tab>
        <mat-tab label="Leads">
          <app-leads-page></app-leads-page>
        </mat-tab>
        <mat-tab label="Deals">
          <app-deals-page></app-deals-page>
        </mat-tab>
        <mat-tab label="Tasks">
          <app-tasks-page></app-tasks-page>
        </mat-tab>
        <mat-tab label="Reports">
          <app-reports-page></app-reports-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./crm.component.css']
})
export class CrmComponent {}