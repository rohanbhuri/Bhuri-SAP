import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().totalReports }}</div>
          <div class="stat-label">Total Reports</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().scheduledReports }}</div>
          <div class="stat-label">Scheduled</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().recentReports }}</div>
          <div class="stat-label">Recent</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openReports()"
        >
          <mat-icon>assessment</mat-icon>
          View Reports
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
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }

    .widget-actions {
      display: flex;
      justify-content: center;
    }

    button {
      width: 100%;
    }

    @media (max-width: 599px) {
      .widget-stats {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      
      .stat-number {
        font-size: 1.2rem;
      }
      
      .stat-label {
        font-size: 0.75rem;
      }
    }
  `],
})
export class ReportsManagementWidgetComponent implements OnInit {
  private router = inject(Router);

  stats = signal({
    totalReports: 0,
    scheduledReports: 0,
    recentReports: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Mock data for now
    this.stats.set({
      totalReports: 45,
      scheduledReports: 8,
      recentReports: 12
    });
  }

  openReports() {
    this.router.navigate(['/modules/reports-management']);
  }
}