import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CrmService, CrmStats } from '../crm.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Reports & Analytics</h2>
      </div>
      
      <div class="reports-grid">
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ stats()?.contacts || 0 }}</div>
                <div class="stat-label">Total Contacts</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats()?.leads || 0 }}</div>
                <div class="stat-label">Active Leads</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats()?.deals || 0 }}</div>
                <div class="stat-label">Open Deals</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">\${{ stats()?.pipelineValue || 0 | number:'1.0-0' }}</div>
                <div class="stat-label">Pipeline Value</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Pending Tasks</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value large">{{ stats()?.pendingTasks || 0 }}</div>
            <div class="stat-label">Tasks requiring attention</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    .reports-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .stats-card { background: var(--theme-surface); border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); border-radius: 12px; box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent); }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .stat-item { text-align: center; }
    .stat-value { font-size: 32px; font-weight: 700; color: var(--theme-primary); margin-bottom: 8px; }
    .stat-value.large { font-size: 48px; text-align: center; }
    .stat-label { font-size: 14px; color: var(--theme-on-surface); opacity: 0.7; font-weight: 500; }
    @media (max-width: 768px) { .reports-grid { grid-template-columns: 1fr; } .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
  `]
})
export class ReportsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  stats = signal<CrmStats | null>(null);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.crmService.getDashboardStats().subscribe(stats => this.stats.set(stats));
  }
}