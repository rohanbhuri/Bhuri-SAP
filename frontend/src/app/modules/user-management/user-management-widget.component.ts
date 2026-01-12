import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="user-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>people</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Active users & roles</span>
        </div>
      </div>
      
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-value">{{ totalUsers() }}</div>
          <div class="metric-label">Total Users</div>
          <div class="metric-trend">+{{ Math.floor(totalUsers() * 0.12) }} this month</div>
        </div>
        
        <div class="metric-card secondary">
          <div class="metric-value">{{ activeUsers() }}</div>
          <div class="metric-label">Active Now</div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="(activeUsers() / totalUsers()) * 100"></div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openUserManagement()">
          <mat-icon>settings</mat-icon>
          Manage Users
        </button>
      </div>
    </div>
  `,
  styles: [`
    .user-widget {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    /* Expanded view styles */
    :host-context([data-view="expanded"]) .user-widget {
      padding: 32px;
      gap: 24px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    :host-context([data-view="expanded"]) .header {
      gap: 20px;
    }
    
    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 80%, #fff));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    :host-context([data-view="expanded"]) .icon-container {
      width: 64px;
      height: 64px;
      border-radius: 16px;
    }
    
    :host-context([data-view="expanded"]) .icon-container mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .subtitle {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    :host-context([data-view="expanded"]) .subtitle {
      font-size: 1.2rem;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      flex: 1;

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
    
    :host-context([data-view="expanded"]) .metrics-grid {
      gap: 20px;
      grid-template-columns: 1fr 1fr;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    
    .metric-card {
      padding: 16px;
      border-radius: 12px;
      background: transparent;
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
    }
    
    :host-context([data-view="expanded"]) .metric-card {
      padding: 24px;
      border-radius: 16px;
    }
    
    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--theme-primary);
      line-height: 1;
    }
    
    :host-context([data-view="expanded"]) .metric-value {
      font-size: 3rem;
    }
    
    .metric-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin: 4px 0;
    }
    
    :host-context([data-view="expanded"]) .metric-label {
      font-size: 1rem;
      margin: 8px 0;
    }
    
    .metric-trend {
      font-size: 0.75rem;
      color: var(--theme-success);
      font-weight: 500;
    }
    
    :host-context([data-view="expanded"]) .metric-trend {
      font-size: 0.9rem;
    }
    
    .progress-bar {
      height: 4px;
      background: color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 8px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--theme-primary), var(--theme-accent));
      transition: width 0.3s ease;
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
    
    :host-context([data-view="expanded"]) .action-section button {
      height: 56px;
      font-size: 1.1rem;
      border-radius: 12px;
    }
    
    :host-context([data-view="expanded"]) .action-section button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `],
})
export class UserManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserManagementService);
  protected Math = Math;

  totalUsers = signal(0);
  activeUsers = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers.set(users.length);
        this.activeUsers.set(users.filter((u) => u.isActive).length);
      },
      error: () => {
        // Fallback to mock data
        this.totalUsers.set(0);
        this.activeUsers.set(0);
      },
    });
  }

  openUserManagement() {
    console.log('Navigating to user management...');
    this.router.navigate(['/modules/user-management']).then(
      (success) => console.log('Navigation success:', success),
      (error) => console.error('Navigation error:', error)
    );
  }
}
