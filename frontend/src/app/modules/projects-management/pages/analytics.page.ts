import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ProjectsManagementService, Project, ProjectStats } from '../projects-management.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    CurrencyPipe,
    PercentPipe,
  ],
  template: `
    <div class="analytics-page">
      <div class="page-header">
        <h1>Project Analytics</h1>
        <div class="actions">
          <button mat-button>
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>download</mat-icon>
            Export Report
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <mat-card class="metric-card">
          <div class="metric-content">
            <div class="metric-number">{{ stats().total }}</div>
            <div class="metric-label">Total Projects</div>
          </div>
          <mat-icon class="metric-icon">folder</mat-icon>
        </mat-card>

        <mat-card class="metric-card">
          <div class="metric-content">
            <div class="metric-number">{{ stats().active }}</div>
            <div class="metric-label">Active Projects</div>
          </div>
          <mat-icon class="metric-icon">play_circle</mat-icon>
        </mat-card>

        <mat-card class="metric-card">
          <div class="metric-content">
            <div class="metric-number">{{ stats().completed }}</div>
            <div class="metric-label">Completed</div>
          </div>
          <mat-icon class="metric-icon">check_circle</mat-icon>
        </mat-card>

        <mat-card class="metric-card">
          <div class="metric-content">
            <div class="metric-number">{{ stats().conversions }}</div>
            <div class="metric-label">Lead Conversions</div>
          </div>
          <mat-icon class="metric-icon">trending_up</mat-icon>
        </mat-card>
      </div>

      <!-- Project Health Overview -->
      <mat-card class="health-overview-card">
        <mat-card-header>
          <mat-card-title>Project Health Overview</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="health-stats">
            <div class="health-stat">
              <div class="health-indicator green"></div>
              <div class="health-info">
                <div class="health-count">{{ healthStats().green }}</div>
                <div class="health-label">Healthy</div>
              </div>
            </div>
            <div class="health-stat">
              <div class="health-indicator yellow"></div>
              <div class="health-info">
                <div class="health-count">{{ healthStats().yellow }}</div>
                <div class="health-label">At Risk</div>
              </div>
            </div>
            <div class="health-stat">
              <div class="health-indicator red"></div>
              <div class="health-info">
                <div class="health-count">{{ healthStats().red }}</div>
                <div class="health-label">Critical</div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Project Status Distribution -->
      <mat-card class="status-distribution-card">
        <mat-card-header>
          <mat-card-title>Project Status Distribution</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-bars">
            <div class="status-bar" *ngFor="let status of statusDistribution()">
              <div class="status-info">
                <span class="status-name">{{ status.name }}</span>
                <span class="status-count">{{ status.count }}</span>
              </div>
              <div class="progress-bar-container">
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="status.percentage"
                  [color]="getStatusBarColor(status.name)">
                </mat-progress-bar>
                <span class="percentage">{{ status.percentage | percent:'1.0-0' }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Budget Analysis -->
      <mat-card class="budget-analysis-card">
        <mat-card-header>
          <mat-card-title>Budget Analysis</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="budget-stats">
            <div class="budget-stat">
              <div class="budget-label">Total Budget</div>
              <div class="budget-value">{{ budgetAnalysis().totalBudget | currency:'USD' }}</div>
            </div>
            <div class="budget-stat">
              <div class="budget-label">Total Spent</div>
              <div class="budget-value">{{ budgetAnalysis().totalSpent | currency:'USD' }}</div>
            </div>
            <div class="budget-stat">
              <div class="budget-label">Remaining</div>
              <div class="budget-value">{{ budgetAnalysis().remaining | currency:'USD' }}</div>
            </div>
            <div class="budget-stat">
              <div class="budget-label">Utilization</div>
              <div class="budget-value">{{ budgetAnalysis().utilization | percent:'1.1-1' }}</div>
            </div>
          </div>
          <div class="budget-progress">
            <mat-progress-bar 
              mode="determinate" 
              [value]="budgetAnalysis().utilization * 100"
              [color]="getBudgetColor()">
            </mat-progress-bar>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Projects -->
      <mat-card class="recent-projects-card">
        <mat-card-header>
          <mat-card-title>Recent Projects</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="recent-projects-list">
            <div class="project-item" *ngFor="let project of recentProjects()">
              <div class="project-info">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-code">{{ project.code }}</div>
              </div>
              <div class="project-status">
                <mat-chip [color]="getStatusColor(project.status)">{{ project.status }}</mat-chip>
                <div class="project-stage">{{ project.stage }}</div>
              </div>
              <div class="project-progress">
                <mat-progress-bar mode="determinate" [value]="project.progress"></mat-progress-bar>
                <span>{{ project.progress }}%</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .analytics-page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
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

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .metric-card {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .metric-content {
        flex: 1;
      }

      .metric-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .metric-label {
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        font-size: 0.9rem;
      }

      .metric-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: color-mix(in srgb, var(--theme-on-surface) 30%, transparent);
      }

      .health-overview-card,
      .status-distribution-card,
      .budget-analysis-card,
      .recent-projects-card {
        margin-bottom: 24px;
      }

      .health-stats {
        display: flex;
        gap: 32px;
        justify-content: space-around;
      }

      .health-stat {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .health-indicator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }

      .health-indicator.green {
        background: #4caf50;
      }

      .health-indicator.yellow {
        background: #ff9800;
      }

      .health-indicator.red {
        background: #f44336;
      }

      .health-info {
        text-align: center;
      }

      .health-count {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .health-label {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .status-bars {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .status-bar {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .status-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-name {
        font-weight: 500;
        text-transform: capitalize;
      }

      .status-count {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .progress-bar-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .progress-bar-container mat-progress-bar {
        flex: 1;
      }

      .percentage {
        font-size: 0.9rem;
        min-width: 40px;
        text-align: right;
      }

      .budget-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .budget-stat {
        text-align: center;
      }

      .budget-label {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        margin-bottom: 4px;
      }

      .budget-value {
        font-size: 1.2rem;
        font-weight: 600;
      }

      .budget-progress {
        margin-top: 16px;
      }

      .recent-projects-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .project-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 16px;
        align-items: center;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 8px;
      }

      .project-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .project-name {
        font-weight: 500;
      }

      .project-code {
        font-size: 0.8rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        font-family: monospace;
      }

      .project-status {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: center;
      }

      .project-stage {
        font-size: 0.8rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        text-transform: capitalize;
      }

      .project-progress {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .project-progress mat-progress-bar {
        flex: 1;
      }

      .project-progress span {
        font-size: 0.8rem;
        min-width: 30px;
      }

      @media (max-width: 768px) {
        .metrics-grid {
          grid-template-columns: 1fr;
        }

        .health-stats {
          flex-direction: column;
          gap: 16px;
        }

        .budget-stats {
          grid-template-columns: 1fr 1fr;
        }

        .project-item {
          grid-template-columns: 1fr;
          gap: 12px;
        }
      }
    `,
  ],
})
export class AnalyticsPageComponent implements OnInit {
  private projectsService = inject(ProjectsManagementService);

  projects = signal<Project[]>([]);
  stats = signal<ProjectStats>({
    total: 0,
    active: 0,
    completed: 0,
    conversions: 0,
  });

  healthStats = signal({ green: 0, yellow: 0, red: 0 });
  statusDistribution = signal<any[]>([]);
  budgetAnalysis = signal({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    utilization: 0,
  });
  recentProjects = signal<Project[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projectsService.getStats().subscribe((stats) => {
      this.stats.set(stats);
    });

    this.projectsService.getProjects().subscribe((projects) => {
      this.projects.set(projects);
      this.calculateHealthStats(projects);
      this.calculateStatusDistribution(projects);
      this.calculateBudgetAnalysis(projects);
      this.setRecentProjects(projects);
    });
  }

  calculateHealthStats(projects: Project[]) {
    const health = { green: 0, yellow: 0, red: 0 };
    projects.forEach(project => {
      health[project.health as keyof typeof health]++;
    });
    this.healthStats.set(health);
  }

  calculateStatusDistribution(projects: Project[]) {
    const statusCounts: { [key: string]: number } = {};
    projects.forEach(project => {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
    });

    const distribution = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      count,
      percentage: (count / projects.length) * 100,
    }));

    this.statusDistribution.set(distribution);
  }

  calculateBudgetAnalysis(projects: Project[]) {
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const remaining = totalBudget - totalSpent;
    const utilization = totalBudget > 0 ? totalSpent / totalBudget : 0;

    this.budgetAnalysis.set({
      totalBudget,
      totalSpent,
      remaining,
      utilization,
    });
  }

  setRecentProjects(projects: Project[]) {
    const recent = projects
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5);
    this.recentProjects.set(recent);
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

  getStatusBarColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'accent';
      case 'on-hold': return 'warn';
      default: return 'primary';
    }
  }

  getBudgetColor(): string {
    const utilization = this.budgetAnalysis().utilization;
    if (utilization > 0.9) return 'warn';
    if (utilization > 0.7) return 'accent';
    return 'primary';
  }
}