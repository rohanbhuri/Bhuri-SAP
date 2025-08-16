import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ stats().totalItems }}</div>
          <div class="stat-label">Items</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().lowStock }}</div>
          <div class="stat-label">Low Stock</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">\${{ stats().totalValue }}K</div>
          <div class="stat-label">Total Value</div>
        </div>
      </div>
      <div class="widget-actions">
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>inventory</mat-icon>
          Manage Inventory
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
export class InventoryManagementWidgetComponent {
  private router = inject(Router);
  stats = signal({ totalItems: 0, lowStock: 0, totalValue: 0 });

  openModule() {
    this.router.navigate(['/modules/inventory-management']);
  }
}