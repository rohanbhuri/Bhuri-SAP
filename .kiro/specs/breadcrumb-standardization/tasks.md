# Implementation Plan: Breadcrumb Standardization

## Overview

This implementation plan converts the breadcrumb standardization design into discrete coding tasks. The approach follows an incremental strategy: first creating the core service and component, then integrating them into existing pages, and finally adding comprehensive testing. Each task builds on previous work to ensure the system remains functional throughout development.

## Tasks

- [x] 1. Create BreadcrumbService with core functionality
  - Create `frontend/src/app/services/breadcrumb.service.ts`
  - Implement `BreadcrumbSegment` interface with label, route, and optional icon
  - Implement service with signal-based state management
  - Add router event subscription to auto-update breadcrumbs on navigation
  - Implement `updateBreadcrumbs()` method to generate trail from current route
  - Implement `setContext()` and `clearContext()` methods for tab support
  - Add fallback logic for routes without breadcrumb metadata (convert kebab-case to Title Case)
  - _Requirements: 2.1, 2.2, 2.4, 4.2_

- [ ]* 1.1 Write property test for Dashboard root consistency
  - **Property 1: Dashboard Root Consistency**
  - **Validates: Requirements 2.1, 2.2, 2.4**

- [ ]* 1.2 Write property test for legacy prefix removal
  - **Property 2: Legacy Prefix Removal**
  - **Validates: Requirements 1.1, 1.2**

- [x] 2. Create BreadcrumbComponent
  - Create `frontend/src/app/components/breadcrumb.component.ts` as standalone component
  - Inject BreadcrumbService and expose breadcrumbs signal
  - Implement template with nav element and aria-label="Breadcrumb"
  - Render clickable links for non-current segments using routerLink
  - Render non-clickable span for current page segment
  - Add Material Design chevron icons with aria-hidden="true"
  - Apply existing breadcrumb CSS classes for visual consistency
  - _Requirements: 3.1, 3.2, 3.3, 7.1, 7.3, 8.2_

- [ ]* 2.1 Write property test for current page non-clickability
  - **Property 3: Current Page Non-Clickability**
  - **Validates: Requirements 3.3**

- [ ]* 2.2 Write property test for non-current segments clickable
  - **Property 4: Non-Current Segments Clickable**
  - **Validates: Requirements 3.1**

- [ ]* 2.3 Write property test for accessibility nav element
  - **Property 11: Accessibility Nav Element**
  - **Validates: Requirements 7.1**

- [ ]* 2.4 Write property test for accessibility chevron icons
  - **Property 12: Accessibility Chevron Icons**
  - **Validates: Requirements 7.3**

- [x] 3. Update Angular route configuration with breadcrumb metadata
  - Add breadcrumb data to dashboard route: `{ breadcrumb: 'Dashboard' }`
  - Add breadcrumb data to active module routes:
    - User Management: `{ breadcrumb: 'User Management' }`
    - Client Management: `{ breadcrumb: 'Client Management' }`
    - Catalogue: `{ breadcrumb: 'Catalogue' }`
    - Quotations: `{ breadcrumb: 'Quotations' }`
    - CMS: `{ breadcrumb: 'CMS' }`
  - Add breadcrumb data to Global Search route: `{ breadcrumb: 'Global Search' }`
  - _Requirements: 5.1-5.5, 6.1_

- [x] 4. Replace hardcoded breadcrumbs in Dashboard component
  - Remove hardcoded breadcrumb HTML from `dashboard.component.ts` template
  - Import and add BreadcrumbComponent to imports array
  - Add `<app-breadcrumb></app-breadcrumb>` in page header
  - Verify Dashboard shows only "Dashboard" without prefix
  - _Requirements: 1.3, 2.3_

- [ ]* 4.1 Write unit test for Dashboard page breadcrumb
  - Test that Dashboard page shows exactly one segment: "Dashboard"
  - **Validates: Requirements 1.3, 2.3**

- [x] 5. Replace hardcoded breadcrumbs in module components with tabs
  - Update User Management module (`user-management.component.ts` and `user-management-layout.component.ts`)
  - Update Client Management module (`client-management.component.ts`)
  - Update Catalogue module (`catalogue.component.ts`)
  - Update Quotations module (`quotations.component.ts`)
  - Update CMS module (`cms.component.ts`)
  - For each: remove hardcoded breadcrumb HTML, import BreadcrumbComponent, add `<app-breadcrumb>`
  - Inject BreadcrumbService in component class
  - Call `breadcrumbService.setContext(tabName)` when active tab changes
  - Call `breadcrumbService.clearContext()` in ngOnDestroy
  - Verify format: "Dashboard > Module Name > Active Tab"
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 4.1, 4.2, 4.4_

- [ ]* 5.1 Write property test for module with tabs format
  - **Property 7: Module With Tabs Format**
  - **Validates: Requirements 4.1, 4.4**

- [ ]* 5.2 Write property test for tab context updates
  - **Property 6: Tab Context Updates**
  - **Validates: Requirements 4.2**

- [x] 6. Replace hardcoded breadcrumbs in non-module pages
  - Update Global Search page (`search.component.ts`)
  - Remove hardcoded breadcrumb HTML
  - Import and add BreadcrumbComponent
  - Add `<app-breadcrumb></app-breadcrumb>` in page header
  - Verify format: "Dashboard > Global Search"
  - _Requirements: 6.1, 6.3_

- [ ]* 6.1 Write property test for non-module page format
  - **Property 9: Non-Module Page Format**
  - **Validates: Requirements 6.3**

- [x] 7. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Manually verify breadcrumbs on Dashboard, all 5 active modules, and search page
  - Verify clickable navigation works correctly
  - Verify tab switching updates breadcrumbs in modules
  - Ask the user if questions arise

- [ ]* 8. Write property test for clickable segment navigation
  - **Property 5: Clickable Segment Navigation**
  - **Validates: Requirements 3.2**

- [ ]* 9. Write property test for keyboard navigation support
  - **Property 13: Keyboard Navigation Support**
  - **Validates: Requirements 7.5**

- [ ]* 10. Write property test for dashboard page simplicity
  - **Property 10: Dashboard Page Simplicity**
  - **Validates: Requirements 1.3, 2.3**

- [ ]* 11. Write integration tests
  - Test breadcrumb updates across actual route navigation
  - Test breadcrumb component integrates correctly in page headers
  - Test tab switching in modules updates breadcrumbs
  - Test keyboard navigation works for breadcrumb links
  - _Requirements: 3.5, 7.5_

- [x] 12. Final checkpoint - Verify complete implementation
  - Run full test suite (unit + property + integration tests)
  - Manually test all 5 active modules (User Management, Client Management, Catalogue, Quotations, CMS) and pages
  - Verify accessibility with screen reader
  - Verify keyboard navigation works throughout
  - Ensure visual consistency with existing design
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows Angular best practices with standalone components and signals
