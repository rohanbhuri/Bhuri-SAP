import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { BrandConfigService } from '../services/brand-config.service';
import { PwaService } from '../services/pwa.service';
import { ThemeService } from '../services/theme.service';
import { NotificationsService } from '../services/notifications.service';
import { WebSocketService } from '../services/websocket.service';
import { PwaInstallModalComponent } from './pwa-install-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="nav-brand" (click)="goToDashboard()">
        <img
          [src]="brandConfig.getThemeAwareLogo(isDarkTheme())"
          [alt]="brandConfig.getBrandName()"
          class="logo"
        />
        <span class="brand-name">{{ brandConfig.getBrandName() }}</span>
      </div>

      <div class="nav-actions">
        <button
          mat-icon-button
          (click)="toggleTheme()"
          [matTooltip]="isDarkTheme() ? 'Light Mode' : 'Dark Mode'"
          class="theme-toggle"
        >
          <mat-icon>{{ isDarkTheme() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        @if (showInstallButton()) {
        <button
          mat-icon-button
          (click)="showInstallModal()"
          matTooltip="Install App"
          class="install-button"
        >
          <mat-icon>download</mat-icon>
        </button>
        } @if (currentUser()) {
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
          <div class="display-flex">
            <div class="user-avatar">
              @if (currentUser()?.avatar) {
              <img
                [src]="getAvatarUrl()"
                alt="User Avatar"
                class="avatar-image"
              />
              } @else {
              <mat-icon>account_circle</mat-icon>
              }
            </div>
            <span class="user-name"
              >{{ currentUser()?.firstName }}
              {{ currentUser()?.lastName }}</span
            >
          </div>
        </button>

        <mat-menu #userMenu="matMenu" class="user-menu">
          <button mat-menu-item (click)="openProfile()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="openSettings()">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      .display-flex {
        display: flex;
      }
      .navbar {
        background: #ffffff;
        color: #000000;
        border-bottom: 1px solid #e5e7eb;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      :host-context(body.dark-theme) .navbar {
        background: #000000;
        color: #ffffff;
        border-bottom-color: #374151;
      }

      .nav-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .nav-brand:hover {
        opacity: 0.8;
      }

      .logo {
        height: 32px;
        width: auto;
      }

      .brand-name {
        font-size: 20px;
        font-weight: 600;
        color: var(--theme-primary);
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .theme-toggle,
      .install-button {
        color: var(--theme-primary);
        transition: all 0.2s ease;
      }

      .theme-toggle:hover,
      .install-button:hover {
        background-color: color-mix(
          in srgb,
          var(--theme-primary) 10%,
          transparent
        );
        transform: scale(1.05);
      }

      .user-button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        border-radius: 24px;
        background: transparent;
        border: 1px solid #e5e7eb;
        color: #000000;
        transition: all 0.2s ease;
        min-width: 120px;
      }

      :host-context(body.dark-theme) .user-button {
        border-color: #374151;
        color: #ffffff;
      }

      .user-button:hover {
        background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
        border-color: var(--theme-primary);
        transform: translateY(-1px);
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        background: color-mix(in srgb, var(--theme-primary) 10%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .user-avatar mat-icon {
        color: var(--theme-primary);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .user-name {
        font-weight: 500;
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .navbar {
          padding: 0 16px;
          height: 56px;
        }

        .brand-name {
          display: none;
        }

        .user-name {
          display: none;
        }

        .user-button {
          min-width: auto;
          padding: 8px;
          border-radius: 50%;
        }

        .nav-actions {
          gap: 4px;
        }
      }

      @media (max-width: 480px) {
        .navbar {
          padding: 0 12px;
        }

        .logo {
          height: 28px;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private pwaService = inject(PwaService);
  private themeService = inject(ThemeService);
  private notificationsService = inject(NotificationsService);
  private wsService = inject(WebSocketService);
  private cdr = inject(ChangeDetectorRef);
  protected brandConfig = inject(BrandConfigService);

  currentUser = signal<User | null>(null);
  showInstallButton = signal(false);
  isDarkTheme = signal(false);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);

      // Initialize WebSocket and notifications when user is authenticated
      if (user) {
        this.initializeNotifications();
      }
    });

    // Check if PWA is installable
    this.pwaService.installable$.subscribe((installable) => {
      this.showInstallButton.set(installable);
    });

    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe((theme) => {
      this.isDarkTheme.set(theme === 'dark');
    });

    // Load user theme preferences
    this.themeService.loadAndApplyUserTheme();
  }

  private initializeNotifications() {
    // Connect WebSocket for real-time updates
    this.wsService.connect();

    // Request notification permission
    this.notificationsService.requestNotificationPermission();
  }

  showInstallModal() {
    this.dialog.open(PwaInstallModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'pwa-install-dialog',
    });
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }

  getAvatarUrl(): string {
    const user = this.currentUser();
    return this.authService.getAvatarUrl(user?.avatar);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
