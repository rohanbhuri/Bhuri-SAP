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
        class="nav-button"
        (click)="goToDashboard()"
        [attr.aria-current]="activeRoute === '/dashboard' ? 'page' : null"
        [class.active]="activeRoute === '/dashboard'"
        aria-label="Dashboard"
      >
        <mat-icon>dashboard</mat-icon>
        <span class="nav-label">Dashboard</span>
      </button>
      <button
        class="nav-button"
        (click)="goToMessages()"
        [attr.aria-current]="activeRoute === '/messages' ? 'page' : null"
        [class.active]="activeRoute === '/messages'"
        aria-label="Messages"
      >
        <mat-icon>message</mat-icon>
        <span class="nav-label">Messages</span>
      </button>
      <button
        class="nav-button"
        (click)="goToSearch()"
        [attr.aria-current]="activeRoute === '/search' ? 'page' : null"
        [class.active]="activeRoute === '/search'"
        aria-label="Search"
      >
        <mat-icon>search</mat-icon>
        <span class="nav-label">Search</span>
      </button>
      <button
        class="nav-button"
        (click)="goToNotifications()"
        [attr.aria-current]="activeRoute === '/notifications' ? 'page' : null"
        [class.active]="activeRoute === '/notifications'"
        aria-label="Notifications"
      >
        <mat-icon>notifications</mat-icon>
        <span class="nav-label">Notifications</span>
      </button>
      <button
        class="nav-button"
        (click)="goToModules()"
        [attr.aria-current]="activeRoute === '/modules' ? 'page' : null"
        [class.active]="activeRoute === '/modules'"
        aria-label="Modules"
      >
        <mat-icon>apps</mat-icon>
        <span class="nav-label">Modules</span>
      </button>
      @for (module of pinnedModules(); track module.id) {
        <button
          class="nav-button"
          (click)="goToModule(module)"
          [attr.aria-current]="activeRoute.includes('/modules/' + module.name) ? 'page' : null"
          [class.active]="activeRoute.includes('/modules/' + module.name)"
          [attr.aria-label]="module.displayName"
        >
          <mat-icon>{{ getModuleIcon(module.name) }}</mat-icon>
          <span class="nav-label">{{ module.displayName || module.name }}</span>
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
        padding: 8px 12px;
        border: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        z-index: 1000;
        max-width: calc(100vw - 40px);
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
      }

      .bottom-nav::-webkit-scrollbar {
        display: none;
      }

      .nav-button {
        width: auto;
        height: 56px;
        min-width: 56px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 4px 8px;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--theme-on-surface);
      }

      .nav-button:hover {
        background: color-mix(in srgb, var(--theme-primary) 10%, transparent);
      }

      .nav-button.active {
        background: color-mix(in srgb, var(--theme-primary) 15%, transparent);
        color: var(--theme-primary);
      }

      .nav-button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2px;
      }

      .nav-label {
        font-size: 10px;
        font-weight: 500;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 60px;
      }

      .bottom-nav:focus-within {
        outline: var(--focus-outline);
        outline-offset: 4px;
      }

      @media (max-width: 599px) {
        .bottom-nav {
          gap: 4px;
          padding: 6px 8px;
          left: 50%;
          transform: translateX(-50%);
          width: fit-content;
          min-width: auto;
        }
        
        .nav-button {
          height: 48px;
          min-width: 48px;
          padding: 2px 6px;
          flex-shrink: 0;
        }
        
        .nav-button mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
        
        .nav-label {
          font-size: 9px;
          max-width: 50px;
        }
      }

      @media (max-width: 480px) {
        .bottom-nav {
          gap: 2px;
          padding: 4px 6px;
          left: 50%;
          transform: translateX(-50%);
          width: fit-content;
          min-width: auto;
        }
        
        .nav-button {
          height: 44px;
          min-width: 44px;
          padding: 2px 4px;
          flex-shrink: 0;
        }
        
        .nav-button mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
        
        .nav-label {
          font-size: 8px;
          max-width: 40px;
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
