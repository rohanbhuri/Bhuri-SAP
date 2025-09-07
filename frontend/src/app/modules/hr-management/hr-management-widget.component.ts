import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { HrManagementService, HrStats, Employee, LeaveRequestDto } from './hr-management.service';

@Component({
  selector: 'app-hr-management-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="hr-widget" (mouseenter)="pauseAutoSlide()" (mouseleave)="resumeAutoSlide()">
      <div class="header">
        <div class="icon-container">
          <mat-icon>badge</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Human resources management</span>
        </div>
      </div>

      <div class="slider-container">
        <div
          class="slider-wrapper"
          [style.transform]="'translateX(-' + currentSlide() * 100 + '%)'"
        >
          <!-- Overview Card -->
          <div class="slide">
            <div class="card-content">
              <div class="workforce-overview">
                <div class="employee-count">
                  <div class="value">
                    {{ stats().total }}
                  </div>
                  <div class="label">Employees</div>
                </div>
                <div class="salary-avg">
                  <div class="rate">
                    \${{ formatCurrency(stats().averageSalary) }}
                  </div>
                  <div class="label">Avg Salary</div>
                </div>
              </div>
              <div class="metrics-grid">
                <div class="metric">
                  <div class="metric-number active">
                    {{ stats().active }}
                  </div>
                  <div class="metric-label">Active</div>
                </div>
                <div class="metric">
                  <div class="metric-number departments">{{ stats().departments }}</div>
                  <div class="metric-label">Departments</div>
                </div>
                <div class="metric">
                  <div class="metric-number new-hires">{{ stats().newHires }}</div>
                  <div class="metric-label">New Hires</div>
                </div>
                <div class="metric">
                  <div class="metric-number leaves">
                    {{ pendingLeaves().length }}
                  </div>
                  <div class="metric-label">Pending</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Department Distribution Card -->
          <div class="slide">
            <div class="card-content">
              <div class="card-title">Department Distribution</div>
              <div class="department-breakdown">
                <div class="dept-stats">
                  <div class="total-depts">
                    <span class="count">{{ stats().departments }}</span>
                    <span class="label">Departments</span>
                  </div>
                  <div class="avg-per-dept">
                    <span class="count">{{ getAvgEmployeesPerDept() }}</span>
                    <span class="label">Avg/Dept</span>
                  </div>
                </div>
                <div class="dept-list">
                  <div
                    class="dept-item"
                    *ngFor="let dept of getDepartments().slice(0, 4)"
                  >
                    <div class="dept-header">
                      <div class="dept-info">
                        <div class="dept-dot" [style.background]="dept.color"></div>
                        <span class="dept-name">{{ dept.name }}</span>
                      </div>
                      <span class="dept-count">{{ dept.count }}</span>
                    </div>
                    <mat-progress-bar
                      [value]="dept.percentage"
                      mode="determinate"
                      [color]="'primary'"
                    ></mat-progress-bar>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Leave Management Card -->
          <div class="slide">
            <div class="card-content">
              <div class="card-title">Leave Management</div>
              <div class="leave-overview">
                <div class="leave-stats">
                  <div class="leave-stat pending">
                    <div class="stat-value">{{ pendingLeaves().length }}</div>
                    <div class="stat-label">Pending</div>
                  </div>
                  <div class="leave-stat approved">
                    <div class="stat-value">{{ approvedLeaves().length }}</div>
                    <div class="stat-label">Approved</div>
                  </div>
                  <div class="leave-stat rejected">
                    <div class="stat-value">{{ rejectedLeaves().length }}</div>
                    <div class="stat-label">Rejected</div>
                  </div>
                </div>
                <div class="recent-leaves" *ngIf="pendingLeaves().length > 0">
                  <div class="recent-title">Recent Requests</div>
                  <div class="leave-list">
                    <div
                      class="leave-item"
                      *ngFor="let leave of pendingLeaves().slice(0, 3)"
                    >
                      <div class="leave-type">{{ leave.leaveType }}</div>
                      <div class="leave-duration">{{ getLeaveDuration(leave) }} days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <div class="slider-dots">
          <button
            class="dot"
            [class.active]="currentSlide() === 0"
            (click)="goToSlide(0)"
          ></button>
          <button
            class="dot"
            [class.active]="currentSlide() === 1"
            (click)="goToSlide(1)"
          ></button>
          <button
            class="dot"
            [class.active]="currentSlide() === 2"
            (click)="goToSlide(2)"
          ></button>
        </div>
        <button
          mat-flat-button
          color="primary"
          class="hr-button"
          (click)="openModule()"
        >
          <mat-icon>badge</mat-icon>
          Open HR
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .hr-widget {
        padding: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .icon-container {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #ff9800, #ffb74d);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .icon-container mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .subtitle {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        font-weight: 600;
      }

      .slider-container {
        flex: 1;
        overflow: hidden;
        border-radius: 8px;
      }

      .slider-wrapper {
        display: flex;
        transition: transform 0.3s ease;
        height: 100%;
      }

      .slide {
        min-width: 100%;
        height: 100%;
      }

      .card-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card-title {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--theme-on-surface);
        margin-bottom: 8px;
      }

      .workforce-overview {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 8px;
        padding: 10px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, #ff9800 10%, transparent),
          color-mix(in srgb, #ff9800 5%, transparent)
        );
        border-radius: 6px;
        border: 1px solid color-mix(in srgb, #ff9800 20%, transparent);
      }

      .employee-count .value {
        font-size: 1.4rem;
        font-weight: 700;
        color: #ff9800;
        line-height: 1;
      }

      .salary-avg .rate {
        font-size: 1.2rem;
        font-weight: 700;
        color: #4caf50;
        line-height: 1;
      }

      .employee-count .label,
      .salary-avg .label {
        font-size: 0.7rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        margin-top: 2px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }

      .metric {
        text-align: center;
        padding: 6px;
        border-radius: 4px;
        background: color-mix(
          in srgb,
          var(--theme-surface) 95%,
          var(--theme-primary)
        );
      }

      .metric-number {
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1;
      }

      .metric-number.active {
        color: #4caf50;
      }
      .metric-number.departments {
        color: #2196f3;
      }
      .metric-number.new-hires {
        color: #ff5722;
      }
      .metric-number.leaves {
        color: #ff9800;
      }

      .metric-label {
        font-size: 0.65rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        margin-top: 2px;
      }

      .department-breakdown {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .dept-stats {
        display: flex;
        justify-content: space-around;
        padding: 8px;
        background: color-mix(
          in srgb,
          var(--theme-surface) 98%,
          var(--theme-primary)
        );
        border-radius: 6px;
      }

      .total-depts,
      .avg-per-dept {
        text-align: center;
      }

      .total-depts .count,
      .avg-per-dept .count {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--theme-primary);
        display: block;
      }

      .total-depts .label,
      .avg-per-dept .label {
        font-size: 0.6rem;
        color: var(--theme-on-surface);
        opacity: 0.7;
      }

      .dept-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .dept-item {
        margin-bottom: 6px;
      }

      .dept-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3px;
      }

      .dept-info {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .dept-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .dept-name {
        font-size: 0.65rem;
        font-weight: 500;
      }

      .dept-count {
        font-size: 0.65rem;
        color: var(--theme-primary);
        font-weight: 600;
      }

      .leave-overview {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .leave-stats {
        display: flex;
        justify-content: space-around;
        padding: 8px;
        background: color-mix(
          in srgb,
          var(--theme-surface) 98%,
          var(--theme-primary)
        );
        border-radius: 6px;
      }

      .leave-stat {
        text-align: center;
      }

      .stat-value {
        font-size: 1.1rem;
        font-weight: 700;
        line-height: 1;
      }

      .leave-stat.pending .stat-value {
        color: #ff9800;
      }
      .leave-stat.approved .stat-value {
        color: #4caf50;
      }
      .leave-stat.rejected .stat-value {
        color: #f44336;
      }

      .stat-label {
        font-size: 0.6rem;
        color: var(--theme-on-surface);
        opacity: 0.7;
        margin-top: 2px;
      }

      .recent-leaves {
        flex: 1;
      }

      .recent-title {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--theme-on-surface);
        margin-bottom: 6px;
      }

      .leave-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .leave-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 6px;
        background: color-mix(
          in srgb,
          var(--theme-surface) 95%,
          var(--theme-primary)
        );
        border-radius: 4px;
      }

      .leave-type {
        font-size: 0.65rem;
        font-weight: 500;
        text-transform: capitalize;
      }

      .leave-duration {
        font-size: 0.6rem;
        color: var(--theme-primary);
        font-weight: 600;
      }

      .navigation {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .slider-dots {
        display: flex;
        gap: 6px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        background: color-mix(
          in srgb,
          var(--theme-on-surface) 30%,
          transparent
        );
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .dot.active {
        background: var(--theme-primary);
      }

      .hr-button {
        height: 32px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .hr-button mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    `,
  ],
})
export class HrManagementWidgetComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private hrService = inject(HrManagementService);

  stats = signal<HrStats>({
    total: 0,
    active: 0,
    departments: 0,
    averageSalary: 0,
    newHires: 0,
  });

  employees = signal<Employee[]>([]);
  leaves = signal<LeaveRequestDto[]>([]);
  currentSlide = signal(0);
  private slideInterval: any;

  ngOnInit() {
    this.loadAllData();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      const nextSlide = (this.currentSlide() + 1) % 3;
      this.currentSlide.set(nextSlide);
    }, 5000);
  }

  pauseAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  loadAllData() {
    this.loadStats();
    this.loadEmployees();
    this.loadLeaves();
  }

  loadStats() {
    this.hrService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {
        this.stats.set({
          total: 0,
          active: 0,
          departments: 0,
          averageSalary: 0,
          newHires: 0,
        });
      },
    });
  }

  loadEmployees() {
    this.hrService.getEmployees().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.employees.set([]),
    });
  }

  loadLeaves() {
    this.hrService.listLeaves().subscribe({
      next: (leaves) => this.leaves.set(leaves),
      error: () => this.leaves.set([]),
    });
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  }

  getDepartments() {
    const deptColors = {
      'Engineering': '#2196F3',
      'Sales': '#4CAF50',
      'Marketing': '#FF9800',
      'Support': '#9C27B0',
      'HR': '#E91E63',
      'Finance': '#00BCD4',
      'Operations': '#795548',
      'IT': '#607D8B'
    };

    const deptCounts: { [key: string]: number } = {};
    this.employees().forEach(emp => {
      if (emp.department) {
        deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
      }
    });

    const totalEmployees = this.employees().length;
    
    return Object.entries(deptCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
        color: deptColors[name as keyof typeof deptColors] || '#9E9E9E'
      }))
      .sort((a, b) => b.count - a.count);
  }

  getAvgEmployeesPerDept(): number {
    const depts = this.stats().departments;
    const total = this.stats().total;
    return depts > 0 ? Math.round(total / depts) : 0;
  }

  pendingLeaves() {
    return this.leaves().filter(leave => leave.status === 'pending');
  }

  approvedLeaves() {
    return this.leaves().filter(leave => leave.status === 'approved');
  }

  rejectedLeaves() {
    return this.leaves().filter(leave => leave.status === 'rejected');
  }

  getLeaveDuration(leave: LeaveRequestDto): number {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    // Reset auto-slide timer when user manually navigates
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  openModule() {
    this.router.navigate(['/modules/hr-management'], {
      queryParams: { tab: 'employees' },
    });
  }
}
