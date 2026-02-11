import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  init_router
} from "./chunk-PPGSDIHY.js";
import {
  Injectable,
  __decorate,
  filter,
  init_core,
  init_operators,
  init_tslib_es6,
  inject,
  signal
} from "./chunk-S5YEWOSK.js";

// src/app/services/breadcrumb.service.ts
init_tslib_es6();
init_core();
init_router();
init_operators();
var BreadcrumbService = class BreadcrumbService2 {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  breadcrumbs = signal([]);
  customContext = signal(null);
  // Public readonly signal
  breadcrumbs$ = this.breadcrumbs.asReadonly();
  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.updateBreadcrumbs());
    this.updateBreadcrumbs();
  }
  /**
   * Generate breadcrumbs from current route
   */
  updateBreadcrumbs() {
    const breadcrumbTrail = [];
    const currentUrl = this.router.url.split("?")[0];
    if (currentUrl === "/dashboard" || currentUrl === "/") {
      breadcrumbTrail.push({
        label: "Dashboard",
        route: null
      });
      this.breadcrumbs.set(breadcrumbTrail);
      return;
    }
    breadcrumbTrail.push({
      label: "Dashboard",
      route: "/dashboard"
    });
    let route = this.activatedRoute.root;
    const urlSegments = [];
    while (route) {
      if (route.snapshot.url.length > 0) {
        route.snapshot.url.forEach((segment) => {
          urlSegments.push(segment.path);
        });
      }
      if (route.snapshot.data["breadcrumb"]) {
        const breadcrumbLabel = route.snapshot.data["breadcrumb"];
        const routePath = "/" + urlSegments.join("/");
        if (breadcrumbLabel !== "Dashboard") {
          breadcrumbTrail.push({
            label: breadcrumbLabel,
            route: routePath
          });
        }
      }
      route = route.firstChild;
    }
    if (breadcrumbTrail.length === 1) {
      const pathSegments = currentUrl.split("/").filter((s) => s);
      let accumulatedPath = "";
      pathSegments.forEach((segment, index) => {
        accumulatedPath += "/" + segment;
        if (segment === "modules") {
          return;
        }
        const label = this.kebabToTitleCase(segment);
        breadcrumbTrail.push({
          label,
          route: accumulatedPath
        });
      });
    }
    if (this.customContext()) {
      breadcrumbTrail.push({
        label: this.customContext(),
        route: null
      });
    } else {
      if (breadcrumbTrail.length > 0) {
        breadcrumbTrail[breadcrumbTrail.length - 1].route = null;
      }
    }
    this.breadcrumbs.set(breadcrumbTrail);
  }
  /**
   * Set custom breadcrumb context (e.g., active tab name)
   */
  setContext(context) {
    this.customContext.set(context);
    this.updateBreadcrumbs();
  }
  /**
   * Clear custom breadcrumb context
   */
  clearContext() {
    this.customContext.set(null);
    this.updateBreadcrumbs();
  }
  /**
   * Convert kebab-case to Title Case
   * Example: 'user-management' -> 'User Management'
   */
  kebabToTitleCase(kebabStr) {
    return kebabStr.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  }
  static ctorParameters = () => [];
};
BreadcrumbService = __decorate([
  Injectable({
    providedIn: "root"
  })
], BreadcrumbService);

export {
  BreadcrumbService
};
//# sourceMappingURL=chunk-HC6FYXML.js.map
