import { Component, inject, signal, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Organization, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { BrandConfigService } from '../../services/brand-config.service';
import { ModulesService, AppModuleInfo } from '../../services/modules.service';
import {
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { UserManagementWidgetComponent } from '../../modules/user-management/user-management-widget.component';
import { OrganizationManagementWidgetComponent } from '../../modules/organization-management/organization-management-widget.component';
import { CrmWidgetComponent } from '../../modules/crm/crm-widget.component';
import { HrManagementWidgetComponent } from '../../modules/hr-management/hr-management-widget.component';
import { ProjectsManagementWidgetComponent } from '../../modules/projects-management/projects-management-widget.component';
import { TasksManagementWidgetComponent } from '../../modules/tasks-management/tasks-management-widget.component';
import { InventoryManagementWidgetComponent } from '../../modules/inventory-management/inventory-management-widget.component';
import { PayrollManagementWidgetComponent } from '../../modules/payroll-management/payroll-management-widget.component';
import { SalesManagementWidgetComponent } from '../../modules/sales-management/sales-management-widget.component';
import { PendingWorkWidgetComponent } from '../../components/pending-work-widget.component';
import { OrganizationManagementService } from '../../modules/organization-management/organization-management.service';
import { SeoService } from '../../services/seo.service';

interface DashboardWidget {
  id: string;
  title: string;
  description?: string;
  size: 's' | 'm' | 'l';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    UserManagementWidgetComponent,
    OrganizationManagementWidgetComponent,
    CrmWidgetComponent,
    HrManagementWidgetComponent,
    ProjectsManagementWidgetComponent,
    TasksManagementWidgetComponent,
    InventoryManagementWidgetComponent,
    PayrollManagementWidgetComponent,
    SalesManagementWidgetComponent,
    PendingWorkWidgetComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header" aria-label="Dashboard header">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <span>Pages</span>
          <mat-icon aria-hidden="true">chevron_right</mat-icon>
          <span class="current">Dashboard</span>
        </nav>
        <h1>Dashboard</h1>
        <p class="subtitle">
          Check the sales, value and bounce rate by country.
        </p>
      </div>

      <section
        class="widgets"
        cdkDropList
        (cdkDropListDropped)="drop($event)"
        role="list"
        aria-label="Dashboard widgets grid"
      >
        @for (w of widgets(); track w.id) {
        <mat-card
          class="widget"
          [attr.data-size]="w.size"
          [style.border-color]="getModuleColor(w.id)"
          [style.background]="getModuleColor(w.id) + '33'"
          cdkDrag
          role="listitem"
          tabindex="0"
          [attr.aria-label]="w.title"
        >
          <div class="widget-header">
            <h3 class="widget-title">{{ w.title }}</h3>
            <div class="widget-actions">
              <button mat-icon-button cdkDragHandle aria-label="Drag widget">
                <mat-icon>drag_indicator</mat-icon>
              </button>
              <button
                mat-icon-button
                [matMenuTriggerFor]="menu"
                aria-label="Widget options"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="resize(w, 's')">
                  <mat-icon>fit_screen</mat-icon>
                  <span>Small</span>
                </button>
                <button mat-menu-item (click)="resize(w, 'm')">
                  <mat-icon>crop_5_4</mat-icon>
                  <span>Medium</span>
                </button>
                <button mat-menu-item (click)="resize(w, 'l')">
                  <mat-icon>crop_16_9</mat-icon>
                  <span>Large</span>
                </button>
              </mat-menu>
            </div>
          </div>
          <div class="widget-body">
            @switch (w.id) { @case ('user-management') {
            <app-user-management-widget></app-user-management-widget>
            } @case ('organization-management') {
            <app-organization-management-widget></app-organization-management-widget>
            } @case ('crm') {
            <app-crm-widget></app-crm-widget>
            } @case ('hr-management') {
            <app-hr-management-widget></app-hr-management-widget>
            } @case ('projects-management') {
            <app-projects-management-widget></app-projects-management-widget>
            } @case ('tasks-management') {
            <app-tasks-management-widget></app-tasks-management-widget>
            } @case ('inventory-management') {
            <app-inventory-management-widget></app-inventory-management-widget>
            } @case ('payroll-management') {
            <app-payroll-management-widget></app-payroll-management-widget>
            } @case ('sales-management') {
            <app-sales-management-widget></app-sales-management-widget>
            } @case ('pending-work') {
            <app-pending-work-widget></app-pending-work-widget>
            } @default {
            <div class="placeholder-widget">
              <p class="metric">{{ w.title }}</p>
              <p class="trend">Ready for implementation</p>
            </div>
            } }
          </div>
        </mat-card>
        } @if (widgets().length === 0) {
        <mat-card class="empty" tabindex="0" aria-live="polite">
          <mat-card-title>No active modules</mat-card-title>
          <mat-card-content>
            <p>
              Ask your administrator to activate modules for your organization.
            </p>
          </mat-card-content>
        </mat-card>
        }
      </section>
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

      .widgets {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(12, minmax(0, 1fr));
      }

      .widget {
        grid-column: span 12;
        background: var(--theme-surface);
        border: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px 0 16px;
      }
      .widget-title {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
      }
      .widget-actions {
        display: inline-flex;
        gap: 4px;
      }

      .widget-body {
        padding: 4px 16px 16px 16px;
      }
      .metric {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 6px 0;
      }
      .trend {
        font-weight: 600;
        font-size: 0.9rem;
      }
      .trend.positive {
        color: var(--theme-success, #4caf50);
      }
      .trend.negative {
        color: var(--theme-error, #f44336);
      }

      @media (min-width: 900px) {
        .widget[data-size='s'] {
          grid-column: span 4;
        }
        .widget[data-size='m'] {
          grid-column: span 6;
        }
        .widget[data-size='l'] {
          grid-column: span 12;
        }
      }

      @media (min-width: 1200px) {
        .widget[data-size='s'] {
          grid-column: span 3;
        }
        .widget[data-size='m'] {
          grid-column: span 6;
        }
        .widget[data-size='l'] {
          grid-column: span 12;
        }
      }

      .empty {
        text-align: center;
      }

      .widget:focus-visible {
        outline: var(--focus-outline);
        outline-offset: 2px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private seoService = inject(SeoService);
  protected brandConfig = inject(BrandConfigService);
  private modulesService = inject(ModulesService);
  private orgService = inject(OrganizationManagementService);

  currentUser = signal<User | null>(null);
  organizations = signal<Organization[]>([]);
  activeModules = signal<AppModuleInfo[]>([]);
  widgets = signal<DashboardWidget[]>([]);

  ngOnInit() {
    this.setupSEO();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user && this.authService.isAuthenticated()) {
        this.modulesService.getActive().subscribe({
          next: (list) => {
            this.activeModules.set(list);
            const mapped: DashboardWidget[] = list.length
              ? list.map((m, idx) => ({
                  id: m.name,
                  title: m.displayName,
                  description: m.description,
                  size:
                    idx === 0
                      ? 'm'
                      : idx === 1
                      ? 'm'
                      : idx % 3 === 0
                      ? 'l'
                      : 'm',
                }))
              : [];
            
            // Add pending work widget if user has super admin role
            if (user?.roles?.includes('super_admin')) {
              this.orgService.getOrganizationRequests().subscribe({
                next: (requests) => {
                  const pendingCount = requests.filter(r => r.status === 'pending').length;
                  if (pendingCount > 0) {
                    const pendingWidget: DashboardWidget = {
                      id: 'pending-work',
                      title: 'Pending Work',
                      description: 'Review pending organization requests',
                      size: 's'
                    };
                    this.widgets.set([pendingWidget, ...mapped]);
                  } else {
                    this.widgets.set(mapped);
                  }
                },
                error: () => {
                  this.widgets.set(mapped);
                }
              });
            } else {
              this.widgets.set(mapped);
            }
          },
          error: (error) => {
            if (error.status === 401 || error.status === 403) {
              this.authService.logout();
            }
          },
        });
        this.loadOrganizations();
      }
    });
  }

  drop(event: CdkDragDrop<DashboardWidget[]>) {
    const copy = [...this.widgets()];
    moveItemInArray(copy, event.previousIndex, event.currentIndex);
    this.widgets.set(copy);
  }

  resize(w: DashboardWidget, size: 's' | 'm' | 'l') {
    const updated = this.widgets().map((x) =>
      x.id === w.id ? { ...x, size } : x
    );
    this.widgets.set(updated);
  }

  loadOrganizations() {
    this.authService.getMyOrganizations().subscribe({
      next: (orgs) => this.organizations.set(orgs),
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
        } else {
          this.snackBar.open('Failed to load organizations', 'Close', {
            duration: 3000,
          });
        }
      },
    });
  }

  onOrganizationChange(organizationId: string) {
    this.authService.updateUserOrganization(organizationId);
    this.snackBar.open('Organization updated successfully', 'Close', {
      duration: 2000,
    });
  }

  getCurrentOrgName(): string {
    const user = this.currentUser();
    if (!user?.organizationId) return '';
    const org = this.organizations().find((o) => o.id === user.organizationId);
    return org?.name || '';
  }

  getModuleColor(moduleId: string): string | null {
    const module = this.activeModules().find((m) => m.name === moduleId);
    return module?.color || null;
  }

  private setupSEO() {
    const brandName = this.brandConfig.getBrandName();

    this.seoService.updateSEO({
      title: `Dashboard - ${brandName}`,
      description: `Access your ${brandName} business management dashboard with real-time insights, module widgets, and comprehensive analytics.`,
      keywords:
        'dashboard, business analytics, management dashboard, widgets, business insights',
      siteName: brandName,
      author: 'Rohan Bhuri',
    });
  }

  logout() {
    this.authService.logout();
  }
}
