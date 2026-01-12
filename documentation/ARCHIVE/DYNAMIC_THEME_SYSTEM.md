# Dynamic Theme System Documentation

## Overview
The Bhuri-SAP platform uses a comprehensive dynamic theme system that supports:
- **Light/Dark Mode**: Automatic system preference detection with manual override
- **Brand Colors**: Primary, secondary, and accent colors from brand configuration
- **Organization Themes**: Custom themes per organization
- **Module Themes**: Specific color schemes for different modules
- **Accessibility**: High contrast support and reduced motion preferences

## Architecture

### Core Services
1. **ThemeService** - Main theme management
2. **BrandConfigService** - Brand-specific configurations
3. **PreferencesService** - User preference storage

### CSS Variables Structure
```css
:root {
  /* Primary Theme Colors */
  --theme-primary: #1976d2;
  --theme-secondary: #dc004e;
  --theme-accent: #ffc107;
  
  /* Surface Colors */
  --theme-background: #fafafa;
  --theme-surface: #ffffff;
  --theme-on-surface: #212121;
  --theme-on-primary: #ffffff;
  
  /* Status Colors */
  --theme-success: #4caf50;
  --theme-warning: #ff9800;
  --theme-error: #f44336;
  
  /* Accessibility */
  --focus-outline: 2px solid var(--theme-primary);
  --border-radius: 8px;
  --transition: all 0.2s ease-in-out;
}
```

## Implementation Guide

### 1. Component Theme Integration

#### Basic Theme Usage
```typescript
// Component styles using CSS variables
.component-card {
  background-color: var(--theme-surface);
  color: var(--theme-on-surface);
  border: 1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent);
}

.primary-button {
  background-color: var(--theme-primary);
  color: var(--theme-on-primary);
}

.accent-element {
  background-color: color-mix(in srgb, var(--theme-accent) 15%, transparent);
  color: var(--theme-accent);
}
```

#### Advanced Theme Features
```typescript
// Gradient backgrounds
.header-card {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--theme-primary) 10%, var(--theme-surface)),
    color-mix(in srgb, var(--theme-accent) 5%, var(--theme-surface))
  );
}

// Hover effects
.interactive-element:hover {
  background-color: color-mix(in srgb, var(--theme-primary) 8%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 25%, transparent);
}
```

### 2. Theme Service Usage

#### Applying Themes
```typescript
import { ThemeService } from './services/theme.service';

export class MyComponent {
  private themeService = inject(ThemeService);
  
  ngOnInit() {
    // Load user theme preferences
    this.themeService.loadAndApplyUserTheme();
    
    // Apply module-specific theme
    this.themeService.setModuleTheme({
      id: 'user-management',
      name: 'User Management',
      colors: {
        primary: '#2196f3',
        accent: '#ff9800'
      },
      enabled: true
    });
  }
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

### 3. Brand Configuration

#### Brand Colors Setup
```javascript
// config.js
const configs = {
  "brand-name": {
    colors: {
      primary: "#3B82F6",    // Main brand color
      secondary: "#6B7280",  // Secondary actions
      accent: "#F59E0B"      // Highlights and CTAs
    }
  }
}
```

## Component Patterns

### 1. Card Components
```scss
.themed-card {
  background: var(--theme-surface);
  border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
  }
  
  // Dark theme specific
  :host-context(body.dark-theme) & {
    border-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}
```

### 2. Interactive Elements
```scss
.themed-button {
  background-color: var(--theme-primary);
  color: var(--theme-on-primary);
  border: none;
  border-radius: var(--border-radius);
  transition: var(--transition);
  
  &:hover {
    background-color: color-mix(in srgb, var(--theme-primary) 85%, black);
    transform: translateY(-1px);
  }
  
  &:focus-visible {
    outline: var(--focus-outline);
    outline-offset: 2px;
  }
}

.secondary-button {
  background-color: transparent;
  color: var(--theme-secondary);
  border: 1px solid var(--theme-secondary);
  
  &:hover {
    background-color: color-mix(in srgb, var(--theme-secondary) 10%, transparent);
  }
}
```

### 3. Status Indicators
```scss
.status-indicators {
  .success {
    background-color: color-mix(in srgb, var(--theme-success) 15%, transparent);
    color: var(--theme-success);
    border: 1px solid color-mix(in srgb, var(--theme-success) 30%, transparent);
  }
  
  .warning {
    background-color: color-mix(in srgb, var(--theme-warning) 15%, transparent);
    color: var(--theme-warning);
    border: 1px solid color-mix(in srgb, var(--theme-warning) 30%, transparent);
  }
  
  .error {
    background-color: color-mix(in srgb, var(--theme-error) 15%, transparent);
    color: var(--theme-error);
    border: 1px solid color-mix(in srgb, var(--theme-error) 30%, transparent);
  }
}
```

## Accessibility Features

### 1. High Contrast Support
```scss
@media (prefers-contrast: high) {
  :root {
    --focus-outline: 3px solid;
  }
  
  .themed-card {
    border: 2px solid var(--theme-on-surface);
  }
  
  .themed-button {
    border: 2px solid currentColor;
  }
}
```

### 2. Reduced Motion Support
```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Focus Management
```scss
*:focus-visible {
  outline: var(--focus-outline);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  
  &:focus {
    left: 16px;
    top: 16px;
    background: var(--theme-primary);
    color: var(--theme-on-primary);
    padding: 8px 12px;
    border-radius: 6px;
    z-index: 10000;
  }
}
```

## Dark Theme Specifications

### Color Adjustments
```scss
body.dark-theme {
  --theme-background: #121212;
  --theme-surface: #1e1e1e;
  --theme-on-surface: #e0e0e0;
  --theme-on-primary: #000000;
  
  // Enhanced contrast for better readability
  .mat-mdc-card {
    background-color: var(--theme-surface);
    border: 1px solid color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
  }
  
  .mat-mdc-form-field .mat-mdc-text-field-wrapper {
    background-color: #2d2d2d;
  }
  
  // Better text hierarchy
  h1, h2, h3, h4, h5, h6 {
    color: #ffffff;
  }
  
  p {
    color: #e0e0e0;
  }
}
```

## Module-Specific Themes

### Implementation
```typescript
// Module theme configuration
const moduleThemes = {
  'user-management': {
    primary: '#2196f3',
    accent: '#ff9800',
    secondary: '#607d8b'
  },
  'project-management': {
    primary: '#4caf50',
    accent: '#ffc107',
    secondary: '#795548'
  },
  'crm': {
    primary: '#9c27b0',
    accent: '#e91e63',
    secondary: '#673ab7'
  }
};

// Apply module theme
this.themeService.setModuleTheme({
  id: moduleId,
  name: moduleName,
  colors: moduleThemes[moduleId],
  enabled: true
});
```

## Best Practices

### 1. Color Usage Guidelines
- **Primary**: Main brand actions, navigation, key CTAs
- **Secondary**: Supporting actions, less prominent elements
- **Accent**: Highlights, notifications, special states
- **Surface**: Card backgrounds, elevated elements
- **Background**: Page background, main content area

### 2. Contrast Requirements
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Use `color-mix()` for transparent overlays
- Test with high contrast mode

### 3. Animation Guidelines
- Use `var(--transition)` for consistent timing
- Respect `prefers-reduced-motion`
- Keep animations subtle and purposeful
- Maximum 300ms for micro-interactions

### 4. Component Development
- Always use CSS variables for colors
- Include dark theme variants
- Test with different brand configurations
- Ensure keyboard navigation works
- Add proper ARIA labels

## Testing Checklist

### Theme Switching
- [ ] Light to dark mode transition
- [ ] System preference detection
- [ ] User preference persistence
- [ ] Brand color application
- [ ] Module theme switching

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] Color contrast ratios

### Responsive Design
- [ ] Mobile layout adaptation
- [ ] Tablet breakpoints
- [ ] Desktop optimization
- [ ] Touch target sizes
- [ ] Readable font sizes

### Cross-Browser Support
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Troubleshooting

### Common Issues
1. **Colors not updating**: Check CSS variable cascade
2. **Dark theme not applying**: Verify body class application
3. **Brand colors missing**: Ensure config.js is loaded
4. **Module themes conflicting**: Clear previous theme before applying new one

### Debug Tools
```typescript
// Theme debugging
console.log('Current theme:', this.themeService.getCurrentTheme());
console.log('CSS variables:', getComputedStyle(document.documentElement));
console.log('Brand config:', this.brandConfig.getColors());
```

## Future Enhancements

### Planned Features
- [ ] Custom theme builder UI
- [ ] Theme preview mode
- [ ] Seasonal theme variations
- [ ] Advanced color palette generation
- [ ] Theme export/import functionality
- [ ] Real-time theme collaboration
- [ ] AI-powered theme suggestions

### Performance Optimizations
- [ ] CSS variable caching
- [ ] Lazy theme loading
- [ ] Critical CSS extraction
- [ ] Theme preloading
- [ ] Reduced paint operations