import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, Organization } from '../../services/auth.service';

@Component({
  selector: 'app-select-organization',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Select Organization</mat-card-title>
          <mat-card-subtitle>Choose your organization to continue</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          @if (organizations().length > 0) {
            <mat-list>
              @for (org of organizations(); track org._id || org.id) {
                <mat-list-item 
                  (click)="selectOrganization(org._id || org.id)" 
                  class="org-item"
                  [class.selected]="isLastSelected(org._id || org.id)">
                  <div matListItemAvatar>
                    @if (org.avatar) {
                      <img [src]="org.avatar" [alt]="org.name + ' logo'" class="org-avatar">
                    } @else {
                      <div class="org-avatar-placeholder">
                        {{ getOrgInitials(org.name) }}
                      </div>
                    }
                  </div>
                  <span matListItemTitle>{{ org.name }}</span>
                  @if (isLastSelected(org._id || org.id)) {
                    <span matListItemMeta class="selected-indicator">✓</span>
                  }
                </mat-list-item>
              }
            </mat-list>
            
            <div class="or-separator">
              <span>OR</span>
            </div>
            
            <mat-list>
              <mat-list-item 
                (click)="skip()" 
                class="org-item"
                [class.selected]="isPersonalSelected()">
                <div matListItemAvatar>
                  <div class="org-avatar-placeholder personal">
                    P
                  </div>
                </div>
                <span matListItemTitle>Personal</span>
                @if (isPersonalSelected()) {
                  <span matListItemMeta class="selected-indicator">✓</span>
                }
              </mat-list-item>
            </mat-list>
          } @else {
            <p class="no-orgs">No organizations available</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }
    
    .org-item {
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }
    
    .org-item:hover {
      background-color: #f5f5f5;
    }
    
    .org-item.selected {
      background-color: #e3f2fd;
      border: 2px solid #2196f3;
    }
    
    .org-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .org-avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    
    .no-orgs {
      text-align: center;
      color: #666;
      margin: 20px 0;
    }
    
    mat-card-title {
      text-align: center;
    }
    
    mat-card-subtitle {
      text-align: center;
      margin-bottom: 20px;
    }
    
    mat-card-actions {
      justify-content: center;
    }
    
    .selected-indicator {
      color: #2196f3;
      font-size: 18px;
      font-weight: bold;
    }
    
    .or-separator {
      display: flex;
      align-items: center;
      margin: 20px 0;
      text-align: center;
    }
    
    .or-separator::before,
    .or-separator::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #ddd;
    }
    
    .or-separator span {
      padding: 0 15px;
      color: #666;
      font-size: 12px;
      font-weight: 500;
    }
    
    .org-avatar-placeholder.personal {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    }
  `]
})
export class SelectOrganizationComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  organizations = signal<Organization[]>([]);

  ngOnInit() {
    this.loadOrganizations();
  }

  getOrgInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  isLastSelected(orgId: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.organizationId === orgId;
  }

  isPersonalSelected(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !currentUser?.organizationId;
  }

  loadOrganizations() {
    // Load only organizations the user is part of
    this.authService.getMyOrganizations().subscribe({
      next: (myOrgs) => {
        this.organizations.set(myOrgs || []);
        if ((myOrgs || []).length === 0) {
          this.skip();
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to load organizations', 'Close', {
          duration: 3000
        });
        this.skip();
      }
    });
  }

  selectOrganization(organizationId: string) {
    this.loading.set(true);
    this.authService.updateUserOrganization(organizationId);
    this.loading.set(false);
    // Small delay to ensure user object is updated before navigation
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 100);
  }

  skip() {
    this.router.navigate(['/dashboard']);
  }
}