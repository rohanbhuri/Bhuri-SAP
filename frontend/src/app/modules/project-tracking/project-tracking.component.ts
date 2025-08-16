import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe, NgIf } from '@angular/common';

import {
  ProjectTrackingService,
  ProjectMilestone,
  ProjectTask,
  TrackingStats,
} from './project-tracking.service';

@Component({
  selector: 'app-project-tracking',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    DatePipe,
    NgIf,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Project Tracking</span>
        </nav>
        <h1>Project Tracking</h1>
        <p class="subtitle">Track project progress and milestones</p>
      </div>

      <mat-tab-group class="tracking-tabs">
        <mat-tab label="Milestones">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Project Milestones</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                New Milestone
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="milestones()" class="milestones-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Milestone</th>
                  <td mat-cell *matCellDef="let milestone">
                    <div class="milestone-info">
                      <div class="milestone-name">{{ milestone.name }}</div>
                      <div class="milestone-desc">{{ milestone.description }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let milestone">
                    <mat-chip [color]="getMilestoneStatusColor(milestone.status)">
                      {{ milestone.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="progress">
                  <th mat-header-cell *matHeaderCellDef>Progress</th>
                  <td mat-cell *matCellDef="let milestone">
                    <div class="progress-container">
                      <mat-progress-bar
                        mode="determinate"
                        [value]="milestone.progress"
                      ></mat-progress-bar>
                      <span class="progress-text">{{ milestone.progress }}%</span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="dueDate">
                  <th mat-header-cell *matHeaderCellDef>Due Date</th>
                  <td mat-cell *matCellDef="let milestone">
                    {{ milestone.dueDate | date:'MMM dd, yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let milestone">
                    <button mat-icon-button color="primary" title="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" title="Complete">
                      <mat-icon>check_circle</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="milestoneColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: milestoneColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Tasks">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Project Tasks</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                New Task
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="tasks()" class="tasks-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Task</th>
                  <td mat-cell *matCellDef="let task">
                    <div class="task-info">
                      <div class="task-name">{{ task.name }}</div>
                      <div class="task-desc">{{ task.description }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let task">
                    <mat-chip [color]="getTaskStatusColor(task.status)">
                      {{ task.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="priority">
                  <th mat-header-cell *matHeaderCellDef>Priority</th>
                  <td mat-cell *matCellDef="let task">
                    <mat-chip [color]="getPriorityColor(task.priority)">
                      {{ task.priority }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="assignedTo">
                  <th mat-header-cell *matHeaderCellDef>Assigned To</th>
                  <td mat-cell *matCellDef="let task">
                    {{ task.assignedTo }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="hours">
                  <th mat-header-cell *matHeaderCellDef>Hours</th>
                  <td mat-cell *matCellDef="let task">
                    <div class="hours-info">
                      <div>Est: {{ task.estimatedHours }}h</div>
                      <div *ngIf="task.actualHours" class="actual">Act: {{ task.actualHours }}h</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="dueDate">
                  <th mat-header-cell *matHeaderCellDef>Due Date</th>
                  <td mat-cell *matCellDef="let task">
                    {{ task.dueDate | date:'MMM dd, yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let task">
                    <button mat-icon-button color="primary" title="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" title="Complete">
                      <mat-icon>check_circle</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="taskColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: taskColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Analytics">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Tracking Analytics</h2>
            </div>

            <div class="stats-grid">
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().totalProjects }}</div>
                  <div class="stat-label">Total Projects</div>
                </div>
                <mat-icon class="stat-icon">folder</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().onTrack }}</div>
                  <div class="stat-label">On Track</div>
                </div>
                <mat-icon class="stat-icon">trending_up</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().atRisk }}</div>
                  <div class="stat-label">At Risk</div>
                </div>
                <mat-icon class="stat-icon">warning</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().delayed }}</div>
                  <div class="stat-label">Delayed</div>
                </div>
                <mat-icon class="stat-icon">schedule</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().completedMilestones }}</div>
                  <div class="stat-label">Completed Milestones</div>
                </div>
                <mat-icon class="stat-icon">flag</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().pendingTasks }}</div>
                  <div class="stat-label">Pending Tasks</div>
                </div>
                <mat-icon class="stat-icon">assignment</mat-icon>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 24px;
      }

      .breadcrumb {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        font-size: 0.9rem;
        margin-bottom: 8px;
      }
      .breadcrumb .current {
        color: var(--theme-on-surface);
      }

      h1 {
        margin: 0 0 6px;
        font-weight: 600;
      }
      .subtitle {
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
        margin: 0;
      }

      .tracking-tabs {
        background: var(--theme-surface);
        border-radius: 12px;
        overflow: hidden;
      }

      .tab-content {
        padding: 24px;
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .tab-header h2 {
        margin: 0;
        font-weight: 600;
      }

      .table-container {
        overflow-x: auto;
      }

      .milestones-table, .tasks-table {
        width: 100%;
      }

      .milestone-info, .task-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .milestone-name, .task-name {
        font-weight: 500;
      }

      .milestone-desc, .task-desc {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .progress-container {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 120px;
      }

      .progress-text {
        font-size: 0.8rem;
        min-width: 30px;
      }

      .hours-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .actual {
        font-size: 0.8rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-content {
        flex: 1;
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.9rem;
      }

      .stat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: rgba(0, 0, 0, 0.3);
      }

      mat-chip {
        font-size: 0.75rem;
        height: 24px;
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProjectTrackingComponent implements OnInit {
  private trackingService = inject(ProjectTrackingService);

  milestones = signal<ProjectMilestone[]>([]);
  tasks = signal<ProjectTask[]>([]);
  stats = signal<TrackingStats>({
    totalProjects: 0,
    onTrack: 0,
    atRisk: 0,
    delayed: 0,
    completedMilestones: 0,
    pendingTasks: 0,
  });

  milestoneColumns = ['name', 'status', 'progress', 'dueDate', 'actions'];
  taskColumns = ['name', 'status', 'priority', 'assignedTo', 'hours', 'dueDate', 'actions'];

  ngOnInit() {
    this.loadMilestones();
    this.loadTasks();
    this.loadStats();
  }

  loadMilestones() {
    this.trackingService.getMilestones().subscribe((data) => {
      this.milestones.set(data);
    });
  }

  loadTasks() {
    this.trackingService.getTasks().subscribe((data) => {
      this.tasks.set(data);
    });
  }

  loadStats() {
    this.trackingService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  getMilestoneStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent';
      case 'in-progress': return 'primary';
      case 'overdue': return 'warn';
      default: return '';
    }
  }

  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'done': return 'accent';
      case 'in-progress': return 'primary';
      case 'review': return 'warn';
      default: return '';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'warn';
      case 'high': return 'accent';
      case 'medium': return 'primary';
      default: return '';
    }
  }
}