import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProjectTrackingService, TrackingStats } from './project-tracking.service';

@Component({
  selector: 'app-project-tracking-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().onTrack }}</div>
          <div class="stat-label">On Track</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().atRisk }}</div>
          <div class="stat-label">At Risk</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().delayed }}</div>
          <div class="stat-label">Delayed</div>
        </div>
      </div>
      <div class="widget-actions">
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>track_changes</mat-icon>
          Track Progress
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
export class ProjectTrackingWidgetComponent implements OnInit {
  private router = inject(Router);
  private trackingService = inject(ProjectTrackingService);
  stats = signal<TrackingStats>({
    totalProjects: 0,
    onTrack: 0,
    atRisk: 0,
    delayed: 0,
    completedMilestones: 0,
    pendingTasks: 0,
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.trackingService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  openModule() {
    this.router.navigate(['/modules/project-tracking']);
  }
}