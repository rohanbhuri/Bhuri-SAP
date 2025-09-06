import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { OrderManagementService } from '../order-management.service';

@Component({
  selector: 'app-order-analytics-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <div class="analytics-content">
      <mat-grid-list cols="4" rowHeight="200px" gutterSize="16px">
        <!-- Total Orders -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon total">
                <mat-icon>shopping_cart</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().totalOrders }}</div>
                <div class="stat-label">Total Orders</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Pending Orders -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon pending">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().pendingOrders }}</div>
                <div class="stat-label">Pending Orders</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Processing Orders -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon processing">
                <mat-icon>build</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().processingOrders }}</div>
                <div class="stat-label">Processing</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Delivered Orders -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon delivered">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().deliveredOrders }}</div>
                <div class="stat-label">Delivered</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Total Value -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon value">
                <mat-icon>attach_money</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">\${{ formatCurrency(stats().totalValue) }}</div>
                <div class="stat-label">Total Value</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Average Order Value -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon average">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">\${{ formatCurrency(stats().averageOrderValue) }}</div>
                <div class="stat-label">Avg Order Value</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Overdue Orders -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon overdue">
                <mat-icon>warning</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().overdueOrders }}</div>
                <div class="stat-label">Overdue Orders</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Shipped Orders -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon shipped">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().shippedOrders }}</div>
                <div class="stat-label">Shipped</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Status Distribution Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Order Status Distribution</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-chart">
            <div class="status-bar">
              <div class="status-item pending">
                <div class="status-label">Pending</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().pendingOrders)"></div>
                <div class="status-count">{{ stats().pendingOrders }}</div>
              </div>
              <div class="status-item confirmed">
                <div class="status-label">Confirmed</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().totalOrders - stats().pendingOrders - stats().processingOrders - stats().shippedOrders - stats().deliveredOrders - stats().cancelledOrders)"></div>
                <div class="status-count">{{ stats().totalOrders - stats().pendingOrders - stats().processingOrders - stats().shippedOrders - stats().deliveredOrders - stats().cancelledOrders }}</div>
              </div>
              <div class="status-item processing">
                <div class="status-label">Processing</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().processingOrders)"></div>
                <div class="status-count">{{ stats().processingOrders }}</div>
              </div>
              <div class="status-item shipped">
                <div class="status-label">Shipped</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().shippedOrders)"></div>
                <div class="status-count">{{ stats().shippedOrders }}</div>
              </div>
              <div class="status-item delivered">
                <div class="status-label">Delivered</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().deliveredOrders)"></div>
                <div class="status-count">{{ stats().deliveredOrders }}</div>
              </div>
              <div class="status-item cancelled">
                <div class="status-label">Cancelled</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().cancelledOrders)"></div>
                <div class="status-count">{{ stats().cancelledOrders }}</div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .analytics-content {
      padding: 24px;
    }

    .stat-card {
      height: 100%;
      background: var(--theme-surface);
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
      padding: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.total { background: linear-gradient(135deg, #2196F3, #21CBF3); }
    .stat-icon.pending { background: linear-gradient(135deg, #FF9800, #FFB74D); }
    .stat-icon.processing { background: linear-gradient(135deg, #9C27B0, #BA68C8); }
    .stat-icon.delivered { background: linear-gradient(135deg, #4CAF50, #81C784); }
    .stat-icon.value { background: linear-gradient(135deg, #FF5722, #FF8A65); }
    .stat-icon.average { background: linear-gradient(135deg, #607D8B, #90A4AE); }
    .stat-icon.overdue { background: linear-gradient(135deg, #F44336, #EF5350); }
    .stat-icon.shipped { background: linear-gradient(135deg, #3F51B5, #7986CB); }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--theme-on-surface);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
    }

    .chart-card {
      margin-top: 24px;
      background: var(--theme-surface);
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }

    .status-chart {
      padding: 16px 0;
    }

    .status-bar {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .status-label {
      min-width: 100px;
      font-weight: 500;
      color: var(--theme-on-surface);
    }

    .status-bar-fill {
      height: 24px;
      border-radius: 12px;
      min-width: 20px;
      transition: width 0.3s ease;
    }

    .status-item.pending .status-bar-fill { background: linear-gradient(90deg, #FF9800, #FFB74D); }
    .status-item.confirmed .status-bar-fill { background: linear-gradient(90deg, #2196F3, #21CBF3); }
    .status-item.processing .status-bar-fill { background: linear-gradient(90deg, #9C27B0, #BA68C8); }
    .status-item.shipped .status-bar-fill { background: linear-gradient(90deg, #3F51B5, #7986CB); }
    .status-item.delivered .status-bar-fill { background: linear-gradient(90deg, #4CAF50, #81C784); }
    .status-item.cancelled .status-bar-fill { background: linear-gradient(90deg, #F44336, #EF5350); }

    .status-count {
      font-weight: 600;
      color: var(--theme-on-surface);
      min-width: 30px;
      text-align: right;
    }

    /* Dark theme adjustments */
    :host-context(body.dark-theme) .stat-label {
      color: rgba(255, 255, 255, 0.6);
    }

    :host-context(body.dark-theme) .stat-card {
      border-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
    }

    :host-context(body.dark-theme) .chart-card {
      border-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
    }
  `]
})
export class OrderAnalyticsPageComponent implements OnInit {
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

  getStatusPercentage(count: number): number {
    const total = this.stats().totalOrders;
    return total > 0 ? (count / total) * 100 : 0;
  }
}
