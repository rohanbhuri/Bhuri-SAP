import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { LeaveRequestDto } from '../hr-management.service';

@Component({
  selector: 'app-leave-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">beach_access</mat-icon>
        {{ data ? 'Edit Leave Request' : 'New Leave Request' }}
      </h2>
    </div>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput formControlName="startDate" type="date" required />
            <mat-icon matPrefix>event</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>End Date</mat-label>
            <input matInput formControlName="endDate" type="date" required />
            <mat-icon matPrefix>event</mat-icon>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Leave Type</mat-label>
          <mat-select formControlName="leaveType">
            <mat-option value="casual">Casual Leave</mat-option>
            <mat-option value="sick">Sick Leave</mat-option>
            <mat-option value="earned">Earned Leave</mat-option>
            <mat-option value="maternity">Maternity Leave</mat-option>
            <mat-option value="paternity">Paternity Leave</mat-option>
          </mat-select>
          <mat-icon matPrefix>category</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Reason</mat-label>
          <textarea matInput rows="3" formControlName="reason" placeholder="Brief reason for leave"></textarea>
          <mat-icon matPrefix>notes</mat-icon>
        </mat-form-field>
        <div class="dialog-actions" mat-dialog-actions>
          <button mat-button type="button" (click)="close()" class="cancel-btn">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="save-btn">
            <mat-icon>send</mat-icon>
            Submit Request
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      max-width: 540px;
      background: var(--theme-surface);
      color: var(--theme-on-surface);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .dialog-header {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface)),
        color-mix(in srgb, var(--theme-accent) 4%, var(--theme-surface))
      );
      padding: 20px 24px;
      border-bottom: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
    
    .dialog-title { 
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .dialog-icon {
      color: var(--theme-primary);
      background-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);
      border-radius: 50%;
      padding: 8px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .dialog-content { 
      padding: 24px;
      background: var(--theme-surface);
    }
    
    form { 
      display: grid; 
      grid-auto-rows: min-content; 
      row-gap: 20px; 
    }
    
    .form-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 16px; 
    }
    
    mat-form-field { 
      width: 100%;
    }
    
    .dialog-actions { 
      display: flex; 
      justify-content: flex-end; 
      gap: 12px; 
      padding: 20px 0 0;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
      margin-top: 20px;
    }
    
    .cancel-btn {
      background-color: transparent;
      color: var(--theme-secondary);
      border: 1px solid var(--theme-secondary);
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .cancel-btn:hover {
      background-color: color-mix(in srgb, var(--theme-secondary) 10%, transparent);
    }
    
    .save-btn {
      background-color: var(--theme-primary);
      color: white;
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
    }
    
    .save-btn:hover {
      background-color: color-mix(in srgb, var(--theme-primary) 85%, black);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 25%, transparent);
    }
    
    @media (max-width: 768px) {
      :host { max-width: 95vw; }
      .form-grid { grid-template-columns: 1fr; }
      .dialog-header { padding: 16px 20px; }
      .dialog-content { padding: 20px; }
    }
  `]
})
export class LeaveDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<LeaveDialogComponent>);
  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: LeaveRequestDto | null) {}

  ngOnInit() {
    this.form = this.fb.group({
      startDate: [this.data?.startDate ? new Date(this.data.startDate).toISOString().split('T')[0] : '', Validators.required],
      endDate: [this.data?.endDate ? new Date(this.data.endDate).toISOString().split('T')[0] : '', Validators.required],
      leaveType: [this.data?.leaveType || 'casual', Validators.required],
      reason: [this.data?.reason || '']
    });
  }

  close() { this.dialogRef.close(); }
  
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}