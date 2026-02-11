import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-management-layout',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterOutlet,
    NavbarComponent,
    BottomNavbarComponent,
    BreadcrumbComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header">
        <div class="header-content">
          <div>
            <app-breadcrumb></app-breadcrumb>
            <h1>User Management</h1>
            <p class="subtitle">Manage users, roles, and permissions</p>
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

      <mat-tab-group
        class="management-tabs"
        [selectedIndex]="selectedTab"
        (selectedIndexChange)="onTabChange($event)"
      >
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>people</mat-icon>
            Users
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>admin_panel_settings</mat-icon>
            Roles
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>security</mat-icon>
            Permissions
          </ng-template>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>analytics</mat-icon>
            Analytics
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <div class="tab-content">
        <router-outlet></router-outlet>
      </div>
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
        margin-bottom: 24px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }

      h1 {
        margin: 0 0 6px;
        font-weight: 600;
        color: var(--theme-on-surface);
      }
      .subtitle {
        margin: 0;
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
      }

      .management-tabs {
        border-radius: 12px 12px 0 0;
        border-bottom: none;
        background: var(--theme-surface);
      }

      .tab-content {
        border-top: none;
        border-radius: 0 0 12px 12px;
        min-height: 400px;
        background: var(--theme-surface);
      }

      ::ng-deep .mat-mdc-tab-label {
        min-width: 120px;
      }

      ::ng-deep .mat-mdc-tab-label .mdc-tab__text-label {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
})
export class UserManagementLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private breadcrumbService = inject(BreadcrumbService);

  selectedTab = 0;
  private tabNames = ['Users', 'Roles', 'Permissions', 'Analytics'];

  ngOnInit() {
    console.log('UserManagementLayoutComponent initialized');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Navigation event:', event.url);
        this.updateSelectedTab(event.url);
      });

    this.updateSelectedTab(this.router.url);
  }

  ngOnDestroy() {
    this.breadcrumbService.clearContext();
  }

  updateSelectedTab(url: string) {
    if (url.includes('/roles')) {
      this.selectedTab = 1;
    } else if (url.includes('/permissions')) {
      this.selectedTab = 2;
    } else if (url.includes('/analytics')) {
      this.selectedTab = 3;
    } else {
      this.selectedTab = 0;
    }
    this.breadcrumbService.setContext(this.tabNames[this.selectedTab]);
  }

  onTabChange(index: number) {
    const routes = ['users', 'roles', 'permissions', 'analytics'];
    if (routes[index]) {
      this.router.navigate(['/modules/user-management', routes[index]]);
    }
    this.breadcrumbService.setContext(this.tabNames[index]);
  }

  openApiDocs() {
    this.router.navigate(['/modules/user-management/api-doc']);
  }

  canManageRoles(): boolean {
    return (
      this.authService.hasRole('super_admin') ||
      this.authService.hasRole('admin')
    );
  }

  canManagePermissions(): boolean {
    return this.authService.hasRole('super_admin');
  }
}
