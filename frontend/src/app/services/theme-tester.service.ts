import { Injectable, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeTesterService {
  private themeService = inject(ThemeService);

  // Test all module themes
  testAllModuleThemes() {
    const modules = this.themeService.getAvailableModuleThemes();
    let index = 0;

    const cycleThemes = () => {
      if (index < modules.length) {
        console.log(`Testing theme: ${modules[index]}`);
        this.themeService.applyModuleTheme(modules[index]);
        index++;
        setTimeout(cycleThemes, 2000); // 2 seconds per theme
      } else {
        console.log('Theme testing complete');
        this.themeService.clearModuleTheme();
      }
    };

    cycleThemes();
  }

  // Test theme switching
  testThemeToggle() {
    console.log('Testing theme toggle...');
    
    // Toggle every 3 seconds
    setInterval(() => {
      this.themeService.toggleTheme();
      console.log(`Switched to: ${this.themeService.getCurrentTheme()}`);
    }, 3000);
  }

  // Test color contrast
  testColorContrast() {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    const colors = {
      primary: style.getPropertyValue('--theme-primary').trim(),
      secondary: style.getPropertyValue('--theme-secondary').trim(),
      accent: style.getPropertyValue('--theme-accent').trim(),
      background: style.getPropertyValue('--theme-background').trim(),
      surface: style.getPropertyValue('--theme-surface').trim(),
      onSurface: style.getPropertyValue('--theme-on-surface').trim()
    };

    console.log('Current theme colors:', colors);
    
    // Calculate contrast ratios (simplified)
    const contrastRatio = this.calculateContrastRatio(colors.onSurface, colors.surface);
    console.log(`Text contrast ratio: ${contrastRatio.toFixed(2)}:1`);
    
    if (contrastRatio >= 4.5) {
      console.log('✅ Contrast ratio meets WCAG AA standards');
    } else {
      console.log('❌ Contrast ratio below WCAG AA standards');
    }
  }

  // Preview custom theme
  previewCustomTheme(colors: any, duration: number = 5000) {
    console.log('Previewing custom theme:', colors);
    this.themeService.previewTheme(colors, duration);
  }

  // Test responsive breakpoints
  testResponsiveBreakpoints() {
    const breakpoints = [
      { width: 320, name: 'Mobile Small' },
      { width: 768, name: 'Mobile Large' },
      { width: 1024, name: 'Tablet' },
      { width: 1440, name: 'Desktop' },
      { width: 1920, name: 'Large Desktop' }
    ];

    breakpoints.forEach((bp, index) => {
      setTimeout(() => {
        console.log(`Testing ${bp.name} (${bp.width}px)`);
        // Note: This would need actual viewport resizing in a real test
      }, index * 2000);
    });
  }

  // Simplified contrast ratio calculation
  private calculateContrastRatio(color1: string, color2: string): number {
    // This is a simplified version - in production, use a proper color library
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 1;
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): {r: number, g: number, b: number} | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private getLuminance(rgb: {r: number, g: number, b: number}): number {
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
}