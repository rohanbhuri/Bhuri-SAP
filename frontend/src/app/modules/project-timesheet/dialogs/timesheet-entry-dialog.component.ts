import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TimesheetEntry } from '../project-timesheet.service';

@Component({
  selector: 'app-timesheet-entry-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.entry ? 'Edit' : 'Add' }} Time Entry</h2>
    <form [formGroup]="entryForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-grid">
          <mat-form-field>
            <mat-label>Employee ID</mat-label>
            <input matInput formControlName="employeeId" required>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Project</mat-label>
            <mat-select formControlName="projectId" required>
              <mat-option value="proj1">Website Redesign</mat-option>
              <mat-option value="proj2">Mobile App</mat-option>
              <mat-option value="proj3">API Development</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Task ID (Optional)</mat-label>
            <input matInput formControlName="taskId">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Start Time</mat-label>
            <input matInput type="time" formControlName="startTime" required>
          </mat-form-field>

          <mat-form-field>
            <mat-label>End Time</mat-label>
            <input matInput type="time" formControlName="endTime" required>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" required></textarea>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Hourly Rate</mat-label>
            <input matInput type="number" formControlName="hourlyRate" step="0.01">
          </mat-form-field>

          <mat-checkbox formControlName="billable">Billable</mat-checkbox>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="entryForm.invalid">
          {{ data.entry ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      min-width: 500px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    mat-dialog-content {
      padding: 20px 0;
    }
  `]
})
export class TimesheetEntryDialogComponent {
  private fb = inject(FormBuilder);
  entryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TimesheetEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entry?: TimesheetEntry }
  ) {
    this.entryForm = this.fb.group({
      employeeId: [data.entry?.employeeId || '', Validators.required],
      projectId: [data.entry?.projectId || '', Validators.required],
      taskId: [data.entry?.taskId || ''],
      date: [data.entry?.date || new Date(), Validators.required],
      startTime: [data.entry?.startTime || '', Validators.required],
      endTime: [data.entry?.endTime || '', Validators.required],
      description: [data.entry?.description || '', Validators.required],
      hourlyRate: [data.entry?.hourlyRate || null],
      billable: [data.entry?.billable || true],
      status: [data.entry?.status || 'draft']
    });
  }

  onSubmit() {
    if (this.entryForm.valid) {
      const formValue = this.entryForm.value;
      const result = {
        ...this.data.entry,
        ...formValue,
        totalHours: this.calculateHours(formValue.startTime, formValue.endTime)
      };
      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private calculateHours(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
}