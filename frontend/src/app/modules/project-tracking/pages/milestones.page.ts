import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe, NgIf } from '@angular/common';
import { ProjectTrackingService, ProjectMilestone } from '../project-tracking.service';

@Component({
  selector: 'app-milestones-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    NgIf,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Project Milestones</h2>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          New Milestone
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field>
              <mat-label>Filter by Status</mat-label>
              <mat-select>
                <mat-option value="all">All Statuses</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="overdue">Overdue</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Search Milestones</mat-label>
              <input matInput placeholder="Search by name...">
            </mat-form-field>
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
                  <mat-chip [color]="getStatusColor(milestone.status)">
                    {{ milestone.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="progress">
                <th mat-header-cell *matHeaderCellDef>Progress</th>
                <td mat-cell *matCellDef="let milestone">
                  <div class="progress-container">
                    <mat-progress-bar mode="determinate" [value]="milestone.progress"></mat-progress-bar>
                    <span class="progress-text">{{ milestone.progress }}%</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="dueDate">
                <th mat-header-cell *matHeaderCellDef>Due Date</th>
                <td mat-cell *matCellDef="let milestone">
                  <div class="date-info">
                    <div>{{ milestone.dueDate | date:'MMM dd, yyyy' }}</div>
                    <div *ngIf="milestone.completedDate" class="completed-date">
                      Completed: {{ milestone.completedDate | date:'MMM dd' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let milestone">
                  <button mat-icon-button color="primary" title="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" title="Mark Complete" *ngIf="milestone.status !== 'completed'">
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
      }
      .table-container {
        overflow-x: auto;
      }
      .milestones-table {
        width: 100%;
      }
      .milestone-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .milestone-name {
        font-weight: 500;
      }
      .milestone-desc {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.6);
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
      .completed-date {
        font-size: 0.8rem;
        color: #4CAF50;
      }
    `,
  ],
})
export class MilestonesPageComponent implements OnInit {
  private trackingService = inject(ProjectTrackingService);
  milestones = signal<ProjectMilestone[]>([]);
  displayedColumns = ['name', 'status', 'progress', 'dueDate', 'actions'];

  ngOnInit() {
    this.loadMilestones();
  }

  loadMilestones() {
    this.trackingService.getMilestones().subscribe(data => {
      this.milestones.set(data);
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent';
      case 'in-progress': return 'primary';
      case 'overdue': return 'warn';
      default: return '';
    }
  }
}