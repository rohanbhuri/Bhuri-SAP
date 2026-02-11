import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { BlogsPageComponent } from './pages/blogs-page.component';
import { NewsMediaPageComponent } from './pages/news-media-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NavbarComponent,
    BottomNavbarComponent,
    BreadcrumbComponent,
    BlogsPageComponent,
    NewsMediaPageComponent,
    AnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <div class="header-content">
          <div>
            <app-breadcrumb></app-breadcrumb>
            <h1>Content Management System</h1>
            <p class="subtitle">Manage your website content, pages, blogs, and media</p>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="openApiDocs()" *ngIf="canAccessApi()">
              <mat-icon>api</mat-icon>
              <span>API Docs</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <mat-tab-group class="cms-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Blogs & Articles">
          <app-blogs-page></app-blogs-page>
        </mat-tab>
        <mat-tab label="News & Media">
          <app-news-media-page></app-news-media-page>
        </mat-tab>
        <mat-tab label="Analytics">
          <app-analytics-page></app-analytics-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private breadcrumbService = inject(BreadcrumbService);
  
  selectedTabIndex = 0;
  private tabs = ['blogs', 'news-media', 'analytics'];
  private tabNames = ['Blogs & Articles', 'News & Media', 'Analytics'];

  canAccessApi(): boolean {
    return this.authService.getCurrentUser()?.allowApiAccess ?? false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.includes(tab)) {
        this.selectedTabIndex = this.tabs.indexOf(tab);
        this.breadcrumbService.setContext(this.tabNames[this.selectedTabIndex]);
      } else {
        this.breadcrumbService.setContext(this.tabNames[0]);
      }
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.clearContext();
  }

  onTabChange(event: any) {
    const tabName = this.tabs[event.index];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    });
    this.breadcrumbService.setContext(this.tabNames[event.index]);
  }

  openApiDocs() {
    this.router.navigate(['/modules/cms/api-doc']);
  }
}