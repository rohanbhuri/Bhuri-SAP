import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CatalogueService } from '../catalogue.service';

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
                <span class="value">{{ analytics().priceRange.min | currency }}</span>
              </div>
              <div class="price-stat">
                <span class="label">Average Price</span>
                <span class="value">{{ analytics().priceRange.avg | currency }}</span>
              </div>
              <div class="price-stat">
                <span class="label">Highest Price</span>
                <span class="value">{{ analytics().priceRange.max | currency }}</span>
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
      padding: 24px;
    }
    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .analytics-header h2 {
      margin: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px !important;
    }
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    .stat-icon.products { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.categories { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.collections { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.variations { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-info h3 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
    }
    .stat-info p {
      margin: 4px 0;
      color: #666;
    }
    .stat-detail {
      font-size: 12px;
      color: #999;
    }
    .stat-card mat-card-actions {
      padding: 8px 16px !important;
      border-top: 1px solid #eee;
    }
    .detailed-analytics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 16px;
    }
    .category-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .breakdown-item .label {
      min-width: 120px;
      font-size: 14px;
    }
    .bar-container {
      flex: 1;
      height: 24px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }
    .breakdown-item .count {
      min-width: 40px;
      text-align: right;
      font-weight: 600;
    }
    .price-stats {
      display: flex;
      justify-content: space-around;
      gap: 24px;
    }
    .price-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .price-stat .label {
      font-size: 14px;
      color: #666;
    }
    .price-stat .value {
      font-size: 24px;
      font-weight: 600;
      color: #667eea;
    }
    .media-stats {
      display: flex;
      justify-content: space-around;
      gap: 24px;
    }
    .media-stat {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .media-stat mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
    }
    .media-stat h4 {
      margin: 0;
      font-size: 28px;
    }
    .media-stat p {
      margin: 0;
      color: #666;
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
    }
  `]
})
export class AnalyticsPageComponent implements OnInit {
  private catalogueService = inject(CatalogueService);
  
  loading = signal(true);
  exporting = signal(false);
  analytics = signal({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    activeCategories: 0,
    totalCollections: 0,
    activeCollections: 0,
    totalVariations: 0,
    avgVariationsPerProduct: 0,
    productsByCategory: [] as any[],
    productsByCollection: [] as any[],
    priceRange: { min: 0, avg: 0, max: 0 },
    mediaAssets: { images: 0, videos: 0, models3d: 0 }
  });

  ngOnInit() {
    this.loadAnalytics();
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
