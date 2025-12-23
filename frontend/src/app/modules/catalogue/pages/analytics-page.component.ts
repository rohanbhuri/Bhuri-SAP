import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CatalogueService } from '../catalogue.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Analytics & Reports</h2>
      </div>
      
      <div class="stats-grid">
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">{{ stats().totalProducts }}</div>
                <div class="stat-label">Total Products</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats().publishedProducts }}</div>
                <div class="stat-label">Published</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats().draftProducts }}</div>
                <div class="stat-label">Drafts</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>3D Models</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-item large">
              <div class="stat-value large">{{ stats().products3D }}</div>
              <div class="stat-label">Products with 3D Models</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .stats-row {
      display: flex;
      gap: 1rem;
      justify-content: space-around;
    }
    .stat-item {
      text-align: center;
    }
    .stat-item.large {
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 0.5rem;
    }
    .stat-value.large {
      font-size: 3rem;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `]
})
export class AnalyticsPageComponent implements OnInit {
  private catalogueService = inject(CatalogueService);

  stats = signal({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    products3D: 0
  });

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.catalogueService.getProducts().subscribe(products => {
      const publishedProducts = products.filter(p => p.isPublished).length;
      const products3D = products.filter(p => p.model3d).length;
      
      this.stats.set({
        totalProducts: products.length,
        publishedProducts,
        draftProducts: products.length - publishedProducts,
        products3D
      });
    });
  }
}