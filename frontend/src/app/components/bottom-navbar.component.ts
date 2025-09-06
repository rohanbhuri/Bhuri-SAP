import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { ModulesService, AppModuleInfo } from '../services/modules.service';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <nav class="bottom-nav" role="navigation" aria-label="Primary">
      <button
        mat-icon-button
        (click)="goToDashboard()"
        [attr.aria-current]="activeRoute === '/dashboard' ? 'page' : null"
        [color]="activeRoute === '/dashboard' ? 'primary' : ''"
        aria-label="Dashboard"
      >
        <mat-icon>dashboard</mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="goToMessages()"
        [attr.aria-current]="activeRoute === '/messages' ? 'page' : null"
        [color]="activeRoute === '/messages' ? 'primary' : ''"
        aria-label="Messages"
      >
        <mat-icon>message</mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="goToSearch()"
        [attr.aria-current]="activeRoute === '/search' ? 'page' : null"
        [color]="activeRoute === '/search' ? 'primary' : ''"
        aria-label="Search"
      >
        <mat-icon>search</mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="goToNotifications()"
        [attr.aria-current]="activeRoute === '/notifications' ? 'page' : null"
        [color]="activeRoute === '/notifications' ? 'primary' : ''"
        aria-label="Notifications"
      >
        <mat-icon>notifications</mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="goToModules()"
        [attr.aria-current]="activeRoute === '/modules' ? 'page' : null"
        [color]="activeRoute === '/modules' ? 'primary' : ''"
        aria-label="Modules"
      >
        <mat-icon>apps</mat-icon>
      </button>
      @for (module of pinnedModules(); track module.id) {
        <button
          mat-icon-button
          (click)="goToModule(module)"
          [attr.aria-current]="activeRoute.includes('/modules/' + module.name) ? 'page' : null"
          [color]="activeRoute.includes('/modules/' + module.name) ? 'primary' : ''"
          [attr.aria-label]="module.displayName"
        >
          <mat-icon>{{ getModuleIcon(module.name) }}</mat-icon>
        </button>
      }

    </nav>
  `,
  styles: [
    `
      .bottom-nav {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: color-mix(in srgb, var(--theme-surface) 80%, transparent);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        padding: 8px 16px;
        border: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        z-index: 1000;
        max-width: calc(100vw - 40px);
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .bottom-nav::-webkit-scrollbar {
        display: none;
      }

      button {
        width: 44px;
        height: 44px;
        min-width: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .bottom-nav:focus-within {
        outline: var(--focus-outline);
        outline-offset: 4px;
      }

      @media (max-width: 599px) {
        .bottom-nav {
          gap: 2px;
          padding: 6px 12px;
        }
        
        button {
          width: 40px;
          height: 40px;
          min-width: 40px;
        }
        
        button mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      @media (max-width: 480px) {
        .bottom-nav {
          gap: 1px;
          padding: 4px 8px;
        }
        
        button {
          width: 36px;
          height: 36px;
          min-width: 36px;
        }
        
        button mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    `,
  ],
})
export class BottomNavbarComponent {
  private modulesService = inject(ModulesService);
  private preferencesService = inject(PreferencesService);
  activeRoute: string = '';
  activeModules = signal<AppModuleInfo[]>([]);
  pinnedModules = signal<AppModuleInfo[]>([]);
  
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.url;
      });
  }

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.loadActiveModules();
    this.loadPinnedModules();
  }

  loadActiveModules() {
    this.modulesService.getActive().subscribe({
      next: (modules) => {
        this.activeModules.set(modules);
        this.updatePinnedModules();
      },
      error: (error) => {
        console.error('Failed to load active modules:', error);
      }
    });
  }

  loadPinnedModules() {
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        this.preferencesService.updatePinnedModules(prefs?.pinnedModules || []);
        this.updatePinnedModules();
      },
      error: () => {
        this.preferencesService.updatePinnedModules([]);
      }
    });
  }

  updatePinnedModules() {
    this.preferencesService.pinnedModules$.subscribe(pinnedIds => {
      const pinned = this.activeModules().filter(m => pinnedIds.includes(m.id));
      this.pinnedModules.set(pinned);
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  goToModules() {
    this.router.navigate(['/modules']);
  }

  goToModule(module: AppModuleInfo) {
    this.router.navigate(['/modules', module.name]);
  }

  getModuleIcon(moduleName: string): string {
    const module = this.activeModules().find(m => m.name === moduleName);
    return module?.icon || 'extension';
  }


}
