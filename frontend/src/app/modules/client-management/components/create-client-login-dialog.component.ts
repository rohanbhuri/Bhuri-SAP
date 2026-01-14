import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientManagementService } from '../services/client-management.service';

@Component({
  selector: 'app-create-client-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data ? 'Create Client Login' : 'Add New Client' }}</h2>
        <button mat-icon-button (click)="onCancel()" [disabled]="loading">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-tab-group class="dialog-tabs" animationDuration="0ms">
        <!-- Basic Information Tab -->
        <mat-tab label="Basic Information">
          <div class="tab-content">
            <form [formGroup]="basicForm">
              <div class="form-section">
                <h3 class="section-title">Contact Information</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="Enter first name">
                    <mat-error *ngIf="basicForm.get('firstName')?.hasError('required')">
                      First name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Enter last name">
                    <mat-error *ngIf="basicForm.get('lastName')?.hasError('required')">
                      Last name is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" placeholder="email@example.com">
                    <mat-icon matPrefix>email</mat-icon>
                    <mat-error *ngIf="basicForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="basicForm.get('email')?.hasError('email')">
                      Invalid email format
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Phone</mat-label>
                    <input matInput formControlName="phone" placeholder="+1 234 567 8900">
                    <mat-icon matPrefix>phone</mat-icon>
                    <mat-error *ngIf="basicForm.get('phone')?.hasError('required')">
                      Phone is required
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">Login Credentials</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Password</mat-label>
                    <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Leave empty for auto-generated">
                    <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                      <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <mat-hint>Leave empty for auto-generated password</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Confirm Password</mat-label>
                    <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword" placeholder="Confirm password">
                    <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                      <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <mat-error *ngIf="basicForm.hasError('passwordMismatch')">
                      Passwords do not match
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- Additional Details Tab -->
        <mat-tab label="Additional Details">
          <div class="tab-content">
            <form [formGroup]="additionalForm">
              <div class="form-section">
                <h3 class="section-title">Company Details</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Company Name</mat-label>
                    <input matInput formControlName="companyName" placeholder="Enter company name">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Website</mat-label>
                    <input matInput formControlName="website" placeholder="https://example.com">
                    <mat-icon matPrefix>language</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Industry</mat-label>
                    <mat-select formControlName="industry">
                      <mat-option value="Technology">Technology</mat-option>
                      <mat-option value="Finance">Finance</mat-option>
                      <mat-option value="Healthcare">Healthcare</mat-option>
                      <mat-option value="Education">Education</mat-option>
                      <mat-option value="Retail">Retail</mat-option>
                      <mat-option value="Manufacturing">Manufacturing</mat-option>
                      <mat-option value="Other">Other</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">Business Information</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Company Size</mat-label>
                    <mat-select formControlName="companySize">
                      <mat-option value="1-10">1-10 employees</mat-option>
                      <mat-option value="11-50">11-50 employees</mat-option>
                      <mat-option value="51-200">51-200 employees</mat-option>
                      <mat-option value="201-500">201-500 employees</mat-option>
                      <mat-option value="500+">500+ employees</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Tax ID</mat-label>
                    <input matInput formControlName="taxId" placeholder="Enter tax ID">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <textarea matInput formControlName="address" rows="2" placeholder="Enter full address"></textarea>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city" placeholder="Enter city">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Country</mat-label>
                    <input matInput formControlName="country" placeholder="Enter country">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Billing Address</mat-label>
                    <textarea matInput formControlName="billingAddress" rows="2" placeholder="Enter billing address"></textarea>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">Security & Access Control</h3>
                
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Max Device Limit</mat-label>
                    <mat-select formControlName="maxDevices">
                      <mat-option [value]="1">1 Device</mat-option>
                      <mat-option [value]="2">2 Devices</mat-option>
                      <mat-option [value]="3">3 Devices</mat-option>
                      <mat-option [value]="5">5 Devices</mat-option>
                      <mat-option [value]="10">10 Devices</mat-option>
                      <mat-option [value]="null">Unlimited</mat-option>
                    </mat-select>
                    <mat-hint>Maximum concurrent login devices</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Session Timeout (minutes)</mat-label>
                    <mat-select formControlName="sessionTimeout">
                      <mat-option [value]="15">15 minutes</mat-option>
                      <mat-option [value]="30">30 minutes</mat-option>
                      <mat-option [value]="60">1 hour</mat-option>
                      <mat-option [value]="120">2 hours</mat-option>
                      <mat-option [value]="480">8 hours</mat-option>
                      <mat-option [value]="null">No timeout</mat-option>
                    </mat-select>
                    <mat-hint>Auto logout after inactivity</mat-hint>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Account Expiry Date</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="expiryDate" placeholder="Select expiry date">
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                    <mat-hint>Leave empty for no expiry</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>IP Whitelist</mat-label>
                    <input matInput formControlName="ipWhitelist" placeholder="e.g., 192.168.1.1, 10.0.0.1">
                    <mat-hint>Comma-separated IP addresses</mat-hint>
                  </mat-form-field>
                </div>

                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="requireTwoFactor">
                    Require Two-Factor Authentication (2FA)
                  </mat-checkbox>
                  <mat-checkbox formControlName="forcePasswordChange">
                    Force Password Change on First Login
                  </mat-checkbox>
                </div>

                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="restrictToBusinessHours">
                    Restrict Login to Business Hours (9 AM - 6 PM)
                  </mat-checkbox>
                  <mat-checkbox formControlName="allowApiAccess">
                    Allow API Access
                  </mat-checkbox>
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">Additional Notes</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Notes</mat-label>
                    <textarea matInput formControlName="notes" rows="3" placeholder="Add any additional notes"></textarea>
                  </mat-form-field>
                </div>
              </div>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Credentials Display -->
      <div *ngIf="credentials" class="credentials-display">
        <div class="credentials-header">
          <mat-icon>check_circle</mat-icon>
          <h3>Client Login Created Successfully!</h3>
        </div>
        <div class="credentials-content">
          <div class="credential-item">
            <span class="label">Email:</span>
            <span class="value">{{ credentials.email }}</span>
          </div>
          <div class="credential-item">
            <span class="label">Password:</span>
            <code class="password-code">{{ credentials.password }}</code>
          </div>
          <div class="credentials-warning">
            <mat-icon>warning</mat-icon>
            <span>Please save these credentials securely. This is the only time the password will be displayed.</span>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="onCancel()" [disabled]="loading">Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSubmit()" 
          [disabled]="loading || !isFormValid()">
          <mat-icon *ngIf="loading">hourglass_empty</mat-icon>
          {{ loading ? (data ? 'Converting...' : 'Creating...') : (data ? 'Create Login' : 'Add Client') }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .dialog-tabs {
      flex: 1;
      overflow: hidden;
    }

    ::ng-deep .dialog-tabs .mat-mdc-tab-labels {
      padding: 0 24px;
      background: #f9fafb;
    }

    ::ng-deep .dialog-tabs .mat-mdc-tab-label {
      font-size: 0.9375rem;
      font-weight: 500;
      min-width: 180px;
    }

    .tab-content {
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row.checkbox-row {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: white;
    }

    .credentials-display {
      margin: 0 24px 24px;
      padding: 20px;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-radius: 8px;
      border: 1px solid #6ee7b7;
    }

    .credentials-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .credentials-header mat-icon {
      color: #059669;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .credentials-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #065f46;
    }

    .credentials-content {
      background: white;
      padding: 16px;
      border-radius: 6px;
    }

    .credential-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .credential-item:last-of-type {
      margin-bottom: 16px;
    }

    .credential-item .label {
      font-weight: 600;
      color: #374151;
      min-width: 80px;
    }

    .credential-item .value {
      color: #111827;
    }

    .password-code {
      background: #f3f4f6;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9375rem;
      color: #1f2937;
      border: 1px solid #d1d5db;
    }

    .credentials-warning {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background: #fef3c7;
      border-radius: 4px;
      border: 1px solid #fbbf24;
    }

    .credentials-warning mat-icon {
      color: #d97706;
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .credentials-warning span {
      font-size: 0.875rem;
      color: #92400e;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .dialog-actions button {
      min-width: 120px;
    }

    ::ng-deep .mat-mdc-checkbox {
      margin-bottom: 8px;
    }

    ::ng-deep .mat-mdc-checkbox .mdc-form-field {
      color: #374151;
    }
  `]
})
export class CreateClientLoginDialogComponent implements OnInit {
  basicForm!: FormGroup;
  additionalForm!: FormGroup;
  loading = false;
  credentials: any = null;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientManagementService,
    private dialogRef: MatDialogRef<CreateClientLoginDialogComponent>,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.initForms();
    this.populateFromRequest();
  }

  initForms() {
    this.basicForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    this.additionalForm = this.fb.group({
      companyName: [''],
      website: [''],
      industry: [''],
      companySize: [''],
      address: [''],
      city: [''],
      country: [''],
      taxId: [''],
      billingAddress: [''],
      notes: [''],
      maxDevices: [3],
      sessionTimeout: [60],
      expiryDate: [null],
      ipWhitelist: [''],
      requireTwoFactor: [false],
      forcePasswordChange: [true],
      restrictToBusinessHours: [false],
      allowApiAccess: [false]
    });
  }

  populateFromRequest() {
    if (this.data) {
      const nameParts = this.data.contactPerson?.split(' ') || [];
      this.basicForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: this.data.email,
        phone: this.data.phone
      });

      this.additionalForm.patchValue({
        companyName: this.data.companyName,
        website: this.data.website,
        industry: this.data.industry,
        companySize: this.data.companySize,
        address: this.data.address,
        city: this.data.city,
        country: this.data.country,
        notes: this.data.message
      });
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  isFormValid(): boolean {
    return this.basicForm.valid;
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    const conversionData = {
      ...this.basicForm.value,
      ...this.additionalForm.value
    };

    if (this.data?._id) {
      this.clientService.convertToClient(this.data._id, conversionData).subscribe({
        next: (result) => {
          this.credentials = result.credentials;
          this.loading = false;
          this.snackBar.open('Client login created successfully!', 'Close', { duration: 3000 });
          setTimeout(() => this.dialogRef.close(true), 5000);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error?.message || 'Failed to create client login', 'Close', { duration: 3000 });
        }
      });
    } else {
      const requestData = {
        companyName: conversionData.companyName,
        contactPerson: `${conversionData.firstName} ${conversionData.lastName}`,
        email: conversionData.email,
        phone: conversionData.phone,
        website: conversionData.website,
        industry: conversionData.industry,
        companySize: conversionData.companySize,
        address: conversionData.address,
        city: conversionData.city,
        country: conversionData.country,
        message: conversionData.notes
      };

      this.clientService.createClientRequest(requestData).subscribe({
        next: (request) => {
          this.clientService.convertToClient(request._id, conversionData).subscribe({
            next: (result) => {
              this.credentials = result.credentials;
              this.loading = false;
              this.snackBar.open('Client created successfully!', 'Close', { duration: 3000 });
              setTimeout(() => this.dialogRef.close(true), 5000);
            },
            error: (err) => {
              this.loading = false;
              this.snackBar.open(err.error?.message || 'Failed to create client', 'Close', { duration: 3000 });
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error?.message || 'Failed to create client', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel() {
    if (!this.credentials) {
      this.dialogRef.close();
    }
  }
}
