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
    <div class="orders-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>shopping_bag</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Order fulfillment status</span>
        </div>
      </div>
      
      <div class="revenue-card">
        <div class="revenue-amount">\${{ formatCurrency(stats().totalValue) }}</div>
        <div class="revenue-label">Total Revenue</div>
        <div class="revenue-trend">+{{ getTrendPercentage() }}% this month</div>
      </div>
      
      <div class="order-pipeline">
        <div class="pipeline-item">
          <div class="pipeline-number">{{ stats().totalOrders }}</div>
          <div class="pipeline-label">Total Orders</div>
          <div class="pipeline-bar">
            <div class="pipeline-fill total" style="width: 100%"></div>
          </div>
        </div>
        
        <div class="pipeline-item">
          <div class="pipeline-number">{{ stats().pendingOrders }}</div>
          <div class="pipeline-label">Pending</div>
          <div class="pipeline-bar">
            <div class="pipeline-fill pending" [style.width.%]="getPendingPercentage()"></div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openOrderManagement()">
          <mat-icon>inventory</mat-icon>
          Manage Orders
        </button>
      </div>
    </div>
  `,
  styles: [`
    .orders-widget {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #FF5722, #FF7043);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .subtitle {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    .revenue-card {
      padding: 16px;
      background: linear-gradient(135deg, color-mix(in srgb, #FF5722 8%, transparent), color-mix(in srgb, #FF5722 4%, transparent));
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, #FF5722 20%, transparent);
      text-align: center;
    }
    
    .revenue-amount {
      font-size: 2rem;
      font-weight: 700;
      color: #FF5722;
      line-height: 1;
    }
    
    .revenue-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin: 4px 0;
    }
    
    .revenue-trend {
      font-size: 0.75rem;
      color: var(--theme-success);
      font-weight: 500;
    }
    
    .order-pipeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }
    
    .pipeline-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .pipeline-number {
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .pipeline-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }
    
    .pipeline-bar {
      height: 6px;
      background: color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .pipeline-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .pipeline-fill.total {
      background: linear-gradient(90deg, #2196F3, #42A5F5);
    }
    
    .pipeline-fill.pending {
      background: linear-gradient(90deg, #FF9800, #FFB74D);
    }
    
    .action-section {
      margin-top: auto;
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
  `],
})
export class OrderManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private orderService = inject(OrderManagementService);

  stats = signal({
    totalOrders: 0,
    pendingOrders: 0,
    totalValue: 0
  });

  private trendPercentage = Math.floor(Math.random() * 15) + 5;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.orderService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        // Fallback to mock data
        this.stats.set({
          totalOrders: 156,
          pendingOrders: 23,
          totalValue: 89500
        });
      },
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }
  
  getPendingPercentage(): number {
    const stats = this.stats();
    if (stats.totalOrders === 0) return 0;
    return (stats.pendingOrders / stats.totalOrders) * 100;
  }
  
  getTrendPercentage(): number {
    return this.trendPercentage;
  }

  openOrderManagement() {
    this.router.navigate(['/modules/order-management']);
  }
}