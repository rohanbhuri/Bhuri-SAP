import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { RequestLoginListComponent } from './components/request-login-list.component';
import { ClientsListComponent } from './components/clients-list.component';
import { ContactUsComponent } from './pages/contact-us.component';
import { AnalyticsPageComponent } from './pages/analytics-page.component';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NavbarComponent,
    BottomNavbarComponent,
    RequestLoginListComponent,
    ClientsListComponent,
    ContactUsComponent,
    AnalyticsPageComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div>
            <div class="breadcrumb">
              <span>Modules</span>
              <mat-icon>chevron_right</mat-icon>
              <span>Client Management</span>
            </div>
            <h1 class="page-title">Client Management</h1>
            <p class="page-subtitle">Manage client requests and accounts</p>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="openApiDocs()">
              <mat-icon>api</mat-icon>
              <span>API Docs</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <mat-tab-group class="custom-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Request Login Credentials">
          <div class="tab-content">
            <app-request-login-list></app-request-login-list>
          </div>
        </mat-tab>
        <mat-tab label="Clients">
          <div class="tab-content">
            <app-clients-list></app-clients-list>
          </div>
        </mat-tab>
        <mat-tab label="Contact Us">
          <div class="tab-content">
            <app-contact-us></app-contact-us>
          </div>
        </mat-tab>
        <mat-tab label="Analytics">
          <div class="tab-content">
            <app-client-analytics-page></app-client-analytics-page>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 12px;
    }

    .breadcrumb mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #111827;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    .custom-tabs {
      background: transparent;
    }

    .tab-content {
      padding: 24px 0;
    }

    ::ng-deep .custom-tabs .mat-mdc-tab-labels {
      background: white;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    ::ng-deep .custom-tabs .mat-mdc-tab-label {
      font-size: 1rem;
      font-weight: 500;
      min-width: 200px;
    }
  `]
})
export class ClientManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  selectedTabIndex = 0;
  private tabs = ['requests', 'clients', 'contact-us', 'analytics'];

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

  openApiDocs() {
    this.router.navigate(['/modules/client-management/api-doc']);
  }
}
