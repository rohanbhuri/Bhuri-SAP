import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { BrandConfigService } from './services/brand-config.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private brandConfigService = inject(BrandConfigService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Apply brand colors to CSS variables (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const colors = this.brandConfigService.getColors();
      document.documentElement.style.setProperty('--primary-color', colors.primary);
      document.documentElement.style.setProperty('--accent-color', colors.accent);
      document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    }

    // Subscribe to user changes and apply theme accordingly
    this.authService.currentUser$.pipe(delay(100)).subscribe((user) => {
      if (user && this.authService.getToken()) {
        console.log('User changed:', user);
        this.themeService.loadAndApplyUserTheme();
      } else {
        this.themeService.applyTheme();
      }
    });
  }
}
