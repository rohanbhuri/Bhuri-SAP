import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-permission-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEdit ? 'Edit Permission' : 'Add New Permission' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="permissionForm" class="permission-form">
        <mat-form-field appearance="outline">
          <mat-label>Module</mat-label>
          <input matInput formControlName="module" required />
          <mat-error *ngIf="permissionForm.get('module')?.hasError('required')">
            Module is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Action</mat-label>
          <mat-select formControlName="action" required>
            <mat-option value="read">Read</mat-option>
            <mat-option value="write">Write</mat-option>
            <mat-option value="edit">Edit</mat-option>
            <mat-option value="delete">Delete</mat-option>
          </mat-select>
          <mat-error *ngIf="permissionForm.get('action')?.hasError('required')">
            Action is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Resource</mat-label>
          <input matInput formControlName="resource" required />
          <mat-error
            *ngIf="permissionForm.get('resource')?.hasError('required')"
          >
            Resource is required
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
        [disabled]="permissionForm.invalid || loading()"
      >
        {{ loading() ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .permission-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 360px;
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
    `,
  ],
})
export class PermissionDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PermissionDialogComponent>);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserManagementService);
  public data = inject(MAT_DIALOG_DATA);

  permissionForm: FormGroup;
  isEdit = false;
  loading = signal(false);

  constructor() {
    this.isEdit = !!this.data?.permission;
    this.permissionForm = this.fb.group({
      module: ['', Validators.required],
      action: ['', Validators.required],
      resource: ['', Validators.required],
    });

    if (this.isEdit && this.data.permission) {
      this.permissionForm.patchValue({
        module: this.data.permission.module,
        action: this.data.permission.action,
        resource: this.data.permission.resource,
      });
    }
  }

  onSave() {
    if (this.permissionForm.invalid) return;
    this.loading.set(true);
    const payload = this.permissionForm.value;

    const op = this.isEdit
      ? this.userService.updatePermission(
          this.data.permission._id || this.data.permission.id,
          payload
        )
      : this.userService.createPermission(payload);

    op.subscribe({
      next: (res) => {
        this.loading.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          err?.error?.message || err.message || 'Failed to save permission';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
