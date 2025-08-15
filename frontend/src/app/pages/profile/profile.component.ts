import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>User Profile</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          @if (currentUser()) {
            <div class="profile-info">
              <p><strong>Name:</strong> {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
              <p><strong>Email:</strong> {{ currentUser()?.email }}</p>
            </div>
          }
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="editProfile()">
            <mat-icon>edit</mat-icon>
            Edit Profile
          </button>
          <button mat-raised-button color="accent" (click)="openSettings()">
            <mat-icon>settings</mat-icon>
            Settings
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .profile-card {
      width: 100%;
    }
    
    .profile-info p {
      margin: 12px 0;
      font-size: 16px;
    }
    
    mat-card-actions {
      gap: 12px;
    }
  `]
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }
  
  editProfile() {
    this.router.navigate(['/profile/edit']);
  }
  
  openSettings() {
    this.router.navigate(['/settings']);
  }
}