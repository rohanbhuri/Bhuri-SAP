import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { EnquiryListComponent } from './components/enquiry-list/enquiry-list.component';
import { PresentationListComponent } from './components/presentation-list/presentation-list.component';
import { QuotationAnalyticsPageComponent } from './pages/quotation-analytics-page.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NavbarComponent,
    BottomNavbarComponent,
    BreadcrumbComponent,
    QuotationListComponent,
    EnquiryListComponent,
    PresentationListComponent,
    QuotationAnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <div class="header-content">
          <div>
            <app-breadcrumb></app-breadcrumb>
            <h1>Quotation Management</h1>
            <p class="subtitle">Client enquiries to quotation workflow with approval system</p>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="openApiDocs()" *ngIf="canAccessApi()">
              <mat-icon>api</mat-icon>
              <span>API Docs</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <mat-tab-group class="quotations-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Enquiries">
          <app-enquiry-list></app-enquiry-list>
        </mat-tab>
        <mat-tab label="Presentations">
          <app-presentation-list></app-presentation-list>
        </mat-tab>
        <mat-tab label="Quotations">
          <app-quotation-list></app-quotation-list>
        </mat-tab>
        <mat-tab label="Analytics">
          <app-quotation-analytics-page></app-quotation-analytics-page>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private breadcrumbService = inject(BreadcrumbService);
  
  selectedTabIndex = 0;
  private tabs = ['enquiries', 'presentations', 'quotations', 'analytics'];
  private tabNames = ['Enquiries', 'Presentations', 'Quotations', 'Analytics'];

  canAccessApi(): boolean {
    return this.authService.getCurrentUser()?.allowApiAccess ?? false;
  }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.includes(tab)) {
        this.selectedTabIndex = this.tabs.indexOf(tab);
        this.breadcrumbService.setContext(this.tabNames[this.selectedTabIndex]);
      } else {
        this.breadcrumbService.setContext(this.tabNames[0]);
      }
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.clearContext();
  }

  onTabChange(event: any) {
    const tabName = this.tabs[event.index];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    });
    this.breadcrumbService.setContext(this.tabNames[event.index]);
  }

  openApiDocs() {
    this.router.navigate(['/modules/quotations/api-doc']);
  }
}