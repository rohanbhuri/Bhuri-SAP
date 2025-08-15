import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Organization } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    MatSnackBarModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div class="logo-container">
            <img src="/icons/BEAX.png" alt="Beax RM" class="logo" />
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required />
              @if (signupForm.get('firstName')?.hasError('required')) {
              <mat-error>First name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required />
              @if (signupForm.get('lastName')?.hasError('required')) {
              <mat-error>Last name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              @if (signupForm.get('email')?.hasError('required')) {
              <mat-error>Email is required</mat-error>
              } @if (signupForm.get('email')?.hasError('email')) {
              <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                required
              />
              @if (signupForm.get('password')?.hasError('required')) {
              <mat-error>Password is required</mat-error>
              } @if (signupForm.get('password')?.hasError('minlength')) {
              <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="signupForm.invalid || loading()"
              class="full-width"
            >
              {{ loading() ? 'Creating Account...' : 'Sign Up' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Already have an account? <a routerLink="/login">Login</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
      }

      .auth-card {
        width: 100%;
        max-width: 400px;
        padding: 20px;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .logo-container {
        text-align: center;
        margin-bottom: 20px;
        width: 100%;
      }

      .logo {
        max-height: 100px;
        max-width: 200px;
      }

      a {
        text-decoration: none;
      }

      mat-card-actions {
        justify-content: center;
      }
    `,
  ],
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading.set(true);

      this.authService.signup(this.signupForm.value as any).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/select-organization']);
        },
        error: (error) => {
          this.loading.set(false);
          this.snackBar.open('Signup failed. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }
}
