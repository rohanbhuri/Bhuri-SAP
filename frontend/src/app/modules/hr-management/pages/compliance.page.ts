import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
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
    MatChipsModule,
    FormsModule,
    DatePipe,
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Compliance Management</h2>
        <button mat-raised-button color="primary" (click)="createItem()">
          <mat-icon>add</mat-icon>
          Add Compliance Item
        </button>
      </div>

      <div class="compliance-form-section">
        <h3>New Compliance Item</h3>
        <div class="new-item">
          <mat-form-field appearance="outline">
            <mat-label>Compliance Item Name</mat-label>
            <input matInput [(ngModel)]="newItemName" placeholder="e.g., Safety Training, Tax Filing" />
          </mat-form-field>
        </div>
      </div>

      <div class="schedule-section">
        <h3>Schedule Compliance Event</h3>
        <div class="schedule">
          <mat-form-field appearance="outline">
            <mat-label>Item ID</mat-label>
            <input matInput [(ngModel)]="scheduleItemId" placeholder="Enter item ID" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Due Date</mat-label>
            <input matInput [(ngModel)]="scheduleDueDate" placeholder="YYYY-MM-DD" />
          </mat-form-field>
          <button mat-stroked-button (click)="scheduleEvent()">
            <mat-icon>schedule</mat-icon>
            Schedule Due Date
          </button>
        </div>
      </div>

      <div class="compliance-items-section">
        <h3>Compliance Items</h3>
        <div class="table-container">
          <table mat-table [dataSource]="items()" class="hr-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Item Name</th>
              <td mat-cell *matCellDef="let i">{{ i.name }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="itemCols"></tr>
            <tr mat-row *matRowDef="let row; columns: itemCols"></tr>
          </table>
        </div>
      </div>

      <div class="alerts-section">
        <h3>Compliance Alerts</h3>
        <div class="table-container">
          <table mat-table [dataSource]="alerts().upcoming" class="hr-table">
            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef>Due Date</th>
              <td mat-cell *matCellDef="let e">
                <mat-chip color="warn">{{ e.dueDate | date }}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let e">
                <button mat-button color="primary" (click)="complete(e)">
                  <mat-icon>check_circle</mat-icon>
                  Mark Complete
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="eventCols"></tr>
            <tr mat-row *matRowDef="let row; columns: eventCols"></tr>
          </table>
        </div>
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

      .compliance-form-section,
      .schedule-section,
      .compliance-items-section,
      .alerts-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }

      .compliance-form-section h3,
      .schedule-section h3,
      .compliance-items-section h3,
      .alerts-section h3 {
        margin: 0 0 16px 0;
        color: var(--theme-on-surface);
        font-size: 18px;
        font-weight: 500;
      }

      .new-item,
      .schedule {
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
        
        .new-item,
        .schedule {
          flex-direction: column;
          align-items: stretch;
        }
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
  eventCols = ['dueDate', 'action'];

  newItemName = '';
  scheduleItemId = '';
  scheduleDueDate = '';

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

  scheduleEvent(): void {
    if (!this.scheduleItemId || !this.scheduleDueDate) return;
    this.hr
      .scheduleComplianceEvent({
        itemId: this.scheduleItemId,
        dueDate: this.scheduleDueDate,
      })
      .subscribe(() => {
        this.scheduleItemId = '';
        this.scheduleDueDate = '';
        this.load();
      });
  }

  complete(e: ComplianceEventDto): void {
    if (!e._id) return;
    this.hr.markComplianceCompleted(e._id).subscribe(() => this.load());
  }
}
