import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ProjectsManagementService, Project } from '../projects-management.service';
import { ProjectDialogComponent } from '../dialogs/project-dialog.component';

@Component({
  selector: 'app-projects-page',
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
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <div class="projects-page">
      <div class="page-header">
        <h1>Projects</h1>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="openProjectDialog()">
            <mat-icon>add</mat-icon>
            New Project
          </button>
          <button mat-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item>
              <mat-icon>upload</mat-icon>
              Import Projects
            </button>
            <button mat-menu-item>
              <mat-icon>download</mat-icon>
              Export Projects
            </button>
          </mat-menu>
        </div>
      </div>

      <mat-card class="projects-table-card">
        <table mat-table [dataSource]="projects()" class="projects-table">
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let project">
              <span class="project-code">{{ project.code }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let project">
              <div class="project-info">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-desc">{{ project.description }}</div>
                <div class="project-tags" *ngIf="project.tags?.length">
                  <mat-chip *ngFor="let tag of project.tags">{{ tag }}</mat-chip>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let project">
              <div class="status-info">
                <mat-chip [color]="getStatusColor(project.status)">{{ project.status }}</mat-chip>
                <div class="stage">{{ project.stage }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="health">
            <th mat-header-cell *matHeaderCellDef>Health</th>
            <td mat-cell *matCellDef="let project">
              <div class="health-indicator" [class]="'health-' + project.health">
                <mat-icon>{{ getHealthIcon(project.health) }}</mat-icon>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="progress">
            <th mat-header-cell *matHeaderCellDef>Progress</th>
            <td mat-cell *matCellDef="let project">
              <div class="progress-container">
                <mat-progress-bar mode="determinate" [value]="project.progress"></mat-progress-bar>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="budget">
            <th mat-header-cell *matHeaderCellDef>Budget</th>
            <td mat-cell *matCellDef="let project">
              <div class="budget-info">
                <div class="budget">{{ project.budget | currency:project.currency }}</div>
                <div class="spent">Spent: {{ project.spent | currency:project.currency }}</div>
                <div class="billing-type">{{ project.billingType }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="timeline">
            <th mat-header-cell *matHeaderCellDef>Timeline</th>
            <td mat-cell *matCellDef="let project">
              <div class="timeline-info">
                <div>{{ project.startDate | date:'MMM dd' }} - {{ project.endDate | date:'MMM dd, yyyy' }}</div>
                <div class="converted" *ngIf="project.convertedFromLead">
                  <mat-icon>trending_up</mat-icon>
                  Converted from lead
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let project">
              <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #actionMenu="matMenu">
                <button mat-menu-item (click)="editProject(project)">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-menu-item>
                  <mat-icon>people</mat-icon>
                  Assign Team
                </button>
                <button mat-menu-item>
                  <mat-icon>assignment</mat-icon>
                  View Deliverables
                </button>
                <button mat-menu-item>
                  <mat-icon>receipt</mat-icon>
                  Generate Invoice
                </button>
                <button mat-menu-item (click)="deleteProject(project._id)">
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
      .projects-page {
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
        gap: 8px;
        align-items: center;
      }

      .projects-table-card {
        padding: 0;
        overflow: hidden;
      }

      .projects-table {
        width: 100%;
      }

      .project-code {
        font-family: monospace;
        background: var(--theme-surface-variant);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
      }

      .project-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .project-name {
        font-weight: 500;
      }

      .project-desc {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .project-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .project-tags mat-chip {
        font-size: 0.7rem;
        height: 20px;
      }

      .status-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .stage {
        font-size: 0.8rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        text-transform: capitalize;
      }

      .health-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .health-green {
        background: color-mix(in srgb, #4caf50 20%, transparent);
        color: #4caf50;
      }

      .health-yellow {
        background: color-mix(in srgb, #ff9800 20%, transparent);
        color: #ff9800;
      }

      .health-red {
        background: color-mix(in srgb, #f44336 20%, transparent);
        color: #f44336;
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

      .budget-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .budget {
        font-weight: 500;
      }

      .spent {
        font-size: 0.8rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .billing-type {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--theme-primary);
        font-weight: 500;
      }

      .timeline-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .converted {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: var(--theme-primary);
      }

      .converted mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    `,
  ],
})
export class ProjectsPageComponent implements OnInit {
  private projectsService = inject(ProjectsManagementService);
  private dialog = inject(MatDialog);

  projects = signal<Project[]>([]);
  displayedColumns = ['code', 'name', 'status', 'health', 'progress', 'budget', 'timeline', 'actions'];

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => {
        console.log('Loaded projects:', data);
        this.projects.set(data);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'accent';
      case 'on-hold': return 'warn';
      case 'cancelled': return '';
      default: return '';
    }
  }

  getHealthIcon(health: string): string {
    switch (health) {
      case 'green': return 'check_circle';
      case 'yellow': return 'warning';
      case 'red': return 'error';
      default: return 'help';
    }
  }

  openProjectDialog(project?: Project) {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (project) {
          this.updateProject(project._id, result);
        } else {
          this.createProject(result);
        }
      }
    });
  }

  editProject(project: Project) {
    this.openProjectDialog(project);
  }

  createProject(projectData: any) {
    this.projectsService.createProject(projectData).subscribe({
      next: (project) => {
        console.log('Project created:', project);
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creating project:', error);
      }
    });
  }

  updateProject(id: string, projectData: any) {
    this.projectsService.updateProject(id, projectData).subscribe(() => {
      this.loadProjects();
    });
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectsService.deleteProject(id).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}