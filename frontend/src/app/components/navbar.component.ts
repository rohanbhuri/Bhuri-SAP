import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary">
      <img src="/icons/BEAX-icon.png" alt="Beax" class="logo" (click)="goToDashboard()">
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
    }
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
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