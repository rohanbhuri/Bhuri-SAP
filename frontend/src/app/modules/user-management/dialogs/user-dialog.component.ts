import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../user-management.service';
import { PasswordDialogComponent } from './password-dialog.component';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit User' : 'Add New User' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required>
            <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" required>
            <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        @if (!isEdit) {
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
          <mat-error *ngIf="userForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
            Password must be at least 6 characters
          </mat-error>
        </mat-form-field>
        }

        <mat-form-field appearance="outline">
          <mat-label>Organization</mat-label>
          <mat-select formControlName="organizationId">
            <mat-option value="">None</mat-option>
            @for (org of organizations(); track org._id) {
            <mat-option [value]="org._id">{{ org.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Roles</mat-label>
          <mat-select formControlName="roleIds" multiple>
            @for (role of roles(); track role._id) {
            <mat-option [value]="role._id">{{ role.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="checkbox-container">
          <mat-checkbox formControlName="isActive">Active User</mat-checkbox>
        </div>

        @if (isEdit) {
        <div class="password-section">
          <button mat-stroked-button type="button" (click)="openPasswordDialog()">
            <mat-icon>lock</mat-icon>
            Change Password
          </button>
        </div>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSave()" 
        [disabled]="userForm.invalid || loading()"
      >
        {{ loading() ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .checkbox-container {
      margin-top: 8px;
    }

    .password-section {
      margin-top: 8px;
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

    h2[mat-dialog-title] {
      background: var(--theme-surface);
      color: var(--theme-on-surface);
      margin: 0;
      padding: 20px 24px 0;
    }
  `]
})
export class UserDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserDialogComponent>);
  private userService = inject(UserManagementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public data = inject(MAT_DIALOG_DATA);

  userForm: FormGroup;
  isEdit = false;
  loading = signal(false);
  organizations = signal<any[]>([]);
  roles = signal<any[]>([]);

  constructor() {
    this.isEdit = !!this.data?.user;
    this.userForm = this.createForm();
  }

  ngOnInit() {
    this.loadOrganizations();
    this.loadRoles();
    
    if (this.isEdit && this.data.user) {
      this.populateForm(this.data.user);
    }
  }

  private createForm(): FormGroup {
    if (this.isEdit) {
      return this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        organizationId: [''],
        roleIds: [[]],
        isActive: [true]
      });
    } else {
      return this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        organizationId: [''],
        roleIds: [[]],
        isActive: [true]
      });
    }
  }

  private populateForm(user: any) {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organizationId: user.organizationId,
      roleIds: user.roleIds || [],
      isActive: user.isActive
    });
  }

  private loadOrganizations() {
    this.userService.getOrganizations().subscribe({
      next: (orgs) => this.organizations.set(orgs),
      error: (error) => console.error('Failed to load organizations:', error)
    });
  }

  private loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error) => console.error('Failed to load roles:', error)
    });
  }

  onSave() {
    if (this.userForm.valid) {
      this.loading.set(true);
      const formValue = this.userForm.value;
      
      const userData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        organizationId: formValue.organizationId || null,
        roleIds: formValue.roleIds || [],
        isActive: formValue.isActive
      };

      if (!this.isEdit && formValue.password) {
        (userData as any).password = formValue.password;
      }

      const operation = this.isEdit 
        ? this.userService.updateUser(this.data.user.id, userData)
        : this.userService.createUser(userData);

      operation.subscribe({
        next: (result) => {
          this.loading.set(false);
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Failed to save user:', error);
          const errorMessage = error.error?.message || error.message || 'Failed to save user';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  openPasswordDialog() {
    const passwordDialogRef = this.dialog.open(PasswordDialogComponent, {
      width: '400px',
      data: { userId: this.data.user.id }
    });

    passwordDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Password updated successfully', 'Close', { duration: 3000 });
      }
    });
  }
}