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
import { RoleDialogComponent } from '../dialogs/role-dialog.component';
import { PermissionTemplateDialogComponent } from '../dialogs/permission-template-dialog.component';
import { UserManagementService } from '../user-management.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
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
    <div class="roles-container">
      <div class="roles-header">
        <div class="search-bar">
          <mat-form-field appearance="outline">
            <mat-label>Search roles</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (input)="filterRoles()"
              placeholder="Search by name or type"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <button mat-raised-button color="primary" (click)="openAddRoleDialog()">
          <mat-icon>add</mat-icon>
          Add Role
        </button>
      </div>

      <div class="roles-table">
        <table mat-table [dataSource]="filteredRoles()" class="role-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Role Name</th>
            <td mat-cell *matCellDef="let role">
              <div class="role-info">
                <div class="role-name">{{ role.name }}</div>
                <div class="role-description">{{ role.description }}</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let role">
              <mat-chip [color]="getRoleTypeColor(role.type)">
                {{ role.type | titlecase }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="permissions">
            <th mat-header-cell *matHeaderCellDef>Permissions</th>
            <td mat-cell *matCellDef="let role">
              <div class="permissions-count">
                {{ role.permissionIds?.length || 0 }} permissions
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let role">
              <div class="action-buttons">
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="roleMenu"
                  [matMenuTriggerData]="{ role: role }"
                  aria-label="More actions"
                  (click)="$event.stopPropagation()"
                >
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #roleMenu="matMenu">
                  <ng-template matMenuContent let-role="role">
                    <button mat-menu-item (click)="editRole(role)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="applyTemplate(role)">
                      <mat-icon>assignment</mat-icon>
                      <span>Apply Template</span>
                    </button>
                    <button mat-menu-item (click)="deleteRole(role)">
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

      @if (filteredRoles().length === 0) {
      <div class="empty-state">
        <mat-icon class="empty-icon">admin_panel_settings</mat-icon>
        <h3>No roles found</h3>
        <p>Try adjusting your search terms or create new roles.</p>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .roles-container {
        padding: 24px;
      }

      .roles-header {
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

      .roles-table {
        overflow-x: auto;
      }

      .role-table {
        width: 100%;
      }

      .role-info {
        display: flex;
        flex-direction: column;
      }

      .role-name {
        font-weight: 500;
        color: var(--theme-on-surface);
      }

      .role-description {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      mat-chip {
        font-size: 0.875rem;
      }

      .permissions-count {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
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
        .roles-header {
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
export class RolesComponent {
  private userService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  roles = signal<any[]>([]);
  filteredRoles = signal<any[]>([]);
  searchTerm = '';
  displayedColumns = ['name', 'type', 'permissions', 'actions'];

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.filteredRoles.set(roles);
      },
      error: () => {
        // Show mock data when backend fails
        const mockRoles = [
          {
            _id: '1',
            name: 'Super Administrator',
            type: 'super_admin',
            description: 'Full system access',
            permissionIds: ['1', '2', '3', '4', '5'],
          },
          {
            _id: '2',
            name: 'Administrator',
            type: 'admin',
            description: 'Organization management',
            permissionIds: ['1', '2', '3'],
          },
          {
            _id: '3',
            name: 'Staff',
            type: 'staff',
            description: 'Basic user access',
            permissionIds: ['1'],
          },
        ];
        this.roles.set(mockRoles);
        this.filteredRoles.set(mockRoles);
      },
    });
  }

  filterRoles() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.roles().filter(
      (role) =>
        role.name.toLowerCase().includes(term) ||
        role.type.toLowerCase().includes(term)
    );
    this.filteredRoles.set(filtered);
  }

  getRoleTypeColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      super_admin: 'warn',
      admin: 'accent',
      staff: 'primary',
      custom: 'primary',
    };
    return colorMap[type] || 'primary';
  }

  openAddRoleDialog() {
    const ref = this.dialog.open(RoleDialogComponent, {
      width: '520px',
      data: { role: null },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Role created successfully', 'Close', {
          duration: 3000,
        });
        this.loadRoles();
      }
    });
  }

  editRole(role: any) {
    const ref = this.dialog.open(RoleDialogComponent, {
      width: '520px',
      data: { role },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Role updated successfully', 'Close', {
          duration: 3000,
        });
        this.loadRoles();
      }
    });
  }

  applyTemplate(role: any) {
    const ref = this.dialog.open(PermissionTemplateDialogComponent, {
      width: '520px',
      data: { roleId: role._id || role.id, roleName: role.name }
    });
    
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deleteRole(role: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Role',
        message: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteRole(role._id || role.id).subscribe({
          next: () => {
            this.snackBar.open('Role deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadRoles();
          },
          error: () =>
            this.snackBar.open('Failed to delete role', 'Close', {
              duration: 3000,
            }),
        });
      }
    });
  }
}
