import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-user-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <div>
          <h2>User Analytics & Reports</h2>
          <p class="last-updated" *ngIf="lastUpdated()">Last updated: {{ lastUpdated() | date:'short' }}</p>
        </div>
        <button mat-icon-button (click)="refreshAnalytics()" [disabled]="loading()" matTooltip="Refresh Analytics">
          <mat-icon [class.spinning]="loading()">refresh</mat-icon>
        </button>
      </div>

      <div class="stats-grid" *ngIf="!loading()">
        <!-- Overview Stats -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon users">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalUsers }}</h3>
              <p>Total Users</p>
              <span class="stat-detail">{{ analytics().activeUsers }} active</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon roles">
              <mat-icon>admin_panel_settings</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalRoles }}</h3>
              <p>Roles</p>
              <span class="stat-detail">Across organization</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon permissions">
              <mat-icon>security</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalPermissions }}</h3>
              <p>Permissions</p>
              <span class="stat-detail">Granular controls</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon security">
              <mat-icon>verified_user</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().mfaAdoption }}</h3>
              <p>MFA Enabled</p>
              <span class="stat-detail">Users with 2FA</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-grid" *ngIf="!loading()">
        <!-- Role Distribution -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>User Role Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="distribution-list">
              <div *ngFor="let role of analytics().rolesDistribution" class="distribution-item">
                <div class="item-header">
                  <span class="label">{{ role.name }}</span>
                  <span class="count">{{ role.count }} users</span>
                </div>
                <div class="bar-container">
                  <div class="bar" [style.width.%]="(role.count / analytics().totalUsers) * 100"></div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Activity -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div *ngFor="let activity of analytics().recentActivity" class="activity-item">
                <div class="activity-icon">
                  <mat-icon>{{ activity.icon }}</mat-icon>
                </div>
                <div class="activity-details">
                  <span class="activity-message">{{ activity.message }}</span>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="loading-state" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading analytics...</p>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 0;
      max-width: 1400px;
    }
    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .analytics-header h2 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
    }
    .last-updated {
      margin: 0;
      font-size: 12px;
      color: #999;
    }
    .analytics-header button {
      transition: transform 0.3s ease;
    }
    .analytics-header button:active {
      transform: rotate(180deg);
    }
    .spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px !important;
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon {
      font-size: 1.2rem;
      width: 28px;
      height: 28px;
      color: white;
    }
    .stat-icon.users { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.roles { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.permissions { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.security { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    
    .stat-info {
      flex: 1;
      min-width: 0;
    }
    .stat-info h3 {
      margin: 0 0 4px 0;
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
    }
    .stat-info p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    .stat-detail {
      font-size: 12px;
      color: #999;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .dashboard-card {
      height: 100%;
    }

    .dashboard-card mat-card-header {
      padding: 20px 20px 10px !important;
    }

    .dashboard-card mat-card-title {
      font-size: 18px !important;
      font-weight: 600 !important;
    }

    .dashboard-card mat-card-content {
      padding: 0 20px 24px !important;
    }

    .distribution-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
    }

    .distribution-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }

    .item-header .label {
      font-weight: 500;
      color: #333;
    }

    .item-header .count {
      color: #666;
    }

    .bar-container {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 4px;
      transition: width 0.5s ease-out;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667eea;
    }

    .activity-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .activity-message {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .activity-time {
      font-size: 12px;
      color: #999;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .stats-grid, .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserAnalyticsPageComponent implements OnInit, OnDestroy {
  private userService = inject(UserManagementService);
  private route = inject(ActivatedRoute);
  
  loading = signal(true);
  lastUpdated = signal<Date | null>(null);
  private queryParamsSubscription?: Subscription;
  private currentTab = '';
  
  analytics = signal({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    mfaAdoption: 0,
    rolesDistribution: [] as any[],
    recentActivity: [] as any[]
  });

  ngOnInit() {
    this.loadAnalytics();
    
    // Subscribe to query params to detect tab changes
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      // If we're switching TO the analytics tab, refresh the data
      if (tab === 'analytics' && this.currentTab !== 'analytics') {
        console.log('Switched to analytics tab, refreshing data...');
        this.loadAnalytics();
      }
      this.currentTab = tab || '';
    });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  refreshAnalytics() {
    console.log('Manual refresh triggered');
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    this.userService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.lastUpdated.set(new Date());
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
