import {
  BreadcrumbService
} from "./chunk-HC6FYXML.js";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  init_router
} from "./chunk-PPGSDIHY.js";
import {
  Subject,
  TestBed,
  init_core,
  init_esm,
  provideZonelessChangeDetection
} from "./chunk-S5YEWOSK.js";

// src/app/services/breadcrumb.service.spec.ts
init_core();
init_router();
init_esm();
describe("BreadcrumbService", () => {
  let service;
  let mockRouter;
  let mockActivatedRoute;
  let routerEventsSubject;
  beforeEach(() => {
    routerEventsSubject = new Subject();
    mockRouter = {
      events: routerEventsSubject.asObservable(),
      url: "/dashboard",
      navigate: jasmine.createSpy("navigate")
    };
    mockActivatedRoute = {
      root: {
        snapshot: {
          url: [],
          data: {}
        },
        firstChild: null
      }
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        BreadcrumbService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });
    service = TestBed.inject(BreadcrumbService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should show only Dashboard for dashboard route", () => {
    mockRouter.url = "/dashboard";
    routerEventsSubject.next(new NavigationEnd(1, "/dashboard", "/dashboard"));
    const breadcrumbs = service.breadcrumbs$();
    expect(breadcrumbs.length).toBe(1);
    expect(breadcrumbs[0].label).toBe("Dashboard");
    expect(breadcrumbs[0].route).toBeNull();
  });
  it("should convert kebab-case to Title Case", () => {
    mockRouter.url = "/modules/user-management";
    routerEventsSubject.next(new NavigationEnd(1, "/modules/user-management", "/modules/user-management"));
    const breadcrumbs = service.breadcrumbs$();
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[0].label).toBe("Dashboard");
    expect(breadcrumbs[0].route).toBe("/dashboard");
    expect(breadcrumbs[1].label).toBe("User Management");
    expect(breadcrumbs[1].route).toBeNull();
  });
  it("should add custom context for tabs", () => {
    mockRouter.url = "/modules/cms";
    routerEventsSubject.next(new NavigationEnd(1, "/modules/cms", "/modules/cms"));
    service.setContext("Analytics");
    const breadcrumbs = service.breadcrumbs$();
    expect(breadcrumbs.length).toBe(3);
    expect(breadcrumbs[0].label).toBe("Dashboard");
    expect(breadcrumbs[1].label).toBe("Cms");
    expect(breadcrumbs[2].label).toBe("Analytics");
    expect(breadcrumbs[2].route).toBeNull();
  });
  it("should clear custom context", () => {
    mockRouter.url = "/modules/cms";
    routerEventsSubject.next(new NavigationEnd(1, "/modules/cms", "/modules/cms"));
    service.setContext("Analytics");
    service.clearContext();
    const breadcrumbs = service.breadcrumbs$();
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[breadcrumbs.length - 1].route).toBeNull();
  });
  it("should make last segment non-clickable when no context", () => {
    mockRouter.url = "/search";
    routerEventsSubject.next(new NavigationEnd(1, "/search", "/search"));
    const breadcrumbs = service.breadcrumbs$();
    const lastSegment = breadcrumbs[breadcrumbs.length - 1];
    expect(lastSegment.route).toBeNull();
  });
  it("should make non-last segments clickable", () => {
    mockRouter.url = "/modules/user-management";
    routerEventsSubject.next(new NavigationEnd(1, "/modules/user-management", "/modules/user-management"));
    const breadcrumbs = service.breadcrumbs$();
    expect(breadcrumbs[0].route).toBe("/dashboard");
  });
  it('should not include "Pages" or "Modules" in labels', () => {
    mockRouter.url = "/modules/cms";
    routerEventsSubject.next(new NavigationEnd(1, "/modules/cms", "/modules/cms"));
    const breadcrumbs = service.breadcrumbs$();
    breadcrumbs.forEach((segment) => {
      expect(segment.label).not.toBe("Pages");
      expect(segment.label).not.toBe("Modules");
    });
  });
});
//# sourceMappingURL=spec-app-services-breadcrumb.service.spec.js.map
