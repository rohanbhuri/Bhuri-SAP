import { Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';
import { RoleDialogComponent } from '../dialogs/role-dialog.component';
import { UserManagementService } from '../user-management.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

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
    MatPaginatorModule,
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
              (input)="onSearchChange($event)"
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
        <table mat-table [dataSource]="dataSource" class="role-table">
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

          <ng-container matColumnDef="hierarchy">
            <th mat-header-cell *matHeaderCellDef>Hierarchy Level</th>
            <td mat-cell *matCellDef="let role">
              <div class="hierarchy-level">
                {{ role.hierarchyLevel || 0 }}
              </div>
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

      <mat-paginator
        [length]="totalRoles"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (page)="onPageChange($event)"
      ></mat-paginator>

      @if (dataSource.data.length === 0) {
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

      .hierarchy-level {
        font-weight: 500;
        color: var(--theme-primary);
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
  private searchSubject = new Subject<string>();

  dataSource = new MatTableDataSource<any>([]);
  searchTerm = '';
  displayedColumns = ['name', 'type', 'hierarchy', 'permissions', 'actions'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  totalRoles = 0;
  allRoles: any[] = [];

  ngOnInit() {
    this.loadRoles();
    this.searchSubject.pipe(debounceTime(500)).subscribe((query) => {
      this.performSearch(query);
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.allRoles = roles;
        this.totalRoles = roles.length;
        this.updatePaginatedData();
      },
      error: () => {
        const mockRoles = [
          {
            _id: '1',
            name: 'Super Administrator',
            type: 'super_admin',
            hierarchyLevel: 4,
            description: 'Full system access',
            permissionIds: ['1', '2', '3', '4', '5'],
          },
          {
            _id: '2',
            name: 'Administrator',
            type: 'admin',
            hierarchyLevel: 3,
            description: 'Organization management',
            permissionIds: ['1', '2', '3'],
          },
          {
            _id: '3',
            name: 'Staff',
            type: 'staff',
            hierarchyLevel: 1,
            description: 'Basic user access',
            permissionIds: ['1'],
          },
        ];
        this.allRoles = mockRoles;
        this.totalRoles = mockRoles.length;
        this.updatePaginatedData();
      },
    });
  }

  onSearchChange(event: any) {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(query: string) {
    if (!query.trim()) {
      this.loadRoles();
      return;
    }
    this.userService.searchRoles(query).subscribe({
      next: (roles) => {
        this.allRoles = roles;
        this.totalRoles = roles.length;
        this.updatePaginatedData();
      },
      error: () => {
        this.allRoles = [];
        this.totalRoles = 0;
        this.dataSource.data = [];
      },
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.allRoles.slice(startIndex, endIndex);
  }

  private updatePaginatedData() {
    this.dataSource.data = this.allRoles.slice(0, this.pageSize);
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
      width: '600px',
      maxHeight: '90vh',
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
      width: '600px',
      maxHeight: '90vh',
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
