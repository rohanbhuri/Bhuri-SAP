import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProjectTimesheetService, TimesheetStats } from './project-timesheet.service';

@Component({
  selector: 'app-project-timesheet-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().thisWeekHours }}</div>
          <div class="stat-label">This Week</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().billableHours }}</div>
          <div class="stat-label">Billable</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().pendingApprovals }}</div>
          <div class="stat-label">Pending</div>
        </div>
      </div>
      <div class="widget-actions">
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>schedule</mat-icon>
          Manage Timesheet
        </button>
      </div>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
})
export class ProjectTimesheetWidgetComponent implements OnInit {
  private router = inject(Router);
  private timesheetService = inject(ProjectTimesheetService);
  stats = signal<TimesheetStats>({
    totalHours: 0,
    billableHours: 0,
    totalProjects: 0,
    pendingApprovals: 0,
    thisWeekHours: 0,
    totalRevenue: 0,
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.timesheetService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  openModule() {
    this.router.navigate(['/modules/project-timesheet']);
  }
}