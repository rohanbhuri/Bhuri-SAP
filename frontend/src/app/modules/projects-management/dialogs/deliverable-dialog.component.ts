import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Deliverable, Project } from '../projects-management.service';

@Component({
  selector: 'app-deliverable-dialog',
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
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.deliverable ? 'Edit Deliverable' : 'New Deliverable' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="deliverableForm" class="deliverable-form">
        <mat-form-field appearance="outline" *ngIf="!data.projectId">
          <mat-label>Project</mat-label>
          <mat-select formControlName="projectId" required>
            <mat-option *ngFor="let project of data.projects" [value]="project._id">
              {{ project.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Deliverable Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="document">Document</mat-option>
              <mat-option value="software">Software</mat-option>
              <mat-option value="design">Design</mat-option>
              <mat-option value="report">Report</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="in-progress">In Progress</mat-option>
              <mat-option value="review">Review</mat-option>
              <mat-option value="completed">Completed</mat-option>
              <mat-option value="rejected">Rejected</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="duePicker" formControlName="dueDate">
          <mat-datepicker-toggle matIconSuffix [for]="duePicker"></mat-datepicker-toggle>
          <mat-datepicker #duePicker></mat-datepicker>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Progress (%)</mat-label>
            <input matInput type="number" min="0" max="100" formControlName="progress">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Estimated Hours</mat-label>
            <input matInput type="number" formControlName="estimatedHours">
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="billable">Billable</mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!deliverableForm.valid">
        {{ data.deliverable ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .deliverable-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 500px;
      }

      .form-row {
        display: flex;
        gap: 16px;
      }

      .form-row mat-form-field {
        flex: 1;
      }
    `,
  ],
})
export class DeliverableDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DeliverableDialogComponent>);

  deliverableForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { 
    deliverable?: Deliverable; 
    projectId?: string;
    projects?: Project[];
  }) {
    this.deliverableForm = this.fb.group({
      projectId: [data.projectId || data.deliverable?.projectId || '', Validators.required],
      name: [data.deliverable?.name || '', Validators.required],
      description: [data.deliverable?.description || ''],
      type: [data.deliverable?.type || 'document'],
      status: [data.deliverable?.status || 'pending'],
      dueDate: [data.deliverable?.dueDate ? new Date(data.deliverable.dueDate) : new Date()],
      progress: [data.deliverable?.progress || 0],
      estimatedHours: [data.deliverable?.estimatedHours || 0],
      billable: [data.deliverable?.billable !== undefined ? data.deliverable.billable : true],
    });
  }

  onSave() {
    if (this.deliverableForm.valid) {
      this.dialogRef.close(this.deliverableForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}