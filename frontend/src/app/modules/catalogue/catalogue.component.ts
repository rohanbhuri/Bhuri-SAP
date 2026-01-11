import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { ProductsPageComponent } from './pages/products-page.component';
import { CategoriesPageComponent } from './pages/categories-page.component';
import { CollectionsPageComponent } from './pages/collections-page.component';
import { DesignersPageComponent } from './pages/designers-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page.component';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NavbarComponent,
    BottomNavbarComponent,
    ProductsPageComponent,
    CategoriesPageComponent,
    CollectionsPageComponent,
    DesignersPageComponent,
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
              <span class="current">Catalogue</span>
            </nav>
            <h1>Catalogue Management</h1>
            <p class="subtitle">Manage your product catalogue with 3D models and collections</p>
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

      <mat-tab-group class="catalogue-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Products">
          <app-products-page></app-products-page>
        </mat-tab>
        <mat-tab label="Categories">
          <app-categories-page></app-categories-page>
        </mat-tab>
        <mat-tab label="Collections">
          <app-collections-page></app-collections-page>
        </mat-tab>
        <mat-tab label="Designers">
          <app-designers-page></app-designers-page>
        </mat-tab>
        <mat-tab label="Analytics">
          <app-analytics-page></app-analytics-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  selectedTabIndex = 0;
  private tabs = ['products', 'categories', 'collections', 'designers', 'analytics'];

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
    this.router.navigate(['/modules/catalogue/api-doc']);
  }
}