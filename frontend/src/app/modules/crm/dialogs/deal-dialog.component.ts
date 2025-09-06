import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Deal } from '../crm.service';

@Component({
  selector: 'app-deal-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Deal' : 'Add Deal' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput rows="3" formControlName="description"></textarea>
      </mat-form-field>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Value</mat-label>
          <input matInput formControlName="value" type="number" min="0" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stage</mat-label>
          <mat-select formControlName="stage">
            <mat-option value="prospecting">Prospecting</mat-option>
            <mat-option value="qualification">Qualification</mat-option>
            <mat-option value="proposal">Proposal</mat-option>
            <mat-option value="negotiation">Negotiation</mat-option>
            <mat-option value="closed-won">Closed Won</mat-option>
            <mat-option value="closed-lost">Closed Lost</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Probability (%)</mat-label>
          <input matInput formControlName="probability" type="number" min="0" max="100" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Expected Close Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="expectedCloseDate" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>
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
export class DealDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<DealDialogComponent>);
  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Deal | null) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || ''],
      value: [this.data?.value || null, [Validators.required, Validators.min(0)]],
      stage: [this.data?.stage || 'prospecting', Validators.required],
      probability: [this.data?.probability || 0, [Validators.min(0), Validators.max(100)]],
      expectedCloseDate: [this.data?.expectedCloseDate || null]
    });
  }

  close() { this.dialogRef.close(); }
  
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}