import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-management-layout',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    RouterOutlet,
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
          <span class="current">User Management</span>
        </nav>
        <h1>User Management</h1>
        <p class="subtitle">Manage users, roles, and permissions</p>
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

      .breadcrumb {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem;
        margin-bottom: 8px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }
      .breadcrumb .current {
        color: var(--theme-on-surface);
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

  selectedTab = 0;

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

  updateSelectedTab(url: string) {
    if (url.includes('/roles')) {
      this.selectedTab = 1;
    } else if (url.includes('/permissions')) {
      this.selectedTab = 2;
    } else {
      this.selectedTab = 0;
    }
  }

  onTabChange(index: number) {
    const routes = ['users', 'roles', 'permissions'];
    if (routes[index]) {
      this.router.navigate(['/modules/user-management', routes[index]]);
    }
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
