import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Change Password</h2>
    
    <mat-dialog-content>
      <form [formGroup]="passwordForm" class="password-form">
        <mat-form-field appearance="outline">
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="password" required>
          <mat-error *ngIf="passwordForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="passwordForm.get('password')?.hasError('minlength')">
            Password must be at least 6 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword" required>
          <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
            Please confirm your password
          </mat-error>
          <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
            Passwords do not match
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSave()" 
        [disabled]="passwordForm.invalid || loading()"
      >
        {{ loading() ? 'Updating...' : 'Update Password' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }

    h2[mat-dialog-title] {
      background: var(--theme-surface);
      color: var(--theme-on-surface);
      margin: 0;
      padding: 20px 24px 0;
    }

    mat-dialog-content {
      padding: 20px 24px;
      background: var(--theme-surface);
      color: var(--theme-on-surface);
    }

    mat-dialog-actions {
      padding: 8px 24px 20px;
      background: var(--theme-surface);
    }
  `]
})
export class PasswordDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PasswordDialogComponent>);
  private userService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);
  public data = inject(MAT_DIALOG_DATA);

  passwordForm: FormGroup;
  loading = signal(false);

  constructor() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSave() {
    if (this.passwordForm.valid) {
      this.loading.set(true);
      const password = this.passwordForm.value.password;
      
      this.userService.updateUser(this.data.userId, { password }).subscribe({
        next: (result) => {
          this.loading.set(false);
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Failed to update password:', error);
          const errorMessage = error.error?.message || error.message || 'Failed to update password';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}