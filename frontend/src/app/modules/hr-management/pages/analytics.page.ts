import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { HrManagementService, HrStats } from '../hr-management.service';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hr-analytics-page',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatIconModule, DecimalPipe, MatButtonModule],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>HR Analytics & Reports</h2>
        <button mat-stroked-button (click)="load()">
          <mat-icon>refresh</mat-icon>
          Refresh Data
        </button>
      </div>

      <div class="analytics-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Total Employees</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ stats().total }}</div>
            <div class="stat-label">Active workforce</div>
          </mat-card-content>
          <mat-icon class="stat-icon">people</mat-icon>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Active Employees</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ stats().active }}</div>
            <div class="stat-label">Currently active</div>
          </mat-card-content>
          <mat-icon class="stat-icon">check_circle</mat-icon>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Departments</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ stats().departments }}</div>
            <div class="stat-label">Total departments</div>
          </mat-card-content>
          <mat-icon class="stat-icon">business</mat-icon>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Average Salary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">\${{ stats().averageSalary | number : '1.0-0' }}</div>
            <div class="stat-label">Per employee</div>
          </mat-card-content>
          <mat-icon class="stat-icon">payments</mat-icon>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>New Hires</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ stats().newHires }}</div>
            <div class="stat-label">Last 30 days</div>
          </mat-card-content>
          <mat-icon class="stat-icon">person_add</mat-icon>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .tab-content {
        padding: 24px;
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }

      .tab-header h2 {
        margin: 0;
        color: var(--theme-on-surface);
        font-size: 24px;
        font-weight: 500;
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }

      .stat-card {
        position: relative;
        background: var(--theme-surface);
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 12px;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        overflow: hidden;
      }

      .stat-card mat-card-header {
        padding-bottom: 8px;
      }

      .stat-card mat-card-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-on-surface);
      }

      .stat-value {
        font-size: 36px;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: color-mix(in srgb, var(--theme-on-surface) 85%, transparent);
        font-weight: 500;
      }

      .stat-icon {
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: color-mix(in srgb, var(--theme-primary) 30%, transparent);
      }

      @media (max-width: 768px) {
        .tab-content {
          padding: 16px;
        }
        
        .tab-header {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
        }
        
        .analytics-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
    `,
  ],
})
export class AnalyticsPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  stats = signal<HrStats>({
    total: 0,
    active: 0,
    departments: 0,
    averageSalary: 0,
    newHires: 0,
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.hr.getStats().subscribe((s) => this.stats.set(s));
  }
}
