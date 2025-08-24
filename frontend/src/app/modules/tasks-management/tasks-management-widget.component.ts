import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().pending }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().inProgress }}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
      <div class="widget-actions">
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>task</mat-icon>
          Manage Tasks
        </button>
      </div>
    </div>
  `,
  styles: [`
    .widget-content { padding: 16px; }
    .widget-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .stat-item { text-align: center; }
    .stat-number { font-size: 1.4rem; font-weight: 700; color: var(--theme-primary); margin-bottom: 4px; }
    .stat-label { font-size: 0.8rem; color: rgba(0, 0, 0, 0.6); }
    .widget-actions { display: flex; justify-content: center; }
    button { width: 100%; }
  `],
})
export class TasksManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  stats = signal({ pending: 12, inProgress: 8, completed: 24 });

  ngOnInit() {
    // Simulate loading stats
    setTimeout(() => {
      this.stats.set({ pending: 12, inProgress: 8, completed: 24 });
    }, 500);
  }

  openModule() {
    this.router.navigate(['/modules/tasks-management']);
  }
}