import { Component, inject, signal } from '@angular/core';
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
import { ModulesService, AppModuleInfo, ModuleRequest } from '../../services/modules.service';
import { AuthService } from '../../services/auth.service';
import { PreferencesService } from '../../services/preferences.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
        <p class="subtitle">Discover and activate modules for your organization</p>
      </div>

      <mat-tab-group class="module-tabs" [selectedIndex]="selectedTab()" (selectedIndexChange)="onTabChange($event)">
        <mat-tab label="Available Modules">
          <div class="tab-content">
            <div class="search-bar">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search modules</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="filterModules()" placeholder="Search by name or description">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>

            <div class="modules-grid">
              @for (module of filteredModules(); track module.id) {
              <mat-card class="module-card" [class.active]="module.isActive" [style.border-left]="'4px solid ' + (module.color || '#ccc')">
                <div class="module-header">
                  <div class="module-info">
                    <h3 class="module-title" [style.color]="module.color || 'inherit'">{{ module.displayName }}</h3>
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
                    <button mat-raised-button color="primary" (click)="openModule(module)">
                      <mat-icon>open_in_new</mat-icon>
                      Open
                    </button>
                    <button mat-icon-button (click)="togglePin(module)" [attr.aria-label]="isPinned(module.id) ? 'Unpin from navbar' : 'Pin to navbar'">
                      <mat-icon>{{ isPinned(module.id) ? 'push_pin' : 'push_pin' }}</mat-icon>
                    </button>
                    <button mat-stroked-button color="warn" (click)="deactivateModule(module)" [disabled]="loading()">
                      @if (loading()) {
                      <mat-spinner diameter="16"></mat-spinner>
                      } @else {
                      <mat-icon>remove</mat-icon>
                      }
                      Deactivate
                    </button>
                  </div>
                  } @else if (module.isPending) {
                  <button mat-stroked-button disabled>
                    <mat-icon>schedule</mat-icon>
                    Request Pending
                  </button>
                  } @else if (module.canActivate) {
                  <button mat-raised-button color="accent" (click)="activateModule(module)" [disabled]="loading()">
                    @if (loading()) {
                    <mat-spinner diameter="16"></mat-spinner>
                    } @else {
                    <mat-icon>add</mat-icon>
                    }
                    Activate
                  </button>
                  } @else {
                  <button mat-raised-button (click)="requestModule(module)" [disabled]="loading()">
                    @if (loading()) {
                    <mat-spinner diameter="16"></mat-spinner>
                    } @else {
                    <mat-icon>request_page</mat-icon>
                    }
                    Request Access
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
              <p>Try adjusting your search terms or contact your administrator.</p>
            </div>
            }
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <span [matBadge]="pendingRequests().length" matBadgeColor="warn" [matBadgeHidden]="pendingRequests().length === 0">
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
                    <p class="request-user">Requested by: {{ request.userName }}</p>
                    <p class="request-date">{{ formatDate(request.requestedAt) }}</p>
                  </div>
                  <mat-chip class="status-chip pending">
                    <mat-icon>schedule</mat-icon>
                    Pending
                  </mat-chip>
                </div>
                
                <div class="request-actions">
                  <button mat-raised-button color="primary" (click)="approveRequest(request)" [disabled]="loading()">
                    <mat-icon>check</mat-icon>
                    Approve
                  </button>
                  <button mat-stroked-button color="warn" (click)="rejectRequest(request)" [disabled]="loading()">
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
      }

      .page-header {
        margin-bottom: 24px;
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
        margin: 0;
      }

      .module-tabs {
        background: var(--theme-surface);
        border-radius: 12px;
        overflow: hidden;
      }

      .tab-content {
        padding: 24px;
      }

      .search-bar {
        margin-bottom: 24px;
      }

      .search-field {
        width: 100%;
        max-width: 400px;
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }

      .module-card {
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 12px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .module-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .module-card.active {
        border-color: var(--theme-primary);
        background: color-mix(in srgb, var(--theme-primary) 5%, var(--theme-surface));
      }

      .module-header {
        padding: 16px 16px 8px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .module-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--theme-on-surface);
      }

      .module-status {
        margin-top: 8px;
      }

      .status-chip {
        font-size: 0.75rem;
        height: 24px;
        font-weight: 500;
      }

      .status-chip.active {
        background: color-mix(in srgb, #4caf50 15%, transparent);
        color: #2e7d32;
      }

      .status-chip.available {
        background: color-mix(in srgb, #2196f3 15%, transparent);
        color: #1565c0;
      }

      .status-chip.restricted {
        background: color-mix(in srgb, #ff9800 15%, transparent);
        color: #ef6c00;
      }

      .status-chip.pending {
        background: color-mix(in srgb, #ff9800 15%, transparent);
        color: #ef6c00;
      }

      .module-description {
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        line-height: 1.5;
        margin: 0;
      }

      .module-actions {
        padding: 16px;
        border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
      }

      .active-module-actions {
        display: flex;
        gap: 8px;
      }

      .active-module-actions button {
        flex: 1;
      }

      .requests-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .request-card {
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        border-radius: 8px;
      }

      .request-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .request-info h4 {
        margin: 0 0 4px;
        font-weight: 600;
      }

      .request-user {
        margin: 0 0 4px;
        font-size: 0.9rem;
        color: var(--theme-primary);
        font-weight: 500;
      }

      .request-date {
        margin: 0;
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .request-actions {
        padding: 0 16px 16px;
        display: flex;
        gap: 12px;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .empty-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-state h3 {
        margin: 0 0 8px;
        color: var(--theme-on-surface);
      }

      .empty-state p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .modules-grid {
          grid-template-columns: 1fr;
        }
        
        .request-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        
        .request-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ModulesComponent {
  private modulesService = inject(ModulesService);
  private authService = inject(AuthService);
  private preferencesService = inject(PreferencesService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  modules = signal<AppModuleInfo[]>([]);
  filteredModules = signal<AppModuleInfo[]>([]);
  pendingRequests = signal<ModuleRequest[]>([]);
  selectedTab = signal(0);
  loading = signal(false);
  searchTerm = '';
  pinnedModules = signal<string[]>([]);

  ngOnInit() {
    this.loadModules();
    this.loadPendingRequests();
    this.loadPinnedModules();
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
        this.snackBar.open('Failed to load modules', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
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
        this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 });
      }
    });
  }

  filterModules() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.modules().filter(m => 
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
          this.snackBar.open('Module activated successfully', 'Close', { duration: 3000 });
          // Add delay to ensure backend has processed the change
          setTimeout(() => {
            this.loadModules();
          }, 500);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Activation error:', error);
        this.snackBar.open('Failed to activate module', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  deactivateModule(module: AppModuleInfo) {
    this.loading.set(true);
    this.modulesService.deactivateModule(module.id).subscribe({
      next: (result) => {
        if (result.success) {
          this.snackBar.open('Module deactivated successfully', 'Close', { duration: 3000 });
          this.loadModules();
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to deactivate module', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  requestModule(module: AppModuleInfo) {
    this.loading.set(true);
    this.modulesService.requestActivation(module.id).subscribe({
      next: (result) => {
        if (result.success) {
          this.snackBar.open('Access request submitted', 'Close', { duration: 3000 });
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to submit request', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  openModule(module: AppModuleInfo) {
    const moduleRoutes: { [key: string]: string } = {
      'crm': '/modules/crm',
      'user-management': '/modules/user-management',
      'user_management': '/modules/user-management',
      'reports': '/reports',
      'dashboard': '/dashboard',
      'settings': '/settings'
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
        this.snackBar.open('Failed to approve request', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
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
        this.snackBar.open('Failed to reject request', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onTabChange(index: number) {
    this.selectedTab.set(index);
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole('super_admin');
  }

  getModuleName(moduleId: string): string {
    const module = this.modules().find(m => m.id === moduleId);
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
      }
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
        this.snackBar.open(`${module.displayName} ${action} navbar`, 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to update pin status', 'Close', { duration: 3000 });
      }
    });
  }
}
