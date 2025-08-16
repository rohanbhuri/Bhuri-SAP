import { Component, inject, signal } from '@angular/core';
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
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().leads }}</div>
          <div class="stat-label">Active Leads</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().deals }}</div>
          <div class="stat-label">Open Deals</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">\${{ formatCurrency(stats().pipelineValue) }}</div>
          <div class="stat-label">Pipeline Value</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openCrm()"
        >
          <mat-icon>business_center</mat-icon>
          Open CRM
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
export class CrmWidgetComponent {
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

  openCrm() {
    this.router.navigate(['/modules/crm']);
  }
}