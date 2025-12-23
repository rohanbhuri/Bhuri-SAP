import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
            <span class="stat-number">{{ productCount }}</span>
            <span class="stat-label">Products</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ categoryCount }}</span>
            <span class="stat-label">Categories</span>
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
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
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
export class CatalogueWidgetComponent {
  productCount = 2;
  categoryCount = 2;

  constructor(private router: Router) {}

  navigateToModule() {
    this.router.navigate(['/modules/catalogue']);
  }
}