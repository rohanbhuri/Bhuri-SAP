import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { InvoicesPageComponent } from './pages/invoices-page.component';
import { ReceiptsPageComponent } from './pages/receipts-page.component';
import { PaymentsPageComponent } from './pages/payments-page.component';
import { FinanceAnalyticsPageComponent } from './pages/finance-analytics-page.component';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
    InvoicesPageComponent,
    ReceiptsPageComponent,
    PaymentsPageComponent,
    FinanceAnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Finance</span>
        </nav>
        <h1>Finance Management</h1>
        <p class="subtitle">Manage invoices, receipts, and payments</p>
      </div>

      <mat-tab-group class="finance-tabs">
        <mat-tab label="Invoices">
          <app-invoices-page></app-invoices-page>
        </mat-tab>
        <mat-tab label="Receipts">
          <app-receipts-page></app-receipts-page>
        </mat-tab>
        <mat-tab label="Payments">
          <app-payments-page></app-payments-page>
        </mat-tab>
        <mat-tab label="Analytics">
          <app-finance-analytics-page></app-finance-analytics-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent {}
