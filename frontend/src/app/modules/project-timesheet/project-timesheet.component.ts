import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, CurrencyPipe, NgIf } from '@angular/common';

import {
  ProjectTimesheetService,
  TimesheetEntry,
  TimesheetSummary,
  ProjectTimeReport,
  TimesheetStats,
} from './project-timesheet.service';
import { TimesheetEntryDialogComponent } from './dialogs';

@Component({
  selector: 'app-project-timesheet',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    DatePipe,
    CurrencyPipe,
    NgIf,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Project Timesheet</span>
        </nav>
        <h1>Project Timesheet</h1>
        <p class="subtitle">Track time spent on projects and tasks</p>
      </div>

      <mat-tab-group class="timesheet-tabs">
        <mat-tab label="Time Entries">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Time Entries</h2>
              <button mat-raised-button color="primary" (click)="openEntryDialog()">
                <mat-icon>add</mat-icon>
                Log Time
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="timesheetEntries()" class="entries-table">
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let entry">
                    {{ entry.date | date:'MMM dd, yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="project">
                  <th mat-header-cell *matHeaderCellDef>Project</th>
                  <td mat-cell *matCellDef="let entry">
                    {{ entry.projectId }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let entry">
                    <div class="entry-desc">{{ entry.description }}</div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="time">
                  <th mat-header-cell *matHeaderCellDef>Time</th>
                  <td mat-cell *matCellDef="let entry">
                    <div class="time-info">
                      <div>{{ entry.startTime }} - {{ entry.endTime }}</div>
                      <div class="total-hours">{{ entry.totalHours }}h</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="billable">
                  <th mat-header-cell *matHeaderCellDef>Billable</th>
                  <td mat-cell *matCellDef="let entry">
                    <mat-chip [color]="entry.billable ? 'primary' : ''">
                      {{ entry.billable ? 'Yes' : 'No' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let entry">
                    <mat-chip [color]="getStatusColor(entry.status)">
                      {{ entry.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let entry">
                    <button mat-icon-button color="primary" title="Edit" (click)="openEntryDialog(entry)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Delete" (click)="deleteEntry(entry._id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="entryColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: entryColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Weekly Summary">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Weekly Timesheets</h2>
              <button mat-raised-button color="primary" (click)="submitTimesheet()">
                <mat-icon>send</mat-icon>
                Submit Timesheet
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="timesheetSummaries()" class="summaries-table">
                <ng-container matColumnDef="week">
                  <th mat-header-cell *matHeaderCellDef>Week Starting</th>
                  <td mat-cell *matCellDef="let summary">
                    {{ summary.weekStartDate | date:'MMM dd, yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="totalHours">
                  <th mat-header-cell *matHeaderCellDef>Total Hours</th>
                  <td mat-cell *matCellDef="let summary">
                    {{ summary.totalHours }}h
                  </td>
                </ng-container>

                <ng-container matColumnDef="billableHours">
                  <th mat-header-cell *matHeaderCellDef>Billable Hours</th>
                  <td mat-cell *matCellDef="let summary">
                    {{ summary.billableHours }}h
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let summary">
                    <mat-chip [color]="getStatusColor(summary.status)">
                      {{ summary.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let summary">
                    <button mat-icon-button color="primary" title="View Details" (click)="viewSummaryDetails(summary)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" title="Submit" *ngIf="summary.status === 'draft'" (click)="submitSummary(summary)">
                      <mat-icon>send</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="summaryColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: summaryColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Project Reports">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Project Time Reports</h2>
              <button mat-raised-button color="primary" (click)="exportReport()">
                <mat-icon>download</mat-icon>
                Export Report
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="projectReports()" class="reports-table">
                <ng-container matColumnDef="project">
                  <th mat-header-cell *matHeaderCellDef>Project</th>
                  <td mat-cell *matCellDef="let report">
                    {{ report.projectName }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="totalHours">
                  <th mat-header-cell *matHeaderCellDef>Total Hours</th>
                  <td mat-cell *matCellDef="let report">
                    {{ report.totalHours }}h
                  </td>
                </ng-container>

                <ng-container matColumnDef="billableHours">
                  <th mat-header-cell *matHeaderCellDef>Billable Hours</th>
                  <td mat-cell *matCellDef="let report">
                    {{ report.billableHours }}h
                  </td>
                </ng-container>

                <ng-container matColumnDef="totalCost">
                  <th mat-header-cell *matHeaderCellDef>Total Cost</th>
                  <td mat-cell *matCellDef="let report">
                    {{ report.totalCost | currency }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let report">
                    <button mat-icon-button color="primary" title="View Details" (click)="viewReportDetails(report)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" title="Export" (click)="exportProjectReport(report)">
                      <mat-icon>download</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: reportColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Analytics">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Timesheet Analytics</h2>
            </div>

            <div class="stats-grid">
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().totalHours }}</div>
                  <div class="stat-label">Total Hours</div>
                </div>
                <mat-icon class="stat-icon">schedule</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().billableHours }}</div>
                  <div class="stat-label">Billable Hours</div>
                </div>
                <mat-icon class="stat-icon">attach_money</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().totalProjects }}</div>
                  <div class="stat-label">Active Projects</div>
                </div>
                <mat-icon class="stat-icon">folder</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().pendingApprovals }}</div>
                  <div class="stat-label">Pending Approvals</div>
                </div>
                <mat-icon class="stat-icon">pending_actions</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().thisWeekHours }}</div>
                  <div class="stat-label">This Week Hours</div>
                </div>
                <mat-icon class="stat-icon">today</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().totalRevenue | currency:'USD':'symbol':'1.0-0' }}</div>
                  <div class="stat-label">Total Revenue</div>
                </div>
                <mat-icon class="stat-icon">payments</mat-icon>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 24px;
      }

      .breadcrumb {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        font-size: 0.9rem;
        margin-bottom: 8px;
      }
      .breadcrumb .current {
        color: var(--theme-on-surface);
      }

      h1 {
        margin: 0 0 6px;
        font-weight: 600;
      }
      .subtitle {
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
        margin: 0;
      }

      .timesheet-tabs {
        background: var(--theme-surface);
        border-radius: 12px;
        overflow: hidden;
      }

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
        font-weight: 600;
      }

      .table-container {
        overflow-x: auto;
      }

      .entries-table, .summaries-table, .reports-table {
        width: 100%;
      }

      .entry-desc {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .total-hours {
        font-weight: 500;
        color: var(--theme-primary);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-content {
        flex: 1;
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.9rem;
      }

      .stat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: rgba(0, 0, 0, 0.3);
      }

      mat-chip {
        font-size: 0.75rem;
        height: 24px;
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProjectTimesheetComponent implements OnInit {
  private timesheetService = inject(ProjectTimesheetService);
  private dialog = inject(MatDialog);

  timesheetEntries = signal<TimesheetEntry[]>([]);
  timesheetSummaries = signal<TimesheetSummary[]>([]);
  projectReports = signal<ProjectTimeReport[]>([]);
  stats = signal<TimesheetStats>({
    totalHours: 0,
    billableHours: 0,
    totalProjects: 0,
    pendingApprovals: 0,
    thisWeekHours: 0,
    totalRevenue: 0,
  });

  entryColumns = ['date', 'project', 'description', 'time', 'billable', 'status', 'actions'];
  summaryColumns = ['week', 'totalHours', 'billableHours', 'status', 'actions'];
  reportColumns = ['project', 'totalHours', 'billableHours', 'totalCost', 'actions'];

  ngOnInit() {
    this.loadTimesheetEntries();
    this.loadTimesheetSummaries();
    this.loadProjectReports();
    this.loadStats();
  }

  loadTimesheetEntries() {
    this.timesheetService.getTimesheetEntries().subscribe((data) => {
      this.timesheetEntries.set(data);
    });
  }

  loadTimesheetSummaries() {
    this.timesheetService.getTimesheetSummaries().subscribe((data) => {
      this.timesheetSummaries.set(data);
    });
  }

  loadProjectReports() {
    this.timesheetService.getProjectTimeReports().subscribe((data) => {
      this.projectReports.set(data);
    });
  }

  loadStats() {
    this.timesheetService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'accent';
      case 'submitted': return 'primary';
      case 'rejected': return 'warn';
      default: return '';
    }
  }

  openEntryDialog(entry?: TimesheetEntry) {
    const dialogRef = this.dialog.open(TimesheetEntryDialogComponent, {
      width: '600px',
      data: { entry }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (entry) {
          this.timesheetService.updateTimesheetEntry(entry._id, result).subscribe(() => {
            this.loadTimesheetEntries();
          });
        } else {
          this.timesheetService.createTimesheetEntry(result).subscribe(() => {
            this.loadTimesheetEntries();
          });
        }
      }
    });
  }

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.timesheetService.deleteTimesheetEntry(id).subscribe(() => {
        this.loadTimesheetEntries();
      });
    }
  }

  submitTimesheet() {
    console.log('Submit timesheet');
  }

  viewSummaryDetails(summary: TimesheetSummary) {
    console.log('View summary details', summary);
  }

  submitSummary(summary: TimesheetSummary) {
    this.timesheetService.submitTimesheet(summary.employeeId).subscribe(() => {
      this.loadTimesheetSummaries();
    });
  }

  exportReport() {
    console.log('Export report');
  }

  viewReportDetails(report: ProjectTimeReport) {
    console.log('View report details', report);
  }

  exportProjectReport(report: ProjectTimeReport) {
    console.log('Export project report', report);
  }
}