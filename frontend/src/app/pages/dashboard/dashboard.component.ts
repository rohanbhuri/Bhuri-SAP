import { Component, inject, signal, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { OrganizationManagementService } from '../../modules/organization-management/organization-management.service';
import { SeoService } from '../../services/seo.service';
import { ThemeService } from '../../services/theme.service';
import { MODULE_REGISTRY } from '../../modules/module-registry';

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
              [matMenuTriggerFor]="dashboardMenu"
              aria-label="Dashboard options"
            >
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #dashboardMenu="matMenu">
              <button mat-menu-item (click)="toggleCompactView()">
                <mat-icon>{{ isCompactView() ? 'view_module' : 'view_compact' }}</mat-icon>
                <span>{{ isCompactView() ? 'Normal View' : 'Compact View' }}</span>
              </button>
            </mat-menu>
          </div>
        </div>
        <p class="subtitle">
          Check the sales, value and bounce rate by country.
        </p>
      </div>

      <section
        class="widgets"
        [class.compact]="isCompactView()"
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
          [attr.data-size]="isCompactView() ? 's' : w.size"
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
            } @case ('pending-work') {
            <app-pending-work-widget></app-pending-work-widget>
            } }
          </div>
        </mat-card>
          } @if (widgets().length === 0) {
          <mat-card class="empty" color="primary" tabindex="0" aria-live="polite">
            <mat-card-title>No active modules</mat-card-title>
            <mat-card-content>
              <p>
                Ask your administrator to activate modules for your organization.
              </p>
            </mat-card-content>
          </mat-card>
          }
        }
      </section>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .page {
        padding: 16px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 16px;
      }

      .header-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
        flex-wrap: wrap;
      }

      .dashboard-menu {
        margin-left: auto;
      }

      .view-selector {
        width: auto;
        min-width: 0;
      }
      
      .view-selector ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
      
      .view-selector ::ng-deep .mdc-notched-outline {
        border: none !important;
      }
      
      .view-selector ::ng-deep .mat-mdc-text-field-wrapper {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      
      .view-selector ::ng-deep .mat-mdc-form-field-infix {
        padding: 0 !important;
        min-height: auto !important;
      }
      
      .view-selector ::ng-deep .mat-mdc-select {
        font-size: 1.5rem;
        font-weight: 600;
        padding: 0px 8px;
        margin: 0;
      }
      
      .view-selector ::ng-deep .mat-mdc-select-value {
        display: flex;
        align-items: center;
        gap: 0;
        padding: 0px;
        margin: 0;
      }
      


      .breadcrumb {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        font-size: 0.8rem;
        margin-bottom: 6px;
      }
      .breadcrumb .current {
        color: var(--theme-on-surface);
      }

      h1 {
        margin: 0;
        font-weight: 600;
        font-size: 1.5rem;
      }
      .subtitle {
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .widgets {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(12, minmax(0, 1fr));
      }

      .widgets.compact {
        gap: 12px;
      }

      .widget {
        grid-column: span 12;
        background: var(--theme-surface);
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: var(--border-radius);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        transition: var(--transition);
      }

      .widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
        border-color: color-mix(in srgb, var(--theme-primary) 25%, transparent);
      }

      .widgets.compact .widget {
        grid-column: span 4;
        border-radius: 8px;
      }

      .widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px 0 16px;
      }
      .widget-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--theme-on-surface);
        display: flex;
        align-items: center;
        gap: 6px;
        line-height: 1.3;
      }

      .widget-title::before {
        content: '';
        width: 3px;
        height: 16px;
        background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
        border-radius: 2px;
        flex-shrink: 0;
      }

      .widgets.compact .widget-header {
        padding: 6px 10px 0 10px;
      }
      .widgets.compact .widget-title {
        font-size: 0.85rem;
      }
      .widget-actions {
        display: inline-flex;
        gap: 4px;
      }

      .widget-body {
        padding: 4px 16px 16px 16px;
      }

      .widgets.compact .widget-body {
        padding: 4px 12px 12px 12px;
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

      /* Mobile-first responsive design */
      @media (max-width: 599px) {
        .page {
          padding: 12px;
        }
        
        .header-controls {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }
        
        .view-selector {
          width: auto;
        }
        
        .view-selector ::ng-deep .mat-mdc-select {
          font-size: 1.3rem;
        }
        
        h1 {
          font-size: 1.3rem;
          text-align: center;
        }
        
        .subtitle {
          font-size: 0.85rem;
          text-align: center;
        }
        
        .breadcrumb {
          font-size: 0.75rem;
          justify-content: center;
        }
        
        .widgets {
          gap: 12px;
        }
        
        .widget-title {
          font-size: 0.9rem;
        }
        
        .widgets.compact .widget-title {
          font-size: 0.8rem;
        }
      }
      
      @media (min-width: 600px) and (max-width: 899px) {
        .page {
          padding: 16px;
        }
        
        .widget[data-size='s'] {
          grid-column: span 6;
        }
        .widget[data-size='m'] {
          grid-column: span 12;
        }
        .widget[data-size='l'] {
          grid-column: span 12;
        }
        
        .widgets.compact .widget {
          grid-column: span 4;
        }
      }

      @media (min-width: 900px) {
        .page {
          padding: 20px;
        }
        
        .widget[data-size='s'] {
          grid-column: span 4;
        }
        .widget[data-size='m'] {
          grid-column: span 6;
        }
        .widget[data-size='l'] {
          grid-column: span 12;
        }

        .widgets.compact .widget {
          grid-column: span 3;
        }
      }

      @media (min-width: 1200px) {
        .page {
          padding: 24px;
        }
        
        .widget[data-size='s'] {
          grid-column: span 3;
        }
        .widget[data-size='m'] {
          grid-column: span 6;
        }
        .widget[data-size='l'] {
          grid-column: span 12;
        }

        .widgets.compact .widget {
          grid-column: span 2;
        }
      }

      .empty {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        grid-column: 1 / -1;
        margin: 40px auto;
        max-width: 400px;
      }

      .widget:focus-visible {
        outline: var(--focus-outline);
        outline-offset: 2px;
      }

      .loading-state {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        gap: 12px;
      }

      .loading-state mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
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
  isCompactView = signal<boolean>(false);
  isLoadingWidgets = signal<boolean>(true);

  ngOnInit() {
    this.setupSEO();
    this.loadCompactViewPreference();
    
    // Fallback timeout to ensure widgets load
    setTimeout(() => {
      if (this.isLoadingWidgets() && this.widgets().length === 0) {
        console.warn('Widget loading timeout, showing default widgets');
        this.isLoadingWidgets.set(false);
        this.loadDefaultWidgets();
      }
    }, 3000);
    
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user && this.authService.isAuthenticated()) {
        this.loadOrganizations();
      } else {
        this.selectedContext.set('personal');
        this.isLoadingWidgets.set(false);
        this.loadDefaultWidgets();
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
  }

  resize(w: DashboardWidget, size: 's' | 'm' | 'l') {
    const updated = this.widgets().map((x) =>
      x.id === w.id ? { ...x, size } : x
    );
    this.widgets.set(updated);
  }

  loadOrganizations() {
    this.authService.getMyOrganizations().subscribe({
      next: (orgs) => {
        this.organizations.set(orgs);
        // After organizations are loaded, validate and set the context
        this.setInitialContext();
      },
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
        this.loadDefaultWidgets();
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
    
    this.modulesService.getPersonalModules().subscribe({
      next: (modules) => {
        console.log('API Response - Personal modules:', modules);
        console.log('Module count:', modules?.length || 0);
        if (modules && modules.length > 0) {
          console.log('Module names:', modules.map(m => m.displayName));
        }
        this.updateWidgets(modules || []);
      },
      error: (error) => {
        console.error('=== ERROR LOADING PERSONAL MODULES ===');
        console.error('Error details:', error);
        this.isLoadingWidgets.set(false);
        this.loadDefaultWidgets();
      }
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
          this.loadDefaultWidgets();
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
          this.loadDefaultWidgets();
        }
      });
    }
  }

  updateWidgets(modules: AppModuleInfo[]) {
    console.log('Updating widgets with modules:', modules?.length || 0);
    console.log('Module details:', modules?.map(m => ({ name: m.name, displayName: m.displayName })));
    
    // If no modules from API, use default widgets
    if (!modules || modules.length === 0) {
      console.log('No modules returned, using default widgets');
      this.loadDefaultWidgets();
      return;
    }
    
    // Filter modules that have corresponding widget components using module registry
    const filtered = modules.filter(m => {
      const registryModule = this.getModuleFromRegistry(m.name);
      return registryModule && registryModule.widgetComponent;
    });
    console.log('Filtered supported modules:', filtered.length);
    
    const mapped: DashboardWidget[] = filtered.map((m, idx) => ({
      id: m.name,
      title: m.displayName,
      description: m.description,
      size: idx === 0 ? 'm' : idx === 1 ? 'm' : idx % 3 === 0 ? 'l' : 'm',
    }));
    
    // If no supported modules, use default widgets
    if (mapped.length === 0) {
      console.log('No supported widget modules found, using defaults');
      this.loadDefaultWidgets();
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
            this.widgets.set([pendingWidget, ...mapped]);
          } else {
            this.widgets.set(mapped);
          }
          this.isLoadingWidgets.set(false);
        },
        error: () => {
          this.widgets.set(mapped);
          this.isLoadingWidgets.set(false);
        }
      });
    } else {
      console.log('Setting widgets:', mapped.length);
      this.widgets.set(mapped);
      this.isLoadingWidgets.set(false);
    }
  }

  getCurrentOrgName(): string {
    const user = this.currentUser();
    if (!user?.organizationId) return '';
    const org = this.organizations().find((o) => o.id === user.organizationId);
    return org?.name || '';
  }

  getModuleColor(moduleId: string): string | null {
    const module = this.activeModules().find((m) => m.name === moduleId);
    if (module?.color) return module.color;
    
    // Fallback to module registry
    const registryModule = this.getModuleFromRegistry(moduleId);
    return registryModule?.color || '#2196F3';
  }

  private getModuleFromRegistry(moduleId: string) {
    return MODULE_REGISTRY.find(m => m.name === moduleId);
  }

  toggleCompactView() {
    this.isCompactView.set(!this.isCompactView());
    this.saveCompactViewPreference();
    const viewType = this.isCompactView() ? 'Compact' : 'Normal';
    this.snackBar.open(`Switched to ${viewType} view`, 'Close', {
      duration: 2000,
    });
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

  private saveCompactViewPreference() {
    try {
      localStorage.setItem('dashboard-compact-view', this.isCompactView().toString());
    } catch (error) {
      console.warn('Failed to save compact view preference:', error);
    }
  }

  private loadCompactViewPreference() {
    try {
      const saved = localStorage.getItem('dashboard-compact-view');
      if (saved !== null) {
        this.isCompactView.set(saved === 'true');
      }
    } catch (error) {
      console.warn('Failed to load compact view preference:', error);
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
    if (!user) {
      this.isLoadingWidgets.set(false);
      this.loadDefaultWidgets();
      return;
    }
    
    const savedContext = this.getSavedContext();
    const validatedContext = this.validateAndGetContext(savedContext);
    const initialContext = validatedContext || user.organizationId || 'personal';
    
    this.selectedContext.set(initialContext);
    console.log('Initial context set to:', initialContext);
    this.loadModulesForContext(initialContext);
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
