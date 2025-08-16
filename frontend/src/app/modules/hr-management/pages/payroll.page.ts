import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    FormsModule,
  ],
  template: `
    <mat-card>
      <h2>Payroll</h2>
      <div class="run-controls">
        <mat-form-field appearance="outline">
          <mat-label>Month (1-12)</mat-label>
          <input matInput [(ngModel)]="month" type="number" min="1" max="12" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Year</mat-label>
          <input matInput [(ngModel)]="year" type="number" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="run()">
          <mat-icon>payments</mat-icon>
          Run Payroll
        </button>
      </div>

      <table mat-table [dataSource]="runs()" class="full-width">
        <ng-container matColumnDef="period">
          <th mat-header-cell *matHeaderCellDef>Period</th>
          <td mat-cell *matCellDef="let r">{{ r.month }}/{{ r.year }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let r">{{ r.status }}</td>
        </ng-container>
        <ng-container matColumnDef="items">
          <th mat-header-cell *matHeaderCellDef>Employees</th>
          <td mat-cell *matCellDef="let r">{{ r.items?.length || 0 }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `
      .run-controls {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 16px 0;
      }
      .full-width {
        width: 100%;
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
}
