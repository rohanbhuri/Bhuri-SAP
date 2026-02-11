import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbSegment {
  label: string;
  route: string | null;  // null for current page (non-clickable)
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  
  private breadcrumbs = signal<BreadcrumbSegment[]>([]);
  private customContext = signal<string | null>(null);
  
  // Public readonly signal
  breadcrumbs$ = this.breadcrumbs.asReadonly();

  constructor() {
    // Subscribe to router events to auto-update breadcrumbs on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateBreadcrumbs());
    
    // Initialize breadcrumbs for current route
    this.updateBreadcrumbs();
  }

  /**
   * Generate breadcrumbs from current route
   */
  private updateBreadcrumbs(): void {
    try {
      // Guard against router being undefined during component destruction
      if (!this.router || !this.router.url) {
        return;
      }
      
      const breadcrumbTrail: BreadcrumbSegment[] = [];
      const currentUrl = this.router.url.split('?')[0]; // Remove query params
      
      // Special case: Dashboard page shows only "Dashboard"
      if (currentUrl === '/dashboard' || currentUrl === '/') {
        breadcrumbTrail.push({
          label: 'Dashboard',
          route: null
        });
        this.breadcrumbs.set(breadcrumbTrail);
        return;
      }
      
      // For all other pages, start with Dashboard as root
      breadcrumbTrail.push({
        label: 'Dashboard',
        route: '/dashboard'
      });
      
      // Build breadcrumb trail from route tree
      let route = this.activatedRoute.root;
      const urlSegments: string[] = [];
      const addedLabels = new Set<string>(['Dashboard']); // Track added labels to avoid duplicates
      
      while (route) {
        if (route.snapshot.url.length > 0) {
          route.snapshot.url.forEach(segment => {
            urlSegments.push(segment.path);
          });
        }
        
        // Check for breadcrumb metadata in route data
        if (route.snapshot.data['breadcrumb']) {
          const breadcrumbLabel = route.snapshot.data['breadcrumb'];
          
          // Don't add if it's the Dashboard (already added) or if we've already added this label
          if (breadcrumbLabel !== 'Dashboard' && !addedLabels.has(breadcrumbLabel)) {
            const routePath = '/' + urlSegments.join('/');
            breadcrumbTrail.push({
              label: breadcrumbLabel,
              route: routePath
            });
            addedLabels.add(breadcrumbLabel);
          }
        }
        
        route = route.firstChild!;
      }
      
      // If no breadcrumb metadata found, generate from URL
      if (breadcrumbTrail.length === 1) {
        const pathSegments = currentUrl.split('/').filter(s => s);
        let accumulatedPath = '';
        
        pathSegments.forEach((segment, index) => {
          accumulatedPath += '/' + segment;
          
          // Skip "modules" prefix
          if (segment === 'modules') {
            return;
          }
          
          // Convert kebab-case to Title Case
          const label = this.kebabToTitleCase(segment);
          
          breadcrumbTrail.push({
            label,
            route: accumulatedPath
          });
        });
      }
      
      // Add custom context (for tabs) if set
      if (this.customContext()) {
        // When there's a tab context, make the previous segment (module) clickable
        if (breadcrumbTrail.length > 1) {
          // The last segment should be the module, make it clickable
          const lastSegment = breadcrumbTrail[breadcrumbTrail.length - 1];
          if (lastSegment.route === null) {
            // Reconstruct the route from the current URL (without query params)
            lastSegment.route = currentUrl;
          }
        }
        
        // Add the tab as the final non-clickable segment
        breadcrumbTrail.push({
          label: this.customContext()!,
          route: null
        });
      } else {
        // Make the last segment non-clickable (current page)
        if (breadcrumbTrail.length > 0) {
          breadcrumbTrail[breadcrumbTrail.length - 1].route = null;
        }
      }
      
      this.breadcrumbs.set(breadcrumbTrail);
    } catch (error) {
      // Silently fail during component destruction
      console.debug('BreadcrumbService: Unable to update breadcrumbs', error);
    }
  }

  /**
   * Set custom breadcrumb context (e.g., active tab name)
   */
  setContext(context: string): void {
    this.customContext.set(context);
    this.updateBreadcrumbs();
  }

  /**
   * Clear custom breadcrumb context
   */
  clearContext(): void {
    this.customContext.set(null);
    this.updateBreadcrumbs();
  }

  /**
   * Convert kebab-case to Title Case
   * Example: 'user-management' -> 'User Management'
   */
  private kebabToTitleCase(kebabStr: string): string {
    return kebabStr
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
