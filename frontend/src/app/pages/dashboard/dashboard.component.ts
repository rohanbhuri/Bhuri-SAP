import { Component, inject, signal, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

export interface Organization {
  id: string;
  _id?: string;
  name: string;
  settings?: {
    primaryColor?: string;
    accentColor?: string;
    theme?: string;
  };
}
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
import { MyOrganizationsWidgetComponent } from '../../modules/my-organizations/my-organizations-widget.component';
import { CrmWidgetComponent } from '../../modules/crm/crm-widget.component';
import { HrManagementWidgetComponent } from '../../modules/hr-management/hr-management-widget.component';
import { ProjectsManagementWidgetComponent } from '../../modules/projects-management/projects-management-widget.component';
import { TasksManagementWidgetComponent } from '../../modules/tasks-management/tasks-management-widget.component';
import { InventoryManagementWidgetComponent } from '../../modules/inventory-management/inventory-management-widget.component';
import { PayrollManagementWidgetComponent } from '../../modules/payroll-management/payroll-management-widget.component';
import { SalesManagementWidgetComponent } from '../../modules/sales-management/sales-management-widget.component';
import { ProjectTrackingWidgetComponent } from '../../modules/project-tracking/project-tracking-widget.component';
import { ProjectTimesheetWidgetComponent } from '../../modules/project-timesheet/project-timesheet-widget.component';
import { PendingWorkWidgetComponent } from '../../components/pending-work-widget.component';
import { OrderManagementWidgetComponent } from '../../modules/order-management/order-management-widget.component';
import { FinanceWidgetComponent } from '../../modules/finance/finance-widget.component';
import { ReportsManagementWidgetComponent } from '../../modules/reports-management/reports-management-widget.component';
import { FormBuilderWidgetComponent } from '../../modules/form-builder/form-builder-widget.component';
import { MessagesWidgetComponent } from '../../modules/messages-module/messages-widget.component';
// Racconti XRM Widgets
import { CatalogueWidgetComponent } from '../../modules/catalogue/catalogue-widget.component';
import { CmsWidgetComponent } from '../../modules/cms/cms-widget.component';
import { QuotationsWidgetComponent } from '../../modules/quotations/quotations-widget.component';
import { ClientManagementWidgetComponent } from '../../modules/client-management/client-management-widget.component';
import { OrganizationManagementService } from '../../modules/organization-management/organization-management.service';
import { SeoService } from '../../services/seo.service';
import { ThemeService } from '../../services/theme.service';
import { MODULE_REGISTRY, getModulesByBrand } from '../../modules/module-registry';

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
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    NavbarComponent,
    BottomNavbarComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    UserManagementWidgetComponent,
    OrganizationManagementWidgetComponent,
    MyOrganizationsWidgetComponent,
    CrmWidgetComponent,
    HrManagementWidgetComponent,
    ProjectsManagementWidgetComponent,
    TasksManagementWidgetComponent,
    InventoryManagementWidgetComponent,
    PayrollManagementWidgetComponent,
    SalesManagementWidgetComponent,
    ProjectTrackingWidgetComponent,
    ProjectTimesheetWidgetComponent,
    PendingWorkWidgetComponent,
    OrderManagementWidgetComponent,
    FinanceWidgetComponent,
    ReportsManagementWidgetComponent,
    FormBuilderWidgetComponent,
    MessagesWidgetComponent,
    CatalogueWidgetComponent,
    CmsWidgetComponent,
    QuotationsWidgetComponent,
    ClientManagementWidgetComponent,
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
        <div class="header-controls">
          <mat-form-field class="view-selector">
            <mat-select 
              [ngModel]="selectedContext()" 
              (ngModelChange)="onContextChange($event)">
              <mat-option value="personal">
                <mat-icon>person</mat-icon>
                Personal
              </mat-option>
              @for (org of organizations(); track org._id || org.id) {
                <mat-option [value]="org._id || org.id">
                  <mat-icon>business</mat-icon>
                  {{ org.name }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <h1>Dashboard</h1>
          <div class="dashboard-menu">
            <button
              mat-icon-button
              (click)="resetWidgetArrangement()"
              matTooltip="Reset to Default Layout"
              aria-label="Reset widget arrangement"
            >
              <mat-icon>refresh</mat-icon>
            </button>
            <button
              mat-icon-button
              [matMenuTriggerFor]="viewMenu"
              matTooltip="Change View"
              aria-label="Change dashboard view"
            >
              <mat-icon>{{ getViewIcon() }}</mat-icon>
            </button>
            <mat-menu #viewMenu="matMenu">
              <button mat-menu-item (click)="setViewMode('compact')">
                <mat-icon>view_compact</mat-icon>
                <span>Compact View</span>
              </button>
              <button mat-menu-item (click)="setViewMode('normal')">
                <mat-icon>view_module</mat-icon>
                <span>Normal View</span>
              </button>
              <button mat-menu-item (click)="setViewMode('expanded')">
                <mat-icon>view_comfy</mat-icon>
                <span>Expanded View</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>

      <section
        class="widgets"
        [class.compact]="viewMode() === 'compact'"
        [class.expanded]="viewMode() === 'expanded'"
        cdkDropList
        (cdkDropListDropped)="drop($event)"
        role="list"
        aria-label="Dashboard widgets grid"
      >
        @if (isLoadingWidgets()) {
          <div class="loading-state" role="status" aria-live="polite">
            <mat-icon>hourglass_empty</mat-icon>
            <p>Loading dashboard widgets...</p>
          </div>
        } @else {
          @for (w of widgets(); track w.id) {
          <mat-card
          class="widget"
          color="primary"
          [attr.data-size]="getWidgetSize(w)"
          [attr.data-view]="viewMode()"
          [style.--module-color]="getModuleColor(w.id)"
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
            } @case ('my-organizations') {
            <app-my-organizations-widget></app-my-organizations-widget>
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
            } @case ('project-tracking') {
            <app-project-tracking-widget></app-project-tracking-widget>
            } @case ('project-timesheet') {
            <app-project-timesheet-widget></app-project-timesheet-widget>
            } @case ('order-management') {
            <app-order-management-widget></app-order-management-widget>
            } @case ('finance') {
            <app-finance-widget></app-finance-widget>
            } @case ('reports-management') {
            <app-reports-management-widget></app-reports-management-widget>
            } @case ('form-builder') {
            <app-form-builder-widget></app-form-builder-widget>
            } @case ('messages') {
            <app-messages-widget></app-messages-widget>
            } @case ('catalogue') {
            <app-catalogue-widget></app-catalogue-widget>
            } @case ('cms') {
            <app-cms-widget></app-cms-widget>
            } @case ('quotations') {
            <app-quotations-widget></app-quotations-widget>
            } @case ('client-management') {
            <app-client-management-widget></app-client-management-widget>
            } @case ('pending-work') {
            <app-pending-work-widget></app-pending-work-widget>
            } }
          </div>
        </mat-card>
          } @if (widgets().length === 0) {
          <mat-card class="empty" color="primary" tabindex="0" aria-live="polite">
            <mat-icon class="empty-icon">extension_off</mat-icon>
            <mat-card-title>No active modules</mat-card-title>
            <mat-card-content>
              <p>
                @if (selectedContext() === 'personal') {
                  You don't have any personal modules activated. Contact your administrator to request access to modules.
                } @else {
                  This organization doesn't have any modules activated. Ask your administrator to activate modules for your organization.
                }
              </p>
              <button mat-raised-button color="primary" (click)="router.navigate(['/modules'])">
                <mat-icon>extension</mat-icon>
                Browse Available Modules
              </button>
            </mat-card-content>
          </mat-card>
          }
        }
      </section>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  protected router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private seoService = inject(SeoService);
  private themeService = inject(ThemeService);
  protected brandConfig = inject(BrandConfigService);
  private modulesService = inject(ModulesService);
  private orgService = inject(OrganizationManagementService);

  currentUser = signal<User | null>(null);
  organizations = signal<Organization[]>([]);
  activeModules = signal<AppModuleInfo[]>([]);
  widgets = signal<DashboardWidget[]>([]);
  selectedContext = signal<string>('personal');
  viewMode = signal<'compact' | 'normal' | 'expanded'>('normal');
  isLoadingWidgets = signal<boolean>(true);

  ngOnInit() {
    this.setupSEO();
    this.loadViewModePreference();

    console.log('=== DASHBOARD INIT ===');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Token exists:', !!this.authService.getToken());

    // Fallback timeout to ensure loading state is cleared
    setTimeout(() => {
      if (this.isLoadingWidgets()) {
        console.warn('Widget loading timeout, clearing loading state');
        this.isLoadingWidgets.set(false);
      }
    }, 5000);

    this.authService.currentUser$.subscribe((user) => {
      console.log('=== USER SUBSCRIPTION ===');
      console.log('Current user:', user);
      console.log('User currentOrganization:', user?.currentOrganization);
      console.log('Is authenticated:', this.authService.isAuthenticated());

      const previousUser = this.currentUser();
      const previousOrgId = previousUser?.currentOrganization?.id;
      const newOrgId = user?.currentOrganization?.id;
      
      console.log('Organization ID change:', previousOrgId, '->', newOrgId);
      
      this.currentUser.set(user);
      
      if (user && this.authService.isAuthenticated()) {
        console.log('User authenticated, loading organizations...');
        // If organizationId changed, force context update
        if (previousOrgId !== newOrgId && this.organizations().length > 0) {
          console.log('Organization ID changed, forcing context update');
          this.setInitialContext();
        } else {
          this.loadOrganizations();
        }
      } else {
        console.log('User not authenticated, showing empty state');
        this.selectedContext.set('personal');
        this.isLoadingWidgets.set(false);
        this.widgets.set([]);
      }
    });
  }

  private loadDefaultWidgets() {
    const defaultWidgets: DashboardWidget[] = [
      { id: 'user-management', title: 'User Management', size: 'm' },
      { id: 'crm', title: 'CRM', size: 'm' },
      { id: 'projects-management', title: 'Projects Management', size: 'l' },
      { id: 'tasks-management', title: 'Tasks Management', size: 's' },
      { id: 'hr-management', title: 'HR Management', size: 'm' },
      { id: 'sales-management', title: 'Sales Management', size: 's' },
      { id: 'inventory-management', title: 'Inventory Management', size: 's' },
      { id: 'project-tracking', title: 'Project Tracking', size: 'm' }
    ];
    this.widgets.set(defaultWidgets);
    this.isLoadingWidgets.set(false);
  }

  drop(event: CdkDragDrop<DashboardWidget[]>) {
    const copy = [...this.widgets()];
    moveItemInArray(copy, event.previousIndex, event.currentIndex);
    this.widgets.set(copy);
    this.saveWidgetOrder(copy);
  }

  resize(w: DashboardWidget, size: 's' | 'm' | 'l') {
    // Auto-switch to normal mode if not in normal mode
    if (this.viewMode() !== 'normal') {
      this.setViewMode('normal');
      this.snackBar.open('Switched to Normal view for resizing', 'Close', {
        duration: 2000,
      });
    }

    const updated = this.widgets().map((x) =>
      x.id === w.id ? { ...x, size } : x
    );
    this.widgets.set(updated);
    this.saveWidgetSizes(updated);

    const sizeNames = { s: 'Small', m: 'Medium', l: 'Large' };
    this.snackBar.open(`${w.title} resized to ${sizeNames[size]}`, 'Close', {
      duration: 2000,
    });
  }

  loadOrganizations() {
    console.log('=== LOADING ORGANIZATIONS ===');
    this.authService.getMyOrganizations().subscribe({
      next: (orgs) => {
        console.log('Organizations loaded:', orgs);
        this.organizations.set(orgs || []);
        // After organizations are loaded, validate and set the context
        this.setInitialContext();
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
        if (error.status === 401 || error.status === 403) {
          console.log('Authentication error, logging out');
          this.authService.logout();
        } else {
          console.log('Setting empty organizations array due to error');
          this.organizations.set([]);
          this.setInitialContext();
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

  onContextChange(context: string) {
    console.log('=== CONTEXT CHANGE ===');
    console.log('New context:', context);
    console.log('Current context:', this.selectedContext());

    if (!context) {
      console.log('Invalid context, ignoring');
      return;
    }

    this.selectedContext.set(context);
    this.saveContext(context);

    if (context === 'personal') {
      console.log('Loading personal modules...');
      this.loadPersonalModules();
    } else {
      console.log('Loading organization modules for:', context);
      this.loadOrganizationModules(context);
      // Update user's current organization
      this.authService.updateUserOrganization(context).subscribe({
        next: () => {
          // Re-evaluate theme hierarchy after organization change
          this.themeService.onOrganizationChange();
        },
        error: (error) => {
          console.error('Failed to update organization:', error);
          this.snackBar.open('Failed to update organization preference', 'Close', {
            duration: 3000,
          });
        }
      });
    }

    const contextName = context === 'personal' ? 'Personal' :
      this.organizations().find(org => (org._id || org.id) === context)?.name || 'Organization';

    this.snackBar.open(`Switched to ${contextName} dashboard`, 'Close', {
      duration: 2000,
    });
  }

  private loadOrganizationModules(orgId: string) {
    console.log('=== LOADING ORG MODULES ===');
    console.log('Organization ID:', orgId);

    this.modulesService.getOrganizationModules(orgId).subscribe({
      next: (modules) => {
        console.log('API Response - Organization modules:', modules);
        console.log('Module count:', modules?.length || 0);
        if (modules && modules.length > 0) {
          console.log('Module names:', modules.map(m => m.displayName));
        }
        this.updateWidgets(modules || []);
      },
      error: (error) => {
        console.error('=== ERROR LOADING ORG MODULES ===');
        console.error('Error details:', error);
        this.isLoadingWidgets.set(false);
        this.widgets.set([]);
        this.snackBar.open('Failed to load organization modules', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  private applyOrganizationTheme(orgId: string) {
    const org = this.organizations().find(o => (o._id || o.id) === orgId);
    if (org?.settings?.primaryColor) {
      document.documentElement.style.setProperty('--theme-primary', org.settings.primaryColor);
    }
    if (org?.settings?.accentColor) {
      document.documentElement.style.setProperty('--theme-accent', org.settings.accentColor);
    }
  }

  private resetTheme() {
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-accent');
  }

  private loadPersonalModules() {
    console.log('=== LOADING PERSONAL MODULES ===');

    this.authService.getUserAccessibleModules(this.modulesService).then((modules) => {
      console.log('API Response - Accessible modules:', modules);
      console.log('Module count:', modules?.length || 0);
      if (modules && modules.length > 0) {
        console.log('Module names:', modules.map(m => m.displayName));
      }
      this.updateWidgets(modules || []);
    }).catch((error) => {
      console.error('=== ERROR LOADING ACCESSIBLE MODULES ===');
      console.error('Error details:', error);
      this.isLoadingWidgets.set(false);
      this.widgets.set([]);
      this.snackBar.open('Failed to load modules', 'Close', {
        duration: 3000,
      });
    });
  }

  loadModulesForContext(context: string) {
    console.log('Loading modules for context:', context);

    // Ensure context is valid
    if (!context) {
      console.warn('Context is undefined, defaulting to personal');
      context = 'personal';
    }

    if (context === 'personal') {
      // Load personal modules (user-specific modules without organization context)
      this.modulesService.getPersonalModules().subscribe({
        next: (modules) => {
          console.log('Personal modules loaded:', modules);
          this.updateWidgets(modules);
        },
        error: (error) => {
          console.error('Error loading personal modules:', error);
          this.isLoadingWidgets.set(false);
          this.widgets.set([]);
        }
      });
    } else {
      // Validate organization exists before loading modules
      const org = this.organizations().find(o => (o._id || o.id) === context);
      if (!org) {
        console.error('Organization not found for context:', context);
        this.selectedContext.set('personal');
        this.loadModulesForContext('personal');
        return;
      }

      // Load organization-specific modules
      this.modulesService.getOrganizationModules(context).subscribe({
        next: (modules) => {
          console.log('Organization modules loaded:', modules);
          this.updateWidgets(modules);
        },
        error: (error) => {
          console.error('Error loading organization modules:', error);
          this.isLoadingWidgets.set(false);
          this.widgets.set([]);
        }
      });
    }
  }

  updateWidgets(modules: AppModuleInfo[]) {
    console.log('Updating widgets with modules:', modules?.length || 0);
    console.log('Module details:', modules?.map(m => ({ id: m.id, name: m.name, displayName: m.displayName })));

    // If no modules from API, show empty state
    if (!modules || modules.length === 0) {
      console.log('No modules returned, showing empty state');
      this.widgets.set([]);
      this.isLoadingWidgets.set(false);
      return;
    }

    // Use common filtering method from auth service
    const brandKey = this.brandConfig.getBrandKey();
    const allowedModules = getModulesByBrand(brandKey);
    const brandFiltered = this.authService.filterModulesWithPermissions(
      modules, 
      brandKey, 
      MODULE_REGISTRY, 
      allowedModules
    );

    console.log('Filtered supported modules:', brandFiltered.length);

    const savedSizes = this.loadWidgetSizes();
    const mapped: DashboardWidget[] = brandFiltered.map((m, idx) => {
      const registryModule = this.authService.getModuleFromRegistry(m.name || m.id, MODULE_REGISTRY);
      const widgetId = registryModule?.name || m.name || m.id || 'unknown';
      return {
        id: widgetId,
        title: m.displayName || m.name || 'Unknown Module',
        description: m.description || '',
        size: savedSizes[widgetId] || (idx === 0 ? 'm' : idx === 1 ? 'm' : idx % 3 === 0 ? 'l' : 'm'),
      };
    });

    // If no supported modules, show empty state with helpful message
    if (mapped.length === 0) {
      console.log('No supported widget modules found, showing empty state');
      this.widgets.set([]);
      this.isLoadingWidgets.set(false);
      return;
    }

    // Add pending work widget if user has super admin role and in organization context
    const user = this.currentUser();
    if (this.authService.hasRole('super_admin') && this.selectedContext() !== 'personal') {
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
            const finalWidgets = [pendingWidget, ...mapped];
            this.widgets.set(this.applySavedOrder(finalWidgets));
          } else {
            this.widgets.set(this.applySavedOrder(mapped));
          }
          this.isLoadingWidgets.set(false);
        },
        error: () => {
          this.widgets.set(this.applySavedOrder(mapped));
          this.isLoadingWidgets.set(false);
        }
      });
    } else {
      console.log('Setting widgets:', mapped.length);
      this.widgets.set(this.applySavedOrder(mapped));
      this.isLoadingWidgets.set(false);
    }
  }

  getCurrentOrgName(): string {
    const user = this.currentUser();
    if (!user?.currentOrganization) return '';
    const org = this.organizations().find((o) => o.id === user.currentOrganization?.id);
    return org?.name || '';
  }

  getModuleColor(moduleId: string): string | null {
    const module = this.activeModules().find((m) => m.name === moduleId);
    if (module?.color) return module.color;

    // Use auth service method
    const registryModule = this.authService.getModuleFromRegistry(moduleId, MODULE_REGISTRY);
    return registryModule?.color || '#2196F3';
  }



  setViewMode(mode: 'compact' | 'normal' | 'expanded') {
    this.viewMode.set(mode);
    this.saveViewModePreference();
    const viewNames = { compact: 'Compact', normal: 'Normal', expanded: 'Expanded' };
    this.snackBar.open(`Switched to ${viewNames[mode]} view`, 'Close', {
      duration: 2000,
    });
  }

  getViewIcon(): string {
    const icons = { compact: 'view_compact', normal: 'view_module', expanded: 'view_comfy' };
    return icons[this.viewMode()];
  }

  getWidgetSize(widget: DashboardWidget): string {
    const mode = this.viewMode();
    if (mode === 'compact') return 's';
    if (mode === 'expanded') return 'xl';
    return widget.size;
  }

  private saveContext(context: string) {
    try {
      localStorage.setItem('dashboard-context', context);
    } catch (error) {
      console.warn('Failed to save dashboard context:', error);
    }
  }

  private getSavedContext(): string | null {
    try {
      return localStorage.getItem('dashboard-context');
    } catch (error) {
      console.warn('Failed to load dashboard context:', error);
      return null;
    }
  }

  private saveViewModePreference() {
    try {
      localStorage.setItem('dashboard-view-mode', this.viewMode());
    } catch (error) {
      console.warn('Failed to save view mode preference:', error);
    }
  }

  private loadViewModePreference() {
    try {
      const saved = localStorage.getItem('dashboard-view-mode') as 'compact' | 'normal' | 'expanded';
      if (saved && ['compact', 'normal', 'expanded'].includes(saved)) {
        this.viewMode.set(saved);
      }
    } catch (error) {
      console.warn('Failed to load view mode preference:', error);
    }
  }

  private saveWidgetSizes(widgets: DashboardWidget[]) {
    try {
      const sizes = widgets.reduce((acc, widget) => {
        acc[widget.id] = widget.size;
        return acc;
      }, {} as Record<string, 's' | 'm' | 'l'>);
      localStorage.setItem('dashboard-widget-sizes', JSON.stringify(sizes));
    } catch (error) {
      console.warn('Failed to save widget sizes:', error);
    }
  }

  private loadWidgetSizes(): Record<string, 's' | 'm' | 'l'> {
    try {
      const saved = localStorage.getItem('dashboard-widget-sizes');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to load widget sizes:', error);
      return {};
    }
  }

  private saveWidgetOrder(widgets: DashboardWidget[]) {
    try {
      const order = widgets.map(w => w.id);
      localStorage.setItem('dashboard-widget-order', JSON.stringify(order));
    } catch (error) {
      console.warn('Failed to save widget order:', error);
    }
  }

  private loadWidgetOrder(): string[] {
    try {
      const saved = localStorage.getItem('dashboard-widget-order');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Failed to load widget order:', error);
      return [];
    }
  }

  private applySavedOrder(widgets: DashboardWidget[]): DashboardWidget[] {
    const savedOrder = this.loadWidgetOrder();
    if (savedOrder.length === 0) return widgets;

    const ordered: DashboardWidget[] = [];
    const widgetMap = new Map(widgets.map(w => [w.id, w]));

    // Add widgets in saved order
    savedOrder.forEach(id => {
      const widget = widgetMap.get(id);
      if (widget) {
        ordered.push(widget);
        widgetMap.delete(id);
      }
    });

    // Add any new widgets that weren't in saved order
    widgetMap.forEach(widget => ordered.push(widget));

    return ordered;
  }

  resetWidgetArrangement() {
    try {
      localStorage.removeItem('dashboard-widget-order');
      localStorage.removeItem('dashboard-widget-sizes');
      this.loadModulesForContext(this.selectedContext());
      this.snackBar.open('Widget arrangement reset to default', 'Close', {
        duration: 2000,
      });
    } catch (error) {
      console.warn('Failed to reset widget arrangement:', error);
      this.snackBar.open('Failed to reset arrangement', 'Close', {
        duration: 2000,
      });
    }
  }

  private validateAndGetContext(savedContext: string | null): string | null {
    if (!savedContext) return null;

    // 'personal' is always valid
    if (savedContext === 'personal') return savedContext;

    // Check if the saved organization ID is still valid
    const orgs = this.organizations();
    const isValidOrg = orgs.some(org => (org._id || org.id) === savedContext);

    if (isValidOrg) {
      return savedContext;
    } else {
      // Clear invalid saved context
      this.clearSavedContext();
      return null;
    }
  }

  private clearSavedContext() {
    try {
      localStorage.removeItem('dashboard-context');
    } catch (error) {
      console.warn('Failed to clear dashboard context:', error);
    }
  }

  private setInitialContext() {
    const user = this.currentUser();
    const orgs = this.organizations();

    console.log('=== SETTING INITIAL CONTEXT ===');
    console.log('User:', user);
    console.log('User currentOrganization:', user?.currentOrganization);
    console.log('Organizations:', orgs);
    console.log('Current selectedContext:', this.selectedContext());

    if (!user) {
      console.log('No user, showing default widgets');
      this.selectedContext.set('personal');
      this.isLoadingWidgets.set(false);
      this.loadDefaultWidgets();
      return;
    }

    // Determine initial context priority:
    // 1. User's current organizationId from backend (if exists in organizations)
    // 2. Personal context (if organizationId is null)
    // 3. Valid saved context as fallback
    // 4. First available organization
    let initialContext = 'personal';

    if (user.currentOrganization && orgs.some(org => org.id === user.currentOrganization!.id)) {
      // User has a valid organization set in backend
      initialContext = user.currentOrganization.id;
      console.log('Using user currentOrganization from backend:', initialContext);
    } else if (!user.currentOrganization) {
      // User explicitly set to personal (currentOrganization is null)
      initialContext = 'personal';
      console.log('User currentOrganization is null, using personal');
      // Clear any conflicting saved context
      this.clearSavedContext();
    } else {
      // Fallback to saved context or first organization
      const savedContext = this.getSavedContext();
      const validatedContext = this.validateAndGetContext(savedContext);
      
      if (validatedContext) {
        initialContext = validatedContext;
        console.log('Using validated saved context:', initialContext);
      } else if (orgs.length > 0) {
        initialContext = orgs[0]._id || orgs[0].id;
        console.log('Using first available organization:', initialContext);
      }
    }

    console.log('Final initial context:', initialContext);
    
    // Only update if context actually changed
    if (this.selectedContext() !== initialContext) {
      console.log('Context changed from', this.selectedContext(), 'to', initialContext);
      this.selectedContext.set(initialContext);
      this.saveContext(initialContext); // Update localStorage to match backend
      this.loadModulesForContext(initialContext);
    } else {
      console.log('Context unchanged, no need to reload modules');
      // Still ensure widgets are loaded if they're empty
      if (this.widgets().length === 0 && this.isLoadingWidgets()) {
        this.loadModulesForContext(initialContext);
      }
    }
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
