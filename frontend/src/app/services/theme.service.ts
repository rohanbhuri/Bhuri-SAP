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
    
    // Only load preferences if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.applyTheme();
      return;
    }
    
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        if (prefs) {
          this.applyTheme(prefs);
        } else {
          this.applyTheme();
        }
      },
      error: () => {
        // Use default theme if preferences can't be loaded
        this.applyTheme();
      },
    });
  }

  applyTheme(preferences?: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    const body = document.body;

    if (!preferences) {
      // Use system theme detection for default
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = isDarkMode ? 'dark' : 'light';
      
      // Apply default colors based on system theme
      if (isDarkMode) {
        root.style.setProperty('--mdc-theme-primary', '#bb86fc');
        root.style.setProperty('--mdc-theme-secondary', '#03dac6');
        root.style.setProperty('--mat-toolbar-background-color', '#bb86fc');
      } else {
        root.style.setProperty('--mdc-theme-primary', '#6200ea');
        root.style.setProperty('--mdc-theme-secondary', '#03dac6');
        root.style.setProperty('--mat-toolbar-background-color', '#6200ea');
      }
      
      // Apply system theme
      body.className = body.className.replace(/\b\w+-theme\b/g, '').trim();
      body.classList.add(`${systemTheme}-theme`);
    } else {
      // Apply custom colors using Material Design CSS variables
      if (preferences.primaryColor) {
        root.style.setProperty('--mdc-theme-primary', preferences.primaryColor);
        root.style.setProperty(
          '--mat-toolbar-background-color',
          preferences.primaryColor
        );
      }
      if (preferences.secondaryColor) {
        root.style.setProperty(
          '--mdc-theme-secondary',
          preferences.secondaryColor
        );
      }
      if (preferences.accentColor) {
        root.style.setProperty(
          '--mdc-theme-secondary',
          preferences.accentColor
        );
      }

      // Remove existing theme classes and apply new one
      body.className = body.className.replace(/\b\w+-theme\b/g, '').trim();
      if (preferences.theme) {
        body.classList.add(`${preferences.theme}-theme`);
      }
    }
  }
}
