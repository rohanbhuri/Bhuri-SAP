import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Contact } from '../crm.service';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Contact' : 'Add Contact' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" required />
        </mat-form-field>
      </div>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" required />
      </mat-form-field>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Company</mat-label>
          <input matInput formControlName="company" />
        </mat-form-field>
      </div>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Position</mat-label>
          <input matInput formControlName="position" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Active</mat-option>
            <mat-option value="inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Notes</mat-label>
        <textarea matInput rows="3" formControlName="notes"></textarea>
      </mat-form-field>
      <div class="actions">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </div>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 16px; padding: 16px 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .full-width { width: 100%; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class ContactDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ContactDialogComponent>);
  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Contact | null) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || ''],
      company: [this.data?.company || ''],
      position: [this.data?.position || ''],
      notes: [this.data?.notes || ''],
      status: [this.data?.status || 'active', Validators.required]
    });
  }

  close() { this.dialogRef.close(); }
  
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}