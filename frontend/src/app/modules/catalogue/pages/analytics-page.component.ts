import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CatalogueService } from '../catalogue.service';
import { PreferencesService } from '../../../services/preferences.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <h2>Catalogue Analytics & Reports</h2>
        <div class="export-actions">
          <button mat-raised-button color="primary" (click)="exportAll()" [disabled]="exporting()">
            <mat-icon>download</mat-icon>
            {{ exporting() ? 'Exporting...' : 'Export All Data' }}
          </button>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!loading()">
        <!-- Overview Stats -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon products">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalProducts }}</h3>
              <p>Total Products</p>
              <span class="stat-detail">{{ analytics().publishedProducts }} published</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="exportProducts()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon categories">
              <mat-icon>category</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalCategories }}</h3>
              <p>Categories</p>
              <span class="stat-detail">{{ analytics().activeCategories }} active</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="exportCategories()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon collections">
              <mat-icon>collections</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalCollections }}</h3>
              <p>Collections</p>
              <span class="stat-detail">{{ analytics().activeCollections }} active</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="exportCollections()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon designers">
              <mat-icon>palette</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalDesigners }}</h3>
              <p>Designers</p>
              <span class="stat-detail">{{ analytics().activeDesigners }} active</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon variations">
              <mat-icon>tune</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ analytics().totalVariations }}</h3>
              <p>Product Variations</p>
              <span class="stat-detail">Avg {{ analytics().avgVariationsPerProduct }} per product</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Changes -->
      <div class="changes-section" *ngIf="!loading()">
        <h3>Recent Changes (Last 7 Days)</h3>
        <div class="changes-grid">
          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon products">inventory_2</mat-icon>
                <div>
                  <h4>Product Changes</h4>
                  <p class="change-count">{{ analytics().recentChanges.products || 0 }} updates</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon categories">category</mat-icon>
                <div>
                  <h4>Category Changes</h4>
                  <p class="change-count">{{ analytics().recentChanges.categories || 0 }} updates</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon collections">collections</mat-icon>
                <div>
                  <h4>Collection Changes</h4>
                  <p class="change-count">{{ analytics().recentChanges.collections || 0 }} updates</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="change-card">
            <mat-card-content>
              <div class="change-header">
                <mat-icon class="change-icon designers">palette</mat-icon>
                <div>
                  <h4>Designer Changes</h4>
                  <p class="change-count">{{ analytics().recentChanges.designers || 0 }} updates</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Detailed Analytics -->
      <div class="detailed-analytics" *ngIf="!loading()">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Products by Category</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-breakdown">
              <div *ngFor="let cat of analytics().productsByCategory" class="breakdown-item">
                <span class="label">{{ cat.name || 'Uncategorized' }}</span>
                <div class="bar-container">
                  <div class="bar" [style.width.%]="(cat.count / analytics().totalProducts) * 100"></div>
                </div>
                <span class="count">{{ cat.count }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Products by Collection</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-breakdown">
              <div *ngFor="let col of analytics().productsByCollection" class="breakdown-item">
                <span class="label">{{ col.name || 'No Collection' }}</span>
                <div class="bar-container">
                  <div class="bar" [style.width.%]="(col.count / analytics().totalProducts) * 100"></div>
                </div>
                <span class="count">{{ col.count }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Price Range Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="price-stats">
              <div class="price-stat">
                <span class="label">Lowest Price</span>
                <span class="value">{{ formatCurrency(analytics().priceRange.min) }}</span>
              </div>
              <div class="price-stat">
                <span class="label">Average Price</span>
                <span class="value">{{ formatCurrency(analytics().priceRange.avg) }}</span>
              </div>
              <div class="price-stat">
                <span class="label">Highest Price</span>
                <span class="value">{{ formatCurrency(analytics().priceRange.max) }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Media Assets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="media-stats">
              <div class="media-stat">
                <mat-icon>image</mat-icon>
                <div>
                  <h4>{{ analytics().mediaAssets.images }}</h4>
                  <p>Images</p>
                </div>
              </div>
              <div class="media-stat">
                <mat-icon>videocam</mat-icon>
                <div>
                  <h4>{{ analytics().mediaAssets.videos }}</h4>
                  <p>Videos</p>
                </div>
              </div>
              <div class="media-stat">
                <mat-icon>view_in_ar</mat-icon>
                <div>
                  <h4>{{ analytics().mediaAssets.models3d }}</h4>
                  <p>3D Models</p>
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
      margin: 0;
      font-size: 24px;
      font-weight: 600;
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
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }
    .stat-icon.products { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.categories { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.collections { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.designers { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .stat-icon.variations { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-info {
      flex: 1;
      min-width: 0;
    }
    .stat-info h3 {
      margin: 0 0 4px 0;
      font-size: 28px;
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
    .stat-card mat-card-actions {
      padding: 12px 20px !important;
      border-top: 1px solid #f0f0f0;
      margin: 0 !important;
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
      margin-bottom: 32px;
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
    .change-icon.products { background: rgba(102, 126, 234, 0.1); color: #667eea; }
    .change-icon.categories { background: rgba(240, 147, 251, 0.1); color: #f093fb; }
    .change-icon.collections { background: rgba(79, 172, 254, 0.1); color: #4facfe; }
    .change-icon.designers { background: rgba(250, 112, 154, 0.1); color: #fa709a; }
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
    .breakdown-item .count {
      min-width: 40px;
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: #667eea;
    }
    .price-stats {
      display: flex;
      justify-content: space-around;
      gap: 24px;
      padding: 12px 0;
    }
    .price-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .price-stat .label {
      font-size: 13px;
      color: #666;
      font-weight: 500;
    }
    .price-stat .value {
      font-size: 22px;
      font-weight: 700;
      color: #667eea;
    }
    .media-stats {
      display: flex;
      justify-content: space-around;
      gap: 24px;
      padding: 12px 0;
    }
    .media-stat {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .media-stat mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #667eea;
    }
    .media-stat h4 {
      margin: 0 0 2px 0;
      font-size: 24px;
      font-weight: 700;
    }
    .media-stat p {
      margin: 0;
      color: #666;
      font-size: 13px;
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
export class AnalyticsPageComponent implements OnInit {
  private catalogueService = inject(CatalogueService);
  private preferencesService = inject(PreferencesService);
  
  loading = signal(true);
  exporting = signal(false);
  currencySymbol = signal('$');
  analytics = signal({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    activeCategories: 0,
    totalCollections: 0,
    activeCollections: 0,
    totalDesigners: 0,
    activeDesigners: 0,
    totalVariations: 0,
    avgVariationsPerProduct: 0,
    productsByCategory: [] as any[],
    productsByCollection: [] as any[],
    priceRange: { min: 0, avg: 0, max: 0 },
    mediaAssets: { images: 0, videos: 0, models3d: 0 },
    recentChanges: { products: 0, categories: 0, collections: 0, designers: 0 }
  });

  ngOnInit() {
    this.loadCurrencyPreferences();
    this.loadAnalytics();
  }

  loadCurrencyPreferences() {
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        if (prefs?.currencySymbol) {
          this.currencySymbol.set(prefs.currencySymbol);
        }
      },
      error: () => {
        // Use default currency symbol
        this.currencySymbol.set('$');
      }
    });
  }

  formatCurrency(value: number): string {
    const numValue = Number(value) || 0;
    return `${this.currencySymbol()}${numValue.toFixed(2)}`;
  }

  loadAnalytics() {
    this.loading.set(true);
    this.catalogueService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportProducts() {
    this.catalogueService.exportProducts().subscribe(blob => {
      this.downloadFile(blob, 'products.csv');
    });
  }

  exportCategories() {
    this.catalogueService.exportCategories().subscribe(blob => {
      this.downloadFile(blob, 'categories.csv');
    });
  }

  exportCollections() {
    this.catalogueService.exportCollections().subscribe(blob => {
      this.downloadFile(blob, 'collections.csv');
    });
  }

  exportAll() {
    this.exporting.set(true);
    this.catalogueService.exportAll().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'catalogue-export.zip');
        this.exporting.set(false);
      },
      error: () => this.exporting.set(false)
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
