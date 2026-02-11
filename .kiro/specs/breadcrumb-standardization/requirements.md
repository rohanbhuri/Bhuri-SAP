# Requirements Document

## Introduction

This specification defines the standardization of breadcrumb navigation across the Angular frontend application. Currently, breadcrumbs are inconsistent, using hardcoded "Pages" and "Modules" prefixes, and lack clickable navigation. The goal is to create a unified, accessible breadcrumb system that uses "Dashboard" as the root level, provides clickable navigation, and dynamically displays active tab names for modules.

## Glossary

- **Breadcrumb**: A navigation component that shows the user's current location within the application hierarchy
- **Dashboard**: The home/root page of the application, serving as the starting point for all navigation paths
- **Module**: A major functional area of the application (e.g., User Management, CRM, Catalogue)
- **Active_Tab**: The currently selected tab within a module that has multiple tabs
- **Breadcrumb_Segment**: An individual clickable element within the breadcrumb trail
- **Router**: Angular's routing service for navigation between views
- **ARIA**: Accessible Rich Internet Applications - accessibility standards for web content

## Requirements

### Requirement 1: Remove Legacy Prefixes

**User Story:** As a user, I want breadcrumbs to show meaningful navigation paths, so that I can understand my location in the application without confusing prefixes.

#### Acceptance Criteria

1. WHEN viewing any page, THE System SHALL NOT display "Pages" as a breadcrumb prefix
2. WHEN viewing any module, THE System SHALL NOT display "Modules" as a breadcrumb prefix
3. WHEN viewing the Dashboard page, THE System SHALL display only "Dashboard" without any prefix
4. THE System SHALL remove all hardcoded "Pages" and "Modules" text from breadcrumb templates

### Requirement 2: Establish Dashboard as Root

**User Story:** As a user, I want "Dashboard" to be the starting point for all breadcrumbs, so that I have a consistent reference point for navigation.

#### Acceptance Criteria

1. WHEN viewing any module page, THE System SHALL display "Dashboard" as the first breadcrumb segment
2. WHEN viewing any non-dashboard page, THE System SHALL display "Dashboard" as the first breadcrumb segment
3. WHEN viewing the Dashboard page itself, THE System SHALL display only "Dashboard" without additional segments
4. THE System SHALL ensure "Dashboard" appears as the root level in all breadcrumb paths except on the Dashboard page itself

### Requirement 3: Implement Clickable Navigation

**User Story:** As a user, I want to click on breadcrumb segments to navigate, so that I can quickly move to parent pages without using the back button.

#### Acceptance Criteria

1. WHEN a breadcrumb segment is not the current page, THE System SHALL render it as a clickable link
2. WHEN a user clicks a breadcrumb segment, THE System SHALL navigate to the corresponding route using Angular Router
3. WHEN a breadcrumb segment represents the current page, THE System SHALL render it as non-clickable text
4. THE System SHALL provide visual feedback (hover state) for clickable breadcrumb segments
5. WHEN the "Dashboard" segment is clicked, THE System SHALL navigate to the dashboard route

### Requirement 4: Display Active Tab in Module Breadcrumbs

**User Story:** As a user navigating modules with tabs, I want to see the active tab name in the breadcrumb, so that I know exactly which section I'm viewing.

#### Acceptance Criteria

1. WHEN viewing a module with tabs, THE System SHALL display the active tab name as the final breadcrumb segment
2. WHEN the active tab changes within a module, THE System SHALL update the breadcrumb to reflect the new active tab
3. WHEN viewing a module without tabs, THE System SHALL display only "Dashboard > Module Name"
4. THE System SHALL format module breadcrumbs as "Dashboard > Module Name > Active Tab"

### Requirement 5: Apply Consistent Breadcrumb Format Across All Active Modules

**User Story:** As a user, I want consistent breadcrumb formatting across all active modules, so that navigation feels predictable and familiar.

#### Acceptance Criteria

1. THE System SHALL apply the standardized breadcrumb format to User Management module
2. THE System SHALL apply the standardized breadcrumb format to Client Management module
3. THE System SHALL apply the standardized breadcrumb format to Catalogue module
4. THE System SHALL apply the standardized breadcrumb format to Quotations module
5. THE System SHALL apply the standardized breadcrumb format to CMS module

### Requirement 6: Apply Consistent Breadcrumb Format to Non-Module Pages

**User Story:** As a user, I want consistent breadcrumb formatting on all pages, so that navigation is uniform throughout the application.

#### Acceptance Criteria

1. THE System SHALL apply the standardized breadcrumb format to the Global Search page
2. THE System SHALL apply the standardized breadcrumb format to any other pages that display breadcrumbs
3. WHEN viewing a non-module page, THE System SHALL display "Dashboard > Page Name" format

### Requirement 7: Maintain Accessibility Standards

**User Story:** As a user relying on assistive technologies, I want accessible breadcrumb navigation, so that I can navigate the application effectively.

#### Acceptance Criteria

1. THE System SHALL wrap breadcrumb navigation in a `<nav>` element with `aria-label="Breadcrumb"`
2. THE System SHALL use semantic HTML for breadcrumb links and text
3. WHEN rendering chevron icons, THE System SHALL mark them with `aria-hidden="true"`
4. THE System SHALL ensure breadcrumb links have sufficient color contrast for accessibility
5. THE System SHALL support keyboard navigation for all clickable breadcrumb segments

### Requirement 8: Preserve Visual Consistency

**User Story:** As a user, I want breadcrumbs to maintain the existing visual style, so that the interface remains familiar and cohesive.

#### Acceptance Criteria

1. THE System SHALL maintain the existing breadcrumb styling (font size, color, spacing)
2. THE System SHALL continue using Material Design icons for chevron separators
3. THE System SHALL preserve the visual distinction between clickable and current page segments
4. THE System SHALL ensure breadcrumbs integrate seamlessly with the existing page header design
