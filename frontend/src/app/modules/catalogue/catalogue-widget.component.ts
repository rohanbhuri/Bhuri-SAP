import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CatalogueService } from './catalogue.service';

@Component({
  selector: 'app-catalogue-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="catalogue-widget">
      <div class="widget-header-content">
        <p class="subtitle">Product catalogue with 3D models & variations</p>
      </div>
      <div class="widget-body-content">
        <div class="widget-stats">
          <div class="stat-item primary">
            <mat-icon>inventory_2</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().products }}</span>
              <span class="stat-label">Products</span>
              <span class="stat-detail">{{ stats().published }} published</span>
            </div>
          </div>
          <div class="stat-item secondary">
            <mat-icon>category</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().categories }}</span>
              <span class="stat-label">Categories</span>
            </div>
          </div>
          <div class="stat-item tertiary">
            <mat-icon>collections</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().collections }}</span>
              <span class="stat-label">Collections</span>
            </div>
          </div>
          <div class="stat-item accent">
            <mat-icon>tune</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().variations }}</span>
              <span class="stat-label">Variations</span>
            </div>
          </div>
        </div>
      </div>
      <div class="widget-footer-actions">
        <button mat-raised-button color="primary" (click)="navigateToModule()">
          <mat-icon>dashboard</mat-icon>
          Manage
        </button>
        <button  mat-raised-button color="primary" (click)="navigateToAnalytics()">
          <mat-icon>analytics</mat-icon>
          Analytics
        </button>
      </div>
    </div>
  `,
  styles: [`
    .catalogue-widget {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: transparent;
    }
    
    :host-context([data-view="expanded"]) .catalogue-widget {
      border-radius: 16px;
    }
    .catalogue-widget mat-card-header {
      padding: 16px;
    }
    
    :host-context([data-view="expanded"]) .catalogue-widget mat-card-header {
      padding: 24px;
    }
    .widget-icon {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .widget-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    .catalogue-widget mat-card-title {
      color: white;
      font-size: 20px;
      margin-bottom: 4px;
    }
    .subtitle {
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      padding: 0 16px;
      font-size: 0.9rem;
    }
    
    :host-context([data-view="expanded"]) .catalogue-widget mat-card-subtitle {
      font-size: 1.1rem;
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
      background: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-primary));
      border: 1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent);
      border-radius: 8px;
    }
    
    :host-context([data-view="expanded"]) .stat-item {
      padding: 20px;
      border-radius: 12px;
      flex-direction: column;
      text-align: center;
      gap: 8px;
    }
    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--theme-primary);
    }
    
    :host-context([data-view="expanded"]) .stat-item mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: var(--theme-primary);
      line-height: 1;
    }
    
    :host-context([data-view="expanded"]) .stat-number {
      font-size: 36px;
    }
    .stat-label {
      font-size: 12px;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin-top: 2px;
    }
    
    :host-context([data-view="expanded"]) .stat-label {
      font-size: 14px;
    }
    .stat-detail {
      font-size: 10px;
      color: color-mix(in srgb, var(--theme-on-surface) 50%, transparent);
      margin-top: 2px;
    }
    .widget-footer-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
      margin-top: auto;
    }
    
    :host-context([data-view="expanded"]) .catalogue-widget mat-card-actions {
      padding: 24px;
      gap: 16px;
    }
    
    :host-context([data-view="expanded"]) .catalogue-widget mat-card-actions button {
      height: 48px;
      font-size: 1rem;
      border-radius: 12px;
    }
    .catalogue-widget mat-card-actions button {
      flex: 1;
    }
  `]
})
export class CatalogueWidgetComponent implements OnInit {
  private router = inject(Router);
  private catalogueService = inject(CatalogueService);

  stats = signal({
    products: 0,
    published: 0,
    categories: 0,
    collections: 0,
    variations: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.catalogueService.getAnalytics().subscribe(analytics => {
      this.stats.set({
        products: analytics.totalProducts,
        published: analytics.publishedProducts,
        categories: analytics.totalCategories,
        collections: analytics.totalCollections,
        variations: analytics.totalVariations
      });
    });
  }

  navigateToModule() {
    this.router.navigate(['/modules/catalogue']);
  }

  navigateToAnalytics() {
    this.router.navigate(['/modules/catalogue'], { queryParams: { tab: 'analytics' } });
  }
}