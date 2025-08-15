import { Component, inject, signal, OnInit } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Role' : 'Add New Role' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="roleForm" class="role-form">
        <mat-form-field appearance="outline">
          <mat-label>Role Name</mat-label>
          <input matInput formControlName="name" required />
          <mat-error *ngIf="roleForm.get('name')?.hasError('required')">
            Role name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="custom">Custom</mat-option>
            <mat-option value="staff">Staff</mat-option>
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="super_admin">Super Admin</mat-option>
          </mat-select>
          <mat-error *ngIf="roleForm.get('type')?.hasError('required')">
            Type is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="3" formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Permissions</mat-label>
          <mat-select formControlName="permissionIds" multiple>
            @for (perm of permissions(); track perm._id) {
            <mat-option [value]="perm._id"
              >{{ perm.module }}: {{ perm.action }}
              {{ perm.resource }}</mat-option
            >
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="roleForm.invalid || loading()"
      >
        {{ loading() ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .role-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 420px;
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
export class RoleDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RoleDialogComponent>);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserManagementService);
  public data = inject(MAT_DIALOG_DATA);

  roleForm: FormGroup;
  isEdit = false;
  loading = signal(false);
  permissions = signal<any[]>([]);

  constructor() {
    this.isEdit = !!this.data?.role;
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      type: ['custom', Validators.required],
      description: [''],
      permissionIds: [[]],
    });
  }

  ngOnInit() {
    this.loadPermissions();
    if (this.isEdit && this.data.role) {
      this.roleForm.patchValue({
        name: this.data.role.name,
        type: this.data.role.type || 'custom',
        description: this.data.role.description || '',
        permissionIds: this.data.role.permissionIds || [],
      });
    }
  }

  private loadPermissions() {
    this.userService.getPermissions().subscribe({
      next: (perms) => this.permissions.set(perms),
      error: () => this.permissions.set([]),
    });
  }

  onSave() {
    if (this.roleForm.invalid) return;
    this.loading.set(true);
    const payload = this.roleForm.value;

    const op = this.isEdit
      ? this.userService.updateRole(
          this.data.role._id || this.data.role.id,
          payload
        )
      : this.userService.createRole(payload);

    op.subscribe({
      next: (res) => {
        this.loading.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || err.message || 'Failed to save role';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
