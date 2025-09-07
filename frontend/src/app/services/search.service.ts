import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

// Dynamic API URL based on current port
const getApiUrl = () => {
  const port = window.location.port;
  const basePort = port === '4200' ? '3000' : port === '4201' ? '3001' : '3000';
  return `http://localhost:${basePort}/api`;
};

// Default enabled modules for search
const DEFAULT_MODULES = [
  'user-management',
  'hr-management', 
  'projects-management',
  'tasks-management',
  'crm',
  'organization-management'
];

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  module: string;
  relevance: number;
  metadata?: any;
}

export interface SearchFilters {
  modules?: string[];
  types?: string[];
  dateRange?: { from: Date; to: Date };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${getApiUrl()}/search`;
  private searchCache = new Map<string, { data: SearchResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  search(query: string, filters?: SearchFilters, limit: number = 50): Observable<SearchResponse> {
    if (!query || query.trim().length < 2) {
      return of({ results: [], total: 0, query: '', suggestions: [] });
    }

    const cacheKey = this.getCacheKey(query, filters, limit);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return of(cached);
    }

    let params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    // Add organization context if available
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.organizationId) {
      params = params.set('organizationId', currentUser.organizationId);
    }

    // Add filters - use defaults if none provided
    const modulesToSearch = filters?.modules?.length ? filters.modules : DEFAULT_MODULES;
    params = params.set('modules', modulesToSearch.join(','));

    if (filters?.types?.length) {
      params = params.set('types', filters.types.join(','));
    }

    // Get both search results and suggestions
    const searchRequest = this.http.get<SearchResponse>(`${this.apiUrl}`, { params });
    const suggestionsRequest = this.getSuggestions(query);

    return forkJoin({
      search: searchRequest,
      suggestions: suggestionsRequest
    }).pipe(
      map(({ search, suggestions }) => {
        const result = {
          ...search,
          suggestions: suggestions.suggestions
        };
        this.setCache(cacheKey, result);
        return result;
      }),
      catchError(error => {
        console.error('Search error:', error);
        const fallback = { results: [], total: 0, query, suggestions: [] };
        return of(fallback);
      })
    );
  }

  getSuggestions(query: string): Observable<{ suggestions: string[] }> {
    if (!query || query.trim().length < 2) {
      return of({ suggestions: [] });
    }

    let params = new HttpParams().set('q', query.trim());

    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.organizationId) {
      params = params.set('organizationId', currentUser.organizationId);
    }

    return this.http.get<{ suggestions: string[] }>(`${this.apiUrl}/suggestions`, { params })
      .pipe(
        catchError(error => {
          console.error('Suggestions error:', error);
          return of({ suggestions: [] });
        })
      );
  }

  // Quick search for navbar/header search
  quickSearch(query: string, limit: number = 10): Observable<SearchResult[]> {
    return this.search(query, undefined, limit).pipe(
      map(response => response.results)
    );
  }

  // Search within specific module
  searchInModule(query: string, module: string, limit: number = 20): Observable<SearchResult[]> {
    const filters: SearchFilters = { modules: [module] };
    return this.search(query, filters, limit).pipe(
      map(response => response.results)
    );
  }

  // Search by type
  searchByType(query: string, type: string, limit: number = 20): Observable<SearchResult[]> {
    const filters: SearchFilters = { types: [type] };
    return this.search(query, filters, limit).pipe(
      map(response => response.results)
    );
  }

  // Advanced search with multiple filters
  advancedSearch(
    query: string,
    modules?: string[],
    types?: string[],
    dateRange?: { from: Date; to: Date },
    limit: number = 50
  ): Observable<SearchResponse> {
    const filters: SearchFilters = {
      modules,
      types,
      dateRange
    };

    return this.search(query, filters, limit);
  }

  // Cache management
  private getCacheKey(query: string, filters?: SearchFilters, limit?: number): string {
    return JSON.stringify({ query: query.toLowerCase(), filters, limit });
  }

  private getFromCache(key: string): SearchResponse | null {
    const cached = this.searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    if (cached) {
      this.searchCache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: SearchResponse): void {
    this.searchCache.set(key, { data, timestamp: Date.now() });
    // Clean old cache entries
    if (this.searchCache.size > 100) {
      const oldestKey = this.searchCache.keys().next().value;
      if (oldestKey) {
        this.searchCache.delete(oldestKey);
      }
    }
  }

  clearCache(): void {
    this.searchCache.clear();
  }
}