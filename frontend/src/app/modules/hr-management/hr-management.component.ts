import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  HrManagementService,
  Employee,
  Department,
  HrStats,
} from './hr-management.service';

@Component({
  selector: 'app-hr-management',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">HR Management</span>
        </nav>
        <h1>Human Resources Management</h1>
        <p class="subtitle">Manage employees, departments, and HR operations</p>
      </div>

      <mat-tab-group class="hr-tabs">
        <mat-tab label="Employees">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Employees</h2>
              <button mat-raised-button color="primary">
                <mat-icon>person_add</mat-icon>
                Add Employee
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="employees()" class="hr-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let employee">
                    <div class="employee-info">
                      <div class="employee-avatar">
                        {{ getInitials(employee.firstName, employee.lastName) }}
                      </div>
                      <div>
                        <div class="employee-name">
                          {{ employee.firstName }} {{ employee.lastName }}
                        </div>
                        <div class="employee-email">{{ employee.email }}</div>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="position">
                  <th mat-header-cell *matHeaderCellDef>Position</th>
                  <td mat-cell *matCellDef="let employee">
                    {{ employee.position }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="department">
                  <th mat-header-cell *matHeaderCellDef>Department</th>
                  <td mat-cell *matCellDef="let employee">
                    {{ employee.department }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let employee">
                    <mat-chip
                      [color]="
                        employee.status === 'active' ? 'primary' : 'warn'
                      "
                    >
                      {{ employee.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let employee">
                    <button mat-icon-button color="primary" title="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Delete">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="employeeColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: employeeColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Departments">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Departments</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Add Department
              </button>
            </div>

            <div class="table-container">
              <table mat-table [dataSource]="departments()" class="hr-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let department">
                    {{ department.name }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let department">
                    {{ department.description }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="employeeCount">
                  <th mat-header-cell *matHeaderCellDef>Employees</th>
                  <td mat-cell *matCellDef="let department">
                    {{ department.employeeCount }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let department">
                    <button mat-icon-button color="primary" title="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Delete">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="departmentColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: departmentColumns"
                ></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Analytics">
          <div class="tab-content">
            <div class="tab-header">
              <h2>HR Analytics</h2>
            </div>

            <div class="stats-grid">
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().total }}</div>
                  <div class="stat-label">Total Employees</div>
                </div>
                <mat-icon class="stat-icon">people</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().active }}</div>
                  <div class="stat-label">Active Employees</div>
                </div>
                <mat-icon class="stat-icon">check_circle</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().departments }}</div>
                  <div class="stat-label">Departments</div>
                </div>
                <mat-icon class="stat-icon">business</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">
                    \${{ formatCurrency(stats().averageSalary) }}
                  </div>
                  <div class="stat-label">Average Salary</div>
                </div>
                <mat-icon class="stat-icon">payments</mat-icon>
              </mat-card>

              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().newHires }}</div>
                  <div class="stat-label">New Hires (30 days)</div>
                </div>
                <mat-icon class="stat-icon">person_add</mat-icon>
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

      .hr-tabs {
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

      .hr-table {
        width: 100%;
      }

      .employee-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .employee-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--theme-primary);
        color: var(--theme-on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .employee-name {
        font-weight: 500;
      }

      .employee-email {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
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
export class HrManagementComponent implements OnInit {
  private hrService = inject(HrManagementService);

  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  stats = signal<HrStats>({
    total: 0,
    active: 0,
    departments: 0,
    averageSalary: 0,
    newHires: 0,
  });

  employeeColumns = ['name', 'position', 'department', 'status', 'actions'];
  departmentColumns = ['name', 'description', 'employeeCount', 'actions'];

  ngOnInit() {
    this.loadEmployees();
    this.loadDepartments();
    this.loadStats();
  }

  loadEmployees() {
    this.hrService.getEmployees().subscribe((data) => {
      this.employees.set(data);
    });
  }

  loadDepartments() {
    this.hrService.getDepartments().subscribe((data) => {
      this.departments.set(data);
    });
  }

  loadStats() {
    this.hrService.getStats().subscribe((data) => {
      this.stats.set(data);
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
