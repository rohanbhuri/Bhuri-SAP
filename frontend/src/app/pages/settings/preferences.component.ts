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
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please log in to access preferences', 'Close', { duration: 3000 });
      return;
    }
    
    this.loadPreferences();
    
    // Apply theme changes on form value changes
    this.preferencesForm.valueChanges.subscribe(values => {
      if (values.primaryColor && values.accentColor && values.secondaryColor) {
        this.themeService.applyTheme(values);
      }
    });
  }
  
  loadPreferences() {
    // Load brand colors as defaults
    const brandColors = this.getBrandColors();
    const defaults = {
      theme: 'light',
      primaryColor: brandColors.primary,
      accentColor: brandColors.accent,
      secondaryColor: brandColors.secondary
    };
    
    this.preferencesForm.patchValue(defaults);
    
    this.preferencesService.getUserPreferences().subscribe({
      next: (prefs) => {
        if (prefs) {
          this.preferencesForm.patchValue({ ...defaults, ...prefs });
        }
      },
      error: () => {
        console.log('No user preferences found, using defaults');
      }
    });
  }
  
  private getBrandColors() {
    if (typeof window !== 'undefined' && (window as any).brandConfig) {
      return (window as any).brandConfig.colors;
    }
    return { primary: '#10B981', secondary: '#374151', accent: '#EF4444' };
  }
  
  savePreferences() {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please log in to save preferences', 'Close', { duration: 3000 });
      return;
    }
    
    this.loading.set(true);
    const formValues = this.preferencesForm.value;
    const preferences = {
      theme: formValues.theme || 'light',
      primaryColor: formValues.primaryColor || '#10B981',
      accentColor: formValues.accentColor || '#EF4444',
      secondaryColor: formValues.secondaryColor || '#374151'
    };
    
    this.preferencesService.saveUserPreferences(preferences).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Preferences saved successfully', 'Close', { duration: 3000 });
      },
      error: (error: any) => {
        this.loading.set(false);
        console.error('Save preferences error:', error);
        this.snackBar.open('Failed to save preferences', 'Close', { duration: 3000 });
      }
    });
  }
  
  resetToDefault() {
    const brandColors = this.getBrandColors();
    const defaults = {
      theme: 'light',
      primaryColor: brandColors.primary,
      accentColor: brandColors.accent,
      secondaryColor: brandColors.secondary
    };
    
    this.preferencesForm.patchValue(defaults);
    this.savePreferences();
  }
  

}