# Widget Standardization Guidelines

This document outlines the standard structure, aesthetics, and logic for all dashboard widgets in the Bhuri-SAP application. These standards ensure consistency across modules like User Management, CRM, Catalogue, CMS, and Quotations.

## 1. Component Architecture

All widgets MUST be implemented as **Standalone Components**.

```typescript
@Component({
  selector: 'app-MODULE-NAME-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `...`,
  styles: [`...`]
})
export class ModuleNameWidgetComponent implements OnInit { ... }
```

## 2. HTML Structure

Widgets follow a flexible container-based layout to support different view states.

### Basic Wrapper
All content should be wrapped in a div with the class `[module]-widget`.

```html
<div class="crm-widget">
  <!-- Header -->
  <div class="header">
    <div class="icon-container">
      <mat-icon>business_center</mat-icon>
    </div>
    <div class="title-section">
      <span class="subtitle">Brief description of the module</span>
    </div>
  </div>

  <!-- Body (Metrics/Content) -->
  <div class="metrics-grid">
    <!-- Metric Cards -->
  </div>

  <!-- Footer (Actions) -->
  <div class="action-section">
    <button mat-flat-button color="primary" (click)="navigate()">
      Open Module
    </button>
  </div>
</div>
```

### Advanced Components
- **Carousel/Slider**: For widgets with many metrics (e.g., CRM), use a slider wrapper with auto-sliding logic.
- **Progress Bars**: Use for visual representation of quotas or pipeline stages.

## 3. Aesthetics & Design System

### Colors & Gradients
- Use **Linear Gradients** (135deg) for icon containers to provide a premium look.
- Use `color-mix(in srgb, var(--theme-primary) 80%, #fff)` for subtle variations.
- Borders should be subtle: `1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent)`.

### View States (Normal vs. Expanded)
Widgets must adapt to their container size using `:host-context([data-view="expanded"])`.

| Attribute | Normal View | Expanded View |
| :--- | :--- | :--- |
| **Padding** | 12px - 20px | 24px - 32px |
| **Icon Size** | 32px - 48px | 48px - 64px |
| **Metric Text** | 1.4rem - 2rem | 2.2rem - 3rem |
| **Grid** | 1-2 columns | 4 columns |

### Micro-animations
- Hover effects on cards (`transform: translateY(-2px)`).
- Smooth transitions for sliders and progress bars.

## 4. Logic & Reactive Patterns

### State Management
- Use **Signals** (`signal()`) for all reactive data.
- Inject dependencies using the `inject()` function.

```typescript
private router = inject(Router);
private service = inject(ModuleService);

data = signal<any>(null);

ngOnInit() {
  this.loadData();
}
```

### Data Loading
- All data fetching should be handled in `ngOnInit`.
- Provide fallback/mock data or empty states in case of error.

### Navigation
- Use specific navigation methods (e.g., `openCrm()`, `navigateToModule()`).
- Support query parameters if the module has multiple tabs (e.g., `{ queryParams: { tab: 'analytics' } }`).

## 5. Summary of Standardized Widgets

| Widget | Primary Metric | Visual Style |
| :--- | :--- | :--- |
| **User Management** | Active Users | Dual Metric Grid |
| **CRM** | Pipeline Value | Auto-sliding Funnel Card |
| **Catalogue** | Total Products | 4-item Icon Grid |
| **CMS** | Content Status | Metric List with Trends |
| **Quotations** | Pending Quotes | Progress-based Pipeline |

---
> [!TIP]
> Always verify the widget looks good in both the "Compact" dashboard view and the "Expanded" focus mode.
