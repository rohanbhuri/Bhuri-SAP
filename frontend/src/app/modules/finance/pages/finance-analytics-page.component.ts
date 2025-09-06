import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-finance-analytics-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <div class="analytics-content">
      <mat-grid-list cols="4" rowHeight="200px" gutterSize="16px">
        <!-- Total Invoices -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon total">
                <mat-icon>receipt</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().totalInvoices }}</div>
                <div class="stat-label">Total Invoices</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Paid Invoices -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon paid">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().paidInvoices }}</div>
                <div class="stat-label">Paid Invoices</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Outstanding Amount -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon outstanding">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">\${{ formatCurrency(stats().outstandingAmount) }}</div>
                <div class="stat-label">Outstanding</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Total Revenue -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon revenue">
                <mat-icon>attach_money</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">\${{ formatCurrency(stats().totalRevenue) }}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Draft Invoices -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon draft">
                <mat-icon>edit</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().draftInvoices }}</div>
                <div class="stat-label">Draft Invoices</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Overdue Invoices -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon overdue">
                <mat-icon>warning</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().overdueInvoices }}</div>
                <div class="stat-label">Overdue</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Average Invoice Value -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon average">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">\${{ formatCurrency(stats().averageInvoiceValue) }}</div>
                <div class="stat-label">Avg Invoice Value</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Total Receipts -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon receipts">
                <mat-icon>receipt_long</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats().totalReceipts }}</div>
                <div class="stat-label">Total Receipts</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Invoice Status Distribution Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Invoice Status Distribution</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-chart">
            <div class="status-bar">
              <div class="status-item draft">
                <div class="status-label">Draft</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().draftInvoices)"></div>
                <div class="status-count">{{ stats().draftInvoices }}</div>
              </div>
              <div class="status-item sent">
                <div class="status-label">Sent</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().sentInvoices)"></div>
                <div class="status-count">{{ stats().sentInvoices }}</div>
              </div>
              <div class="status-item paid">
                <div class="status-label">Paid</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().paidInvoices)"></div>
                <div class="status-count">{{ stats().paidInvoices }}</div>
              </div>
              <div class="status-item overdue">
                <div class="status-label">Overdue</div>
                <div class="status-bar-fill" [style.width.%]="getStatusPercentage(stats().overdueInvoices)"></div>
                <div class="status-count">{{ stats().overdueInvoices }}</div>
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
    .stat-icon.paid { background: linear-gradient(135deg, #4CAF50, #81C784); }
    .stat-icon.outstanding { background: linear-gradient(135deg, #FF9800, #FFB74D); }
    .stat-icon.revenue { background: linear-gradient(135deg, #FF5722, #FF8A65); }
    .stat-icon.draft { background: linear-gradient(135deg, #607D8B, #90A4AE); }
    .stat-icon.overdue { background: linear-gradient(135deg, #F44336, #EF5350); }
    .stat-icon.average { background: linear-gradient(135deg, #9C27B0, #BA68C8); }
    .stat-icon.receipts { background: linear-gradient(135deg, #3F51B5, #7986CB); }

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

    .status-item.draft .status-bar-fill { background: linear-gradient(90deg, #607D8B, #90A4AE); }
    .status-item.sent .status-bar-fill { background: linear-gradient(90deg, #2196F3, #21CBF3); }
    .status-item.paid .status-bar-fill { background: linear-gradient(90deg, #4CAF50, #81C784); }
    .status-item.overdue .status-bar-fill { background: linear-gradient(90deg, #F44336, #EF5350); }

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
export class FinanceAnalyticsPageComponent implements OnInit {
  private financeService = inject(FinanceService);

  stats = signal({
    totalInvoices: 0,
    draftInvoices: 0,
    sentInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
    outstandingAmount: 0,
    overdueAmount: 0,
    averageInvoiceValue: 0,
    totalReceipts: 0,
    totalPayments: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.financeService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        this.stats.set({
          totalInvoices: 0,
          draftInvoices: 0,
          sentInvoices: 0,
          paidInvoices: 0,
          overdueInvoices: 0,
          totalRevenue: 0,
          outstandingAmount: 0,
          overdueAmount: 0,
          averageInvoiceValue: 0,
          totalReceipts: 0,
          totalPayments: 0
        });
      },
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }

  getStatusPercentage(count: number): number {
    const total = this.stats().totalInvoices;
    return total > 0 ? (count / total) * 100 : 0;
  }
}
