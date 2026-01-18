# Bhuri-SAP UI Design System

**Last Updated**: 2026-01-13  
**Purpose**: Design standards, theming documentation, and component patterns.

---

## 🎨 Design Principles
- **Premium Aesthetics**: Use gradients (135deg), subtle shadows, and hover micro-animations.
- **Responsiveness**: Mobile-first design with adaptive layouts for "Expanded" and "Compact" views.
- **Dynamic Theming**: Support for multi-brand color schemes and dark mode.

---

## 🧱 Theming System

### Core CSS Variables
All components must use these variables for colors instead of hardcoded hex values.

| Variable | Description |
| :--- | :--- |
| `--theme-primary` | Main brand color (from Brand Config) |
| `--theme-accent` | Highlight and CTA color |
| `--theme-surface` | Card and container backgrounds |
| `--theme-background` | Page-level background |
| `--theme-on-surface` | Primary text color |

### Status Colors
- **Success**: `--theme-success` (#4caf50)
- **Warning**: `--theme-warning` (#ff9800)
- **Error**: `--theme-error` (#f44336)

### Dark Mode
Dark mode is activated by the `.dark-theme` class on the `<body>`. The `ThemeService` handles automatic detection and persistence.

---

## 📐 Widget Standardization
Standard structure for all dashboard widgets to ensure consistency.

### Component Structure
- **Standalone**: All widgets must be `standalone: true`.
- **States**: Use **Signals** (`signal()`) for reactive data management.
- **Injection**: Use the `inject()` function for dependencies.

### HTML Pattern
```html
<div class="module-widget">
  <div class="header">
    <div class="icon-container"><!-- Gradient icon --></div>
    <div class="title-section">
      <h3>Title</h3>
      <span class="subtitle">Description</span>
    </div>
  </div>
  <div class="metrics-grid">
    <!-- 2x2 or 4x1 grid of stats -->
  </div>
  <div class="action-section">
    <button mat-flat-button color="primary">Open Module</button>
  </div>
</div>
```

---

## 💠 Component Patterns

### Cards & Surfaces
- **Themed Card**: `background: var(--theme-surface); border: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);`
- **Hover Effect**: `transform: translateY(-2px); shadow: 0 8px 25px ...`

### Buttons
- **Primary**: Uses `--theme-primary` with contrast text.
- **Secondary**: Outlined button with `--theme-secondary`.

### Status Badges
Use `color-mix` for pill-style backgrounds:
```scss
.badge-success {
  background: color-mix(in srgb, var(--theme-success) 15%, transparent);
  color: var(--theme-success);
}
```

---

## 📱 Mobile & Accessibility
- **Touch Targets**: Minimum 44px for interactive elements.
- **Reduced Motion**: Respects `prefers-reduced-motion` media query.
- **High Contrast**: Enhanced borders for WCAG compliance under high-contrast settings.
