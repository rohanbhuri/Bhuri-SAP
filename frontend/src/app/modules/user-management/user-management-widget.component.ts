import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-management-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="user-widget">
      <div class="widget-header-content">
        <p class="subtitle">Manage users, roles & permissions</p>
      </div>
      
      <div class="widget-body-content">
        <div class="widget-stats">
          <div class="stat-item primary">
            <mat-icon>people</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().totalUsers }}</span>
              <span class="stat-label">Users</span>
              <span class="stat-detail">{{ stats().activeUsers }} active</span>
            </div>
          </div>
          
          <div class="stat-item secondary">
            <mat-icon>admin_panel_settings</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().totalRoles }}</span>
              <span class="stat-label">Roles</span>
              <span class="stat-detail">Defined roles</span>
            </div>
          </div>
          
          <div class="stat-item tertiary">
            <mat-icon>security</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().totalPermissions }}</span>
              <span class="stat-label">Permissions</span>
              <span class="stat-detail">Access controls</span>
            </div>
          </div>
          
          <div class="stat-item security">
            <mat-icon>verified_user</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().mfaAdoption }}</span>
              <span class="stat-label">MFA Enabled</span>
              <span class="stat-detail">Secure accounts</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="widget-footer-actions">
        <div class="cta-grid">
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('users')">
            <mat-icon>people</mat-icon>
            <span>Users</span>
          </button>
          
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('roles')">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Roles</span>
          </button>
          
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('permissions')">
            <mat-icon>security</mat-icon>
            <span>Permissions</span>
          </button>
          
          <button mat-flat-button class="cta-btn analytics-btn" (click)="navigateToTab('analytics')">
            <mat-icon>analytics</mat-icon>
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-widget {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: transparent;
    }
    
    .subtitle {
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      padding: 0 16px;
      font-size: 0.9rem;
      margin-top: 4px;
    }
    
    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 16px;
    }
    
    :host-context([data-view="expanded"]) .widget-stats {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding: 24px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: color-mix(in srgb, var(--theme-surface) 96%, var(--theme-primary));
      border: 1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent);
      border-radius: 12px;
      transition: all 0.2s ease-in-out;
    }
    
    .stat-item:hover {
      transform: translateY(-2px);
      background: color-mix(in srgb, var(--theme-surface) 92%, var(--theme-primary));
      border-color: color-mix(in srgb, var(--theme-primary) 20%, transparent);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    :host-context([data-view="expanded"]) .stat-item {
      padding: 20px;
      border-radius: 16px;
    }

    .stat-item mat-icon {
      font-size: 1.2rem;
      width: 28px;
      height: 28px;
      color: var(--theme-primary);
      opacity: 0.8;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 22px;
      font-weight: 800;
      color: var(--theme-primary);
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-detail {
      font-size: 10px;
      color: color-mix(in srgb, var(--theme-on-surface) 40%, transparent);
      margin-top: 1px;
    }

    /* Stat item specific colors */
    .stat-item.primary { border-left: 3px solid var(--theme-primary); }
    .stat-item.secondary { border-left: 3px solid #673ab7; }
    .stat-item.tertiary { border-left: 3px solid #009688; }
    .stat-item.security { border-left: 3px solid #ff9800; }

    .widget-footer-actions {
      padding: 16px;
      margin-top: auto;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 5%, transparent);
    }
    
    .cta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    :host-context([data-view="expanded"]) .cta-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .cta-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: auto;
      padding: 14px 10px;
      background: color-mix(in srgb, var(--theme-primary) 12%, var(--theme-surface)) !important;
      color: var(--theme-primary) !important;
      border-radius: 14px;
      min-width: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent) !important;
      box-shadow: 0 4px 6px -1px color-mix(in srgb, var(--theme-on-surface) 5%, transparent);
    }

    .cta-btn mat-icon {
      margin: 0;
      font-size: 24px;
      width: 24px;
      height: 24px;
      transition: transform 0.3s ease;
    }

    .cta-btn span {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .analytics-btn {
      background: color-mix(in srgb, var(--theme-primary) 18%, var(--theme-surface)) !important;
      border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent) !important;
    }

    .cta-btn:hover {
      background: var(--theme-primary) !important;
      color: var(--theme-on-primary) !important;
      border-color: var(--theme-primary) !important;
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }
    
    .cta-btn:hover mat-icon {
      transform: scale(1.1);
    }
  `],
})
export class UserManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserManagementService);

  stats = signal({
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    mfaAdoption: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.userService.getAnalytics().subscribe({
      next: (analytics) => {
        this.stats.set({
          totalUsers: analytics.totalUsers || 0,
          activeUsers: analytics.activeUsers || 0,
          totalRoles: analytics.totalRoles || 0,
          totalPermissions: analytics.totalPermissions || 0,
          mfaAdoption: analytics.mfaAdoption || 0
        });
      },
      error: () => {
        // Fallback to basic user count if analytics fails
        this.userService.getUsers().subscribe(users => {
          this.stats.update(s => ({
            ...s,
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length
          }));
        });
      },
    });
  }

  navigateToTab(tabName: string) {
    this.router.navigate(['/modules/user-management/' + tabName]);
  }
}
