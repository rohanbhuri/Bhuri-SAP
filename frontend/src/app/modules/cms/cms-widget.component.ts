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
    <mat-card class="cms-widget">
      <mat-card-header>
        <div mat-card-avatar class="widget-avatar">
          <mat-icon>web</mat-icon>
        </div>
        <mat-card-title>Content Management</mat-card-title>
        <mat-card-subtitle>Manage your website content</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
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
      </mat-card-content>
      
      <mat-card-actions>
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
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .cms-widget {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .widget-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
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

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .recent-content h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
    }

    .content-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .content-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 6px;
      background: #fafafa;
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

    .content-meta {
      font-size: 0.75rem;
      color: #666;
    }

    .status-chip {
      font-size: 0.75rem;
      height: 20px;
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