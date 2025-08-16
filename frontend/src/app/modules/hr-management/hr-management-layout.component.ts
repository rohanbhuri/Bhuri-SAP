import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hr-management-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    BottomNavbarComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="module-container">
      <nav class="subnav">
        <a routerLink="overview" routerLinkActive="active">Overview</a>
        <a routerLink="attendance" routerLinkActive="active">Attendance</a>
        <a routerLink="leaves" routerLinkActive="active">Leaves</a>
        <a routerLink="performance" routerLinkActive="active">Performance</a>
        @if (hasRole('hr_admin')) {
        <a routerLink="payroll" routerLinkActive="active">Payroll</a>
        <a routerLink="compliance" routerLinkActive="active">Compliance</a>
        <a routerLink="documents" routerLinkActive="active">Documents</a>
        <a routerLink="assets" routerLinkActive="active">Assets</a>
        <a routerLink="analytics" routerLinkActive="active">Analytics</a>
        }
      </nav>
      <router-outlet></router-outlet>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .module-container {
        padding: 16px;
        max-width: 1400px;
        margin: 0 auto;
      }
      .subnav {
        display: flex;
        gap: 12px;
        border-bottom: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .subnav a {
        padding: 8px 12px;
        text-decoration: none;
        color: var(--theme-on-surface);
        border-radius: 8px 8px 0 0;
      }
      .subnav a.active {
        border-bottom: 2px solid var(--theme-primary);
        color: var(--theme-primary);
        font-weight: 600;
      }
    `,
  ],
})
export class HrManagementLayoutComponent {
  private auth = inject(AuthService);
  hasRole(role: string) {
    return this.auth.hasRole(role);
  }
}
