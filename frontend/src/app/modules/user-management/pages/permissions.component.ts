import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { PermissionDialogComponent } from '../dialogs/permission-dialog.component';
import { UserManagementService } from '../user-management.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
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
    MatDialogModule,
    MatMenuModule,
    MatPaginatorModule,
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
              (input)="onSearchChange($event)"
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
        <table mat-table [dataSource]="dataSource" class="permission-table">
          <ng-container matColumnDef="module">
            <th mat-header-cell *matHeaderCellDef>Module</th>
            <td mat-cell *matCellDef="let permission">
              {{ permission.module }}
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let permission">
              {{ permission.action }}
            </td>
          </ng-container>

          <ng-container matColumnDef="resource">
            <th mat-header-cell *matHeaderCellDef>Resource</th>
            <td mat-cell *matCellDef="let permission">
              {{ permission.resource }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let permission">
              <button
                mat-icon-button
                [matMenuTriggerFor]="permMenu"
                [matMenuTriggerData]="{ permission: permission }"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #permMenu="matMenu">
                <ng-template matMenuContent let-permission="permission">
                  <button mat-menu-item (click)="editPermission(permission)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deletePermission(permission)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>

      <mat-paginator
        [length]="totalPermissions"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (page)="onPageChange($event)"
      ></mat-paginator>

      <div *ngIf="dataSource.data.length === 0" class="empty-state">
        <mat-icon class="empty-icon">security</mat-icon>
        <h3>No permissions found</h3>
        <p>Try adjusting your search terms or create new permissions.</p>
      </div>
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
        border-collapse: collapse;
      }

      .permission-table th {
        background-color: #f5f5f5;
        font-weight: 600;
        padding: 12px;
        text-align: left;
      }

      .permission-table td {
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: #999;
      }

      .empty-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin: 0 auto 16px;
        opacity: 0.5;
      }

      .empty-state h3 {
        margin: 0 0 8px;
        color: #333;
      }

      .empty-state p {
        margin: 0;
      }
    `,
  ],
})
export class PermissionsComponent implements OnInit {
  private userService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private searchSubject = new Subject<string>();

  dataSource = new MatTableDataSource<any>([]);
  searchTerm = '';
  displayedColumns = ['module', 'action', 'resource', 'actions'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  totalPermissions = 0;
  allPermissions: any[] = [];

  ngOnInit() {
    this.loadPermissions();
    this.searchSubject.pipe(debounceTime(500)).subscribe((query) => {
      this.performSearch(query);
    });
  }

  loadPermissions() {
    this.userService.getPermissions().subscribe({
      next: (permissions) => {
        this.allPermissions = permissions.map(p => ({
          _id: p._id || p.id,
          id: p._id || p.id,
          module: p.module || '',
          action: p.action || '',
          resource: p.resource || '',
          createdAt: p.createdAt
        }));
        this.totalPermissions = this.allPermissions.length;
        this.updatePaginatedData();
      },
      error: () => {
        const mockPermissions = [
          { _id: '1', id: '1', module: 'user-management', action: 'read', resource: 'users' },
          { _id: '2', id: '2', module: 'user-management', action: 'create', resource: 'users' },
          { _id: '3', id: '3', module: 'user-management', action: 'update', resource: 'users' },
          { _id: '4', id: '4', module: 'dashboard', action: 'read', resource: 'dashboard' },
          { _id: '5', id: '5', module: 'reports', action: 'read', resource: 'reports' },
        ];
        this.allPermissions = mockPermissions;
        this.totalPermissions = mockPermissions.length;
        this.updatePaginatedData();
      },
    });
  }

  onSearchChange(event: any) {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(query: string) {
    if (!query.trim()) {
      this.loadPermissions();
      return;
    }
    this.userService.searchPermissions(query).subscribe({
      next: (permissions) => {
        this.allPermissions = permissions.map(p => ({
          _id: p._id || p.id,
          id: p._id || p.id,
          module: p.module || '',
          action: p.action || '',
          resource: p.resource || '',
          createdAt: p.createdAt
        }));
        this.totalPermissions = this.allPermissions.length;
        this.updatePaginatedData();
      },
      error: () => {
        this.allPermissions = [];
        this.totalPermissions = 0;
        this.dataSource.data = [];
      },
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.allPermissions.slice(startIndex, endIndex);
  }

  private updatePaginatedData() {
    this.dataSource.data = this.allPermissions.slice(0, this.pageSize);
  }

  openAddPermissionDialog() {
    const ref = this.dialog.open(PermissionDialogComponent, {
      width: '520px',
      data: { permission: null },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Permission created successfully', 'Close', { duration: 3000 });
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
        this.snackBar.open('Permission updated successfully', 'Close', { duration: 3000 });
        this.loadPermissions();
      }
    });
  }

  deletePermission(permission: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Permission',
        message: `Are you sure you want to delete the permission "${permission.module} ${permission.action}"?`,
        confirmText: 'Delete',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deletePermission(permission._id || permission.id).subscribe({
          next: () => {
            this.snackBar.open('Permission deleted successfully', 'Close', { duration: 3000 });
            this.loadPermissions();
          },
          error: () => this.snackBar.open('Failed to delete permission', 'Close', { duration: 3000 }),
        });
      }
    });
  }
}
