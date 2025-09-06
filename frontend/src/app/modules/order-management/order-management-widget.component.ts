import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OrderManagementService } from './order-management.service';

@Component({
  selector: 'app-order-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().totalOrders }}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().pendingOrders }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">\${{ formatCurrency(stats().totalValue) }}</div>
          <div class="stat-label">Total Value</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openOrderManagement()"
        >
          <mat-icon>shopping_cart</mat-icon>
          Manage Orders
        </button>
      </div>
    </div>
  `,
  styles: [`
    .widget-content {
      padding: 16px;
    }

    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--theme-primary);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .widget-actions {
      display: flex;
      justify-content: center;
    }

    button {
      width: 100%;
    }
  `],
})
export class OrderManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private orderManagementService = inject(OrderManagementService);

  stats = signal({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalValue: 0,
    averageOrderValue: 0,
    overdueOrders: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.orderManagementService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        this.stats.set({
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalValue: 0,
          averageOrderValue: 0,
          overdueOrders: 0
        });
      },
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }

  openOrderManagement() {
    this.router.navigate(['/modules/order-management']);
  }
}
