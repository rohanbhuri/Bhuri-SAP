import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe, CurrencyPipe } from '@angular/common';

import {
  ProjectsManagementService,
  Project,
  Deliverable,
  ProjectStats,
} from './projects-management.service';

@Component({
  selector: 'app-projects-management',
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
    CurrencyPipe,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Projects Management</span>
        </nav>
        <h1>Projects Management</h1>
        <p class="subtitle">Manage projects and deliverables</p>
      </div>

      <mat-tab-group class="projects-tabs">
        <mat-tab label="Projects">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Projects</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                New Project
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="projects()" class="projects-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Project</th>
                  <td mat-cell *matCellDef="let project">
                    <div class="project-info">
                      <div class="project-name">{{ project.name }}</div>
                      <div class="project-desc">{{ project.description }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let project">
                    <mat-chip [color]="getStatusColor(project.status)">
                      {{ project.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="progress">
                  <th mat-header-cell *matHeaderCellDef>Progress</th>
                  <td mat-cell *matCellDef="let project">
                    <div class="progress-container">
                      <mat-progress-bar
                        mode="determinate"
                        [value]="project.progress"
                      ></mat-progress-bar>
                      <span class="progress-text">{{ project.progress }}%</span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="budget">
                  <th mat-header-cell *matHeaderCellDef>Budget</th>
                  <td mat-cell *matCellDef="let project">
                    <div class="budget-info">
                      <div>{{ project.budget | currency:project.currency }}</div>
                      <div class="spent">Spent: {{ project.spent | currency:project.currency }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="dates">
                  <th mat-header-cell *matHeaderCellDef>Timeline</th>
                  <td mat-cell *matCellDef="let project">
                    <div class="date-info">
                      <div>{{ project.startDate | date:'MMM dd' }} - {{ project.endDate | date:'MMM dd, yyyy' }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let project">
                    <button mat-icon-button color="primary" title="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Delete">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="projectColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: projectColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Deliverables">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Deliverables</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                New Deliverable
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="deliverables()" class="deliverables-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Deliverable</th>
                  <td mat-cell *matCellDef="let deliverable">
                    <div class="deliverable-info">
                      <div class="deliverable-name">{{ deliverable.name }}</div>
                      <div class="deliverable-desc">{{ deliverable.description }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let deliverable">
                    <mat-chip [color]="getDeliverableStatusColor(deliverable.status)">
                      {{ deliverable.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="progress">
                  <th mat-header-cell *matHeaderCellDef>Progress</th>
                  <td mat-cell *matCellDef="let deliverable">
                    <div class="progress-container">
                      <mat-progress-bar
                        mode="determinate"
                        [value]="deliverable.progress"
                      ></mat-progress-bar>
                      <span class="progress-text">{{ deliverable.progress }}%</span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="dueDate">
                  <th mat-header-cell *matHeaderCellDef>Due Date</th>
                  <td mat-cell *matCellDef="let deliverable">
                    {{ deliverable.dueDate | date:'MMM dd, yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let deliverable">
                    <button mat-icon-button color="primary" title="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Delete">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="deliverableColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: deliverableColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Analytics">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Project Analytics</h2>
            </div>

            <div class="stats-grid">
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().total }}</div>
                  <div class="stat-label">Total Projects</div>
                </div>
                <mat-icon class="stat-icon">folder</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().active }}</div>
                  <div class="stat-label">Active Projects</div>
                </div>
                <mat-icon class="stat-icon">play_circle</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().completed }}</div>
                  <div class="stat-label">Completed</div>
                </div>
                <mat-icon class="stat-icon">check_circle</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().conversions }}</div>
                  <div class="stat-label">Lead Conversions</div>
                </div>
                <mat-icon class="stat-icon">trending_up</mat-icon>
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

      .projects-tabs {
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

      .projects-table, .deliverables-table {
        width: 100%;
      }

      .project-info, .deliverable-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .project-name, .deliverable-name {
        font-weight: 500;
      }

      .project-desc, .deliverable-desc {
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

      .budget-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .spent {
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
export class ProjectsManagementComponent implements OnInit {
  private projectsService = inject(ProjectsManagementService);

  projects = signal<Project[]>([]);
  deliverables = signal<Deliverable[]>([]);
  stats = signal<ProjectStats>({
    total: 0,
    active: 0,
    completed: 0,
    conversions: 0,
  });

  projectColumns = ['name', 'status', 'progress', 'budget', 'dates', 'actions'];
  deliverableColumns = ['name', 'status', 'progress', 'dueDate', 'actions'];

  ngOnInit() {
    this.loadProjects();
    this.loadDeliverables();
    this.loadStats();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe((data) => {
      this.projects.set(data);
    });
  }

  loadDeliverables() {
    // Load all deliverables from all projects
    this.projectsService.getProjects().subscribe((projects) => {
      const allDeliverables: Deliverable[] = [];
      projects.forEach(project => {
        this.projectsService.getProjectDeliverables(project._id).subscribe((deliverables) => {
          allDeliverables.push(...deliverables);
          this.deliverables.set([...allDeliverables]);
        });
      });
    });
  }

  loadStats() {
    this.projectsService.getStats().subscribe((data) => {
      this.stats.set(data);
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

  getDeliverableStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent';
      case 'in-progress': return 'primary';
      case 'review': return 'warn';
      default: return '';
    }
  }
}