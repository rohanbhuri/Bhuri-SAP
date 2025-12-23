import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotations-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="widget-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>request_quote</mat-icon>
        <mat-card-title>Quotations</mat-card-title>
        <mat-card-subtitle>Manage quotations and client proposals</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="widget-stats">
          <div class="stat-item">
            <span class="stat-number">{{ draftCount }}</span>
            <span class="stat-label">Drafts</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ sentCount }}</span>
            <span class="stat-label">Sent</span>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="navigateToModule()">
          <mat-icon>launch</mat-icon>
          Open Quotations
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
      color: #FF9800;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class QuotationsWidgetComponent {
  draftCount = 0;
  sentCount = 0;

  constructor(private router: Router) {}

  navigateToModule() {
    this.router.navigate(['/modules/quotations']);
  }
}