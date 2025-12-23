import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Content Analytics</h2>
      </div>
      
      <div class="stats-grid">
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Content Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">{{ stats().pages }}</div>
                <div class="stat-label">Total Pages</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats().blogs }}</div>
                <div class="stat-label">Blog Posts</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats().published }}</div>
                <div class="stat-label">Published</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats().drafts }}</div>
                <div class="stat-label">Drafts</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>SEO Health</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="seo-stats">
              <div class="seo-item">
                <div class="seo-score good">{{ stats().seoOptimized }}</div>
                <div class="seo-label">SEO Optimized</div>
              </div>
              <div class="seo-item">
                <div class="seo-score warning">{{ stats().needsSeo }}</div>
                <div class="seo-label">Needs SEO</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivity()">
                <mat-icon [class]="'activity-icon ' + activity.type">{{ activity.icon }}</mat-icon>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .stat-item {
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    .stat-label {
      color: #666;
      font-size: 0.875rem;
    }
    .seo-stats {
      display: flex;
      justify-content: space-around;
    }
    .seo-item {
      text-align: center;
    }
    .seo-score {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .seo-score.good {
      color: #4CAF50;
    }
    .seo-score.warning {
      color: #FF9800;
    }
    .seo-label {
      color: #666;
      font-size: 0.875rem;
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .activity-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .activity-icon.page {
      background: #E3F2FD;
      color: #2196F3;
    }
    .activity-icon.blog {
      background: #FFF3E0;
      color: #FF9800;
    }
    .activity-text {
      font-weight: 500;
    }
    .activity-time {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class AnalyticsPageComponent implements OnInit {
  stats = signal({
    pages: 12,
    blogs: 8,
    published: 15,
    drafts: 5,
    seoOptimized: 14,
    needsSeo: 6
  });

  recentActivity = signal([
    { icon: 'article', type: 'page', text: 'About Us page updated', time: '2 hours ago' },
    { icon: 'article', type: 'blog', text: 'New blog post published', time: '5 hours ago' },
    { icon: 'article', type: 'page', text: 'Contact page created', time: '1 day ago' }
  ]);

  ngOnInit() {
    // Load analytics data
  }
}