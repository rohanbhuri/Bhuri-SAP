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
        <h1>Welcome to Beax RM</h1>
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
    }
    
    .welcome-section {
      margin-bottom: 32px;
      text-align: center;
    }
    
    .welcome-section h1 {
      margin-bottom: 16px;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .dashboard-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }
    
    .dashboard-card:hover {
      transform: translateY(-4px);
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

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