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
    <mat-card class="widget-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>view_in_ar</mat-icon>
        <mat-card-title>Catalogue Management</mat-card-title>
        <mat-card-subtitle>Manage product catalogue with 3D models</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="widget-stats">
          <div class="stat-item">
            <span class="stat-number">{{ stats().products }}</span>
            <span class="stat-label">Products</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().categories }}</span>
            <span class="stat-label">Categories</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().collections }}</span>
            <span class="stat-label">Collections</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats().models3D }}</span>
            <span class="stat-label">3D Models</span>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="navigateToModule()">
          <mat-icon>launch</mat-icon>
          Open Catalogue
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .widget-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1rem 0;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
      color: #4CAF50;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class CatalogueWidgetComponent implements OnInit {
  private router = inject(Router);
  private catalogueService = inject(CatalogueService);
  
  stats = signal({
    products: 0,
    categories: 0,
    collections: 0,
    models3D: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Load products
    this.catalogueService.getProducts().subscribe(products => {
      const models3D = products.filter(p => p.model3d).length;
      this.stats.update(current => ({
        ...current,
        products: products.length,
        models3D
      }));
    });

    // Load categories
    this.catalogueService.getCategories().subscribe(categories => {
      this.stats.update(current => ({
        ...current,
        categories: categories.length
      }));
    });

    // Load collections
    this.catalogueService.getCollections().subscribe(collections => {
      this.stats.update(current => ({
        ...current,
        collections: collections.length
      }));
    });
  }

  navigateToModule() {
    this.router.navigate(['/modules/catalogue']);
  }
}