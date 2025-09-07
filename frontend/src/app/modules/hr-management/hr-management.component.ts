import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { AttendancePageComponent } from './pages/attendance.page';
import { LeavesPageComponent } from './pages/leaves.page';
import { PayrollPageComponent } from './pages/payroll.page';
import { PerformancePageComponent } from './pages/performance.page';
import { CompliancePageComponent } from './pages/compliance.page';
import { DocumentsPageComponent } from './pages/documents.page';
import { AssetsPageComponent } from './pages/assets.page';
import { AnalyticsPageComponent } from './pages/analytics.page';

@Component({
  selector: 'app-hr-management',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
    AttendancePageComponent,
    LeavesPageComponent,
    PayrollPageComponent,
    PerformancePageComponent,
    CompliancePageComponent,
    DocumentsPageComponent,
    AssetsPageComponent,
    AnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">HR Management</span>
        </nav>
        <h1>Human Resources Management</h1>
        <p class="subtitle">Manage employees, attendance, leaves, and HR operations</p>
      </div>

      <mat-tab-group class="hr-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Attendance">
          <app-hr-attendance-page></app-hr-attendance-page>
        </mat-tab>
        <mat-tab label="Leaves">
          <app-hr-leaves-page></app-hr-leaves-page>
        </mat-tab>
        <mat-tab label="Performance">
          <app-hr-performance-page></app-hr-performance-page>
        </mat-tab>
        <mat-tab label="Payroll">
          <app-hr-payroll-page></app-hr-payroll-page>
        </mat-tab>
        <mat-tab label="Compliance">
          <app-hr-compliance-page></app-hr-compliance-page>
        </mat-tab>
        <mat-tab label="Documents">
          <app-hr-documents-page></app-hr-documents-page>
        </mat-tab>
        <mat-tab label="Assets">
          <app-hr-assets-page></app-hr-assets-page>
        </mat-tab>
        <mat-tab label="Analytics">
          <app-hr-analytics-page></app-hr-analytics-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./hr-management.component.css']
})
export class HrManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  selectedTabIndex = 0;
  private tabs = ['attendance', 'leaves', 'performance', 'payroll', 'compliance', 'documents', 'assets', 'analytics'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.includes(tab)) {
        this.selectedTabIndex = this.tabs.indexOf(tab);
      }
    });
  }

  onTabChange(event: any) {
    const tabName = this.tabs[event.index];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    });
  }
}
