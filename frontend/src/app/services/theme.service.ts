import { Injectable, Inject, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreferencesService } from './preferences.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  onSurface: string;
  onPrimary: string;
  success: string;
  warning: string;
  error: string;
}

export interface ModuleTheme {
  id: string;
  name: string;
  colors: Partial<ThemeColors>;
  enabled: boolean;
}

const MODULE_THEMES: Record<string, Partial<ThemeColors>> = {
  'user-management': { primary: '#2196f3', accent: '#ff9800', secondary: '#607d8b' },
  'organization-management': { primary: '#4caf50', accent: '#ffc107', secondary: '#795548' },
  'project-management': { primary: '#9c27b0', accent: '#e91e63', secondary: '#673ab7' },
  'crm': { primary: '#ff5722', accent: '#00bcd4', secondary: '#3f51b5' },
  'hr-management': { primary: '#8bc34a', accent: '#ff9800', secondary: '#607d8b' },
  'tasks-management': { primary: '#f44336', accent: '#ffeb3b', secondary: '#9e9e9e' },
  'project-tracking': { primary: '#00bcd4', accent: '#4caf50', secondary: '#795548' },
  'project-timesheet': { primary: '#673ab7', accent: '#e91e63', secondary: '#607d8b' },
  'messages': { primary: '#10B981', accent: '#EF4444', secondary: '#374151' },
  'search': { primary: '#6366f1', accent: '#f59e0b', secondary: '#64748b' }
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private preferencesService = inject(PreferencesService);
  private authService = inject(AuthService);
  private currentPreferences: any = {};
  private mediaQuery?: MediaQueryList;
  private themeSubject = new BehaviorSubject<string>('light');
  private moduleThemeSubject = new BehaviorSubject<ModuleTheme | null>(null);
  
  currentTheme$ = this.themeSubject.asObservable();
  currentModuleTheme$ = this.moduleThemeSubject.asObservable();
  isDarkTheme = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', () => this.handleSystemThemeChange());
    }
  }

  loadAndApplyUserTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Start with app default colors
    const brandColors = this.getBrandColors();
    const defaultPrefs = {
      theme: 'light',
      primaryColor: brandColors.primary,
      secondaryColor: brandColors.secondary,
      accentColor: brandColors.accent
    };
    
    if (!this.authService.isAuthenticated()) {
      this.applyTheme(defaultPrefs);
      return;
    }
    
    // Try to load user preferences
    this.preferencesService.getUserPreferences().subscribe({
      next: (userPrefs) => {
        if (userPrefs && (userPrefs.theme || userPrefs.primaryColor)) {
          // User has preferences - use them (highest priority)
          this.applyTheme({ ...defaultPrefs, ...userPrefs });
        } else {
          // No user preferences - check organization
          this.loadOrganizationTheme(defaultPrefs);
        }
      },
      error: (error) => {
        console.log('No user preferences found, checking organization theme');
        // Error loading user prefs - check organization
        this.loadOrganizationTheme(defaultPrefs);
      },
    });
  }

  private loadOrganizationTheme(defaultPrefs: any) {
    const user = this.authService.getCurrentUser();
    if (user?.organizationId) {
      // Get organization from user's organizations array
      const currentOrg = user.organizations?.find(org => org.id === user.organizationId);
      if (currentOrg?.settings) {
        const orgSettings = currentOrg.settings;
        const orgPrefs = {
          ...defaultPrefs,
          primaryColor: orgSettings.primaryColor || defaultPrefs.primaryColor,
          secondaryColor: orgSettings.secondaryColor || defaultPrefs.secondaryColor,
          accentColor: orgSettings.accentColor || defaultPrefs.accentColor,
          theme: orgSettings.theme || defaultPrefs.theme
        };
        console.log('Applying organization theme:', orgPrefs);
        this.applyTheme(orgPrefs);
        return;
      }
    }
    // No organization settings - use app defaults
    console.log('Applying app default theme:', defaultPrefs);
    this.applyTheme(defaultPrefs);
  }

  onOrganizationChange() {
    // Re-evaluate theme hierarchy when organization changes
    this.loadAndApplyUserTheme();
  }

  private handleSystemThemeChange() {
    if (this.currentPreferences.theme === 'auto') {
      this.applyTheme(this.currentPreferences, this.moduleThemeSubject.value || undefined);
    }
  }

  applyTheme(preferences: any = {}, moduleTheme?: ModuleTheme) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentPreferences = { ...preferences };
    const root = document.documentElement;
    const body = document.body;
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme = preferences.theme || 'light';
    if (theme === 'auto') {
      theme = isDarkMode ? 'dark' : 'light';
    }

    this.isDarkTheme.set(theme === 'dark');
    this.themeSubject.next(theme);
    
    if (moduleTheme) {
      this.moduleThemeSubject.next(moduleTheme);
    }

    const baseColors = this.getBaseThemeColors(theme, preferences);
    const finalColors = moduleTheme ? { ...baseColors, ...moduleTheme.colors } : baseColors;

    this.applyCSSVariables(finalColors);
    this.applyThemeClass(theme);
  }

  private getBaseThemeColors(theme: string, preferences: any): ThemeColors {
    const brandColors = this.getBrandColors();
    
    const themeColors = {
      light: {
        primary: preferences.primaryColor || brandColors.primary || '#1976d2',
        secondary: preferences.secondaryColor || brandColors.secondary || '#dc004e', 
        accent: preferences.accentColor || brandColors.accent || '#ffc107',
        background: '#fafafa',
        surface: '#ffffff',
        onSurface: '#212121',
        onPrimary: '#ffffff',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336'
      },
      dark: {
        primary: preferences.primaryColor || this.adjustColorForDarkMode(brandColors.primary) || '#90caf9',
        secondary: preferences.secondaryColor || this.adjustColorForDarkMode(brandColors.secondary) || '#f48fb1',
        accent: preferences.accentColor || this.adjustColorForDarkMode(brandColors.accent) || '#ffcc02',
        background: '#121212',
        surface: '#1e1e1e', 
        onSurface: '#e0e0e0',
        onPrimary: '#000000',
        success: '#66bb6a',
        warning: '#ffb74d',
        error: '#ef5350'
      }
    };
    return themeColors[theme as keyof typeof themeColors] || themeColors.light;
  }

  private getBrandColors() {
    if (typeof window !== 'undefined' && (window as any).brandConfig) {
      return (window as any).brandConfig.colors;
    }
    return { primary: '#1976d2', secondary: '#dc004e', accent: '#ffc107' };
  }

  private adjustColorForDarkMode(color: string): string {
    if (!color) return color;
    
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.min(255, Math.floor(r * 1.4));
    const newG = Math.min(255, Math.floor(g * 1.4));
    const newB = Math.min(255, Math.floor(b * 1.4));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  private applyCSSVariables(colors: ThemeColors) {
    const root = document.documentElement;
    Object.entries({
      '--theme-primary': colors.primary,
      '--theme-secondary': colors.secondary,
      '--theme-accent': colors.accent,
      '--theme-background': colors.background,
      '--theme-surface': colors.surface,
      '--theme-on-surface': colors.onSurface,
      '--theme-on-primary': colors.onPrimary,
      '--theme-success': colors.success,
      '--theme-warning': colors.warning,
      '--theme-error': colors.error,
      '--mdc-theme-primary': colors.primary,
      '--mdc-theme-secondary': colors.secondary,
      '--mat-toolbar-background-color': colors.primary
    }).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  private applyThemeClass(theme: string) {
    const body = document.body;
    body.className = body.className.replace(/\b\w+-theme\b/g, '').trim();
    body.classList.add(`${theme}-theme`);
    document.documentElement.style.setProperty('color-scheme', theme);
  }

  setModuleTheme(moduleTheme: ModuleTheme) {
    this.applyTheme(this.currentPreferences, moduleTheme);
  }

  clearModuleTheme() {
    this.moduleThemeSubject.next(null);
    this.applyTheme(this.currentPreferences);
  }

  getModuleTheme(moduleId: string): ModuleTheme | null {
    const colors = MODULE_THEMES[moduleId];
    if (!colors) return null;
    
    return {
      id: moduleId,
      name: moduleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      colors,
      enabled: true
    };
  }

  applyModuleTheme(moduleId: string) {
    const moduleTheme = this.getModuleTheme(moduleId);
    if (moduleTheme) {
      this.setModuleTheme(moduleTheme);
    }
  }

  toggleTheme() {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const newPrefs = { ...this.currentPreferences, theme: newTheme };
    
    this.applyTheme(newPrefs);
    
    // Save user preference if authenticated
    if (this.authService.isAuthenticated()) {
      this.preferencesService.saveUserPreferences({ theme: newTheme }).subscribe({
        error: (error) => console.warn('Failed to save theme preference:', error)
      });
    }
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }

  getAvailableModuleThemes(): string[] {
    return Object.keys(MODULE_THEMES);
  }

  previewTheme(colors: Partial<ThemeColors>, duration: number = 3000) {
    const originalColors = this.getCurrentColors();
    const previewColors = { ...this.getBaseThemeColors(this.getCurrentTheme(), this.currentPreferences), ...colors };
    
    this.applyCSSVariables(previewColors);
    
    setTimeout(() => {
      this.applyCSSVariables(originalColors);
    }, duration);
  }

  private getCurrentColors(): ThemeColors {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    return {
      primary: style.getPropertyValue('--theme-primary').trim(),
      secondary: style.getPropertyValue('--theme-secondary').trim(),
      accent: style.getPropertyValue('--theme-accent').trim(),
      background: style.getPropertyValue('--theme-background').trim(),
      surface: style.getPropertyValue('--theme-surface').trim(),
      onSurface: style.getPropertyValue('--theme-on-surface').trim(),
      onPrimary: style.getPropertyValue('--theme-on-primary').trim(),
      success: style.getPropertyValue('--theme-success').trim(),
      warning: style.getPropertyValue('--theme-warning').trim(),
      error: style.getPropertyValue('--theme-error').trim()
    };
  }
}
