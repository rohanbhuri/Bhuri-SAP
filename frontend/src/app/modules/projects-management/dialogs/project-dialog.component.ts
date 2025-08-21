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
import { Project } from '../projects-management.service';

@Component({
  selector: 'app-project-dialog',
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
  ],
  template: `
    <h2 mat-dialog-title>{{ data.project ? 'Edit Project' : 'New Project' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="projectForm" class="project-form">
        <mat-form-field appearance="outline">
          <mat-label>Project Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="planning">Planning</mat-option>
              <mat-option value="active">Active</mat-option>
              <mat-option value="on-hold">On Hold</mat-option>
              <mat-option value="completed">Completed</mat-option>
              <mat-option value="cancelled">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">Low</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="high">High</mat-option>
              <mat-option value="critical">Critical</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate">
            <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate">
            <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Stage</mat-label>
            <mat-select formControlName="stage">
              <mat-option value="discovery">Discovery</mat-option>
              <mat-option value="planning">Planning</mat-option>
              <mat-option value="execution">Execution</mat-option>
              <mat-option value="delivery">Delivery</mat-option>
              <mat-option value="closure">Closure</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Health</mat-label>
            <mat-select formControlName="health">
              <mat-option value="green">Green</mat-option>
              <mat-option value="yellow">Yellow</mat-option>
              <mat-option value="red">Red</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Budget</mat-label>
            <input matInput type="number" formControlName="budget">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Currency</mat-label>
            <mat-select formControlName="currency">
              <mat-option value="USD">USD</mat-option>
              <mat-option value="EUR">EUR</mat-option>
              <mat-option value="GBP">GBP</mat-option>
              <mat-option value="INR">INR</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Billing Type</mat-label>
            <mat-select formControlName="billingType">
              <mat-option value="fixed">Fixed</mat-option>
              <mat-option value="hourly">Hourly</mat-option>
              <mat-option value="milestone">Milestone</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Progress (%)</mat-label>
            <input matInput type="number" min="0" max="100" formControlName="progress">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!projectForm.valid">
        {{ data.project ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .project-form {
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
export class ProjectDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProjectDialogComponent>);

  projectForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project?: Project }) {
    this.projectForm = this.fb.group({
      name: [data.project?.name || '', Validators.required],
      description: [data.project?.description || ''],
      status: [data.project?.status || 'planning'],
      stage: [data.project?.stage || 'discovery'],
      priority: [data.project?.priority || 'medium'],
      health: [data.project?.health || 'green'],
      startDate: [data.project?.startDate ? new Date(data.project.startDate) : new Date()],
      endDate: [data.project?.endDate ? new Date(data.project.endDate) : new Date()],
      budget: [data.project?.budget || 0],
      currency: [data.project?.currency || 'USD'],
      billingType: [data.project?.billingType || 'fixed'],
      progress: [data.project?.progress || 0],
      spent: [data.project?.spent || 0],
      teamMemberIds: [data.project?.teamMemberIds || []],
      tags: [data.project?.tags || []],
      convertedFromLead: [data.project?.convertedFromLead || false]
    });
  }

  onSave() {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}