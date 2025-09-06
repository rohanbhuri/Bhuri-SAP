import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProjectsManagementService, ProjectStats } from './projects-management.service';

@Component({
  selector: 'app-projects-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="projects-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>work</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Project portfolio overview</span>
        </div>
      </div>
      
      <div class="progress-section">
        <div class="completion-circle">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="circle" [attr.stroke-dasharray]="getCompletionPercentage() + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" class="percentage">{{ getCompletionPercentage() }}%</text>
          </svg>
          <div class="completion-label">Completion Rate</div>
        </div>
        
        <div class="project-stats">
          <div class="stat-row">
            <div class="stat-dot active"></div>
            <span class="stat-text">{{ stats().active }} Active</span>
          </div>
          <div class="stat-row">
            <div class="stat-dot completed"></div>
            <span class="stat-text">{{ stats().completed }} Completed</span>
          </div>
          <div class="stat-row">
            <div class="stat-dot total"></div>
            <span class="stat-text">{{ stats().total }} Total</span>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openModule()">
          <mat-icon>dashboard</mat-icon>
          View Projects
        </button>
      </div>
    </div>
  `,
  styles: [`
    .projects-widget {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3F51B5, #5C6BC0);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .subtitle {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    .progress-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: center;
      flex: 1;
    }
    
    .completion-circle {
      text-align: center;
    }
    
    .circular-chart {
      width: 80px;
      height: 80px;
    }
    
    .circle-bg {
      fill: none;
      stroke: color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
      stroke-width: 2.8;
    }
    
    .circle {
      fill: none;
      stroke: #3F51B5;
      stroke-width: 2.8;
      stroke-linecap: round;
      animation: progress 1s ease-in-out forwards;
    }
    
    .percentage {
      fill: #3F51B5;
      font-family: sans-serif;
      font-size: 0.5em;
      font-weight: bold;
      text-anchor: middle;
    }
    
    .completion-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 8px;
    }
    
    .project-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .stat-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .stat-dot.active {
      background: #4CAF50;
    }
    
    .stat-dot.completed {
      background: #2196F3;
    }
    
    .stat-dot.total {
      background: #FF9800;
    }
    
    .stat-text {
      font-size: 0.9rem;
      color: var(--theme-on-surface);
      font-weight: 500;
    }
    
    .action-section {
      margin-top: auto;
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
    
    @keyframes progress {
      0% {
        stroke-dasharray: 0 100;
      }
    }
  `],
})
export class ProjectsManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private projectsService = inject(ProjectsManagementService);
  stats = signal<ProjectStats>({
    total: 0,
    active: 0,
    completed: 0,
    conversions: 0,
  });
  
  getCompletionPercentage(): number {
    const stats = this.stats();
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.projectsService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  openModule() {
    this.router.navigate(['/modules/projects-management']);
  }
}