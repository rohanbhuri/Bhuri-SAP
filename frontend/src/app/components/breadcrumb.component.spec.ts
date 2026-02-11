import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let breadcrumbService: jasmine.SpyObj<BreadcrumbService>;

  beforeEach(async () => {
    const breadcrumbServiceSpy = jasmine.createSpyObj('BreadcrumbService', [], {
      breadcrumbs$: signal([
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'CMS', route: null }
      ])
    });

    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BreadcrumbService, useValue: breadcrumbServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    breadcrumbService = TestBed.inject(BreadcrumbService) as jasmine.SpyObj<BreadcrumbService>;
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nav element with aria-label', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('should render clickable links for non-current segments', () => {
    const links = fixture.nativeElement.querySelectorAll('a.breadcrumb-link');
    expect(links.length).toBe(1);
    expect(links[0].textContent.trim()).toBe('Dashboard');
    // Verify the link has a routerLink directive (Angular will handle the actual navigation)
    expect(links[0].hasAttribute('ng-reflect-router-link') || links[0].getAttribute('href')).toBeTruthy();
  });

  it('should render non-clickable span for current page', () => {
    const currentSpan = fixture.nativeElement.querySelector('span.current');
    expect(currentSpan).toBeTruthy();
    expect(currentSpan.textContent.trim()).toBe('CMS');
  });

  it('should render chevron icons with aria-hidden', () => {
    const icons = fixture.nativeElement.querySelectorAll('mat-icon');
    expect(icons.length).toBe(1);
    expect(icons[0].getAttribute('aria-hidden')).toBe('true');
    expect(icons[0].textContent.trim()).toBe('chevron_right');
  });

  it('should not render chevron after last segment', () => {
    const segments = fixture.nativeElement.querySelectorAll('.breadcrumb > *');
    const lastElement = segments[segments.length - 1];
    expect(lastElement.tagName.toLowerCase()).not.toBe('mat-icon');
  });
});
