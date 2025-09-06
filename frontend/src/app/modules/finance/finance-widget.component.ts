import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FinanceService } from './finance.service';

@Component({
  selector: 'app-finance-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().totalInvoices }}</div>
          <div class="stat-label">Total Invoices</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().paidInvoices }}</div>
          <div class="stat-label">Paid</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">\${{ formatCurrency(stats().totalRevenue) }}</div>
          <div class="stat-label">Revenue</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openFinance()"
        >
          <mat-icon>account_balance</mat-icon>
          Manage Finance
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
export class FinanceWidgetComponent implements OnInit {
  private router = inject(Router);
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

  openFinance() {
    this.router.navigate(['/modules/finance']);
  }
}
