import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { AuthService, Organization } from '../../services/auth.service';

@Component({
  selector: 'app-select-organization',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
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
              @for (org of organizations(); track org.id) {
                <mat-list-item (click)="selectOrganization(org.id)" class="org-item">
                  <span matListItemTitle>{{ org.name }}</span>
                </mat-list-item>
              }
            </mat-list>
          } @else {
            <p class="no-orgs">No organizations available</p>
          }
        </mat-card-content>

        <mat-card-actions>
          <button mat-button color="primary" (click)="skip()">Skip for now</button>
        </mat-card-actions>
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
    }
    
    .org-item:hover {
      background-color: #f5f5f5;
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

  loadOrganizations() {
    // Load both user organizations and public organizations
    const myOrgs$ = this.authService.getMyOrganizations();
    const publicOrgs$ = this.authService.getPublicOrganizations();
    
    // Combine both requests
    Promise.all([
      myOrgs$.toPromise(),
      publicOrgs$.toPromise()
    ]).then(([myOrgs, publicOrgs]) => {
      // Merge and deduplicate organizations
      const allOrgs = [...(myOrgs || []), ...(publicOrgs || [])];
      const uniqueOrgs = allOrgs.filter((org, index, self) => 
        index === self.findIndex(o => o.id === org.id)
      );
      
      this.organizations.set(uniqueOrgs);
      if (uniqueOrgs.length === 0) {
        this.skip();
      }
    }).catch((error) => {
      this.snackBar.open('Failed to load organizations', 'Close', {
        duration: 3000
      });
      this.skip();
    });
  }

  selectOrganization(organizationId: string) {
    this.loading.set(true);
    this.authService.updateUserOrganization(organizationId);
    this.loading.set(false);
    this.router.navigate(['/dashboard']);
  }

  skip() {
    this.router.navigate(['/dashboard']);
  }
}