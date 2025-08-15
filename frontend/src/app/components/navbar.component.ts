import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User } from '../services/auth.service';
import { BrandConfigService } from '../services/brand-config.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary">
      <img [src]="brandConfig.getIcon()" [alt]="brandConfig.getBrandName()" class="logo" (click)="goToDashboard()">
      <span class="spacer"></span>
      
      @if (currentUser()) {
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
          <mat-icon>account_circle</mat-icon>
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
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected brandConfig = inject(BrandConfigService);
  
  currentUser = signal<User | null>(null);
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
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
}