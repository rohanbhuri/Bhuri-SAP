import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { SearchService, SearchResult, SearchFilters } from '../../services/search.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

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
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="page-container">
      <div class="search-container">
        <!-- Search Header -->
        <div class="search-header">
          <div class="search-input-container">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search across all modules...</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Type to search users, projects, tasks, and more">
              <mat-icon matPrefix>search</mat-icon>
              <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clearSearch()">
                <mat-icon>clear</mat-icon>
              </button>
            </mat-form-field>
            
            <div class="search-actions">
              <button mat-icon-button [matMenuTriggerFor]="filtersMenu" class="filter-button">
                <mat-icon [class.has-filters]="selectedFilters.modules?.length || selectedFilters.types?.length">tune</mat-icon>
              </button>
            </div>
          </div>

          <!-- Active Filters -->
          <div class="active-filters">
            <div class="filter-summary">
              <span class="filter-count">{{ getActiveFilterCount() }} filters active</span>
              <button mat-button (click)="resetToDefaults()" class="reset-filters">
                <mat-icon>refresh</mat-icon>
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Search Results -->
        <div class="search-content">
          <!-- Loading State -->
          <div class="loading-container" *ngIf="isLoading">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Searching...</p>
          </div>

          <!-- Suggestions -->
          <div class="suggestions-container" *ngIf="suggestions.length > 0 && !showResults && !isLoading">
            <h3>Suggestions</h3>
            <div class="suggestions-list">
              <button mat-stroked-button 
                      *ngFor="let suggestion of suggestions" 
                      (click)="onSuggestionClick(suggestion)"
                      class="suggestion-chip">
                <mat-icon>search</mat-icon>
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div class="results-container" *ngIf="showResults && !isLoading">
            <div class="results-header">
              <h3>Search Results ({{ results.length }})</h3>
            </div>

            <div class="results-list">
              <mat-card *ngFor="let result of results; trackBy: trackByResultId" 
                        class="result-card" 
                        (click)="onResultClick(result)">
                <mat-card-content>
                  <div class="result-header">
                    <div class="result-icon">
                      <mat-icon [class]="'module-' + result.module">{{ getTypeIcon(result.type) }}</mat-icon>
                    </div>
                    
                    <div class="result-info">
                      <h4 class="result-title">{{ result.title }}</h4>
                      <p class="result-subtitle">{{ result.subtitle }}</p>
                      
                      <div class="result-meta">
                        <mat-chip class="module-chip" [class]="'module-' + result.module">
                          <mat-icon matChipAvatar>{{ getModuleIcon(result.module) }}</mat-icon>
                          {{ getModuleLabel(result.module) }}
                        </mat-chip>
                        
                        <mat-chip class="type-chip">
                          {{ getTypeLabel(result.type) }}
                        </mat-chip>
                        
                        <mat-chip *ngIf="result.metadata?.status" 
                                 [color]="getStatusColor(result.metadata)"
                                 class="status-chip">
                          {{ result.metadata.status }}
                        </mat-chip>
                      </div>
                    </div>
                    
                    <div class="result-actions">
                      <mat-icon class="navigate-icon">arrow_forward_ios</mat-icon>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!isLoading && !showResults && searchControl.value && searchControl.value.length >= 2">
            <mat-icon class="empty-icon">search_off</mat-icon>
            <h3>No results found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>

          <!-- Initial State -->
          <div class="initial-state" *ngIf="!isLoading && !showResults && (!searchControl.value || searchControl.value.length < 2)">
            <mat-icon class="initial-icon">search</mat-icon>
            <h3>Global Search</h3>
            <p>Search across all modules and find users, projects, tasks, contacts, and more</p>
            
            <div class="search-tips">
              <h4>Search Tips:</h4>
              <ul>
                <li>Use specific terms for better results</li>
                <li>Filter by module or type using the filter button</li>
                <li>Search works across names, emails, descriptions, and IDs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>

    <!-- Filters Menu -->
    <mat-menu #filtersMenu="matMenu" class="filters-menu">
      <div class="filters-content" (click)="$event.stopPropagation()">
        <div class="filter-header">
          <h3>Search Filters</h3>
          <div class="filter-actions">
            <button mat-button (click)="selectAllModules()" class="select-all">
              <mat-icon>select_all</mat-icon>
              All
            </button>
            <button mat-button (click)="clearFilters()" class="clear-all">
              <mat-icon>clear_all</mat-icon>
              None
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h4>
            <mat-icon>apps</mat-icon>
            Modules ({{ selectedFilters.modules?.length || 0 }}/{{ availableModules.length }})
          </h4>
          <div class="filter-grid">
            <mat-checkbox *ngFor="let module of availableModules"
                         [checked]="isModuleSelected(module.key)"
                         (change)="toggleModuleFilter(module.key)"
                         class="filter-checkbox">
              <div class="checkbox-content">
                <mat-icon [class]="'module-icon module-' + module.key">{{ module.icon }}</mat-icon>
                <span>{{ module.label }}</span>
              </div>
            </mat-checkbox>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="filter-section">
          <h4>
            <mat-icon>category</mat-icon>
            Types ({{ selectedFilters.types?.length || 0 }}/{{ availableTypes.length }})
          </h4>
          <div class="filter-grid">
            <mat-checkbox *ngFor="let type of availableTypes"
                         [checked]="isTypeSelected(type.key)"
                         (change)="toggleTypeFilter(type.key)"
                         class="filter-checkbox">
              <div class="checkbox-content">
                <mat-icon [class]="'type-icon type-' + type.key">{{ type.icon }}</mat-icon>
                <span>{{ type.label }}</span>
              </div>
            </mat-checkbox>
          </div>
        </div>

        <div class="filter-footer">
          <button mat-button (click)="resetToDefaults()" class="reset-button">
            <mat-icon>refresh</mat-icon>
            Reset to Defaults
          </button>
        </div>
      </div>
    </mat-menu>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchService = inject(SearchService);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchControl = new FormControl('');
  results: SearchResult[] = [];
  suggestions: string[] = [];
  isLoading = false;
  showResults = false;
  selectedFilters: SearchFilters = {
    modules: [
      'user-management',
      'hr-management', 
      'projects-management',
      'tasks-management',
      'crm',
      'organization-management'
    ]
  };
  
  availableModules = [
    { key: 'user-management', label: 'Users', icon: 'people' },
    { key: 'hr-management', label: 'HR', icon: 'business' },
    { key: 'projects-management', label: 'Projects', icon: 'work' },
    { key: 'tasks-management', label: 'Tasks', icon: 'task' },
    { key: 'crm', label: 'CRM', icon: 'contacts' },
    { key: 'organization-management', label: 'Organizations', icon: 'domain' }
  ];

  availableTypes = [
    { key: 'user', label: 'Users', icon: 'person' },
    { key: 'employee', label: 'Employees', icon: 'badge' },
    { key: 'project', label: 'Projects', icon: 'folder' },
    { key: 'task', label: 'Tasks', icon: 'assignment' },
    { key: 'contact', label: 'Contacts', icon: 'contact_phone' },
    { key: 'lead', label: 'Leads', icon: 'trending_up' },
    { key: 'deal', label: 'Deals', icon: 'handshake' },
    { key: 'department', label: 'Departments', icon: 'corporate_fare' },
    { key: 'organization', label: 'Organizations', icon: 'business' }
  ];

  ngOnInit() {
    this.themeService.applyModuleTheme('search');
    this.setupSearch();
    this.handleQueryParams();
  }

  private handleQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchControl.setValue(params['q']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) {
          this.showResults = false;
          return of({ results: [], suggestions: [] });
        }
        
        this.isLoading = true;
        return this.searchService.search(query, this.selectedFilters);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.results = response.results;
        this.suggestions = response.suggestions || [];
        this.showResults = response.results.length > 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showResults = false;
      }
    });
  }

  onResultClick(result: SearchResult) {
    this.navigateToResult(result);
    this.clearSearch();
  }

  onSuggestionClick(suggestion: string) {
    this.searchControl.setValue(suggestion);
  }

  private navigateToResult(result: SearchResult) {
    const routes: { [key: string]: string } = {
      'user': `/modules/user-management/users/${result.id}`,
      'employee': `/modules/hr-management/employees/${result.id}`,
      'project': `/modules/projects-management/projects/${result.id}`,
      'task': `/modules/tasks-management/tasks/${result.id}`,
      'contact': `/modules/crm/contacts/${result.id}`,
      'lead': `/modules/crm/leads/${result.id}`,
      'deal': `/modules/crm/deals/${result.id}`,
      'department': `/modules/organization-management/departments/${result.id}`,
      'organization': `/modules/organization-management/organizations/${result.id}`
    };

    const route = routes[result.type];
    if (route) {
      this.router.navigate([route]).catch(error => {
        console.error('Navigation error:', error);
        // Fallback to module list if specific route fails
        this.router.navigate(['/modules']);
      });
    } else {
      console.warn('No route found for result type:', result.type);
      this.router.navigate(['/modules']);
    }
  }

  toggleModuleFilter(moduleKey: string) {
    if (!this.selectedFilters.modules) {
      this.selectedFilters.modules = [];
    }
    
    const index = this.selectedFilters.modules.indexOf(moduleKey);
    if (index > -1) {
      this.selectedFilters.modules.splice(index, 1);
    } else {
      this.selectedFilters.modules.push(moduleKey);
    }
    
    this.applyFilters();
  }

  toggleTypeFilter(typeKey: string) {
    if (!this.selectedFilters.types) {
      this.selectedFilters.types = [];
    }
    
    const index = this.selectedFilters.types.indexOf(typeKey);
    if (index > -1) {
      this.selectedFilters.types.splice(index, 1);
    } else {
      this.selectedFilters.types.push(typeKey);
    }
    
    this.applyFilters();
  }

  private applyFilters() {
    const query = this.searchControl.value;
    if (query && query.length >= 2) {
      this.isLoading = true;
      this.searchService.search(query, this.selectedFilters).subscribe({
        next: (response) => {
          this.results = response.results;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  clearFilters() {
    this.selectedFilters = { modules: [], types: [] };
    this.applyFilters();
  }

  resetToDefaults() {
    this.selectedFilters = {
      modules: [
        'user-management',
        'hr-management', 
        'projects-management',
        'tasks-management',
        'crm',
        'organization-management'
      ]
    };
    this.applyFilters();
  }

  getActiveFilterCount(): number {
    return (this.selectedFilters.modules?.length || 0) + (this.selectedFilters.types?.length || 0);
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.results = [];
    this.suggestions = [];
    this.showResults = false;
  }

  getModuleIcon(module: string): string {
    const moduleConfig = this.availableModules.find(m => m.key === module);
    return moduleConfig?.icon || 'search';
  }

  getTypeIcon(type: string): string {
    const typeConfig = this.availableTypes.find(t => t.key === type);
    return typeConfig?.icon || 'description';
  }

  getModuleLabel(module: string): string {
    const moduleConfig = this.availableModules.find(m => m.key === module);
    return moduleConfig?.label || module;
  }

  getTypeLabel(type: string): string {
    const typeConfig = this.availableTypes.find(t => t.key === type);
    return typeConfig?.label || type;
  }

  getStatusColor(metadata: any): string {
    if (!metadata) return '';
    
    if (metadata.status) {
      switch (metadata.status.toLowerCase()) {
        case 'active': return 'success';
        case 'inactive': return 'warn';
        case 'pending': return 'accent';
        case 'completed': return 'success';
        case 'in-progress': return 'primary';
        default: return '';
      }
    }
    
    return '';
  }

  isModuleSelected(moduleKey: string): boolean {
    return this.selectedFilters.modules?.includes(moduleKey) || false;
  }

  isTypeSelected(typeKey: string): boolean {
    return this.selectedFilters.types?.includes(typeKey) || false;
  }

  selectAllModules() {
    this.selectedFilters.modules = this.availableModules.map(m => m.key);
    this.applyFilters();
  }

  selectAllTypes() {
    this.selectedFilters.types = this.availableTypes.map(t => t.key);
    this.applyFilters();
  }

  trackByResultId(index: number, result: SearchResult): string {
    return result.id;
  }
}