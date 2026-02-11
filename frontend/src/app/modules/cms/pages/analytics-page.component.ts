import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-analytics-page',
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
          <h2>CMS Analytics & Reports</h2>
          <p class="last-updated" *ngIf="lastUpdated()">Last updated: {{ lastUpdated() | date:'short' }}</p>
        </div>
        <button mat-icon-button (click)="refreshAnalytics()" [disabled]="loading()" matTooltip="Refresh Analytics">
          <mat-icon [class.spinning]="loading()">refresh</mat-icon>
        </button>
      </div>

      <div class="loading-state" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading analytics...</p>
      </div>

      <div *ngIf="!loading()">
        <!-- Overview Stats -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon blogs">
                <mat-icon>article</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ analytics().totalBlogs }}</h3>
                <p>Blog Posts</p>
                <span class="stat-detail">{{ analytics().publishedBlogs }} published</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon news">
                <mat-icon>newspaper</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ analytics().totalNewsMedia }}</h3>
                <p>News & Media</p>
                <span class="stat-detail">{{ analytics().publishedNews }} published</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon featured">
                <mat-icon>star</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ analytics().featuredBlogs + analytics().featuredNews }}</h3>
                <p>Featured Content</p>
                <span class="stat-detail">{{ analytics().featuredBlogs }} blogs, {{ analytics().featuredNews }} news</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon drafts">
                <mat-icon>edit_note</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ analytics().draftBlogs + analytics().draftNews }}</h3>
                <p>Drafts</p>
                <span class="stat-detail">Work in progress</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Detailed Analytics -->
        <div class="detailed-analytics">
          <!-- Blog Tags -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon>article</mat-icon>
                Top Blog Tags
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="category-breakdown">
                <div *ngFor="let tag of analytics().topBlogTags" class="breakdown-item">
                  <span class="label">{{ tag.tag }}</span>
                  <div class="bar-container">
                    <div class="bar blog-bar" [style.width.%]="(tag.count / (analytics().topBlogTags[0]?.count || 1)) * 100"></div>
                  </div>
                  <span class="count">{{ tag.count }}</span>
                </div>
                <div *ngIf="analytics().topBlogTags.length === 0" class="empty-state">
                  <mat-icon>label_off</mat-icon>
                  <p>No blog tags available yet.</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- News Tags -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon>newspaper</mat-icon>
                Top News Tags
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="category-breakdown">
                <div *ngFor="let tag of analytics().topNewsTags" class="breakdown-item">
                  <span class="label">{{ tag.tag }}</span>
                  <div class="bar-container">
                    <div class="bar news-bar" [style.width.%]="(tag.count / (analytics().topNewsTags[0]?.count || 1)) * 100"></div>
                  </div>
                  <span class="count">{{ tag.count }}</span>
                </div>
                <div *ngIf="analytics().topNewsTags.length === 0" class="empty-state">
                  <mat-icon>label_off</mat-icon>
                  <p>No news tags available yet.</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Blog Content by Month -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon>trending_up</mat-icon>
                Blog Posts by Month
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="category-breakdown">
                <div *ngFor="let month of analytics().blogsByMonth" class="breakdown-item">
                  <span class="label">{{ formatMonth(month.month) }}</span>
                  <div class="bar-container">
                    <div class="bar blog-bar" [style.width.%]="(month.count / getMaxMonthCount(analytics().blogsByMonth)) * 100"></div>
                  </div>
                  <span class="count">{{ month.count }}</span>
                </div>
                <div *ngIf="analytics().blogsByMonth.length === 0" class="empty-state">
                  <mat-icon>calendar_today</mat-icon>
                  <p>No data available for the last 6 months.</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- News Content by Month -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon>trending_up</mat-icon>
                News Items by Month
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="category-breakdown">
                <div *ngFor="let month of analytics().newsByMonth" class="breakdown-item">
                  <span class="label">{{ formatMonth(month.month) }}</span>
                  <div class="bar-container">
                    <div class="bar news-bar" [style.width.%]="(month.count / getMaxMonthCount(analytics().newsByMonth)) * 100"></div>
                  </div>
                  <span class="count">{{ month.count }}</span>
                </div>
                <div *ngIf="analytics().newsByMonth.length === 0" class="empty-state">
                  <mat-icon>calendar_today</mat-icon>
                  <p>No data available for the last 6 months.</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Activity -->
        <div class="changes-section">
          <h3>Recent Activity (Last 7 Days)</h3>
          <div class="changes-grid">
            <mat-card class="change-card">
              <mat-card-content>
                <div class="change-header">
                  <mat-icon class="change-icon blogs">article</mat-icon>
                  <div>
                    <h4>Blog Updates</h4>
                    <p class="change-count">{{ analytics().recentChanges.blogs || 0 }} updates</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="change-card">
              <mat-card-content>
                <div class="change-header">
                  <mat-icon class="change-icon news">newspaper</mat-icon>
                  <div>
                    <h4>News Updates</h4>
                    <p class="change-count">{{ analytics().recentChanges.newsMedia || 0 }} updates</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
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
    .tab-content {
      padding: 24px 0;
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
      padding: 20px !important;
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
    .stat-icon.blogs { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.news { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.featured { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); }
    .stat-icon.drafts { background: linear-gradient(135deg, #ffa502 0%, #ff6348 100%); }
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
    .changes-section {
      margin-bottom: 32px;
    }
    .changes-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .changes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    .change-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .change-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .change-card mat-card-content {
      padding: 20px !important;
    }
    .change-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .change-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    .change-icon.blogs { background: rgba(102, 126, 234, 0.1); color: #667eea; }
    .change-icon.news { background: rgba(240, 147, 251, 0.1); color: #f093fb; }
    .change-header h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
    .change-count {
      margin: 0;
      font-size: 13px;
      color: #666;
    }
    .detailed-analytics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .detailed-analytics mat-card {
      height: 100%;
    }
    .detailed-analytics mat-card-header {
      padding: 20px 20px 16px !important;
    }
    .detailed-analytics mat-card-title {
      font-size: 16px !important;
      font-weight: 600 !important;
    }
    .detailed-analytics mat-card-content {
      padding: 0 20px 20px !important;
    }
    .category-breakdown {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .breakdown-item .label {
      min-width: 120px;
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }
    .bar-container {
      flex: 1;
      height: 28px;
      background: #f5f5f5;
      border-radius: 6px;
      overflow: hidden;
    }
    .bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
      border-radius: 6px;
    }
    .bar.blog-bar {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    .bar.news-bar {
      background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
    }
    .breakdown-item .count {
      min-width: 40px;
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: #667eea;
    }
    .breakdown-item .count.news-count {
      color: #f093fb;
    }
    .empty-state {
      text-align: center;
      padding: 20px;
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
      .analytics-container {
        padding: 16px;
      }
      .stats-grid,
      .changes-grid,
      .detailed-analytics {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  private cmsService = inject(CmsService);
  private route = inject(ActivatedRoute);
  
  loading = signal(true);
  lastUpdated = signal<Date | null>(null);
  private queryParamsSubscription?: Subscription;
  private currentTab = '';
  
  analytics = signal({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    featuredBlogs: 0,
    archivedBlogs: 0,
    totalNewsMedia: 0,
    publishedNews: 0,
    draftNews: 0,
    featuredNews: 0,
    archivedNews: 0,
    topBlogTags: [] as any[],
    topNewsTags: [] as any[],
    blogsByMonth: [] as any[],
    newsByMonth: [] as any[],
    recentChanges: { blogs: 0, newsMedia: 0 }
  });

  ngOnInit() {
    console.log('Analytics component initialized');
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
    console.log('Loading analytics...');
    this.loading.set(true);
    this.cmsService.getAnalytics().subscribe({
      next: (data) => {
        console.log('CMS Analytics data received:', data);
        // Ensure all required fields exist with defaults
        const analyticsData = {
          totalBlogs: data.totalBlogs || 0,
          publishedBlogs: data.publishedBlogs || 0,
          draftBlogs: data.draftBlogs || 0,
          featuredBlogs: data.featuredBlogs || 0,
          archivedBlogs: data.archivedBlogs || 0,
          totalNewsMedia: data.totalNewsMedia || 0,
          publishedNews: data.publishedNews || 0,
          draftNews: data.draftNews || 0,
          featuredNews: data.featuredNews || 0,
          archivedNews: data.archivedNews || 0,
          topBlogTags: data.topBlogTags || [],
          topNewsTags: data.topNewsTags || [],
          blogsByMonth: data.blogsByMonth || [],
          newsByMonth: data.newsByMonth || [],
          recentChanges: data.recentChanges || { blogs: 0, newsMedia: 0 }
        };
        this.analytics.set(analyticsData);
        this.lastUpdated.set(new Date());
        this.loading.set(false);
        console.log('Analytics loaded successfully');
      },
      error: (err) => {
        console.error('Error loading CMS analytics:', err);
        this.loading.set(false);
      }
    });
  }

  formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getMaxMonthCount(months: any[]): number {
    if (!months || months.length === 0) return 1;
    return Math.max(...months.map(m => m.count));
  }
}
