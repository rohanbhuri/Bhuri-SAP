import { Component, inject, signal, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthService, User, UpdateProfileRequest } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    NavbarComponent,
    BottomNavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="edit-container">
      <!-- Header Card -->
      <mat-card class="header-card">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>edit</mat-icon>
          </div>
          <div class="header-text">
            <h2>Edit Profile</h2>
            <p>Update your personal information</p>
          </div>
        </div>
      </mat-card>

      <!-- Edit Form Card -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="title-icon">person</mat-icon>
            Personal Information
          </mat-card-title>
        </mat-card-header>
        
        <mat-divider></mat-divider>
        
        <mat-card-content>
          <!-- Avatar Upload Section -->
          <div class="avatar-section">
            <h4 class="section-title">
              <mat-icon>account_circle</mat-icon>
              Profile Picture
            </h4>
            <div class="avatar-upload">
              <div class="current-avatar">
                @if (currentUser()?.avatar) {
                  <img [src]="getAvatarUrl()" alt="Current Avatar" class="avatar-preview">
                } @else {
                  <div class="avatar-placeholder">
                    <mat-icon>person</mat-icon>
                  </div>
                }
              </div>
              <div class="avatar-actions">
                <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" style="display: none;">
                <button mat-raised-button color="primary" type="button" (click)="fileInput.click()" [disabled]="uploadingAvatar()">
                  @if (uploadingAvatar()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    <mat-icon>upload</mat-icon>
                  }
                  <span>{{ uploadingAvatar() ? 'Uploading...' : 'Upload New Photo' }}</span>
                </button>
                @if (currentUser()?.avatar) {
                  <button mat-stroked-button type="button" (click)="removeAvatar()" [disabled]="uploadingAvatar()">
                    <mat-icon>delete</mat-icon>
                    <span>Remove</span>
                  </button>
                }
              </div>
            </div>
          </div>
          
          <mat-divider></mat-divider>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-icon matSuffix class="field-icon primary-color">person</mat-icon>
                @if (profileForm.get('firstName')?.hasError('required') && profileForm.get('firstName')?.touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-icon matSuffix class="field-icon secondary-color">person_outline</mat-icon>
                @if (profileForm.get('lastName')?.hasError('required') && profileForm.get('lastName')?.touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>
            
            <mat-form-field appearance="outline" class="form-field full-width readonly-field">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" readonly>
              <mat-icon matSuffix class="field-icon accent-color">lock</mat-icon>
              <mat-hint>
                <mat-icon class="hint-icon">info</mat-icon>
                Email cannot be changed for security reasons. Contact support if you need to update your email.
              </mat-hint>
            </mat-form-field>

            <!-- Future fields placeholder -->
            <div class="future-fields">
              <h4 class="section-title">
                <mat-icon>info</mat-icon>
                Additional Information (Coming Soon)
              </h4>
              <div class="placeholder-fields">
                <mat-form-field appearance="outline" class="form-field" disabled>
                  <mat-label>Phone Number</mat-label>
                  <input matInput placeholder="Will be available soon">
                  <mat-icon matSuffix>phone</mat-icon>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="form-field" disabled>
                  <mat-label>Department</mat-label>
                  <input matInput placeholder="Will be available soon">
                  <mat-icon matSuffix>business</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>
        
        <mat-divider></mat-divider>
        
        <mat-card-actions class="form-actions">
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading() || profileForm.invalid" class="action-btn primary-btn">
            @if (loading()) {
              <mat-spinner diameter="20" class="btn-spinner"></mat-spinner>
            } @else {
              <mat-icon>save</mat-icon>
            }
            <span>{{ loading() ? 'Saving...' : 'Save Changes' }}</span>
          </button>
          
          <button mat-stroked-button class="action-btn secondary-btn" (click)="cancel()" [disabled]="loading()">
            <mat-icon>cancel</mat-icon>
            <span>Cancel</span>
          </button>
          
          <button mat-button class="action-btn accent-btn" (click)="resetForm()" [disabled]="loading()">
            <mat-icon>refresh</mat-icon>
            <span>Reset</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
    
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [`
    .edit-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Header Card */
    .header-card {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-primary) 12%, var(--theme-surface)),
        color-mix(in srgb, var(--theme-secondary) 8%, var(--theme-surface))
      );
      border: 1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
    }

    .header-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }

    .header-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--theme-on-primary);
    }

    .header-text h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--theme-on-surface);
    }

    .header-text p {
      margin: 0;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-size: 16px;
    }

    /* Form Card */
    .form-card {
      border-left: 4px solid var(--theme-primary);
    }

    .title-icon {
      margin-right: 8px;
      color: var(--theme-primary);
    }

    mat-card-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: var(--theme-on-surface);
    }

    .profile-form {
      padding: 24px 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-field {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .field-icon {
      opacity: 0.7;
    }

    .field-icon.primary-color {
      color: var(--theme-primary);
    }

    .field-icon.secondary-color {
      color: var(--theme-secondary);
    }

    .field-icon.accent-color {
      color: var(--theme-accent);
    }

    /* Future Fields Section */
    .future-fields {
      margin-top: 32px;
      padding: 20px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--theme-accent) 5%, transparent);
      border: 1px solid color-mix(in srgb, var(--theme-accent) 20%, transparent);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: color-mix(in srgb, var(--theme-on-surface) 80%, transparent);
      font-size: 16px;
      font-weight: 500;
    }

    .section-title mat-icon {
      color: var(--theme-accent);
    }

    .placeholder-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* Form Actions */
    .form-actions {
      padding: 24px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-btn {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      border-radius: 12px !important;
      transition: all 0.3s ease;
      min-width: 140px;
    }

    .action-btn:hover:not([disabled]) {
      transform: translateY(-2px);
    }

    .primary-btn:hover:not([disabled]) {
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }

    .secondary-btn {
      color: var(--theme-secondary) !important;
      border-color: var(--theme-secondary) !important;
    }

    .secondary-btn:hover:not([disabled]) {
      background-color: color-mix(in srgb, var(--theme-secondary) 10%, transparent) !important;
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-secondary) 25%, transparent);
    }

    .accent-btn {
      color: var(--theme-accent) !important;
    }

    .accent-btn:hover:not([disabled]) {
      background-color: color-mix(in srgb, var(--theme-accent) 10%, transparent) !important;
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-accent) 25%, transparent);
    }

    .btn-spinner {
      margin-right: 8px;
    }

    /* Form Field Enhancements */
    .mat-mdc-form-field {
      .mat-mdc-text-field-wrapper {
        border-radius: 12px !important;
      }

      .mdc-notched-outline__leading,
      .mdc-notched-outline__trailing {
        border-radius: 12px !important;
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .edit-container {
        padding: 12px;
        gap: 16px;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .header-text h2 {
        font-size: 20px;
      }

      .form-row,
      .placeholder-fields {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .action-btn {
        width: 100%;
        justify-content: center;
      }

      .header-icon {
        width: 50px;
        height: 50px;
      }

      .header-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    /* Dark theme specific adjustments */
    :host-context(body.dark-theme) {
      .header-card {
        background: linear-gradient(135deg, 
          color-mix(in srgb, var(--theme-primary) 15%, var(--theme-surface)),
          color-mix(in srgb, var(--theme-secondary) 10%, var(--theme-surface))
        );
        border-color: color-mix(in srgb, var(--theme-primary) 35%, transparent);
      }

      .form-card {
        background-color: var(--theme-surface);
        color: var(--theme-on-surface);
      }

      .future-fields {
        background: color-mix(in srgb, var(--theme-accent) 12%, var(--theme-surface));
        border-color: color-mix(in srgb, var(--theme-accent) 30%, transparent);
      }

      .section-title {
        color: var(--theme-on-surface);
      }

      .header-text p {
        color: color-mix(in srgb, var(--theme-on-surface) 80%, transparent);
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .header-icon,
      .action-btn,
      .future-fields {
        border: 2px solid var(--theme-on-surface);
      }

      .field-icon {
        opacity: 1;
      }
    }

    /* Loading state */
    .action-btn[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Form validation styles */
    .mat-mdc-form-field.mat-form-field-invalid .mat-mdc-text-field-wrapper {
      border-color: #f44336 !important;
    }

    .mat-mdc-form-field.mat-form-field-invalid .field-icon {
      color: #f44336 !important;
    }

    /* Read-only email field styles */
    .readonly-field {
      position: relative;
    }

    .readonly-field::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        color-mix(in srgb, var(--theme-accent) 5%, transparent) 2px,
        color-mix(in srgb, var(--theme-accent) 5%, transparent) 4px
      );
      pointer-events: none;
      border-radius: 12px;
    }

    .mat-mdc-form-field input[readonly] {
      background-color: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-on-surface)) !important;
      cursor: not-allowed;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent) !important;
    }

    .mat-mdc-form-field:has(input[readonly]) {
      .mat-mdc-text-field-wrapper {
        background-color: color-mix(in srgb, var(--theme-surface) 95%, var(--theme-on-surface)) !important;
        border: 2px solid color-mix(in srgb, var(--theme-accent) 30%, transparent) !important;
      }
      
      .mat-mdc-floating-label {
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent) !important;
      }
    }

    .hint-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-right: 4px;
      color: var(--theme-accent);
    }

    .mat-mdc-form-field-hint {
      display: flex;
      align-items: center;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent) !important;
      font-size: 12px;
    }

    /* Avatar Section */
    .avatar-section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--theme-on-surface);
    }

    .avatar-upload {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .current-avatar {
      flex-shrink: 0;
    }

    .avatar-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--theme-primary);
      box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }

    .avatar-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--theme-primary);
      box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent);
    }

    .avatar-placeholder mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--theme-on-primary);
    }

    .avatar-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .avatar-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 160px;
      justify-content: center;
    }

    /* Dark theme adjustments for read-only field */
    :host-context(body.dark-theme) {
      .mat-mdc-form-field input[readonly] {
        background-color: color-mix(in srgb, var(--theme-surface) 90%, var(--theme-on-surface)) !important;
      }

      .mat-mdc-form-field:has(input[readonly]) .mat-mdc-text-field-wrapper {
        background-color: color-mix(in srgb, var(--theme-surface) 90%, var(--theme-on-surface)) !important;
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .avatar-upload {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .avatar-actions {
        width: 100%;
      }

      .avatar-actions button {
        width: 100%;
      }
    }
  `]
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  loading = signal(false);
  uploadingAvatar = signal(false);
  currentUser = signal<User | null>(null);
  
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{value: '', disabled: true}] // Disabled for security
  });
  
  ngOnInit() {
    // Load fresh profile data from backend
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.populateForm(user);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Fallback to cached user data
        this.authService.currentUser$.subscribe(user => {
          if (user) {
            this.currentUser.set(user);
            this.populateForm(user);
          }
        });
      }
    });
  }

  private populateForm(user: User) {
    // Set editable fields
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    // Set email value directly since it's disabled
    this.profileForm.get('email')?.setValue(user.email);
  }
  
  onSubmit() {
    if (this.profileForm.valid) {
      this.loading.set(true);
      
      // Only send editable fields (firstName and lastName)
      const updateData: UpdateProfileRequest = {
        firstName: this.profileForm.get('firstName')?.value ?? '',
        lastName: this.profileForm.get('lastName')?.value ?? ''
      };
      
      this.authService.updateProfile(updateData).subscribe({
        next: (updatedUser) => {
          this.loading.set(false);
          this.currentUser.set(updatedUser);
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Error updating profile:', error);
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }
  
  cancel() {
    this.router.navigate(['/profile']);
  }

  resetForm() {
    // Reset form to original user data
    const user = this.currentUser();
    if (user) {
      this.populateForm(user);
    }
    
    // Mark form as pristine
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select a valid image file', 'Close', { duration: 3000 });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 5MB', 'Close', { duration: 3000 });
        return;
      }
      
      this.uploadAvatar(file);
    }
  }

  uploadAvatar(file: File) {
    this.uploadingAvatar.set(true);
    
    this.authService.uploadAvatar(file).subscribe({
      next: (updatedUser) => {
        this.uploadingAvatar.set(false);
        this.currentUser.set(updatedUser);
        this.snackBar.open('Avatar updated successfully', 'Close', { duration: 3000 });
        // Clear the file input
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error: (error) => {
        this.uploadingAvatar.set(false);
        console.error('Error uploading avatar:', error);
        this.snackBar.open('Failed to upload avatar. Please try again.', 'Close', { duration: 5000 });
        // Clear the file input
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      }
    });
  }

  removeAvatar() {
    // TODO: Implement remove avatar API call
    this.snackBar.open('Remove avatar functionality will be implemented soon', 'Close', { duration: 3000 });
  }

  getAvatarUrl(): string {
    const user = this.currentUser();
    return this.authService.getAvatarUrl(user?.avatar);
  }
}