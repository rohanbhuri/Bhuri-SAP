import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { PagesPageComponent } from './pages/pages-page.component';
import { BlogsPageComponent } from './pages/blogs-page.component';
import { MenusPageComponent } from './pages/menus-page.component';
import { MediaPageComponent } from './pages/media-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page.component';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NavbarComponent,
    BottomNavbarComponent,
    PagesPageComponent,
    BlogsPageComponent,
    MenusPageComponent,
    MediaPageComponent,
    AnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <div class="header-content">
          <div>
            <nav class="breadcrumb">
              <span>Modules</span>
              <mat-icon>chevron_right</mat-icon>
              <span class="current">CMS</span>
            </nav>
            <h1>Content Management System</h1>
            <p class="subtitle">Manage your website content, pages, blogs, and media</p>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="openApiDocs()">
              <mat-icon>api</mat-icon>
              <span>API Docs</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <mat-tab-group class="cms-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Pages">
          <app-pages-page></app-pages-page>
        </mat-tab>
        <mat-tab label="Blogs">
          <app-blogs-page></app-blogs-page>
        </mat-tab>
        <mat-tab label="Menus">
          <app-menus-page></app-menus-page>
        </mat-tab>
        <mat-tab label="Media">
          <app-media-page></app-media-page>
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
  
  selectedTabIndex = 0;
  private tabs = ['pages', 'blogs', 'menus', 'media', 'analytics'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.includes(tab)) {
        this.selectedTabIndex = this.tabs.indexOf(tab);
      }
    });
  }

  onTabChange(event: any) {
    const tabName = this.tabs[event.index];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    });
  }

  openApiDocs() {
    this.router.navigate(['/modules/cms/api-doc']);
  }
}