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
              <span class="stat-detail">{{ stats().activeCategories }} active</span>
            </div>
          </div>
          <div class="stat-item tertiary">
            <mat-icon>collections</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().collections }}</span>
              <span class="stat-label">Collections</span>
              <span class="stat-detail">{{ stats().activeCollections }} active</span>
            </div>
          </div>
          <div class="stat-item designer">
            <mat-icon>person_outline</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().designers }}</span>
              <span class="stat-label">Designers</span>
              <span class="stat-detail">{{ stats().activeDesigners }} active</span>
            </div>
          </div>
          <div class="stat-item accent">
            <mat-icon>view_in_ar</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().models3d }}</span>
              <span class="stat-label">3D Models</span>
            </div>
          </div>
          <div class="stat-item variant">
            <mat-icon>tune</mat-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats().variations }}</span>
              <span class="stat-label">Variations</span>
            </div>
          </div>
        </div>
      </div>
      <div class="widget-footer-actions">
        <div class="cta-grid">
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('products')">
            <mat-icon>inventory_2</mat-icon>
            <span>Products</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('collections')">
            <mat-icon>collections</mat-icon>
            <span>Collections</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('categories')">
            <mat-icon>category</mat-icon>
            <span>Categories</span>
          </button>
          <button mat-flat-button class="cta-btn" (click)="navigateToTab('designers')">
            <mat-icon>person_outline</mat-icon>
            <span>Designers</span>
          </button>
          <button mat-flat-button class="cta-btn downloads-btn" (click)="navigateToTab('technical-sheet-downloads')">
            <mat-icon>download</mat-icon>
            <span>Track Tech Sheet</span>
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
    .catalogue-widget {
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
      grid-template-columns: repeat(3, 1fr);
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
      grid-template-columns: repeat(3, 1fr);
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
      grid-column: span 2;
      background: color-mix(in srgb, var(--theme-primary) 18%, var(--theme-surface)) !important;
      border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent) !important;
    }

    .downloads-btn {
      background: color-mix(in srgb, #4caf50 12%, var(--theme-surface)) !important;
      color: #4caf50 !important;
      border-color: color-mix(in srgb, #4caf50 25%, transparent) !important;
    }

    .downloads-btn:hover {
      background: #4caf50 !important;
      color: white !important;
      border-color: #4caf50 !important;
    }

    :host-context([data-view="expanded"]) .analytics-btn {
      grid-column: auto;
    }

    :host-context([data-view="expanded"]) .downloads-btn {
      grid-column: auto;
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

    /* Stat item specific colors */
    .stat-item.primary { border-left: 3px solid var(--theme-primary); }
    .stat-item.secondary { border-left: 3px solid #673ab7; }
    .stat-item.tertiary { border-left: 3px solid #009688; }
    .stat-item.designer { border-left: 3px solid #ff9800; }
    .stat-item.accent { border-left: 3px solid #e91e63; }
    .stat-item.variant { border-left: 3px solid #3f51b5; }
  `]
})
export class CatalogueWidgetComponent implements OnInit {
  private router = inject(Router);
  private catalogueService = inject(CatalogueService);

  stats = signal({
    products: 0,
    published: 0,
    categories: 0,
    activeCategories: 0,
    collections: 0,
    activeCollections: 0,
    designers: 0,
    activeDesigners: 0,
    variations: 0,
    models3d: 0
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
        activeCategories: analytics.activeCategories,
        collections: analytics.totalCollections,
        activeCollections: analytics.activeCollections,
        designers: analytics.totalDesigners,
        activeDesigners: analytics.activeDesigners,
        variations: analytics.totalVariations,
        models3d: analytics.mediaAssets?.models3d || 0
      });
    });
  }

  navigateToTab(tabName: string) {
    this.router.navigate(['/modules/catalogue'], { queryParams: { tab: tabName } });
  }
}