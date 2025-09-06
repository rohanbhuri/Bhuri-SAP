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
import { Task } from '../crm.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Task' : 'Add Task' }}</h2>
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
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="task">Task</mat-option>
            <mat-option value="call">Call</mat-option>
            <mat-option value="email">Email</mat-option>
            <mat-option value="meeting">Meeting</mat-option>
            <mat-option value="follow-up">Follow-up</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option value="low">Low</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="high">High</mat-option>
            <mat-option value="urgent">Urgent</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="in-progress">In Progress</mat-option>
            <mat-option value="completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate" />
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
export class TaskDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task | null) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || ''],
      status: [this.data?.status || 'pending', Validators.required],
      priority: [this.data?.priority || 'medium', Validators.required],
      dueDate: [this.data?.dueDate || null],
      type: [this.data?.type || 'task', Validators.required]
    });
  }

  close() { this.dialogRef.close(); }
  
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}