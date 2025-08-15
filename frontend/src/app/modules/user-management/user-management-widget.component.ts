import { Component, inject, signal } from '@angular/core';
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
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ totalUsers() }}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ activeUsers() }}</div>
          <div class="stat-label">Active</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openUserManagement()"
        >
          <mat-icon>people</mat-icon>
          Manage Users
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .widget-content {
        padding: 16px;
      }

      .widget-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .widget-actions {
        display: flex;
        justify-content: center;
      }

      button {
        width: 100%;
      }
    `,
  ],
})
export class UserManagementWidgetComponent {
  private router = inject(Router);
  private userService = inject(UserManagementService);

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
