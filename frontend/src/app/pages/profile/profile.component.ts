import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, MatListModule, NavbarComponent, BottomNavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="profile-container">
      <!-- Profile Header Card -->
      <mat-card class="profile-header-card">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-circle">
              @if (currentUser()?.avatar) {
                <img [src]="getAvatarUrl()" alt="Profile Avatar" class="avatar-image">
              } @else {
                <mat-icon class="avatar-icon">person</mat-icon>
              }
            </div>
            <div class="status-indicator" [class.online]="currentUser()?.isActive"></div>
          </div>
          
          <div class="user-info">
            @if (currentUser()) {
              <h2 class="user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</h2>
              <p class="user-email">{{ currentUser()?.email }}</p>
              <mat-chip-set class="user-status">
                <mat-chip class="status-chip">
                  <mat-icon matChipAvatar>verified</mat-icon>
                  Verified User
                </mat-chip>
              </mat-chip-set>
            }
          </div>
        </div>
      </mat-card>

      <!-- Profile Details Card -->
      <mat-card class="profile-details-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="title-icon">account_circle</mat-icon>
            Profile Information
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          @if (currentUser()) {
            <mat-list class="profile-list">
              <mat-list-item>
                <mat-icon matListItemIcon class="list-icon primary-color">person</mat-icon>
                <div matListItemTitle>Full Name</div>
                <div matListItemLine>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</div>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon class="list-icon secondary-color">email</mat-icon>
                <div matListItemTitle>Email Address</div>
                <div matListItemLine>{{ currentUser()?.email }}</div>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon class="list-icon accent-color">schedule</mat-icon>
                <div matListItemTitle>Member Since</div>
                <div matListItemLine>{{ getMemberSince() }}</div>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon class="list-icon primary-color">security</mat-icon>
                <div matListItemTitle>Account Status</div>
                <div matListItemLine [class]="currentUser()?.isActive ? 'status-active' : 'status-inactive'">
                  {{ currentUser()?.isActive ? 'Active & Verified' : 'Inactive' }}
                </div>
              </mat-list-item>
              
              @if ((currentUser()?.roles?.length || 0) > 0) {
                <mat-divider></mat-divider>
                
                <mat-list-item>
                  <mat-icon matListItemIcon class="list-icon secondary-color">admin_panel_settings</mat-icon>
                  <div matListItemTitle>Roles</div>
                  <div matListItemLine>
                    <mat-chip-set>
                      @for (role of currentUser()?.roles; track role.id) {
                        <mat-chip>{{ role.name }}</mat-chip>
                      }
                    </mat-chip-set>
                  </div>
                </mat-list-item>
              }
              
              @if (currentUser()?.currentOrganization) {
                <mat-divider></mat-divider>
                
                <mat-list-item>
                  <mat-icon matListItemIcon class="list-icon accent-color">business</mat-icon>
                  <div matListItemTitle>Current Organization</div>
                  <div matListItemLine>{{ currentUser()?.currentOrganization?.name }}</div>
                </mat-list-item>
              }
              
              @if ((currentUser()?.organizations?.length || 0) > 0) {
                <mat-divider></mat-divider>
                
                <mat-list-item>
                  <mat-icon matListItemIcon class="list-icon primary-color">groups</mat-icon>
                  <div matListItemTitle>Member Organizations</div>
                  <div matListItemLine>
                    <mat-chip-set>
                      @for (org of currentUser()?.organizations; track org.id) {
                        <mat-chip>{{ org.name }}</mat-chip>
                      }
                    </mat-chip-set>
                  </div>
                </mat-list-item>
              }
            </mat-list>
          }
        </mat-card-content>
      </mat-card>

      <!-- Quick Actions Card -->
      <mat-card class="actions-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="title-icon">settings</mat-icon>
            Quick Actions
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" class="action-btn" (click)="editProfile()">
              <mat-icon>edit</mat-icon>
              <span>Edit Profile</span>
            </button>
            
            <button mat-raised-button color="accent" class="action-btn" (click)="openSettings()">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            
            <button mat-stroked-button color="primary" class="action-btn" (click)="changePassword()">
              <mat-icon>lock</mat-icon>
              <span>Change Password</span>
            </button>
            
            <button mat-stroked-button class="action-btn secondary-btn" (click)="viewActivity()">
              <mat-icon>history</mat-icon>
              <span>Activity Log</span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Account Statistics Card -->
      <mat-card class="stats-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="title-icon">analytics</mat-icon>
            Account Overview
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item primary-stat">
              <mat-icon class="stat-icon">login</mat-icon>
              <div class="stat-value">{{ getLoginCount() }}</div>
              <div class="stat-label">Total Logins</div>
            </div>
            
            <div class="stat-item secondary-stat">
              <mat-icon class="stat-icon">access_time</mat-icon>
              <div class="stat-value">{{ getLastLogin() }}</div>
              <div class="stat-label">Last Login</div>
            </div>
            
            <div class="stat-item accent-stat">
              <mat-icon class="stat-icon">folder</mat-icon>
              <div class="stat-value">{{ getProjectCount() }}</div>
              <div class="stat-label">Active Projects</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .profile-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Profile Header Card */
    .profile-header-card {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-primary) 10%, var(--theme-surface)),
        color-mix(in srgb, var(--theme-accent) 5%, var(--theme-surface))
      );
      border: 1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent);
      transition: var(--transition);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 24px;
    }

    .avatar-section {
      position: relative;
      flex-shrink: 0;
    }

    .avatar-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }

    .avatar-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--theme-on-primary);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .status-indicator {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid var(--theme-surface);
    }

    .status-indicator.online {
      background-color: #4caf50;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      color: var(--theme-on-surface);
    }

    .user-email {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
    }

    .user-status {
      margin: 0;
    }

    .status-chip {
      background-color: color-mix(in srgb, var(--theme-accent) 20%, transparent) !important;
      color: var(--theme-on-surface) !important;
      font-weight: 500;
    }

    /* Profile Details Card */
    .profile-details-card {
      border-left: 4px solid var(--theme-primary);
    }

    .profile-list {
      padding: 0;
    }

    .list-icon {
      border-radius: 50%;
      padding: 8px;
      margin-right: 8px;
    }

    .list-icon.primary-color {
      background-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);
      color: var(--theme-primary);
    }

    .list-icon.secondary-color {
      background-color: color-mix(in srgb, var(--theme-secondary) 15%, transparent);
      color: var(--theme-secondary);
    }

    .list-icon.accent-color {
      background-color: color-mix(in srgb, var(--theme-accent) 15%, transparent);
      color: var(--theme-accent);
    }

    .status-active {
      color: #4caf50 !important;
      font-weight: 500;
    }

    .status-inactive {
      color: #f44336 !important;
      font-weight: 500;
    }

    /* Quick Actions Card */
    .actions-card {
      border-left: 4px solid var(--theme-secondary);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-btn {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 500;
      border-radius: 12px !important;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 25%, transparent);
    }

    .secondary-btn {
      color: var(--theme-secondary) !important;
      border-color: var(--theme-secondary) !important;
    }

    .secondary-btn:hover {
      background-color: color-mix(in srgb, var(--theme-secondary) 10%, transparent) !important;
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-secondary) 25%, transparent);
    }

    /* Account Statistics Card */
    .stats-card {
      border-left: 4px solid var(--theme-accent);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 20px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-4px);
    }

    .primary-stat {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-primary) 10%, transparent),
        color-mix(in srgb, var(--theme-primary) 5%, transparent)
      );
      border: 1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent);
    }

    .secondary-stat {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-secondary) 10%, transparent),
        color-mix(in srgb, var(--theme-secondary) 5%, transparent)
      );
      border: 1px solid color-mix(in srgb, var(--theme-secondary) 20%, transparent);
    }

    .accent-stat {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-accent) 10%, transparent),
        color-mix(in srgb, var(--theme-accent) 5%, transparent)
      );
      border: 1px solid color-mix(in srgb, var(--theme-accent) 20%, transparent);
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 12px;
    }

    .primary-stat .stat-icon {
      color: var(--theme-primary);
    }

    .secondary-stat .stat-icon {
      color: var(--theme-secondary);
    }

    .accent-stat .stat-icon {
      color: var(--theme-accent);
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--theme-on-surface);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }

    /* Card Titles */
    .title-icon {
      margin-right: 8px;
      color: var(--theme-primary);
    }

    mat-card-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: var(--theme-on-surface);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-container {
        padding: 12px;
        gap: 16px;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .user-name {
        font-size: 24px;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .avatar-circle {
        width: 60px;
        height: 60px;
      }

      .avatar-icon {
        font-size: 30px;
        width: 30px;
        height: 30px;
      }
    }

    /* Dark theme specific adjustments */
    :host-context(body.dark-theme) {
      .profile-header-card {
        background: linear-gradient(135deg, 
          color-mix(in srgb, var(--theme-primary) 15%, var(--theme-surface)),
          color-mix(in srgb, var(--theme-accent) 10%, var(--theme-surface))
        );
        border-color: color-mix(in srgb, var(--theme-primary) 35%, transparent);
        box-shadow: 0 4px 20px color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
      }

      .avatar-circle {
        box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 40%, transparent);
      }

      .stat-item:hover {
        box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
      }

      .profile-details-card,
      .actions-card,
      .stats-card {
        background-color: var(--theme-surface);
        color: var(--theme-on-surface);
      }

      .user-email {
        color: color-mix(in srgb, var(--theme-on-surface) 80%, transparent);
      }

      .stat-label {
        color: color-mix(in srgb, var(--theme-on-surface) 80%, transparent);
      }

      .primary-stat {
        background: linear-gradient(135deg, 
          color-mix(in srgb, var(--theme-primary) 15%, var(--theme-surface)),
          color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface))
        );
        border-color: color-mix(in srgb, var(--theme-primary) 30%, transparent);
      }

      .secondary-stat {
        background: linear-gradient(135deg, 
          color-mix(in srgb, var(--theme-secondary) 15%, var(--theme-surface)),
          color-mix(in srgb, var(--theme-secondary) 8%, var(--theme-surface))
        );
        border-color: color-mix(in srgb, var(--theme-secondary) 30%, transparent);
      }

      .accent-stat {
        background: linear-gradient(135deg, 
          color-mix(in srgb, var(--theme-accent) 15%, var(--theme-surface)),
          color-mix(in srgb, var(--theme-accent) 8%, var(--theme-surface))
        );
        border-color: color-mix(in srgb, var(--theme-accent) 30%, transparent);
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .avatar-circle,
      .stat-item,
      .action-btn {
        border: 2px solid var(--theme-on-surface);
      }

      .list-icon {
        border: 1px solid currentColor;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);
  
  ngOnInit() {
    // Load fresh profile data from backend
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Fallback to cached user data
        this.authService.currentUser$.subscribe(user => {
          this.currentUser.set(user);
        });
      }
    });
  }
  
  editProfile() {
    this.router.navigate(['/profile/edit']);
  }
  
  openSettings() {
    this.router.navigate(['/settings']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  viewActivity() {
    this.router.navigate(['/activity-log']);
  }

  getMemberSince(): string {
    const user = this.currentUser();
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return 'Unknown';
  }

  getAvatarUrl(): string {
    const user = this.currentUser();
    return this.authService.getAvatarUrl(user?.avatar);
  }

  getLoginCount(): string {
    // Mock data - replace with actual login count
    return '127';
  }

  getLastLogin(): string {
    // Mock data - replace with actual last login
    return 'Today';
  }

  getProjectCount(): string {
    // Mock data - replace with actual project count
    return '8';
  }
}