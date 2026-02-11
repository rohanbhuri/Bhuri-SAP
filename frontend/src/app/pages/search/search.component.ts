import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { SearchService, SearchResult, SearchFilters } from '../../services/search.service';
import { ModulesService } from '../../services/modules.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { MODULE_REGISTRY, getModuleById } from '../../modules/module-registry';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTooltipModule,
    NavbarComponent,
    BottomNavbarComponent,
    BreadcrumbComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <!-- Dashboard-style page header -->
      <div class="page-header" aria-label="Search header">
        <app-breadcrumb></app-breadcrumb>
        <div class="header-controls">
          <h1>Global Search</h1>
          <p class="description">Locate people, projects, and resources across your workspace</p>
        </div>
      </div>

      <div class="search-main-container">
        <!-- Hero Search Section -->
        <div class="search-hero">
          <div class="hero-glass-card">
            <div class="search-input-group">
              <mat-form-field appearance="outline" class="premium-search-field">
                <mat-icon matPrefix>search</mat-icon>
                <input
                  matInput
                  [formControl]="searchControl"
                  placeholder="What can we help you find today?"
                  autocomplete="off"
                  (keyup.enter)="onSearch()"
                />
                @if (searchControl.value) {
                  <button mat-icon-button matSuffix (click)="clearSearch()" matTooltip="Clear search">
                    <mat-icon>close</mat-icon>
                  </button>
                }
              </mat-form-field>
              
              <button 
                mat-flat-button 
                color="primary" 
                class="main-search-btn"
                (click)="onSearch()"
                [disabled]="isLoading()">
                <mat-icon>search</mat-icon>
                <span>Search</span>
              </button>
            </div>

            <!-- Quick Access Module Pills -->
            <div class="quick-module-filters">
              <div class="pill-label">Search in:</div>
              <div class="pill-list">
                @for (mod of availableModules(); track mod.key) {
                  <button 
                    class="module-pill" 
                    [class.active]="isModuleSelected(mod.key)"
                    (click)="toggleModuleFilter(mod.key)"
                    [style.--mod-color]="getModuleColor(mod.key)">
                    <mat-icon>{{ mod.icon }}</mat-icon>
                    <span>{{ mod.label }}</span>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="search-view-content">
          <!-- Loading State overlay-like -->
          @if (isLoading()) {
            <div class="loading-state-view">
              <mat-spinner diameter="48"></mat-spinner>
              <p>Scanning your modules...</p>
            </div>
          }

          <!-- Initial/Empty State -->
          @if (!showResults() && !isLoading()) {
            <div class="empty-placeholder fade-in">
              <div class="icon-orb">
                <mat-icon>{{ searchControl.value ? 'search_off' : 'explore' }}</mat-icon>
              </div>
              <h2>{{ searchControl.value ? 'No matches found' : 'Find anything instantly' }}</h2>
              <p>
                {{ searchControl.value ? 
                  'We couldn\\'t find any results for "' + searchControl.value + '". Try broadening your search or checking your filters.' : 
                  'Type a name, project title, or keyword to search across all your active modules.' 
                }}
              </p>
              
              <!-- Suggested keywords if empty -->
              @if (!searchControl.value && suggestions().length > 0) {
                <div class="trending-box">
                  <span class="trending-label">Common searches:</span>
                  <div class="trending-tags">
                    @for (s of suggestions(); track s) {
                      <button class="trend-tag" (click)="onSuggestionClick(s)">#{{ s }}</button>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- Results Grid -->
          @if (showResults() && !isLoading()) {
            <div class="results-layout-container">
              <div class="results-header-info">
                <h3>Found {{ results().length }} items</h3>
                <button mat-button class="clear-filters-link" (click)="resetToDefaults()">
                  <mat-icon>refresh</mat-icon> Reset filters
                </button>
              </div>

              <div class="results-list-grid">
                @for (result of results(); track result.id) {
                  <div 
                    class="search-tile fade-in-up" 
                    (click)="onResultClick(result)"
                    [style.--module-color]="getModuleColor(result.module)">
                    <div class="tile-branding-bar"></div>
                    <div class="tile-body">
                      <div class="tile-icon-section">
                        <div class="icon-backdrop">
                          <mat-icon>{{ getResultIcon(result.type) }}</mat-icon>
                        </div>
                      </div>
                      <div class="tile-main-info">
                        <div class="tile-title-row">
                          <h4 class="tile-name">{{ result.title }}</h4>
                          <span class="type-badge">{{ result.type }}</span>
                        </div>
                        <p class="tile-desc">{{ result.subtitle }}</p>
                        <div class="tile-tags">
                          <div class="module-tag">
                            <mat-icon>{{ getModuleIcon(result.module) }}</mat-icon>
                            <span>{{ getModuleLabel(result.module) }}</span>
                          </div>
                          @if (result.metadata?.status) {
                            <div class="status-badge" [attr.data-status]="result.metadata.status">
                              {{ result.metadata.status }}
                            </div>
                          }
                        </div>
                      </div>
                      <mat-icon class="tile-arrow">chevron_right</mat-icon>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchService = inject(SearchService);
  private modulesService = inject(ModulesService);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchControl = new FormControl('');
  results = signal<SearchResult[]>([]);
  suggestions = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  showResults = signal<boolean>(false);

  availableModules = signal<any[]>([]);
  selectedModules = signal<string[]>([]);

  ngOnInit() {
    this.themeService.applyModuleTheme('search');
    this.loadActiveModules();
    this.handleQueryParams();
  }

  private loadActiveModules() {
    this.modulesService.getActive().subscribe({
      next: (activeModules) => {
        const mods = activeModules.map(m => {
          const registryMod = MODULE_REGISTRY.find(reg => reg.id === m.id || reg.name === m.name);
          // Use registry ID as the key if found, otherwise the module id
          const moduleKey = registryMod?.id || m.id;
          return {
            key: moduleKey,
            label: m.displayName || registryMod?.displayName || m.name,
            icon: m.icon || registryMod?.icon || 'apps'
          };
        }).filter((m): m is { key: string; label: string; icon: string } => !!m.key);

        this.availableModules.set(mods);
        // Default to all active modules selected
        this.selectedModules.set(mods.map(m => m.key).filter((key): key is string => !!key));
        this.setupSearch();
      },
      error: (err) => {
        console.error('Failed to load active modules', err);
        const fallback = MODULE_REGISTRY.filter(m => m.isActive).map(m => ({
          key: m.id,
          label: m.displayName,
          icon: m.icon
        }));
        this.availableModules.set(fallback);
        this.selectedModules.set(fallback.map(m => m.key).filter((key): key is string => !!key));
        this.setupSearch();
      }
    });
  }

  private handleQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['q']) {
        this.searchControl.setValue(params['q']);
        this.onSearch();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    // Initial setup if needed
  }

  onSearch() {
    const query = this.searchControl.value;
    if (!query || query.length < 2) {
      this.showResults.set(false);
      this.results.set([]);
      return;
    }

    const filters: SearchFilters = {
      modules: this.selectedModules()
    };

    this.isLoading.set(true);
    this.searchService.search(query, filters).subscribe({
      next: (response) => {
        this.results.set(response.results);
        this.suggestions.set(response.suggestions || []);
        this.showResults.set(response.results.length > 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.showResults.set(false);
      }
    });
  }

  onResultClick(result: SearchResult) {
    this.navigateToResult(result);
  }

  onSuggestionClick(suggestion: string) {
    this.searchControl.setValue(suggestion);
    this.onSearch();
  }

  private navigateToResult(result: SearchResult) {
    const routes: { [key: string]: string } = {
      'user': '/modules/user-management/users',
      'employee': '/modules/hr-management',
      'project': '/modules/projects-management',
      'task': '/modules/crm/tasks', // Mapping tasks search to CRM tasks for now as it's the active one
      'contact': '/modules/crm/contacts',
      'lead': '/modules/crm/leads',
      'deal': '/modules/crm/deals',
      'department': '/modules/organization-management',
      'organization': '/modules/organization-management',
      'client': '/modules/client-management/clients',
      'client-request': '/modules/client-management/requests',
      'product': '/modules/catalogue',
      'blog-post': '/modules/cms/blogs',
      'page': '/modules/cms/pages',
      'quotation': '/modules/quotations',
      'order': '/modules/order-management'
    };

    let route = routes[result.type];

    // Fallback: If no specific route for type, try to find the module's default route
    if (!route && result.module) {
      const moduleConfig = getModuleById(result.module);
      if (moduleConfig?.route) {
        route = moduleConfig.route;
      }
    }

    if (route) {
      // Navigate with ID as query parameter for potential future highlighting
      this.router.navigate([route], {
        queryParams: { selectedId: result.id }
      }).catch(err => {
        console.error('Navigation error:', err);
        this.router.navigate(['/modules']);
      });
    } else {
      console.warn('No route found for type:', result.type, 'module:', result.module);
      this.router.navigate(['/modules']);
    }
  }

  toggleModuleFilter(moduleKey: string) {
    const current = this.selectedModules();
    const index = current.indexOf(moduleKey);
    if (index > -1) {
      this.selectedModules.set(current.filter(m => m !== moduleKey));
    } else {
      this.selectedModules.set([...current, moduleKey]);
    }

    if (this.searchControl.value) this.onSearch();
  }

  resetToDefaults() {
    this.selectedModules.set(this.availableModules().map(m => m.key));
    if (this.searchControl.value) this.onSearch();
  }

  isModuleSelected(moduleKey: string): boolean {
    return this.selectedModules().includes(moduleKey);
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.results.set([]);
    this.showResults.set(false);
  }

  getModuleColor(moduleId: string): string {
    const config = getModuleById(moduleId);
    return config?.color || '#3B82F6';
  }

  getModuleLabel(module: string): string {
    const config = getModuleById(module);
    return config?.displayName || module;
  }

  getModuleIcon(module: string): string {
    const config = getModuleById(module);
    return config?.icon || 'apps';
  }

  getResultIcon(type: string): string {
    const typeConfigs: any = {
      'user': 'person',
      'employee': 'badge',
      'project': 'folder',
      'task': 'assignment',
      'contact': 'contact_phone',
      'lead': 'trending_up',
      'deal': 'handshake',
      'department': 'corporate_fare',
      'organization': 'business',
      'client': 'people_outline',
      'client-request': 'contact_page',
      'product': 'inventory_2',
      'blog-post': 'article',
      'page': 'description',
      'quotation': 'request_quote',
      'order': 'shopping_bag'
    };
    return typeConfigs[type] || 'description';
  }
}