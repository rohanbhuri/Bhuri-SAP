import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { HrManagementService, PayrollRunDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-payroll-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Payroll Management</h2>
        <button mat-raised-button color="primary" (click)="run()">
          <mat-icon>payments</mat-icon>
          Run Payroll
        </button>
      </div>

      <div class="payroll-controls-section">
        <h3>Payroll Configuration</h3>
        <div class="run-controls">
          <mat-form-field appearance="outline">
            <mat-label>Month</mat-label>
            <input matInput [(ngModel)]="month" type="number" min="1" max="12" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Year</mat-label>
            <input matInput [(ngModel)]="year" type="number" />
          </mat-form-field>
          <button mat-stroked-button (click)="load()">Refresh Data</button>
        </div>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="runs()" class="hr-table">
          <ng-container matColumnDef="period">
            <th mat-header-cell *matHeaderCellDef>Pay Period</th>
            <td mat-cell *matCellDef="let r">{{ r.month }}/{{ r.year }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip [color]="getStatusColor(r.status)">{{ r.status }}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>Employees Processed</th>
            <td mat-cell *matCellDef="let r">{{ r.items?.length || 0 }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols"></tr>
        </table>
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
        margin-bottom: 24px;
      }

      .tab-header h2 {
        margin: 0;
        color: var(--theme-on-surface);
        font-size: 24px;
        font-weight: 500;
      }

      .payroll-controls-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }

      .payroll-controls-section h3 {
        margin: 0 0 16px 0;
        color: var(--theme-on-surface);
        font-size: 18px;
        font-weight: 500;
      }

      .run-controls {
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
      }

      .table-container {
        background: var(--theme-surface);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }

      .hr-table {
        width: 100%;
        background: var(--theme-surface);
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
        
        .run-controls {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class PayrollPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  runs = signal<PayrollRunDto[]>([]);
  cols = ['period', 'status', 'items'];

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (!this.organizationId) return;
    this.hr
      .listPayrollRuns(this.organizationId)
      .subscribe((list) => this.runs.set(list));
  }

  run(): void {
    if (!this.organizationId) return;
    this.hr
      .runPayroll(this.organizationId, this.month, this.year)
      .subscribe(() => this.load());
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'processing': return 'accent';
      case 'failed': return 'warn';
      default: return '';
    }
  }
}
