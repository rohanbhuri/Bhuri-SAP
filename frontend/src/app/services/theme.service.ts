import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreferencesService } from './preferences.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private preferencesService = inject(PreferencesService);
  private authService = inject(AuthService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadAndApplyUserTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (!this.authService.isAuthenticated()) {
      this.applyTheme();
      return;
    }
    
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        this.applyTheme(prefs || {});
      },
      error: () => {
        this.applyTheme();
      },
    });
  }

  applyTheme(preferences: any = {}) {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    const body = document.body;
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = preferences.theme || (isDarkMode ? 'dark' : 'light');

    // Define theme colors with better accessibility
    const themeColors = {
      light: {
        primary: preferences.primaryColor || '#1976d2',
        secondary: preferences.secondaryColor || '#dc004e',
        accent: preferences.accentColor || '#ffc107',
        background: '#fafafa',
        surface: '#ffffff',
        onSurface: '#212121',
        onPrimary: '#ffffff'
      },
      dark: {
        primary: preferences.primaryColor || '#90caf9',
        secondary: preferences.secondaryColor || '#f48fb1',
        accent: preferences.accentColor || '#ffcc02',
        background: '#121212',
        surface: '#1e1e1e',
        onSurface: '#e0e0e0',
        onPrimary: '#000000'
      }
    };

    const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

    // Apply CSS custom properties
    Object.entries({
      '--theme-primary': colors.primary,
      '--theme-secondary': colors.secondary,
      '--theme-accent': colors.accent,
      '--theme-background': colors.background,
      '--theme-surface': colors.surface,
      '--theme-on-surface': colors.onSurface,
      '--theme-on-primary': colors.onPrimary,
      '--mdc-theme-primary': colors.primary,
      '--mdc-theme-secondary': colors.secondary,
      '--mat-toolbar-background-color': colors.primary
    }).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply theme class
    body.className = body.className.replace(/\b\w+-theme\b/g, '').trim();
    body.classList.add(`${theme}-theme`);
    
    // Set color-scheme for better browser integration
    root.style.setProperty('color-scheme', theme);
  }
}
