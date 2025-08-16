import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  HrManagementService,
  ComplianceItemDto,
  ComplianceEventDto,
} from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-compliance-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
  ],
  template: `
    <mat-card>
      <h2>Compliance</h2>

      <div class="new-item">
        <mat-form-field appearance="outline">
          <mat-label>New Compliance Item</mat-label>
          <input matInput [(ngModel)]="newItemName" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="createItem()">
          <mat-icon>add</mat-icon>
          Add Item
        </button>
      </div>

      <h3>Items</h3>
      <table mat-table [dataSource]="items()" class="full-width">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let i">{{ i.name }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="itemCols"></tr>
        <tr mat-row *matRowDef="let row; columns: itemCols"></tr>
      </table>

      <h3 style="margin-top:16px">Alerts</h3>
      <table mat-table [dataSource]="alerts().upcoming" class="full-width">
        <ng-container matColumnDef="dueDate">
          <th mat-header-cell *matHeaderCellDef>Upcoming Due</th>
          <td mat-cell *matCellDef="let e">{{ e.dueDate | date }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="eventCols"></tr>
        <tr mat-row *matRowDef="let row; columns: eventCols"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `
      .new-item {
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
export class CompliancePageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  items = signal<ComplianceItemDto[]>([]);
  alerts = signal<{
    upcoming: ComplianceEventDto[];
    overdue: ComplianceEventDto[];
  }>({ upcoming: [], overdue: [] });

  itemCols = ['name'];
  eventCols = ['dueDate'];

  newItemName = '';

  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (!this.organizationId) return;
    this.hr
      .listComplianceItems(this.organizationId)
      .subscribe((list) => this.items.set(list));
    this.hr
      .complianceAlerts(this.organizationId)
      .subscribe((a) => this.alerts.set(a));
  }

  createItem(): void {
    if (!this.newItemName) return;
    this.hr.createComplianceItem({ name: this.newItemName }).subscribe(() => {
      this.newItemName = '';
      this.load();
    });
  }
}
