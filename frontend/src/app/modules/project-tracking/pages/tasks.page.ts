import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe, NgIf } from '@angular/common';
import { ProjectTrackingService, ProjectTask } from '../project-tracking.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    NgIf,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Project Tasks</h2>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          New Task
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field>
              <mat-label>Filter by Status</mat-label>
              <mat-select>
                <mat-option value="all">All Statuses</mat-option>
                <mat-option value="todo">To Do</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="review">Review</mat-option>
                <mat-option value="done">Done</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Filter by Priority</mat-label>
              <mat-select>
                <mat-option value="all">All Priorities</mat-option>
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
                <mat-option value="critical">Critical</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Search Tasks</mat-label>
              <input matInput placeholder="Search by name...">
            </mat-form-field>
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
                  <mat-chip [color]="getStatusColor(task.status)">
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
                  <div class="assignee-info">
                    <mat-icon class="assignee-icon">person</mat-icon>
                    {{ task.assignedTo }}
                  </div>
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

              <ng-container matColumnDef="timeline">
                <th mat-header-cell *matHeaderCellDef>Timeline</th>
                <td mat-cell *matCellDef="let task">
                  <div class="timeline-info">
                    <div>Start: {{ task.startDate | date:'MMM dd' }}</div>
                    <div>Due: {{ task.dueDate | date:'MMM dd, yyyy' }}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let task">
                  <button mat-icon-button color="primary" title="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" title="Start" *ngIf="task.status === 'todo'">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" title="Complete" *ngIf="task.status === 'in-progress'">
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" title="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 24px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .filters {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }
      .table-container {
        overflow-x: auto;
      }
      .tasks-table {
        width: 100%;
      }
      .task-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .task-name {
        font-weight: 500;
      }
      .task-desc {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.6);
      }
      .assignee-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .assignee-icon {
        font-size: 1.2rem;
        color: rgba(0, 0, 0, 0.5);
      }
      .hours-info, .timeline-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .actual {
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.6);
      }
    `,
  ],
})
export class TasksPageComponent implements OnInit {
  private trackingService = inject(ProjectTrackingService);
  tasks = signal<ProjectTask[]>([]);
  displayedColumns = ['name', 'status', 'priority', 'assignedTo', 'hours', 'timeline', 'actions'];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.trackingService.getTasks().subscribe(data => {
      this.tasks.set(data);
    });
  }

  getStatusColor(status: string): string {
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