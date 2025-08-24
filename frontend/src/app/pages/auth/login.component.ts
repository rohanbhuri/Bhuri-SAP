import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Organization } from '../../services/auth.service';
import { BrandConfigService } from '../../services/brand-config.service';
import { SeoService } from '../../services/seo.service';
import { SeoConfigService } from '../../services/seo-config.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-login',
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
      <mat-card class="auth-card" [style.background]="brandConfig.getPrimaryColor() + '11'" [style.border-color]="brandConfig.getPrimaryColor() + '33'">
        <mat-card-header>
          <div class="logo-container">
            <img [src]="brandConfig.getLogo()" [alt]="brandConfig.getBrandName()" class="logo" />
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              @if (loginForm.get('email')?.hasError('required')) {
              <mat-error>Email is required</mat-error>
              } @if (loginForm.get('email')?.hasError('email')) {
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
              @if (loginForm.get('password')?.hasError('required')) {
              <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="loginForm.invalid || loading()"
              class="full-width"
            >
              {{ loading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
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
        border: 2px solid;
        border-radius: var(--border-radius);
        box-shadow: 0 8px 32px color-mix(in srgb, var(--theme-on-surface) 10%, transparent);
        background: var(--theme-surface);
        transition: var(--transition);
      }
      
      :host-context(body.dark-theme) .auth-card {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent);
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
        color: var(--theme-primary);
        font-weight: 500;
        transition: var(--transition);
      }
      
      a:hover {
        color: color-mix(in srgb, var(--theme-primary) 80%, black);
        text-decoration: underline;
      }

      mat-card-actions {
        justify-content: center;
        color: var(--theme-on-surface);
      }
      
      .full-width button {
        height: 48px;
        font-weight: 500;
        border-radius: var(--border-radius);
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private seoService = inject(SeoService);
  private seoConfigService = inject(SeoConfigService);
  private errorHandler = inject(ErrorHandlerService);
  protected brandConfig = inject(BrandConfigService);

  loading = signal(false);

  ngOnInit() {
    this.setupSEO();
  }

  private setupSEO() {
    const seoData = this.seoConfigService.getPageSEO('login');
    this.seoService.updateSEO(seoData);
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);

      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password } as any).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.errorHandler.showSuccess('Login successful! Welcome back!');
          this.router.navigate(['/select-organization']);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorHandler.handleAuthError(error);
        },
      });
    }
  }
}
