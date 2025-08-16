import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-organization-management-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Organization Management</span>
        </nav>
        <h1>Organization Management</h1>
        <p class="subtitle">Manage organizations and membership requests</p>
      </div>

      <nav mat-tab-nav-bar [tabPanel]="tabPanel" class="module-nav">
        <a
          mat-tab-link
          routerLink="organizations"
          routerLinkActive="active-link"
          #organizationsLink="routerLinkActive"
          [active]="organizationsLink.isActive"
        >
          <mat-icon>business</mat-icon>
          Organizations
        </a>
        <a
          mat-tab-link
          routerLink="requests"
          routerLinkActive="active-link"
          #requestsLink="routerLinkActive"
          [active]="requestsLink.isActive"
        >
          <mat-icon>group_add</mat-icon>
          Membership Requests
        </a>
      </nav>

      <mat-tab-nav-panel #tabPanel class="module-content">
        <router-outlet></router-outlet>
      </mat-tab-nav-panel>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 20px;
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
      }

      .module-nav {
        margin-bottom: 24px;
      }

      .module-nav a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .module-content {
        min-height: 400px;
      }
    `,
  ],
})
export class OrganizationManagementLayoutComponent {}