import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Organization, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { BrandConfigService } from '../../services/brand-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="dashboard-content">
      <div class="welcome-section">
        <h1>Welcome to {{ brandConfig.getBrandName() }}</h1>
        @if (currentUser()) {
          <p>Hello, {{ currentUser()?.firstName }}!</p>
          @if (currentUser()?.organizationId) {
            <p>Current Organization: {{ getCurrentOrgName() }}</p>
          } @else {
            <p>No organization selected. Choose one from the dropdown above.</p>
          }
        }
      </div>

      <div class="cards-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Users</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage system users and permissions</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Organizations</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage organizations and settings</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Roles</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Configure roles and permissions</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Modules</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Activate and manage system modules</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .dashboard-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: calc(100vh - 128px);
    }
    
    .welcome-section {
      margin-bottom: 32px;
      text-align: center;
    }
    
    .welcome-section h1 {
      margin-bottom: 16px;
      color: var(--theme-on-surface);
      font-weight: 500;
    }
    
    .welcome-section p {
      color: var(--theme-on-surface);
      opacity: 0.8;
      font-size: 1.1rem;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .dashboard-card {
      cursor: pointer;
      transition: var(--transition);
      background-color: var(--theme-surface);
      border: 1px solid transparent;
    }
    
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      border-color: var(--theme-primary);
    }
    
    .dashboard-card:focus-visible {
      outline: var(--focus-outline);
      outline-offset: 2px;
    }
    
    .dashboard-card mat-card-title {
      color: var(--theme-primary);
      font-weight: 500;
    }
    
    .dashboard-card mat-card-content p {
      color: var(--theme-on-surface);
      opacity: 0.8;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  protected brandConfig = inject(BrandConfigService);

  currentUser = signal<User | null>(null);
  organizations = signal<Organization[]>([]);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
    
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.authService.getOrganizations().subscribe({
      next: (orgs) => this.organizations.set(orgs),
      error: () => {
        this.snackBar.open('Failed to load organizations', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onOrganizationChange(organizationId: string) {
    this.authService.updateUserOrganization(organizationId);
    this.snackBar.open('Organization updated successfully', 'Close', {
      duration: 2000
    });
  }

  getCurrentOrgName(): string {
    const user = this.currentUser();
    if (!user?.organizationId) return '';
    
    const org = this.organizations().find(o => o.id === user.organizationId);
    return org?.name || '';
  }

  logout() {
    this.authService.logout();
  }
}