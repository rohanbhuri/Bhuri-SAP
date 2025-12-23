import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cms-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="widget-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>article</mat-icon>
        <mat-card-title>CMS Management</mat-card-title>
        <mat-card-subtitle>Content management system for pages and blogs</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="widget-stats">
          <div class="stat-item">
            <span class="stat-number">{{ pageCount }}</span>
            <span class="stat-label">Pages</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ blogCount }}</span>
            <span class="stat-label">Blogs</span>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="navigateToModule()">
          <mat-icon>launch</mat-icon>
          Open CMS
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
      color: #2196F3;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class CmsWidgetComponent {
  pageCount = 2;
  blogCount = 0;

  constructor(private router: Router) {}

  navigateToModule() {
    this.router.navigate(['/modules/cms']);
  }
}