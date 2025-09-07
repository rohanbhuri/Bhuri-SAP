import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { SearchService, SearchResult } from '../services/search.service';

@Component({
  selector: 'app-quick-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <div class="quick-search-container">
      <mat-form-field appearance="outline" class="search-field">
        <input matInput 
               [formControl]="searchControl" 
               placeholder="Quick search..."
               [matMenuTriggerFor]="resultsMenu"
               #searchInput>
        <mat-icon matPrefix>search</mat-icon>
        <button mat-icon-button matSuffix 
                *ngIf="searchControl.value" 
                (click)="clearSearch()">
          <mat-icon>clear</mat-icon>
        </button>
      </mat-form-field>

      <mat-menu #resultsMenu="matMenu" class="search-results-menu">
        <div class="search-results-content" (click)="$event.stopPropagation()">
          <!-- Loading -->
          <div *ngIf="isLoading" class="search-loading">
            <mat-icon>hourglass_empty</mat-icon>
            <span>Searching...</span>
          </div>

          <!-- Results -->
          <div *ngIf="!isLoading && results.length > 0" class="search-results">
            <mat-list>
              <mat-list-item *ngFor="let result of results; trackBy: trackByResultId"
                           (click)="onResultClick(result)"
                           class="search-result-item">
                <mat-icon matListItemIcon>{{ getTypeIcon(result.type) }}</mat-icon>
                <div matListItemTitle>{{ result.title }}</div>
                <div matListItemLine>{{ result.subtitle }}</div>
                <div matListItemMeta class="result-module">{{ getModuleLabel(result.module) }}</div>
              </mat-list-item>
            </mat-list>
            
            <mat-divider></mat-divider>
            
            <div class="view-all-results">
              <button mat-button (click)="viewAllResults()" class="view-all-button">
                <mat-icon>search</mat-icon>
                View all results
              </button>
            </div>
          </div>

          <!-- No results -->
          <div *ngIf="!isLoading && searchControl.value && searchControl.value.length >= 2 && results.length === 0" 
               class="no-results">
            <mat-icon>search_off</mat-icon>
            <span>No results found</span>
          </div>

          <!-- Initial state -->
          <div *ngIf="!isLoading && (!searchControl.value || searchControl.value.length < 2)" 
               class="search-hint">
            <mat-icon>info</mat-icon>
            <span>Type to search across all modules</span>
          </div>
        </div>
      </mat-menu>
    </div>
  `,
  styles: [`
    .quick-search-container {
      .search-field {
        width: 300px;
        
        ::ng-deep {
          .mat-mdc-form-field-outline {
            background: color-mix(in srgb, var(--theme-surface) 95%, transparent);
            border-radius: 20px;
          }
          
          .mat-mdc-form-field-infix {
            padding: 8px 0;
          }
          
          .mat-mdc-input-element {
            font-size: 14px;
          }
        }
      }
    }

    ::ng-deep .search-results-menu {
      .mat-mdc-menu-panel {
        min-width: 400px;
        max-width: 500px;
        max-height: 400px;
      }

      .search-results-content {
        .search-loading, .no-results, .search-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
          font-size: 14px;
          
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }

        .search-results {
          .search-result-item {
            cursor: pointer;
            transition: background-color 0.2s ease;
            
            &:hover {
              background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
            }

            .result-module {
              font-size: 11px;
              color: color-mix(in srgb, var(--theme-primary) 80%, transparent);
              background: color-mix(in srgb, var(--theme-primary) 10%, transparent);
              padding: 2px 8px;
              border-radius: 12px;
            }
          }

          .view-all-results {
            padding: 8px;
            
            .view-all-button {
              width: 100%;
              justify-content: flex-start;
              color: var(--theme-primary);
              
              mat-icon {
                margin-right: 8px;
              }
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .quick-search-container .search-field {
        width: 200px;
      }
      
      ::ng-deep .search-results-menu .mat-mdc-menu-panel {
        min-width: 300px;
      }
    }
  `]
})
export class QuickSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchService = inject(SearchService);
  private router = inject(Router);

  searchControl = new FormControl('');
  results: SearchResult[] = [];
  isLoading = false;

  private moduleLabels: { [key: string]: string } = {
    'user-management': 'Users',
    'hr-management': 'HR',
    'projects-management': 'Projects',
    'tasks-management': 'Tasks',
    'crm': 'CRM',
    'organization-management': 'Organizations'
  };

  private typeIcons: { [key: string]: string } = {
    'user': 'person',
    'employee': 'badge',
    'project': 'folder',
    'task': 'assignment',
    'contact': 'contact_phone',
    'lead': 'trending_up',
    'deal': 'handshake',
    'department': 'corporate_fare',
    'organization': 'business'
  };

  ngOnInit() {
    this.setupQuickSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupQuickSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) {
          this.results = [];
          return of([]);
        }
        
        this.isLoading = true;
        return this.searchService.quickSearch(query, 8);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.results = [];
      }
    });
  }

  onResultClick(result: SearchResult) {
    this.navigateToResult(result);
    this.clearSearch();
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

  viewAllResults() {
    const query = this.searchControl.value;
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
    this.clearSearch();
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.results = [];
  }

  getTypeIcon(type: string): string {
    return this.typeIcons[type] || 'description';
  }

  getModuleLabel(module: string): string {
    return this.moduleLabels[module] || module;
  }

  trackByResultId(index: number, result: SearchResult): string {
    return result.id;
  }
}