import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">\${{ stats().revenue }}K</div>
          <div class="stat-label">Revenue</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().deals }}</div>
          <div class="stat-label">Active Deals</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().leads }}</div>
          <div class="stat-label">New Leads</div>
        </div>
      </div>
      <div class="widget-actions">
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>trending_up</mat-icon>
          Manage Sales
        </button>
      </div>
    </div>
  `,
  styles: [`
    .widget-content { padding: 16px; }
    .widget-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .stat-item { text-align: center; }
    .stat-number { font-size: 1.4rem; font-weight: 700; color: var(--theme-primary); margin-bottom: 4px; }
    .stat-label { font-size: 0.8rem; color: rgba(0, 0, 0, 0.6); }
    .widget-actions { display: flex; justify-content: center; }
    button { width: 100%; }
  `],
})
export class SalesManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  stats = signal({ revenue: 125, deals: 18, leads: 34 });

  ngOnInit() {
    // Simulate loading stats
    setTimeout(() => {
      this.stats.set({ revenue: 125, deals: 18, leads: 34 });
    }, 500);
  }

  openModule() {
    this.router.navigate(['/modules/sales-management']);
  }
}