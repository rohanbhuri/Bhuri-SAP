import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientManagementService } from '../services/client-management.service';

@Component({
  selector: 'app-convert-client-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Convert to Client</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="space-y-4">
        <mat-form-field class="w-full">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName">
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName">
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Password (leave empty for auto-generated)</mat-label>
          <input matInput type="password" formControlName="password">
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
        </mat-form-field>

        <div *ngIf="credentials" class="p-4 bg-green-50 rounded">
          <p class="font-semibold mb-2">Client Created Successfully!</p>
          <p><strong>Email:</strong> {{ credentials.email }}</p>
          <p><strong>Password:</strong> {{ credentials.password }}</p>
          <p class="text-sm text-red-600 mt-2">Please save these credentials!</p>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onConvert()" [disabled]="form.invalid || loading">
        {{ loading ? 'Converting...' : 'Convert to Client' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConvertClientDialogComponent {
  form: FormGroup;
  loading = false;
  credentials: any = null;

  constructor(
    private fb: FormBuilder,
    private clientManagementService: ClientManagementService,
    private dialogRef: MatDialogRef<ConvertClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const nameParts = data.contactPerson.split(' ');
    this.form = this.fb.group({
      firstName: [nameParts[0] || '', Validators.required],
      lastName: [nameParts.slice(1).join(' ') || '', Validators.required],
      password: [''],
      notes: ['']
    });
  }

  onConvert() {
    if (this.form.valid) {
      this.loading = true;
      this.clientManagementService.convertToClient(this.data._id, this.form.value).subscribe({
        next: (result) => {
          this.credentials = result.credentials;
          this.loading = false;
          setTimeout(() => this.dialogRef.close(true), 5000);
        },
        error: (err) => {
          console.error('Failed to convert', err);
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
