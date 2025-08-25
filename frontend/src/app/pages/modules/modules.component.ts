import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import {
  ModulesService,
  AppModuleInfo,
  ModuleRequest,
} from '../../services/modules.service';
import { AuthService } from '../../services/auth.service';
import { PreferencesService } from '../../services/preferences.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';
import { BrandConfigService } from '../../services/brand-config.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    NavbarComponent,
    BottomNavbarComponent,
    FormsModule,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Pages</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Modules</span>
        </nav>
        <h1>Module Management</h1>
        <p class="subtitle">
          Discover and activate modules for your organization
        </p>
      </div>

      <mat-tab-group
        class="module-tabs"
        [selectedIndex]="selectedTab()"
        (selectedIndexChange)="onTabChange($event)"
      >
        <mat-tab label="Available Modules">
          <div class="tab-content">
            <div class="search-bar">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search modules</mat-label>
                <input
                  matInput
                  [(ngModel)]="searchTerm"
                  (input)="filterModules()"
                  placeholder="Search by name or description"
                />
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>

            <div class="modules-grid">
              @for (module of filteredModules(); track module.id) {
              <mat-card
                class="module-card"
                [class.active]="module.isActive"
                [style.border-color]="
                  module.isActive ? module.color || '#ccc' : 'transparent'
                "
                [style.background]="
                  module.isActive
                    ? (module.color || '#f5f5f5') + '33'
                    : 'var(--theme-surface)'
                "
              >
                <div class="module-header">
                  <div class="module-info">
                    <h3 
                      class="module-title"
                      [style.color]="module.color || '#ffffff'"
                    >
                      {{ module.name }}
                    </h3>
                    <div class="module-status">
                      @if (module.isActive) {
                      <mat-chip class="status-chip active">
                        <mat-icon>check_circle</mat-icon>
                        Active
                      </mat-chip>
                      } @else if (module.permissionType === 'public') {
                      <mat-chip class="status-chip available">
                        <mat-icon>public</mat-icon>
                        Public
                      </mat-chip>
                      } @else if (module.isPending) {
                      <mat-chip class="status-chip pending">
                        <mat-icon>schedule</mat-icon>
                        Pending
                      </mat-chip>
                      } @else {
                      <mat-chip class="status-chip restricted">
                        <mat-icon>lock</mat-icon>
                        Restricted
                      </mat-chip>
                      }
                    </div>
                  </div>
                </div>

                <mat-card-content>
                  <p class="module-description">{{ module.description }}</p>
                </mat-card-content>

                <div class="module-actions">
                  @if (module.isActive) {
                  <div class="active-module-actions">
                    <button
                      mat-raised-button
                      color="primary"
                      (click)="openModule(module)"
                    >
                      <mat-icon>open_in_new</mat-icon>
                      Open
                    </button>
                    <button
                      mat-icon-button
                      (click)="togglePin(module)"
                      [attr.aria-label]="
                        isPinned(module.id)
                          ? 'Unpin from navbar'
                          : 'Pin to navbar'
                      "
                    >
                      <mat-icon>{{
                        isPinned(module.id) ? 'push_pin' : 'push_pin'
                      }}</mat-icon>
                    </button>
                    <button
                      mat-stroked-button
                      color="warn"
                      (click)="deactivateModule(module)"
                      [disabled]="loading()"
                    >
                      @if (loading()) {
                      <mat-spinner diameter="16"></mat-spinner>
                      } @else {
                      <mat-icon>remove</mat-icon>
                      } Deactivate
                    </button>
                  </div>
                  } @else if (module.isPending) {
                  <button mat-stroked-button disabled>
                    <mat-icon>schedule</mat-icon>
                    Request Pending
                  </button>
                  } @else if (module.canActivate) {
                  <button
                    mat-raised-button
                    color="accent"
                    (click)="activateModule(module)"
                    [disabled]="loading()"
                  >
                    @if (loading()) {
                    <mat-spinner diameter="16"></mat-spinner>
                    } @else {
                    <mat-icon>add</mat-icon>
                    } Activate
                  </button>
                  } @else {
                  <button
                    mat-raised-button
                    (click)="requestModule(module)"
                    [disabled]="loading()"
                  >
                    @if (loading()) {
                    <mat-spinner diameter="16"></mat-spinner>
                    } @else {
                    <mat-icon>request_page</mat-icon>
                    } Request Access
                  </button>
                  }
                </div>
              </mat-card>
              }
            </div>

            @if (filteredModules().length === 0 && !loading()) {
            <div class="empty-state">
              <mat-icon class="empty-icon">extension</mat-icon>
              <h3>No modules found</h3>
              <p>
                Try adjusting your search terms or contact your administrator.
              </p>
            </div>
            }
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <span
              [matBadge]="pendingRequests().length"
              matBadgeColor="warn"
              [matBadgeHidden]="pendingRequests().length === 0"
            >
              Pending Requests
            </span>
          </ng-template>

          <div class="tab-content">
            @if (pendingRequests().length > 0) {
            <div class="requests-list">
              @for (request of pendingRequests(); track request._id) {
              <mat-card class="request-card">
                <div class="request-header">
                  <div class="request-info">
                    <h4>{{ getModuleName(request.moduleId) }}</h4>
                    <p class="request-user">
                      Requested by: {{ request.userName }}
                    </p>
                    <p class="request-date">
                      {{ formatDate(request.requestedAt) }}
                    </p>
                  </div>
                  <mat-chip class="status-chip pending">
                    <mat-icon>schedule</mat-icon>
                    Pending
                  </mat-chip>
                </div>

                <div class="request-actions">
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="approveRequest(request)"
                    [disabled]="loading()"
                  >
                    <mat-icon>check</mat-icon>
                    Approve
                  </button>
                  <button
                    mat-stroked-button
                    color="warn"
                    (click)="rejectRequest(request)"
                    [disabled]="loading()"
                  >
                    <mat-icon>close</mat-icon>
                    Reject
                  </button>
                </div>
              </mat-card>
              }
            </div>
            } @else {
            <div class="empty-state">
              <mat-icon class="empty-icon">inbox</mat-icon>
              <h3>No pending requests</h3>
              <p>All module requests have been processed.</p>
            </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
        background: var(--theme-background);
        min-height: calc(100vh - 120px);
      }

      .page-header {
        background: linear-gradient(135deg, 
          color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface)),
          color-mix(in srgb, var(--theme-accent) 3%, var(--theme-surface))
        );
        padding: 32px;
        border-radius: 16px;
        margin-bottom: 32px;
        border: 1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--theme-primary), var(--theme-accent));
        }
      }

      .breadcrumb {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        font-size: 0.875rem;
        margin-bottom: 12px;
        font-weight: 500;
        
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
      
      .breadcrumb .current {
        color: var(--theme-primary);
        font-weight: 600;
      }

      h1 {
        margin: 0 0 8px;
        font-weight: 700;
        font-size: 2.25rem;
        color: var(--theme-on-surface);
        letter-spacing: -0.025em;
      }
      
      .subtitle {
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        margin: 0;
        font-size: 1.125rem;
        font-weight: 400;
      }

      .module-tabs {
        background: var(--theme-surface);
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 16px;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        transition: all 0.2s ease;
        overflow: hidden;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
        }
        
        ::ng-deep .mat-mdc-tab-group {
          .mat-mdc-tab-header {
            background: color-mix(in srgb, var(--theme-primary) 5%, var(--theme-surface));
            border-bottom: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
          }
          
          .mat-mdc-tab {
            &.mdc-tab--active .mdc-tab__text-label {
              color: var(--theme-primary);
              font-weight: 600;
            }
          }
          
          .mat-mdc-tab-body-content {
            overflow: visible;
          }
        }
      }

      .tab-content {
        padding: 32px;
      }

      .search-bar {
        margin-bottom: 32px;
      }

      .search-field {
        width: 100%;
        max-width: 500px;
        
        ::ng-deep .mat-mdc-form-field {
          .mat-mdc-text-field-wrapper {
            background-color: var(--theme-surface);
            border-radius: 12px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 5%, transparent);
          }
          
          &.mat-focused {
            .mat-mdc-text-field-wrapper {
              border-color: var(--theme-primary);
              box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-primary) 20%, transparent);
            }
          }
        }
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 24px;
      }

      .module-card {
        background: var(--theme-surface);
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 12px;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid var(--theme-primary);
        position: relative;
        overflow: hidden;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
        }
        
        &.active {
          border-left: 6px solid var(--theme-primary);
          background: linear-gradient(135deg, 
            color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface)),
            color-mix(in srgb, var(--theme-accent) 3%, var(--theme-surface))
          );
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-top: 20px solid var(--theme-success);
          }
          
          &::after {
            content: '✓';
            position: absolute;
            top: 2px;
            right: 2px;
            color: white;
            font-size: 10px;
            font-weight: bold;
          }
        }
      }

      .module-header {
        padding: 20px 20px 12px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .module-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .module-status {
        margin-top: 12px;
      }

      .status-chip {
        font-size: 0.75rem;
        height: 28px;
        font-weight: 600;
        border-radius: 14px;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        
        &:focus-visible {
          outline: 2px solid var(--theme-primary);
          outline-offset: 2px;
        }
        
        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
        
        &.active {
          background-color: color-mix(in srgb, var(--theme-success) 15%, transparent);
          color: var(--theme-success);
          border: 1px solid color-mix(in srgb, var(--theme-success) 30%, transparent);
        }
        
        &.available {
          background: color-mix(in srgb, var(--theme-primary) 15%, transparent);
          color: var(--theme-primary);
          border: 1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent);
        }
        
        &.restricted {
          background-color: color-mix(in srgb, var(--theme-warning) 15%, transparent);
          color: var(--theme-warning);
          border: 1px solid color-mix(in srgb, var(--theme-warning) 30%, transparent);
        }
        
        &.pending {
          background-color: color-mix(in srgb, var(--theme-warning) 15%, transparent);
          color: var(--theme-warning);
          border: 1px solid color-mix(in srgb, var(--theme-warning) 30%, transparent);
        }
      }

      .module-description {
        color: color-mix(in srgb, var(--theme-on-surface) 75%, transparent);
        line-height: 1.6;
        margin: 0;
        font-size: 0.9375rem;
      }

      .module-actions {
        padding: 20px;
        border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        background: color-mix(in srgb, var(--theme-surface) 50%, transparent);
      }

      .active-module-actions {
        display: flex;
        gap: 12px;
        align-items: center;
        
        button {
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
          
          &[color="primary"] {
            flex: 1;
            background-color: var(--theme-primary);
            color: var(--theme-on-primary);
            
            &:hover {
              background-color: color-mix(in srgb, var(--theme-primary) 85%, black);
              transform: translateY(-1px);
              box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 25%, transparent);
            }
          }
          
          &[color="warn"] {
            background-color: transparent;
            color: var(--theme-error);
            border: 1px solid var(--theme-error);
            
            &:hover {
              background: color-mix(in srgb, var(--theme-error) 10%, transparent);
            }
          }
        }
        
        .mat-mdc-icon-button {
          color: var(--theme-primary);
          background-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);
          border-radius: 50%;
          padding: 8px;
          margin-right: 8px;
          width: 40px;
          height: 40px;
          
          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .requests-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .request-card {
        background: var(--theme-surface);
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 12px;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        transition: all 0.2s ease;
        overflow: hidden;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
        }
      }

      .request-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: color-mix(in srgb, var(--theme-primary) 3%, var(--theme-surface));
      }

      .request-info h4 {
        margin: 0 0 6px;
        font-weight: 700;
        font-size: 1.125rem;
        color: var(--theme-on-surface);
      }

      .request-user {
        margin: 0 0 4px;
        font-size: 0.9375rem;
        color: var(--theme-primary);
        font-weight: 600;
      }

      .request-date {
        margin: 0;
        font-size: 0.875rem;
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
      }

      .request-actions {
        padding: 0 20px 20px;
        display: flex;
        gap: 16px;
        
        button {
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
          
          &[color="primary"] {
            background-color: var(--theme-primary);
            color: var(--theme-on-primary);
            
            &:hover {
              background-color: color-mix(in srgb, var(--theme-primary) 85%, black);
              transform: translateY(-1px);
            }
          }
          
          &[color="warn"] {
            background-color: transparent;
            color: var(--theme-error);
            border: 1px solid var(--theme-error);
            
            &:hover {
              background: color-mix(in srgb, var(--theme-error) 10%, transparent);
            }
          }
        }
      }

      .empty-state {
        text-align: center;
        padding: 64px 32px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        
        .empty-icon {
          color: var(--theme-primary);
          background-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);
          font-size: 64px;
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          opacity: 0.7;
          border-radius: 50%;
          padding: 16px;
        }
        
        h3 {
          margin: 0 0 12px;
          color: var(--theme-on-surface);
          font-weight: 600;
          font-size: 1.5rem;
        }
        
        p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }
      }

      @media (max-width: 768px) {
        .page {
          padding: 16px;
        }
        
        .page-header {
          padding: 24px;
          margin-bottom: 24px;
          
          h1 {
            font-size: 1.875rem;
          }
        }
        
        .tab-content {
          padding: 20px;
        }
        
        .modules-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        .request-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        
        .request-actions {
          flex-direction: column;
        }
        
        .active-module-actions {
          flex-wrap: wrap;
          
          button {
            min-width: 120px;
          }
        }
      }
      
      :host-context(body.dark-theme) .module-card {
        border-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
      }
      
      :host-context(body.dark-theme) .module-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      }
      
      :host-context(body.dark-theme) .page-header {
        border-color: color-mix(in srgb, var(--theme-primary) 30%, transparent);
      }
      

      
      @media (prefers-reduced-motion: reduce) {
        .module-card,
        .request-card {
          transition: none;
          
          &:hover {
            transform: none;
          }
        }
      }
    `,
  ],
})
export class ModulesComponent implements OnInit {
  private modulesService = inject(ModulesService);
  private authService = inject(AuthService);
  private preferencesService = inject(PreferencesService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private seoService = inject(SeoService);
  private brandConfig = inject(BrandConfigService);
  private themeService = inject(ThemeService);

  modules = signal<AppModuleInfo[]>([]);
  filteredModules = signal<AppModuleInfo[]>([]);
  pendingRequests = signal<ModuleRequest[]>([]);
  selectedTab = signal(0);
  loading = signal(false);
  searchTerm = '';
  pinnedModules = signal<string[]>([]);

  ngOnInit() {
    this.setupSEO();
    this.loadModules();
    this.loadPendingRequests();
    this.loadPinnedModules();
    // Apply module-specific theme for modules page
    this.themeService.applyModuleTheme('user-management');
  }

  private setupSEO() {
    const brandName = this.brandConfig.getBrandName();

    this.seoService.updateSEO({
      title: `Modules - ${brandName}`,
      description: `Discover and activate business modules for ${brandName}. Manage HR, CRM, project management, inventory, and more with our comprehensive module system.`,
      keywords:
        'business modules, module management, HR management, CRM, project management, inventory management, activate modules',
      siteName: brandName,
      author: 'Rohan Bhuri',
    });
  }

  loadModules() {
    this.loading.set(true);
    this.modulesService.getAvailable().subscribe({
      next: (modules) => {
        console.log('Loaded modules:', modules);
        this.modules.set(modules);
        this.filteredModules.set(modules);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load modules:', error);
        this.snackBar.open('Failed to load modules', 'Close', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  loadPendingRequests() {
    console.log('Loading pending requests...');
    this.modulesService.getPendingRequests().subscribe({
      next: (requests) => {
        console.log('Loaded pending requests:', requests);
        this.pendingRequests.set(requests);
      },
      error: (error) => {
        console.error('Failed to load requests:', error);
        this.snackBar.open('Failed to load requests', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  filterModules() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.modules().filter(
      (m) =>
        m.displayName.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term)
    );
    this.filteredModules.set(filtered);
  }

  activateModule(module: AppModuleInfo) {
    this.loading.set(true);
    console.log('Activating module:', module.id);
    this.modulesService.requestActivation(module.id).subscribe({
      next: (result) => {
        console.log('Activation result:', result);
        if (result.success) {
          this.snackBar.open('Module activated successfully', 'Close', {
            duration: 3000,
          });
          // Add delay to ensure backend has processed the change
          setTimeout(() => {
            this.loadModules();
          }, 500);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Activation error:', error);
        this.snackBar.open('Failed to activate module', 'Close', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  deactivateModule(module: AppModuleInfo) {
    this.loading.set(true);
    this.modulesService.deactivateModule(module.id).subscribe({
      next: (result) => {
        if (result.success) {
          this.snackBar.open('Module deactivated successfully', 'Close', {
            duration: 3000,
          });
          this.loadModules();
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to deactivate module', 'Close', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  requestModule(module: AppModuleInfo) {
    this.loading.set(true);
    this.modulesService.requestActivation(module.id).subscribe({
      next: (result) => {
        if (result.success) {
          this.snackBar.open('Access request submitted', 'Close', {
            duration: 3000,
          });
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to submit request', 'Close', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  openModule(module: AppModuleInfo) {
    const moduleRoutes: { [key: string]: string } = {
      crm: '/modules/crm',
      'user-management': '/modules/user-management',
      user_management: '/modules/user-management',
      'my-organizations': '/my-organizations',
      reports: '/reports',
      dashboard: '/dashboard',
      settings: '/settings',
    };

    const route = moduleRoutes[module.name] || `/modules/${module.name}`;
    this.router.navigate([route]);
  }

  approveRequest(request: ModuleRequest) {
    this.loading.set(true);
    this.modulesService.approveRequest(request._id).subscribe({
      next: () => {
        this.snackBar.open('Request approved', 'Close', { duration: 3000 });
        // Add delay to ensure backend processing completes
        setTimeout(() => {
          this.loadPendingRequests();
          this.loadModules();
        }, 500);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to approve request', 'Close', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  rejectRequest(request: ModuleRequest) {
    this.loading.set(true);
    this.modulesService.rejectRequest(request._id).subscribe({
      next: () => {
        this.snackBar.open('Request rejected', 'Close', { duration: 3000 });
        this.loadPendingRequests();
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to reject request', 'Close', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  onTabChange(index: number) {
    this.selectedTab.set(index);
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole('super_admin');
  }

  getModuleName(moduleId: string): string {
    const module = this.modules().find((m) => m.id === moduleId);
    return module?.displayName || 'Unknown Module';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  loadPinnedModules() {
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        this.pinnedModules.set(prefs?.pinnedModules || []);
      },
      error: () => {
        this.pinnedModules.set([]);
      },
    });
  }

  isPinned(moduleId: string): boolean {
    return this.pinnedModules().includes(moduleId);
  }

  togglePin(module: AppModuleInfo) {
    this.preferencesService.togglePinnedModule(module.id).subscribe({
      next: (prefs) => {
        this.pinnedModules.set(prefs.pinnedModules || []);
        this.preferencesService.updatePinnedModules(prefs.pinnedModules || []);
        const action = this.isPinned(module.id) ? 'pinned to' : 'unpinned from';
        this.snackBar.open(`${module.displayName} ${action} navbar`, 'Close', {
          duration: 2000,
        });
      },
      error: () => {
        this.snackBar.open('Failed to update pin status', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
