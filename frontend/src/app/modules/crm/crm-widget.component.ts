import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CrmService } from './crm.service';

@Component({
  selector: 'app-crm-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="crm-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>business_center</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Sales pipeline & leads</span>
        </div>
      </div>
      
      <div class="pipeline-overview">
        <div class="pipeline-value">
          <div class="value">\${{ formatCurrency(stats().pipelineValue) }}</div>
          <div class="label">Pipeline Value</div>
        </div>
        <div class="conversion-rate">
          <div class="rate">{{ getConversionRate() }}%</div>
          <div class="label">Conversion</div>
        </div>
      </div>
      
      <div class="metrics-row">
        <div class="metric">
          <div class="metric-number leads">{{ stats().leads }}</div>
          <div class="metric-label">Active Leads</div>
        </div>
        <div class="metric">
          <div class="metric-number deals">{{ stats().deals }}</div>
          <div class="metric-label">Open Deals</div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openCrm()">
          <mat-icon>trending_up</mat-icon>
          Open CRM
        </button>
      </div>
    </div>
  `,
  styles: [`
    .crm-widget {
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
      background: linear-gradient(135deg, #4CAF50, #66BB6A);
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
    
    .pipeline-overview {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, color-mix(in srgb, #4CAF50 10%, transparent), color-mix(in srgb, #4CAF50 5%, transparent));
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, #4CAF50 20%, transparent);
    }
    
    .pipeline-value .value {
      font-size: 2.2rem;
      font-weight: 700;
      color: #4CAF50;
      line-height: 1;
    }
    
    .conversion-rate .rate {
      font-size: 1.8rem;
      font-weight: 700;
      color: #FF9800;
      line-height: 1;
    }
    
    .pipeline-value .label,
    .conversion-rate .label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 4px;
    }
    
    .metrics-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .metric {
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
    }
    
    .metric-number {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1;
    }
    
    .metric-number.leads {
      color: #2196F3;
    }
    
    .metric-number.deals {
      color: #FF5722;
    }
    
    .metric-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin-top: 4px;
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
export class CrmWidgetComponent implements OnInit {
  private router = inject(Router);
  private crmService = inject(CrmService);

  stats = signal({
    contacts: 0,
    leads: 0,
    deals: 0,
    pendingTasks: 0,
    pipelineValue: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.crmService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        this.stats.set({
          contacts: 0,
          leads: 0,
          deals: 0,
          pendingTasks: 0,
          pipelineValue: 0
        });
      },
    });
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }
  
  getConversionRate(): number {
    const stats = this.stats();
    if (stats.leads === 0) return 0;
    return Math.round((stats.deals / stats.leads) * 100);
  }

  openCrm() {
    this.router.navigate(['/modules/crm']);
  }
}