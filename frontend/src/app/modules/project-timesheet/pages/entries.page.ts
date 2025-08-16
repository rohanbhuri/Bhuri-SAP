import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe, NgIf } from '@angular/common';
import { ProjectTimesheetService, TimesheetEntry } from '../project-timesheet.service';

@Component({
  selector: 'app-entries-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    NgIf,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Time Entries</h2>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Log Time
        </button>
      </div>

      <mat-card class="quick-entry-card">
        <mat-card-header>
          <mat-card-title>Quick Time Entry</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-entry-form">
            <mat-form-field>
              <mat-label>Project</mat-label>
              <mat-select>
                <mat-option value="proj1">Website Redesign</mat-option>
                <mat-option value="proj2">Mobile App</mat-option>
                <mat-option value="proj3">API Development</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Start Time</mat-label>
              <input matInput type="time">
            </mat-form-field>
            <mat-form-field>
              <mat-label>End Time</mat-label>
              <input matInput type="time">
            </mat-form-field>
            <mat-form-field class="description-field">
              <mat-label>Description</mat-label>
              <input matInput placeholder="What did you work on?">
            </mat-form-field>
            <button mat-raised-button color="primary">Save Entry</button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field>
              <mat-label>Filter by Project</mat-label>
              <mat-select>
                <mat-option value="all">All Projects</mat-option>
                <mat-option value="proj1">Website Redesign</mat-option>
                <mat-option value="proj2">Mobile App</mat-option>
                <mat-option value="proj3">API Development</mat-option>
              </mat-select>
            </mat-form-field>
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
              <mat-label>Date Range</mat-label>
              <mat-select>
                <mat-option value="today">Today</mat-option>
                <mat-option value="week">This Week</mat-option>
                <mat-option value="month">This Month</mat-option>
                <mat-option value="custom">Custom Range</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="entries()" class="entries-table">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let entry">
                  {{ entry.date | date:'MMM dd, yyyy' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="project">
                <th mat-header-cell *matHeaderCellDef>Project</th>
                <td mat-cell *matCellDef="let entry">
                  <div class="project-info">
                    <mat-icon class="project-icon">work</mat-icon>
                    {{ entry.projectId }}
                  </div>
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
                    <div class="time-range">{{ entry.startTime }} - {{ entry.endTime }}</div>
                    <div class="total-hours">{{ entry.totalHours }}h</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="billable">
                <th mat-header-cell *matHeaderCellDef>Billable</th>
                <td mat-cell *matCellDef="let entry">
                  <mat-chip [color]="entry.billable ? 'primary' : ''">
                    <mat-icon>{{ entry.billable ? 'attach_money' : 'money_off' }}</mat-icon>
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
                  <button mat-icon-button color="primary" title="Edit" *ngIf="entry.status === 'draft'">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" title="Copy">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" title="Delete" *ngIf="entry.status === 'draft'">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
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
      .quick-entry-card {
        margin-bottom: 24px;
      }
      .quick-entry-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        align-items: end;
      }
      .description-field {
        grid-column: 1 / -1;
      }
      .filters {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }
      .table-container {
        overflow-x: auto;
      }
      .entries-table {
        width: 100%;
      }
      .project-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .project-icon {
        font-size: 1.2rem;
        color: rgba(0, 0, 0, 0.5);
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
      mat-chip mat-icon {
        font-size: 1rem;
        margin-right: 4px;
      }
    `,
  ],
})
export class EntriesPageComponent implements OnInit {
  private timesheetService = inject(ProjectTimesheetService);
  entries = signal<TimesheetEntry[]>([]);
  displayedColumns = ['date', 'project', 'description', 'time', 'billable', 'status', 'actions'];

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.timesheetService.getTimesheetEntries().subscribe(data => {
      this.entries.set(data);
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
}