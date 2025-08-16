import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrganizationManagementService } from '../organization-management.service';

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.organization ? 'Edit' : 'Create' }} Organization</h2>
    
    <mat-dialog-content>
      <form [formGroup]="organizationForm" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Organization Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter organization name">
          @if (organizationForm.get('name')?.hasError('required')) {
            <mat-error>Organization name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Organization Code</mat-label>
          <input matInput formControlName="code" placeholder="Enter unique code">
          @if (organizationForm.get('code')?.hasError('required')) {
            <mat-error>Organization code is required</mat-error>
          }
        </mat-form-field>

        <div class="modules-section">
          <h3>Active Modules</h3>
          <div class="modules-grid">
            @for (module of availableModules; track module.id) {
              <mat-checkbox 
                [checked]="isModuleSelected(module.id)"
                (change)="toggleModule(module.id, $event.checked)">
                {{ module.name }}
              </mat-checkbox>
            }
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSave()"
        [disabled]="organizationForm.invalid">
        {{ data.organization ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 400px;
      }

      .modules-section h3 {
        margin: 16px 0 8px 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;
      }
    `,
  ],
})
export class OrganizationDialogComponent {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationManagementService);
  private dialogRef = inject(MatDialogRef<OrganizationDialogComponent>);

  organizationForm: FormGroup;
  availableModules: any[] = [];
  selectedModuleIds: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.organizationForm = this.fb.group({
      name: [data.organization?.name || '', Validators.required],
      code: [data.organization?.code || '', Validators.required],
    });

    this.selectedModuleIds = data.organization?.activeModuleIds || [];
    this.loadModules();
  }

  loadModules() {
    this.orgService.getAvailableModules().subscribe(modules => {
      this.availableModules = modules;
    });
  }

  isModuleSelected(moduleId: string): boolean {
    return this.selectedModuleIds.includes(moduleId);
  }

  toggleModule(moduleId: string, selected: boolean) {
    if (selected) {
      this.selectedModuleIds.push(moduleId);
    } else {
      this.selectedModuleIds = this.selectedModuleIds.filter(id => id !== moduleId);
    }
  }

  onSave() {
    if (this.organizationForm.valid) {
      const formData = {
        ...this.organizationForm.value,
        activeModuleIds: this.selectedModuleIds
      };
      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}