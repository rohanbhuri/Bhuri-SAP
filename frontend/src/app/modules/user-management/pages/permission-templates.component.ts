import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-permission-templates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="templates-container">
      <div class="templates-header">
        <div class="search-bar">
          <mat-form-field appearance="outline">
            <mat-label>Search templates</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (input)="filterTemplates()"
              placeholder="Search by name or description"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <button mat-raised-button color="primary" (click)="addTemplate()">
          <mat-icon>add</mat-icon>
          Add Template
        </button>
      </div>

      <div class="templates-grid">
        @for (template of filteredTemplates(); track template.id) {
          <mat-card class="template-card">
            <mat-card-header>
              <mat-card-title>{{template.name}}</mat-card-title>
              <div class="card-actions">
                <button mat-icon-button [matMenuTriggerFor]="templateMenu" [matMenuTriggerData]="{template: template}">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <p class="template-description">{{template.description}}</p>
              <div class="template-stats">
                <mat-chip color="primary">
                  {{template.permissions.length}} permissions
                </mat-chip>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <mat-menu #templateMenu="matMenu">
        <ng-template matMenuContent let-template="template">
          <button mat-menu-item (click)="editTemplate(template)">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>
          <button mat-menu-item (click)="deleteTemplate(template)">
            <mat-icon color="warn">delete</mat-icon>
            <span>Delete</span>
          </button>
        </ng-template>
      </mat-menu>

      @if (filteredTemplates().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">assignment</mat-icon>
          <h3>No permission templates found</h3>
          <p>Create templates to quickly assign permissions to roles.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .templates-container {
      padding: 24px;
    }
    .templates-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .search-bar {
      flex: 1;
      max-width: 400px;
    }
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
    .template-card {
      position: relative;
    }
    .card-actions {
      position: absolute;
      top: 8px;
      right: 8px;
    }
    .template-description {
      color: #666;
      margin-bottom: 16px;
    }
    .template-stats {
      display: flex;
      gap: 8px;
    }
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }
    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `]
})
export class PermissionTemplatesComponent {
  private userService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  templates = signal<any[]>([]);
  filteredTemplates = signal<any[]>([]);
  searchTerm = '';

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.userService.getPermissionTemplates().subscribe({
      next: (templates) => {
        this.templates.set(templates);
        this.filteredTemplates.set(templates);
      },
      error: () => {
        this.snackBar.open('Error loading templates', 'Close', { duration: 3000 });
      }
    });
  }

  filterTemplates() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.templates().filter(
      (template) =>
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term)
    );
    this.filteredTemplates.set(filtered);
  }

  addTemplate() {
    this.snackBar.open('Add template functionality coming soon', 'Close', { duration: 3000 });
  }

  editTemplate(template: any) {
    this.snackBar.open('Edit template functionality coming soon', 'Close', { duration: 3000 });
  }

  deleteTemplate(template: any) {
    this.snackBar.open('Delete template functionality coming soon', 'Close', { duration: 3000 });
  }
}