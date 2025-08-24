import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { BrandConfigService } from '../services/brand-config.service';
import { PwaService } from '../services/pwa.service';
import { ThemeService } from '../services/theme.service';
import { PwaInstallModalComponent } from './pwa-install-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <mat-toolbar color="primary">
      <img [src]="brandConfig.getIcon()" [alt]="brandConfig.getBrandName()" class="logo" (click)="goToDashboard()">
      <span class="spacer"></span>
      
      <button mat-icon-button (click)="toggleTheme()" [matTooltip]="isDarkTheme() ? 'Switch to Light Mode' : 'Switch to Dark Mode'" class="theme-toggle">
        <mat-icon>{{ isDarkTheme() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      
      @if (showInstallButton()) {
        <button mat-icon-button (click)="showInstallModal()" matTooltip="Install App" class="install-button">
          <mat-icon>download</mat-icon>
        </button>
      }
      
      @if (currentUser()) {
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
          <div class="user-avatar">
            @if (currentUser()?.avatar) {
              <img [src]="getAvatarUrl()" alt="User Avatar" class="avatar-image">
            } @else {
              <mat-icon>account_circle</mat-icon>
            }
          </div>
          <span>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</span>
        </button>
        
        <mat-menu #userMenu="matMenu">
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
    </mat-toolbar>
  `,
  styles: [`
    .logo {
      height: 32px;
      margin-right: 16px;
      cursor: pointer;
      transition: var(--transition);
    }
    
    .logo:hover {
      opacity: 0.8;
    }
    
    .logo:focus-visible {
      outline: var(--focus-outline);
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--theme-on-primary);
      transition: var(--transition);
    }
    
    .user-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .user-button:focus-visible {
      outline: 2px solid var(--theme-on-primary);
      outline-offset: 2px;
    }
    
    .install-button {
      color: var(--theme-on-primary);
      margin-right: 8px;
    }
    
    .install-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .theme-toggle {
      color: var(--theme-on-primary);
      margin-right: 8px;
      transition: var(--transition);
    }
    
    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: rotate(180deg);
    }
    
    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    
    .user-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `]
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private pwaService = inject(PwaService);
  private themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);
  protected brandConfig = inject(BrandConfigService);
  
  currentUser = signal<User | null>(null);
  showInstallButton = signal(false);
  isDarkTheme = signal(false);
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
    
    // Check if PWA is installable
    this.pwaService.installable$.subscribe((installable) => {
      this.showInstallButton.set(installable);
    });
    
    // Subscribe to theme changes
    this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkTheme.set(theme === 'dark');
    });
    
    // Load user theme preferences
    this.themeService.loadAndApplyUserTheme();
  }
  
  showInstallModal() {
    this.dialog.open(PwaInstallModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'pwa-install-dialog'
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