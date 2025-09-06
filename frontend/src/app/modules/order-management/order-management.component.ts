import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { OrdersPageComponent } from './pages/orders-page.component';
import { OrderAnalyticsPageComponent } from './pages/order-analytics-page.component';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
    OrdersPageComponent,
    OrderAnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Order Management</span>
        </nav>
        <h1>Order Management</h1>
        <p class="subtitle">Manage orders, track status, and monitor fulfillment</p>
      </div>

      <mat-tab-group class="order-tabs">
        <mat-tab label="Orders">
          <app-orders-page></app-orders-page>
        </mat-tab>
        <mat-tab label="Analytics">
          <app-order-analytics-page></app-order-analytics-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent {}
