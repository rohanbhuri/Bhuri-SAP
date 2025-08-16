import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payroll-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">\${{ stats().totalPayroll }}K</div>
          <div class="stat-label">Monthly Payroll</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats().processed }}</div>
          <div class="stat-label">Processed</div>
        </div>
      </div>
      <div class="widget-actions">
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>payments</mat-icon>
          Manage Payroll
        </button>
      </div>
    </div>
  `,
  styles: [`
    .widget-content { padding: 16px; }
    .widget-stats { display: flex; justify-content: space-between; margin-bottom: 16px; }
    .stat-item { text-align: center; }
    .stat-number { font-size: 1.4rem; font-weight: 700; color: var(--theme-primary); margin-bottom: 4px; }
    .stat-label { font-size: 0.8rem; color: rgba(0, 0, 0, 0.6); }
    .widget-actions { display: flex; justify-content: center; }
    button { width: 100%; }
  `],
})
export class PayrollManagementWidgetComponent {
  private router = inject(Router);
  stats = signal({ totalPayroll: 0, processed: 0 });

  openModule() {
    this.router.navigate(['/modules/payroll-management']);
  }
}