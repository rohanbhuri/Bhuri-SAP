import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { CmsService } from './cms.service';

@Component({
  selector: 'app-cms-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
      <div class="cms-widget">
      <div>
        <div class="widget-stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats().pages }}</div>
            <div class="stat-label">Pages</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats().blogs }}</div>
            <div class="stat-label">Blog Posts</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats().drafts }}</div>
            <div class="stat-label">Drafts</div>
          </div>
        </div>

        <div class="recent-content">
          <h4>Recent Activity</h4>
          <div class="content-list">
            <div class="content-item" *ngFor="let item of recentContent()">
              <mat-icon [class]="'content-icon ' + item.type">{{ item.icon }}</mat-icon>
              <div class="content-info">
                <div class="content-title">{{ item.title }}</div>
                <div class="content-meta">{{ item.status }} • {{ item.date }}</div>
              </div>
              <mat-chip [color]="getStatusColor(item.status)" class="status-chip">
                {{ item.status }}
              </mat-chip>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button mat-button (click)="navigateToPages()">
          <mat-icon>article</mat-icon>
          Manage Pages
        </button>
        <button mat-button (click)="navigateToBlogs()">
          <mat-icon>article</mat-icon>
          Manage Blogs
        </button>
        <button mat-button (click)="navigateToCms()">
          <mat-icon>dashboard</mat-icon>
          View All
        </button>
      </div>
      </div>
  `,
  styles: [`
    .cms-widget {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    /* Compact view styles */
    :host-context([data-view="compact"]) .cms-widget {
      mat-card-header {
        padding: 8px;
      }
      
      mat-card-title {
        font-size: 0.8rem;
      }
      
      mat-card-subtitle {
        font-size: 0.7rem;
        display: none;
      }
      
      mat-card-content {
        padding: 8px;
      }
      
      mat-card-actions {
        padding: 6px;
        gap: 4px;
      }
    }

    .widget-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host-context([data-view="compact"]) .widget-avatar {
      width: 24px;
      height: 24px;
      
      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .widget-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    :host-context([data-view="compact"]) .widget-stats {
      gap: 4px;
      margin-bottom: 8px;
      padding: 6px;
      border-radius: 4px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 0.25rem;
    }

    :host-context([data-view="compact"]) .stat-value {
      font-size: 1rem;
      margin-bottom: 2px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    :host-context([data-view="compact"]) .stat-label {
      font-size: 0.6rem;
    }

    .recent-content h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
    }

    :host-context([data-view="compact"]) .recent-content h4 {
      font-size: 0.7rem;
      margin: 0 0 6px 0;
    }

    .content-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    :host-context([data-view="compact"]) .content-list {
      gap: 4px;
    }

    .content-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 6px;
      background: #fafafa;
    }

    :host-context([data-view="compact"]) .content-item {
      gap: 4px;
      padding: 3px;
      border-radius: 3px;
    }

    .content-icon {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .content-icon.page {
      background: #e3f2fd;
      color: #2196f3;
    }

    .content-icon.blog {
      background: #fff3e0;
      color: #ff9800;
    }

    .content-info {
      flex: 1;
    }

    .content-title {
      font-weight: 500;
      font-size: 0.875rem;
      color: #333;
      margin-bottom: 0.125rem;
    }

    :host-context([data-view="compact"]) .content-title {
      font-size: 0.6rem;
      margin-bottom: 1px;
    }

    .content-meta {
      font-size: 0.75rem;
      color: #666;
    }

    :host-context([data-view="compact"]) .content-meta {
      font-size: 0.55rem;
    }

    .status-chip {
      font-size: 0.75rem;
      height: 20px;
    }

    :host-context([data-view="compact"]) .status-chip {
      font-size: 0.55rem;
      height: 16px;
      display: none;
    }

    mat-card-actions {
      margin-top: auto;
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    mat-card-actions button {
      flex: 1;
      min-width: 120px;
    }

    :host-context([data-view="compact"]) mat-card-actions button {
      min-width: auto;
      font-size: 0.6rem;
      height: 24px;
      padding: 0 6px;
      
      mat-icon {
        font-size: 12px;
        width: 12px;
        height: 12px;
        margin-right: 2px;
      }
    }

    @media (max-width: 768px) {
      .widget-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      mat-card-actions {
        flex-direction: column;
      }
      
      mat-card-actions button {
        width: 100%;
      }
    }

    /* Compact mode mobile adjustments */
    :host-context([data-view="compact"]) {
      @media (max-width: 768px) {
        .widget-stats {
          grid-template-columns: 1fr;
        }
        
        .recent-content {
          display: none;
        }
        
        mat-card-actions {
          flex-direction: row;
          justify-content: center;
        }
        
        mat-card-actions button {
          width: auto;
          flex: 1;
        }
      }
    }
  `]
})
export class CmsWidgetComponent implements OnInit {
  private router = inject(Router);
  private cmsService = inject(CmsService);

  stats = signal({
    pages: 0,
    blogs: 0,
    drafts: 0
  });

  recentContent = signal([
    {
      title: 'About Us Page',
      status: 'published',
      date: '2 hours ago',
      type: 'page',
      icon: 'article'
    },
    {
      title: 'Company News Blog',
      status: 'draft',
      date: '5 hours ago',
      type: 'blog',
      icon: 'article'
    },
    {
      title: 'Contact Page',
      status: 'published',
      date: '1 day ago',
      type: 'page',
      icon: 'article'
    }
  ]);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Load pages
    this.cmsService.getPages().subscribe(pages => {
      const drafts = pages.filter(p => p.status === 'draft').length;
      this.stats.update(stats => ({ ...stats, pages: pages.length, drafts }));
    });

    // Load blogs
    this.cmsService.getBlogs().subscribe(blogs => {
      const blogDrafts = blogs.filter(b => b.status === 'draft').length;
      this.stats.update(stats => ({
        ...stats,
        blogs: blogs.length,
        drafts: stats.drafts + blogDrafts
      }));
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'primary';
      case 'draft': return 'accent';
      case 'archived': return 'warn';
      default: return '';
    }
  }

  navigateToPages() {
    this.router.navigate(['/modules/cms'], { queryParams: { tab: 'pages' } });
  }

  navigateToBlogs() {
    this.router.navigate(['/modules/cms'], { queryParams: { tab: 'blogs' } });
  }

  navigateToCms() {
    this.router.navigate(['/modules/cms']);
  }
}