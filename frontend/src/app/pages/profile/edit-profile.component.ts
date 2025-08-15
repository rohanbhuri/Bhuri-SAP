import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, User } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="edit-container">
      <mat-card class="edit-card">
        <mat-card-header>
          <mat-card-title>Edit Profile</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading()">
            {{ loading() ? 'Saving...' : 'Save Changes' }}
          </button>
          <button mat-button color="warn" (click)="cancel()">Cancel</button>
        </mat-card-actions>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .edit-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .edit-card {
      width: 100%;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-card-actions {
      gap: 12px;
    }
  `]
})
export class EditProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  loading = signal(false);
  
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  }
  
  onSubmit() {
    if (this.profileForm.valid) {
      this.loading.set(true);
      // TODO: Implement profile update API call
      setTimeout(() => {
        this.loading.set(false);
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/profile']);
      }, 1000);
    }
  }
  
  cancel() {
    this.router.navigate(['/profile']);
  }
}