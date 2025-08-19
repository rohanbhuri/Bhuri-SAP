import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { PreferencesService } from '../../services/preferences.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="preferences-container">
      <mat-card class="preferences-card">
        <mat-card-header>
          <mat-card-title>User Preferences</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="preferencesForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Theme</mat-label>
              <mat-select formControlName="theme">
                <mat-option value="light">Light</mat-option>
                <mat-option value="dark">Dark</mat-option>
                <mat-option value="auto">Auto</mat-option>
              </mat-select>
            </mat-form-field>
            
            <div class="color-section">
              <h3>Custom Colors</h3>
              
              <div class="color-picker">
                <label>Primary Color</label>
                <input type="color" formControlName="primaryColor" class="color-input">
              </div>
              
              <div class="color-picker">
                <label>Accent Color</label>
                <input type="color" formControlName="accentColor" class="color-input">
              </div>
              
              <div class="color-picker">
                <label>Secondary Color</label>
                <input type="color" formControlName="secondaryColor" class="color-input">
              </div>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="savePreferences()" [disabled]="loading()">
            {{ loading() ? 'Saving...' : 'Save Preferences' }}
          </button>
          <button mat-button color="warn" (click)="resetToDefault()">Reset to Default</button>
        </mat-card-actions>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .preferences-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .preferences-card {
      width: 100%;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .color-section {
      margin: 24px 0;
    }
    
    .color-section h3 {
      margin-bottom: 16px;
    }
    
    .color-picker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    
    .color-picker label {
      font-weight: 500;
    }
    
    .color-input {
      width: 60px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    
    mat-card-actions {
      gap: 12px;
    }
  `]
})
export class PreferencesComponent {
  private fb = inject(FormBuilder);
  private preferencesService = inject(PreferencesService);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  
  loading = signal(false);
  
  preferencesForm = this.fb.group({
    theme: ['light'],
    primaryColor: ['#1976d2'],
    accentColor: ['#ff4081'],
    secondaryColor: ['#424242']
  });
  
  ngOnInit() {
    this.loadPreferences();
    
    // Apply theme changes on form value changes
    this.preferencesForm.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);
      this.themeService.applyTheme(values);
    });
  }
  
  loadPreferences() {
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        if (prefs) {
          this.preferencesForm.patchValue(prefs);
          this.themeService.applyTheme(prefs);
        } else {
          // Use default theme when no preferences found
          this.themeService.applyTheme();
        }
      },
      error: () => {
        // Use default theme if error loading preferences
        this.themeService.applyTheme();
      }
    });
  }
  
  savePreferences() {
    if (!this.authService.isAuthenticated() || !this.authService.getToken()) {
      this.snackBar.open('Please log in to save preferences', 'Close', { duration: 3000 });
      return;
    }
    
    this.loading.set(true);
    const preferences = this.preferencesForm.value;
    
    this.preferencesService.saveUserPreferences(preferences as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.themeService.applyTheme(preferences);
        this.snackBar.open('Preferences saved successfully', 'Close', { duration: 3000 });
      },
      error: (error: any) => {
        this.loading.set(false);
        console.error('Save preferences error:', error);
        if (error.status === 401) {
          this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 3000 });
          this.authService.logout();
        } else {
          this.snackBar.open('Failed to save preferences', 'Close', { duration: 3000 });
        }
      }
    });
  }
  
  resetToDefault() {
    this.preferencesForm.patchValue({
      theme: 'light',
      primaryColor: '#1976d2',
      accentColor: '#ff4081',
      secondaryColor: '#424242'
    });
    this.themeService.applyTheme({ theme: 'light' });
    this.savePreferences();
  }
  

}