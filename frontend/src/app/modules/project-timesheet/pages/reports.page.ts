import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProjectTimesheetService, ProjectTimeReport } from '../project-timesheet.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    CurrencyPipe,
    DecimalPipe,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Time Reports</h2>
        <div class="header-actions">
          <button mat-raised-button color="accent">
            <mat-icon>download</mat-icon>
            Export All
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Custom Report
          </button>
        </div>
      </div>

      <mat-card class="filters-card">
        <mat-card-header>
          <mat-card-title>Report Filters</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="filters-grid">
            <mat-form-field>
              <mat-label>Date Range</mat-label>
              <mat-select>
                <mat-option value="week">This Week</mat-option>
                <mat-option value="month">This Month</mat-option>
                <mat-option value="quarter">This Quarter</mat-option>
                <mat-option value="year">This Year</mat-option>
                <mat-option value="custom">Custom Range</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker">
              <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field>
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker">
              <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Project</mat-label>
              <mat-select>
                <mat-option value="all">All Projects</mat-option>
                <mat-option value="proj1">Website Redesign</mat-option>
                <mat-option value="proj2">Mobile App</mat-option>
                <mat-option value="proj3">API Development</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary">Generate Report</button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-tab-group class="reports-tabs">
        <mat-tab label="Project Summary">
          <div class="tab-content">
            <div class="summary-cards">
              <mat-card class="summary-card">
                <mat-card-content>
                  <div class="summary-stat">
                    <mat-icon class="summary-icon">schedule</mat-icon>
                    <div class="summary-info">
                      <div class="summary-number">156.5</div>
                      <div class="summary-label">Total Hours</div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
              <mat-card class="summary-card">
                <mat-card-content>
                  <div class="summary-stat">
                    <mat-icon class="summary-icon">attach_money</mat-icon>
                    <div class="summary-info">
                      <div class="summary-number">124.0</div>
                      <div class="summary-label">Billable Hours</div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
              <mat-card class="summary-card">
                <mat-card-content>
                  <div class="summary-stat">
                    <mat-icon class="summary-icon">payments</mat-icon>
                    <div class="summary-info">
                      <div class="summary-number">{{ 12400 | currency }}</div>
                      <div class="summary-label">Total Revenue</div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
              <mat-card class="summary-card">
                <mat-card-content>
                  <div class="summary-stat">
                    <mat-icon class="summary-icon">folder</mat-icon>
                    <div class="summary-info">
                      <div class="summary-number">5</div>
                      <div class="summary-label">Active Projects</div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Project Breakdown</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="table-container">
                  <table mat-table [dataSource]="reports()" class="reports-table">
                    <ng-container matColumnDef="project">
                      <th mat-header-cell *matHeaderCellDef>Project</th>
                      <td mat-cell *matCellDef="let report">
                        <div class="project-info">
                          <mat-icon class="project-icon">work</mat-icon>
                          {{ report.projectName }}
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="totalHours">
                      <th mat-header-cell *matHeaderCellDef>Total Hours</th>
                      <td mat-cell *matCellDef="let report">
                        <div class="hours-info">
                          <div class="hours-number">{{ report.totalHours }}h</div>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="billableHours">
                      <th mat-header-cell *matHeaderCellDef>Billable Hours</th>
                      <td mat-cell *matCellDef="let report">
                        <div class="billable-info">
                          <div class="billable-number">{{ report.billableHours }}h</div>
                          <div class="billable-percentage">
                            {{ ((report.billableHours / report.totalHours) * 100) | number:'1.0-0' }}%
                          </div>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="totalCost">
                      <th mat-header-cell *matHeaderCellDef>Revenue</th>
                      <td mat-cell *matCellDef="let report">
                        <div class="cost-info">
                          <div class="cost-number">{{ report.totalCost | currency }}</div>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="team">
                      <th mat-header-cell *matHeaderCellDef>Team Members</th>
                      <td mat-cell *matCellDef="let report">
                        <div class="team-info">
                          <span class="team-count">{{ report.employeeHours?.length || 0 }} members</span>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Actions</th>
                      <td mat-cell *matCellDef="let report">
                        <button mat-icon-button color="primary" title="View Details">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button color="accent" title="Export">
                          <mat-icon>download</mat-icon>
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
        </mat-tab>

        <mat-tab label="Employee Report">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Employee Time Summary</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Employee-specific time tracking reports will be displayed here.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Billing Report">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Billing & Revenue Report</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Detailed billing and revenue analysis will be displayed here.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
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
      .filters-card {
        margin-bottom: 24px;
      }
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        align-items: end;
      }
      .reports-tabs {
        background: var(--theme-surface);
        border-radius: 12px;
        overflow: hidden;
      }
      .tab-content {
        padding: 24px;
      }
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .summary-card {
        text-align: center;
      }
      .summary-stat {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      .summary-icon {
        font-size: 2rem;
        color: var(--theme-primary);
      }
      .summary-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--theme-primary);
      }
      .summary-label {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.6);
      }
      .table-container {
        overflow-x: auto;
      }
      .reports-table {
        width: 100%;
      }
      .project-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .project-icon {
        color: rgba(0, 0, 0, 0.5);
      }
      .hours-number, .cost-number {
        font-weight: 500;
      }
      .billable-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .billable-percentage {
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.6);
      }
      .team-count {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.7);
      }
    `,
  ],
})
export class ReportsPageComponent implements OnInit {
  private timesheetService = inject(ProjectTimesheetService);
  reports = signal<ProjectTimeReport[]>([]);
  displayedColumns = ['project', 'totalHours', 'billableHours', 'totalCost', 'team', 'actions'];

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.timesheetService.getProjectTimeReports().subscribe(data => {
      this.reports.set(data);
    });
  }
}