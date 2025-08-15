import { Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';
import { PermissionDialogComponent } from '../dialogs/permission-dialog.component';
import { UserManagementService } from '../user-management.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    TitleCasePipe,
    MatDialogModule,
    MatMenuModule,
  ],
  template: `
    <div class="permissions-container">
      <div class="permissions-header">
        <div class="search-bar">
          <mat-form-field appearance="outline">
            <mat-label>Search permissions</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (input)="filterPermissions()"
              placeholder="Search by module or action"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <button
          mat-raised-button
          color="primary"
          (click)="openAddPermissionDialog()"
        >
          <mat-icon>add</mat-icon>
          Add Permission
        </button>
      </div>

      <div class="permissions-table">
        <table
          mat-table
          [dataSource]="filteredPermissions()"
          class="permission-table"
        >
          <ng-container matColumnDef="module">
            <th mat-header-cell *matHeaderCellDef>Module</th>
            <td mat-cell *matCellDef="let permission">
              <mat-chip color="primary">
                {{ permission.module }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let permission">
              <mat-chip [color]="getActionColor(permission.action)">
                <mat-icon>{{ getActionIcon(permission.action) }}</mat-icon>
                {{ permission.action | titlecase }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="resource">
            <th mat-header-cell *matHeaderCellDef>Resource</th>
            <td mat-cell *matCellDef="let permission">
              <div class="resource-name">{{ permission.resource }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let permission">
              <div class="action-buttons">
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="permMenu"
                  [matMenuTriggerData]="{ permission: permission }"
                  aria-label="More actions"
                  (click)="$event.stopPropagation()"
                >
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #permMenu="matMenu">
                  <ng-template matMenuContent let-permission="permission">
                    <button mat-menu-item (click)="editPermission(permission)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button
                      mat-menu-item
                      (click)="deletePermission(permission)"
                    >
                      <mat-icon color="warn">delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </ng-template>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>

      @if (filteredPermissions().length === 0) {
      <div class="empty-state">
        <mat-icon class="empty-icon">security</mat-icon>
        <h3>No permissions found</h3>
        <p>Try adjusting your search terms or create new permissions.</p>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .permissions-container {
        padding: 24px;
      }

      .permissions-header {
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

      .permissions-table {
        overflow-x: auto;
      }

      .permission-table {
        width: 100%;
      }

      mat-chip {
        font-size: 0.875rem;
      }

      .resource-name {
        font-weight: 500;
        color: var(--theme-on-surface);
      }

      .action-buttons {
        display: flex;
        gap: 4px;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .empty-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-state h3 {
        margin: 0 0 8px;
        color: var(--theme-on-surface);
      }

      .empty-state p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .permissions-header {
          flex-direction: column;
          align-items: stretch;
        }

        .search-bar {
          max-width: none;
        }
      }
    `,
  ],
})
export class PermissionsComponent {
  private userService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  permissions = signal<any[]>([]);
  filteredPermissions = signal<any[]>([]);
  searchTerm = '';
  displayedColumns = ['module', 'action', 'resource', 'actions'];

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.userService.getPermissions().subscribe({
      next: (permissions) => {
        this.permissions.set(permissions);
        this.filteredPermissions.set(permissions);
      },
      error: () => {
        // Show mock data when backend fails
        const mockPermissions = [
          {
            _id: '1',
            module: 'user-management',
            action: 'read',
            resource: 'users',
          },
          {
            _id: '2',
            module: 'user-management',
            action: 'write',
            resource: 'users',
          },
          {
            _id: '3',
            module: 'user-management',
            action: 'edit',
            resource: 'users',
          },
          {
            _id: '4',
            module: 'dashboard',
            action: 'read',
            resource: 'dashboard',
          },
          {
            _id: '5',
            module: 'reports',
            action: 'read',
            resource: 'reports',
          },
        ];
        this.permissions.set(mockPermissions);
        this.filteredPermissions.set(mockPermissions);
      },
    });
  }

  filterPermissions() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.permissions().filter(
      (permission) =>
        permission.module.toLowerCase().includes(term) ||
        permission.action.toLowerCase().includes(term) ||
        permission.resource.toLowerCase().includes(term)
    );
    this.filteredPermissions.set(filtered);
  }

  getActionColor(action: string): string {
    const colorMap: { [key: string]: string } = {
      read: 'primary',
      write: 'primary',
      edit: 'accent',
      delete: 'warn',
    };
    return colorMap[action] || 'primary';
  }

  getActionIcon(action: string): string {
    const icons: { [key: string]: string } = {
      read: 'visibility',
      write: 'create',
      edit: 'edit',
      delete: 'delete',
    };
    return icons[action] || 'security';
  }

  openAddPermissionDialog() {
    const ref = this.dialog.open(PermissionDialogComponent, {
      width: '520px',
      data: { permission: null },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Permission created successfully', 'Close', {
          duration: 3000,
        });
        this.loadPermissions();
      }
    });
  }

  editPermission(permission: any) {
    const ref = this.dialog.open(PermissionDialogComponent, {
      width: '520px',
      data: { permission },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Permission updated successfully', 'Close', {
          duration: 3000,
        });
        this.loadPermissions();
      }
    });
  }

  deletePermission(permission: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Permission',
        message: `Are you sure you want to delete the permission "${permission.module} ${permission.action}"? This action cannot be undone.`,
        confirmText: 'Delete',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService
          .deletePermission(permission._id || permission.id)
          .subscribe({
            next: () => {
              this.snackBar.open('Permission deleted successfully', 'Close', {
                duration: 3000,
              });
              this.loadPermissions();
            },
            error: () =>
              this.snackBar.open('Failed to delete permission', 'Close', {
                duration: 3000,
              }),
          });
      }
    });
  }
}
