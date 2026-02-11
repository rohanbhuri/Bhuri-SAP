import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="auth-container">
      <div class="animated-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      
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
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                required
              />
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
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

        <!-- <mat-card-actions>
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
        </mat-card-actions> -->
      </mat-card>
      
      <footer class="auth-footer">
        <a href="https://purpul.in" target="_blank" rel="noopener noreferrer">
          <h1><b><i>XRM</i></b></h1><br>
          By PURPUL
        </a>
      </footer>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        position: relative;
        overflow: hidden;
      }

      .animated-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
      }

      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.2;
        will-change: transform;
      }

      .orb-1 {
        width: 500px;
        height: 500px;
        background: #667eea;
        top: -150px;
        left: -150px;
        animation: float1 15s ease-in-out infinite;
      }

      .orb-2 {
        width: 400px;
        height: 400px;
        background: #764ba2;
        bottom: -100px;
        right: -100px;
        animation: float2 10s ease-in-out infinite;
      }

      .orb-3 {
        width: 450px;
        height: 450px;
        background: #f093fb;
        top: 40%;
        right: 30%;
        animation: float3 15s ease-in-out infinite;
      }

      @keyframes float1 {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(50px, -40px) scale(1.15);
        }
        66% {
          transform: translate(-30px, 30px) scale(0.9);
        }
      }

      @keyframes float2 {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(-40px, 30px) scale(0.85);
        }
        66% {
          transform: translate(40px, -40px) scale(1.2);
        }
      }

      @keyframes float3 {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(30px, 50px) scale(1.1);
        }
        66% {
          transform: translate(-50px, -30px) scale(0.95);
        }
      }

      :host-context(body.dark-theme) .gradient-orb {
        opacity: 0.3;
      }

      .auth-card {
        width: 100%;
        max-width: 450px;
        padding: 30px;
        border: 0px solid;
        border-radius: var(--border-radius);
        box-shadow: 0 8px 32px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
        background: var(--theme-surface);
        transition: var(--transition);
        position: relative;
        z-index: 1;
        backdrop-filter: blur(20px);
      }
      
      :host-context(body.dark-theme) .auth-card {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent);
        background: color-mix(in srgb, var(--theme-surface) 95%, transparent);
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      /* Fix for floating label overlapping with error border */
      ::ng-deep .mat-mdc-form-field.mat-form-field-invalid .mat-mdc-floating-label {
        background: var(--theme-surface);
        padding: 0 4px;
      }

      ::ng-deep .mat-mdc-form-field .mat-mdc-floating-label {
        background: var(--theme-surface);
        padding: 0 4px;
      }

      :host-context(body.dark-theme) ::ng-deep .mat-mdc-form-field .mat-mdc-floating-label {
        background: color-mix(in srgb, var(--theme-surface) 95%, transparent);
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

      .auth-footer {
        position: relative;
        z-index: 1;
        margin-top: 24px;
        text-align: center;
        font-size: 12px;
      }

      .auth-footer a {
        color: color-mix(in srgb, var(--theme-on-surface) 30%, transparent);
        text-decoration: none;
        font-weight: 400;
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
      }

      .auth-footer a:hover {
        color: color-mix(in srgb, var(--theme-on-surface) 50%, transparent);
        text-decoration: none;
      }

      :host-context(body.dark-theme) .auth-footer a {
        color: color-mix(in srgb, var(--theme-on-surface) 30%, transparent);
      }

      :host-context(body.dark-theme) .auth-footer a:hover {
        color: color-mix(in srgb, var(--theme-on-surface) 50%, transparent);
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
  hidePassword = signal(true);

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
