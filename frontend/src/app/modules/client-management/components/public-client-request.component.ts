import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ClientManagementService } from '../services/client-management.service';

@Component({
  selector: 'app-public-client-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-3xl font-bold mb-2">Request Client Account</h2>
        <p class="text-gray-600 mb-6">Fill out the form below to request access to our platform</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <mat-form-field class="w-full">
            <mat-label>Company Name *</mat-label>
            <input matInput formControlName="companyName" required>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Contact Person *</mat-label>
            <input matInput formControlName="contactPerson" required>
          </mat-form-field>

          <div class="grid grid-cols-2 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Email *</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Phone *</mat-label>
              <input matInput formControlName="phone" required>
            </mat-form-field>
          </div>

          <mat-form-field class="w-full">
            <mat-label>Website</mat-label>
            <input matInput formControlName="website">
          </mat-form-field>

          <div class="grid grid-cols-2 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Industry</mat-label>
              <mat-select formControlName="industry">
                <mat-option value="Technology">Technology</mat-option>
                <mat-option value="Healthcare">Healthcare</mat-option>
                <mat-option value="Finance">Finance</mat-option>
                <mat-option value="Manufacturing">Manufacturing</mat-option>
                <mat-option value="Retail">Retail</mat-option>
                <mat-option value="Other">Other</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Company Size</mat-label>
              <mat-select formControlName="companySize">
                <mat-option value="1-10">1-10 employees</mat-option>
                <mat-option value="11-50">11-50 employees</mat-option>
                <mat-option value="51-200">51-200 employees</mat-option>
                <mat-option value="201-500">201-500 employees</mat-option>
                <mat-option value="500+">500+ employees</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field class="w-full">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address">
          </mat-form-field>

          <div class="grid grid-cols-2 gap-4">
            <mat-form-field class="w-full">
              <mat-label>City</mat-label>
              <input matInput formControlName="city">
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Country</mat-label>
              <input matInput formControlName="country">
            </mat-form-field>
          </div>

          <mat-form-field class="w-full">
            <mat-label>Message</mat-label>
            <textarea matInput formControlName="message" rows="4" 
              placeholder="Tell us about your requirements..."></textarea>
          </mat-form-field>

          <div *ngIf="successMessage" class="p-4 bg-green-50 text-green-800 rounded">
            {{ successMessage }}
          </div>

          <div *ngIf="errorMessage" class="p-4 bg-red-50 text-red-800 rounded">
            {{ errorMessage }}
          </div>

          <button mat-raised-button color="primary" type="submit" 
            [disabled]="form.invalid || loading" class="w-full">
            {{ loading ? 'Submitting...' : 'Submit Request' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class PublicClientRequestComponent {
  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private clientManagementService: ClientManagementService
  ) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      industry: [''],
      companySize: [''],
      address: [''],
      city: [''],
      country: [''],
      message: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.clientManagementService.createClientRequest(this.form.value).subscribe({
        next: () => {
          this.successMessage = 'Your request has been submitted successfully! We will contact you soon.';
          this.form.reset();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to submit request. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
