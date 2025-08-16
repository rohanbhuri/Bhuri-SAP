import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { ProjectTimesheetService, TimesheetSummary } from '../project-timesheet.service';

@Component({
  selector: 'app-timesheets-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    DatePipe,
    NgIf,
    NgFor,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Weekly Timesheets</h2>
        <div class="header-actions">
          <button mat-raised-button color="accent">
            <mat-icon>send</mat-icon>
            Submit Current Week
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            New Timesheet
          </button>
        </div>
      </div>

      <div class="current-week-card">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Current Week Summary</mat-card-title>
            <mat-card-subtitle>Week of {{ getCurrentWeekStart() | date:'MMM dd, yyyy' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="week-stats">
              <div class="stat-item">
                <div class="stat-number">32.5</div>
                <div class="stat-label">Total Hours</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">28.0</div>
                <div class="stat-label">Billable Hours</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">4.5</div>
                <div class="stat-label">Non-Billable</div>
              </div>
              <div class="stat-item">
                <mat-chip color="warn">Draft</mat-chip>
                <div class="stat-label">Status</div>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">View Details</button>
            <button mat-raised-button color="accent">Submit for Approval</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field>
              <mat-label>Filter by Status</mat-label>
              <mat-select>
                <mat-option value="all">All Statuses</mat-option>
                <mat-option value="draft">Draft</mat-option>
                <mat-option value="submitted">Submitted</mat-option>
                <mat-option value="approved">Approved</mat-option>
                <mat-option value="rejected">Rejected</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Time Period</mat-label>
              <mat-select>
                <mat-option value="recent">Recent Weeks</mat-option>
                <mat-option value="month">This Month</mat-option>
                <mat-option value="quarter">This Quarter</mat-option>
                <mat-option value="year">This Year</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-accordion class="timesheets-accordion">
            <mat-expansion-panel *ngFor="let summary of summaries()" class="timesheet-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <div class="panel-title">
                    <span>Week of {{ summary.weekStartDate | date:'MMM dd, yyyy' }}</span>
                    <mat-chip [color]="getStatusColor(summary.status)">{{ summary.status }}</mat-chip>
                  </div>
                </mat-panel-title>
                <mat-panel-description>
                  <div class="panel-description">
                    <span>{{ summary.totalHours }}h total</span>
                    <span>{{ summary.billableHours }}h billable</span>
                  </div>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <div class="timesheet-details">
                <div class="summary-stats">
                  <div class="stat-row">
                    <span class="stat-label">Total Hours:</span>
                    <span class="stat-value">{{ summary.totalHours }}h</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Billable Hours:</span>
                    <span class="stat-value">{{ summary.billableHours }}h</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Non-Billable Hours:</span>
                    <span class="stat-value">{{ summary.totalHours - summary.billableHours }}h</span>
                  </div>
                </div>

                <div class="entries-table" *ngIf="summary.entries?.length">
                  <h4>Time Entries</h4>
                  <table mat-table [dataSource]="summary.entries" class="entries-mini-table">
                    <ng-container matColumnDef="date">
                      <th mat-header-cell *matHeaderCellDef>Date</th>
                      <td mat-cell *matCellDef="let entry">{{ entry.date | date:'MMM dd' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="project">
                      <th mat-header-cell *matHeaderCellDef>Project</th>
                      <td mat-cell *matCellDef="let entry">{{ entry.projectId }}</td>
                    </ng-container>
                    <ng-container matColumnDef="hours">
                      <th mat-header-cell *matHeaderCellDef>Hours</th>
                      <td mat-cell *matCellDef="let entry">{{ entry.totalHours }}h</td>
                    </ng-container>
                    <ng-container matColumnDef="billable">
                      <th mat-header-cell *matHeaderCellDef>Billable</th>
                      <td mat-cell *matCellDef="let entry">
                        <mat-icon class="billable-icon" [class.billable]="entry.billable">
                          {{ entry.billable ? 'attach_money' : 'money_off' }}
                        </mat-icon>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="entryColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: entryColumns"></tr>
                  </table>
                </div>

                <mat-card-actions>
                  <button mat-button color="primary" *ngIf="summary.status === 'draft'">Edit</button>
                  <button mat-raised-button color="accent" *ngIf="summary.status === 'draft'">Submit</button>
                  <button mat-button color="warn" *ngIf="summary.status === 'submitted'">Withdraw</button>
                  <button mat-button>Export PDF</button>
                </mat-card-actions>
              </div>
            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 24px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .header-actions {
        display: flex;
        gap: 12px;
      }
      .current-week-card {
        margin-bottom: 24px;
      }
      .week-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }
      .stat-item {
        text-align: center;
      }
      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }
      .stat-label {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.6);
      }
      .filters {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
      }
      .timesheets-accordion {
        margin-top: 16px;
      }
      .timesheet-panel {
        margin-bottom: 8px;
      }
      .panel-title {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
      }
      .panel-description {
        display: flex;
        gap: 16px;
      }
      .timesheet-details {
        padding: 16px 0;
      }
      .summary-stats {
        margin-bottom: 24px;
      }
      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .stat-value {
        font-weight: 500;
      }
      .entries-mini-table {
        width: 100%;
        margin-top: 8px;
      }
      .billable-icon {
        color: rgba(0, 0, 0, 0.4);
      }
      .billable-icon.billable {
        color: #4CAF50;
      }
    `,
  ],
})
export class TimesheetsPageComponent implements OnInit {
  private timesheetService = inject(ProjectTimesheetService);
  summaries = signal<TimesheetSummary[]>([]);
  entryColumns = ['date', 'project', 'hours', 'billable'];

  ngOnInit() {
    this.loadSummaries();
  }

  loadSummaries() {
    this.timesheetService.getTimesheetSummaries().subscribe(data => {
      this.summaries.set(data);
    });
  }

  getCurrentWeekStart(): Date {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'accent';
      case 'submitted': return 'primary';
      case 'rejected': return 'warn';
      default: return '';
    }
  }
}