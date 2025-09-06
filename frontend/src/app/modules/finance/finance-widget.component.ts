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
    <div class="finance-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>account_balance_wallet</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Financial overview & invoicing</span>
        </div>
      </div>
      
      <div class="financial-summary">
        <div class="summary-item revenue">
          <div class="summary-icon">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="summary-content">
            <div class="summary-value">\${{ formatCurrency(stats().totalRevenue) }}</div>
            <div class="summary-label">Total Revenue</div>
          </div>
        </div>
        
        <div class="summary-item outstanding">
          <div class="summary-icon">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="summary-content">
            <div class="summary-value">\${{ formatCurrency(stats().outstandingAmount) }}</div>
            <div class="summary-label">Outstanding</div>
          </div>
        </div>
      </div>
      
      <div class="invoice-status">
        <div class="status-header">
          <span class="status-title">Invoice Status</span>
          <span class="status-count">{{ stats().totalInvoices }} total</span>
        </div>
        
        <div class="status-bars">
          <div class="status-bar">
            <div class="status-info">
              <span class="status-label">Paid</span>
              <span class="status-number">{{ stats().paidInvoices }}</span>
            </div>
            <div class="status-progress">
              <div class="status-fill paid" [style.width.%]="getPaidPercentage()"></div>
            </div>
          </div>
          
          <div class="status-bar">
            <div class="status-info">
              <span class="status-label">Overdue</span>
              <span class="status-number">{{ stats().overdueInvoices }}</span>
            </div>
            <div class="status-progress">
              <div class="status-fill overdue" [style.width.%]="getOverduePercentage()"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openFinance()">
          <mat-icon>receipt</mat-icon>
          Manage Finance
        </button>
      </div>
    </div>
  `,
  styles: [`
    .finance-widget {
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
      background: linear-gradient(135deg, #388E3C, #66BB6A);
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
    
    .financial-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .summary-item {
      padding: 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .summary-item.revenue {
      background: linear-gradient(135deg, color-mix(in srgb, #4CAF50 12%, transparent), color-mix(in srgb, #4CAF50 6%, transparent));
      border: 1px solid color-mix(in srgb, #4CAF50 20%, transparent);
    }
    
    .summary-item.outstanding {
      background: linear-gradient(135deg, color-mix(in srgb, #FF9800 12%, transparent), color-mix(in srgb, #FF9800 6%, transparent));
      border: 1px solid color-mix(in srgb, #FF9800 20%, transparent);
    }
    
    .summary-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .revenue .summary-icon {
      background: #4CAF50;
      color: white;
    }
    
    .outstanding .summary-icon {
      background: #FF9800;
      color: white;
    }
    
    .summary-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .summary-value {
      font-size: 1.3rem;
      font-weight: 700;
      line-height: 1;
    }
    
    .revenue .summary-value {
      color: #4CAF50;
    }
    
    .outstanding .summary-value {
      color: #FF9800;
    }
    
    .summary-label {
      font-size: 0.75rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 2px;
    }
    
    .invoice-status {
      flex: 1;
    }
    
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .status-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .status-count {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }
    
    .status-bars {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .status-bar {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .status-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status-label {
      font-size: 0.8rem;
      color: var(--theme-on-surface);
    }
    
    .status-number {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .status-progress {
      height: 4px;
      background: color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .status-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    
    .status-fill.paid {
      background: linear-gradient(90deg, #4CAF50, #66BB6A);
    }
    
    .status-fill.overdue {
      background: linear-gradient(90deg, #F44336, #EF5350);
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
export class FinanceWidgetComponent implements OnInit {
  private router = inject(Router);
  private financeService = inject(FinanceService);

  stats = signal({
    totalInvoices: 0,
    overdueInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    outstandingAmount: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.financeService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        // Fallback to mock data
        this.stats.set({
          totalInvoices: 89,
          overdueInvoices: 12,
          paidInvoices: 77,
          totalRevenue: 245000,
          outstandingAmount: 45000
        });
      },
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }
  
  getPaidPercentage(): number {
    const stats = this.stats();
    if (stats.totalInvoices === 0) return 0;
    return (stats.paidInvoices / stats.totalInvoices) * 100;
  }
  
  getOverduePercentage(): number {
    const stats = this.stats();
    if (stats.totalInvoices === 0) return 0;
    return (stats.overdueInvoices / stats.totalInvoices) * 100;
  }

  openFinance() {
    this.router.navigate(['/modules/finance']);
  }
}