import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-permission-template-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title color="primary">Apply Permission Template</h2>
    <mat-dialog-content>
      <p>Select a permission template to apply to <strong>{{data.roleName}}</strong></p>
      
      <div class="debug-info">
        <p>Templates count: {{templates.length}}</p>
      </div>
      
      @if (templates.length > 0) {
        <mat-radio-group [(ngModel)]="selectedTemplate" class="template-group">
          @for (template of templates; track template.id) {
            <mat-radio-button 
              [value]="template.id"
              class="template-option">
              <div class="template-info">
                <div class="template-name">{{template.name}}</div>
                <div class="template-description">{{template.description}}</div>
                <div class="template-count">{{template.permissions.length}} permissions</div>
              </div>
            </mat-radio-button>
          }
        </mat-radio-group>
      } @else {
        <p>Loading templates...</p>
      }
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!selectedTemplate || applying"
              (click)="onApply()">
        {{applying ? 'Applying...' : 'Apply Template'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .template-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 16px 0;
    }
    .template-option {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 8px;
    }
    .template-option:hover {
      background-color: #f5f5f5;
    }
    .template-info {
      margin-left: 32px;
    }
    .template-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    .template-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .template-count {
      color: #999;
      font-size: 12px;
    }
  `]
})
export class PermissionTemplateDialogComponent implements OnInit {
  templates: any[] = [
    {
      id: 'super-admin-full',
      name: 'Super Admin - Full Access',
      description: 'Complete access to all user management features',
      permissions: Array(16).fill({})
    },
    {
      id: 'admin-standard', 
      name: 'Admin - Standard Access',
      description: 'Standard admin access without permissions management',
      permissions: Array(8).fill({})
    },
    {
      id: 'staff-basic',
      name: 'Staff - Basic Access', 
      description: 'Basic staff access to view users only',
      permissions: Array(1).fill({})
    }
  ];
  selectedTemplate: string = '';
  applying = false;

  constructor(
    public dialogRef: MatDialogRef<PermissionTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleId: string; roleName: string },
    private userManagementService: UserManagementService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    console.log('Loading permission templates...');
    this.userManagementService.getPermissionTemplates().subscribe({
      next: (templates) => {
        console.log('Templates received:', templates);
        this.templates = templates || [];
        if (this.templates.length === 0) {
          console.log('No templates received, using fallback');
          this.templates = [
            {
              id: 'super-admin-full',
              name: 'Super Admin - Full Access',
              description: 'Complete access to all user management features',
              permissions: Array(16).fill({})
            },
            {
              id: 'admin-standard', 
              name: 'Admin - Standard Access',
              description: 'Standard admin access without permissions management',
              permissions: Array(8).fill({})
            },
            {
              id: 'staff-basic',
              name: 'Staff - Basic Access', 
              description: 'Basic staff access to view users only',
              permissions: Array(1).fill({})
            }
          ];
        }
      },
      error: (error) => {
        console.error('Error in template subscription:', error);
      }
    });
  }

  onApply() {
    if (!this.selectedTemplate) return;
    
    this.applying = true;
    this.userManagementService.applyPermissionTemplate(this.data.roleId, this.selectedTemplate).subscribe({
      next: (result) => {
        this.snackBar.open(result.message, 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error applying template:', error);
        this.snackBar.open('Error applying template', 'Close', { duration: 3000 });
        this.applying = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}