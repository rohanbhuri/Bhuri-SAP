import {
  MatIconModule,
  init_icon
} from "./chunk-ECNNNQ5B.js";
import {
  BreadcrumbService
} from "./chunk-HC6FYXML.js";
import {
  RouterModule,
  init_router,
  provideRouter
} from "./chunk-PPGSDIHY.js";
import {
  CommonModule,
  Component,
  TestBed,
  __async,
  __decorate,
  init_common,
  init_core,
  init_tslib_es6,
  inject,
  provideZonelessChangeDetection,
  signal
} from "./chunk-S5YEWOSK.js";

// src/app/components/breadcrumb.component.ts
init_tslib_es6();

// angular:jit:style:inline:src/app/components/breadcrumb.component.ts;CiAgICAuYnJlYWRjcnVtYiB7CiAgICAgIGRpc3BsYXk6IGZsZXg7CiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICAgIGdhcDogMC41cmVtOwogICAgICBjb2xvcjogIzY2NjsKICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTsKICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTsKICAgIH0KCiAgICAuYnJlYWRjcnVtYi1saW5rIHsKICAgICAgY29sb3I6ICM2NjY7CiAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTsKICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4yczsKICAgIH0KCiAgICAuYnJlYWRjcnVtYi1saW5rOmhvdmVyIHsKICAgICAgY29sb3I6ICMzMzM7CiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOwogICAgfQoKICAgIC5icmVhZGNydW1iIC5jdXJyZW50IHsKICAgICAgY29sb3I6ICMzMzM7CiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7CiAgICB9CgogICAgLmJyZWFkY3J1bWIgbWF0LWljb24gewogICAgICBmb250LXNpemU6IDFyZW07CiAgICAgIHdpZHRoOiAxcmVtOwogICAgICBoZWlnaHQ6IDFyZW07CiAgICAgIGNvbG9yOiAjOTk5OwogICAgfQogIA==
var breadcrumb_component_default = "/* angular:styles/component:scss;61f854dde4789b426ee80fd5ac2f889d5b64408c89bbfba791c1ab999dd80558;/Users/rvshekhar/Desktop/Projects_Dev/Bhuri-SAP/frontend/src/app/components/breadcrumb.component.ts */\n.breadcrumb {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #666;\n  font-size: 0.875rem;\n  margin-bottom: 1rem;\n}\n.breadcrumb-link {\n  color: #666;\n  text-decoration: none;\n  transition: color 0.2s;\n}\n.breadcrumb-link:hover {\n  color: #333;\n  text-decoration: underline;\n}\n.breadcrumb .current {\n  color: #333;\n  font-weight: 500;\n}\n.breadcrumb mat-icon {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  color: #999;\n}\n/*# sourceMappingURL=breadcrumb.component.css.map */\n";

// src/app/components/breadcrumb.component.ts
init_core();
init_common();
init_router();
init_icon();
var BreadcrumbComponent = class BreadcrumbComponent2 {
  breadcrumbService = inject(BreadcrumbService);
  breadcrumbs = this.breadcrumbService.breadcrumbs$;
};
BreadcrumbComponent = __decorate([
  Component({
    selector: "app-breadcrumb",
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule],
    template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (segment of breadcrumbs(); track segment.label; let isLast = $last) {
        @if (!isLast && segment.route) {
          <a [routerLink]="segment.route" class="breadcrumb-link">
            {{ segment.label }}
          </a>
        } @else {
          <span [class.current]="isLast">{{ segment.label }}</span>
        }
        @if (!isLast) {
          <mat-icon aria-hidden="true">chevron_right</mat-icon>
        }
      }
    </nav>
  `,
    styles: [breadcrumb_component_default]
  })
], BreadcrumbComponent);

// src/app/components/breadcrumb.component.spec.ts
init_core();
init_router();
describe("BreadcrumbComponent", () => {
  let component;
  let fixture;
  let breadcrumbService;
  beforeEach(() => __async(null, null, function* () {
    const breadcrumbServiceSpy = jasmine.createSpyObj("BreadcrumbService", [], {
      breadcrumbs$: signal([
        { label: "Dashboard", route: "/dashboard" },
        { label: "CMS", route: null }
      ])
    });
    yield TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BreadcrumbService, useValue: breadcrumbServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should render nav element with aria-label", () => {
    const nav = fixture.nativeElement.querySelector("nav");
    expect(nav).toBeTruthy();
    expect(nav.getAttribute("aria-label")).toBe("Breadcrumb");
  });
  it("should render clickable links for non-current segments", () => {
    const links = fixture.nativeElement.querySelectorAll("a.breadcrumb-link");
    expect(links.length).toBe(1);
    expect(links[0].textContent.trim()).toBe("Dashboard");
    expect(links[0].hasAttribute("ng-reflect-router-link") || links[0].getAttribute("href")).toBeTruthy();
  });
  it("should render non-clickable span for current page", () => {
    const currentSpan = fixture.nativeElement.querySelector("span.current");
    expect(currentSpan).toBeTruthy();
    expect(currentSpan.textContent.trim()).toBe("CMS");
  });
  it("should render chevron icons with aria-hidden", () => {
    const icons = fixture.nativeElement.querySelectorAll("mat-icon");
    expect(icons.length).toBe(1);
    expect(icons[0].getAttribute("aria-hidden")).toBe("true");
    expect(icons[0].textContent.trim()).toBe("chevron_right");
  });
  it("should not render chevron after last segment", () => {
    const segments = fixture.nativeElement.querySelectorAll(".breadcrumb > *");
    const lastElement = segments[segments.length - 1];
    expect(lastElement.tagName.toLowerCase()).not.toBe("mat-icon");
  });
});
//# sourceMappingURL=spec-app-components-breadcrumb.component.spec.js.map
