import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ProjectsManagementService, Project, Deliverable } from '../projects-management.service';
import { DeliverableDialogComponent } from '../dialogs/deliverable-dialog.component';

@Component({
  selector: 'app-deliverables-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    DatePipe,
  ],
  template: `
    <div class="deliverables-page">
      <div class="page-header">
        <h1>Deliverables</h1>
        <div class="actions">
          <mat-form-field appearance="outline" class="project-filter">
            <mat-label>Filter by Project</mat-label>
            <mat-select [(value)]="selectedProjectId" (selectionChange)="onProjectChange()">
              <mat-option value="">All Projects</mat-option>
              <mat-option *ngFor="let project of projects()" [value]="project._id">
                {{ project.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openDeliverableDialog()">
            <mat-icon>add</mat-icon>
            New Deliverable
          </button>
        </div>
      </div>

      <mat-card class="deliverables-table-card">
        <table mat-table [dataSource]="filteredDeliverables()" class="deliverables-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Deliverable</th>
            <td mat-cell *matCellDef="let deliverable">
              <div class="deliverable-info">
                <div class="deliverable-name">{{ deliverable.name }}</div>
                <div class="deliverable-desc">{{ deliverable.description }}</div>
                <div class="deliverable-type">
                  <mat-chip>{{ deliverable.type }}</mat-chip>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="project">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let deliverable">
              <div class="project-name">{{ getProjectName(deliverable.projectId) }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let deliverable">
              <mat-chip [color]="getStatusColor(deliverable.status)">
                {{ deliverable.status }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="progress">
            <th mat-header-cell *matHeaderCellDef>Progress</th>
            <td mat-cell *matCellDef="let deliverable">
              <div class="progress-container">
                <mat-progress-bar mode="determinate" [value]="deliverable.progress"></mat-progress-bar>
                <span class="progress-text">{{ deliverable.progress }}%</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="assignment">
            <th mat-header-cell *matHeaderCellDef>Assignment</th>
            <td mat-cell *matCellDef="let deliverable">
              <div class="assignment-info">
                <div *ngIf="deliverable.assignedTo" class="assigned">
                  <mat-icon>person</mat-icon>
                  Assigned
                </div>
                <div *ngIf="deliverable.reviewerId" class="reviewer">
                  <mat-icon>rate_review</mat-icon>
                  Reviewer assigned
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="timeline">
            <th mat-header-cell *matHeaderCellDef>Timeline</th>
            <td mat-cell *matCellDef="let deliverable">
              <div class="timeline-info">
                <div class="due-date">Due: {{ deliverable.dueDate | date:'MMM dd, yyyy' }}</div>
                <div *ngIf="deliverable.completedDate" class="completed">
                  Completed: {{ deliverable.completedDate | date:'MMM dd, yyyy' }}
                </div>
                <div *ngIf="isOverdue(deliverable)" class="overdue">
                  <mat-icon>warning</mat-icon>
                  Overdue
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="billing">
            <th mat-header-cell *matHeaderCellDef>Billing</th>
            <td mat-cell *matCellDef="let deliverable">
              <div class="billing-info">
                <div class="billable" [class.non-billable]="!deliverable.billable">
                  {{ deliverable.billable ? 'Billable' : 'Non-billable' }}
                </div>
                <div *ngIf="deliverable.estimatedHours" class="hours">
                  Est: {{ deliverable.estimatedHours }}h
                </div>
                <div *ngIf="deliverable.actualHours" class="hours">
                  Actual: {{ deliverable.actualHours }}h
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let deliverable">
              <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #actionMenu="matMenu">
                <button mat-menu-item (click)="editDeliverable(deliverable)">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-menu-item>
                  <mat-icon>person_add</mat-icon>
                  Assign
                </button>
                <button mat-menu-item>
                  <mat-icon>check_circle</mat-icon>
                  Mark Complete
                </button>
                <button mat-menu-item>
                  <mat-icon>attach_file</mat-icon>
                  Add Attachment
                </button>
                <button mat-menu-item (click)="deleteDeliverable(deliverable._id)">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .deliverables-page {
        padding: 24px;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .page-header h1 {
        margin: 0;
        font-weight: 600;
      }

      .actions {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .project-filter {
        min-width: 200px;
      }

      .deliverables-table-card {
        padding: 0;
        overflow: hidden;
      }

      .deliverables-table {
        width: 100%;
      }

      .deliverable-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .deliverable-name {
        font-weight: 500;
      }

      .deliverable-desc {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .deliverable-type mat-chip {
        font-size: 0.7rem;
        height: 20px;
      }

      .project-name {
        font-weight: 500;
        color: var(--theme-primary);
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

      .assignment-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .assigned, .reviewer {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
      }

      .assigned {
        color: var(--theme-primary);
      }

      .reviewer {
        color: #ff9800;
      }

      .assigned mat-icon, .reviewer mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .timeline-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .due-date {
        font-weight: 500;
      }

      .completed {
        font-size: 0.8rem;
        color: #4caf50;
      }

      .overdue {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: #f44336;
      }

      .overdue mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .billing-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .billable {
        font-size: 0.8rem;
        color: #4caf50;
        font-weight: 500;
      }

      .non-billable {
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .hours {
        font-size: 0.7rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }
    `,
  ],
})
export class DeliverablesPageComponent implements OnInit {
  private projectsService = inject(ProjectsManagementService);
  private dialog = inject(MatDialog);

  projects = signal<Project[]>([]);
  deliverables = signal<Deliverable[]>([]);
  filteredDeliverables = signal<Deliverable[]>([]);
  selectedProjectId = '';

  displayedColumns = ['name', 'project', 'status', 'progress', 'assignment', 'timeline', 'billing', 'actions'];

  ngOnInit() {
    this.loadProjects();
    this.loadDeliverables();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe((data) => {
      this.projects.set(data);
    });
  }

  loadDeliverables() {
    this.projectsService.getProjects().subscribe((projects) => {
      const allDeliverables: Deliverable[] = [];
      projects.forEach(project => {
        this.projectsService.getProjectDeliverables(project._id).subscribe((deliverables) => {
          allDeliverables.push(...deliverables);
          this.deliverables.set([...allDeliverables]);
          this.filteredDeliverables.set([...allDeliverables]);
        });
      });
    });
  }

  onProjectChange() {
    if (this.selectedProjectId) {
      const filtered = this.deliverables().filter(d => d.projectId === this.selectedProjectId);
      this.filteredDeliverables.set(filtered);
    } else {
      this.filteredDeliverables.set(this.deliverables());
    }
  }

  getProjectName(projectId: string): string {
    const project = this.projects().find(p => p._id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent';
      case 'in-progress': return 'primary';
      case 'review': return 'warn';
      case 'rejected': return '';
      default: return '';
    }
  }

  isOverdue(deliverable: Deliverable): boolean {
    if (deliverable.status === 'completed') return false;
    return new Date(deliverable.dueDate) < new Date();
  }

  openDeliverableDialog(deliverable?: Deliverable) {
    const dialogRef = this.dialog.open(DeliverableDialogComponent, {
      width: '600px',
      data: { 
        deliverable,
        projectId: this.selectedProjectId,
        projects: this.projects()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (deliverable) {
          this.updateDeliverable(deliverable._id, result);
        } else {
          this.createDeliverable(result);
        }
      }
    });
  }

  editDeliverable(deliverable: Deliverable) {
    this.openDeliverableDialog(deliverable);
  }

  createDeliverable(deliverableData: any) {
    this.projectsService.createDeliverable(deliverableData.projectId, deliverableData).subscribe(() => {
      this.loadDeliverables();
    });
  }

  updateDeliverable(id: string, deliverableData: any) {
    this.projectsService.updateDeliverable(id, deliverableData).subscribe(() => {
      this.loadDeliverables();
    });
  }

  deleteDeliverable(id: string) {
    if (confirm('Are you sure you want to delete this deliverable?')) {
      this.projectsService.deleteDeliverable(id).subscribe(() => {
        this.loadDeliverables();
      });
    }
  }
}