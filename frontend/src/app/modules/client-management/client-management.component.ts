import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { ClientRequestsComponent } from './components/client-requests.component';
import { ClientsListComponent } from './components/clients-list.component';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
    ClientRequestsComponent,
    ClientsListComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Client Management</span>
        </nav>
        <h1>Client Management</h1>
        <p class="subtitle">Manage client requests and accounts</p>
      </div>

      <mat-tab-group class="client-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Client Requests">
          <app-client-requests></app-client-requests>
        </mat-tab>
        <mat-tab label="Clients">
          <app-clients-list></app-clients-list>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .page {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin-bottom: 12px;
    }

    .breadcrumb .current {
      color: var(--theme-primary);
      font-weight: 500;
    }

    .breadcrumb mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--theme-on-surface);
    }

    .subtitle {
      font-size: 1rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      margin: 0;
    }

    .client-tabs {
      margin-top: 20px;
    }
  `]
})
export class ClientManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  selectedTabIndex = 0;
  private tabs = ['requests', 'clients'];

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
