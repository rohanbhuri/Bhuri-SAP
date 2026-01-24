import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserManagementService } from '../user-management.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { UserDialogComponent } from '../dialogs/user-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
  ],
  template: `
    <div class="users-container">
      <div class="users-header">
        <div class="search-bar">
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Search users</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (input)="onSearchChange($event)"
              placeholder="Search by name or email"
            />
            <mat-icon matSuffix color="primary">search</mat-icon>
          </mat-form-field>
        </div>
        <button mat-raised-button color="primary" (click)="openAddUserDialog()">
          <mat-icon>person_add</mat-icon>
          Add User
        </button>
      </div>

      <div class="users-table">
        <table
          mat-table
          [dataSource]="dataSource"
          class="user-table"
          color="primary"
        >
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">
              <div class="user-info">
                <div class="user-avatar">
                  {{ getUserInitials(user) }}
                </div>
                <div class="user-details">
                  <div class="user-name">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef>Roles</th>
            <td mat-cell *matCellDef="let user">
              <div class="roles-container">
                @for (role of user.roles; track role.id || role) {
                <mat-chip color="primary">{{ role.name || role }}</mat-chip>
                }
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip [color]="user.isActive ? 'primary' : 'warn'">
                <mat-icon [color]="user.isActive ? 'primary' : 'warn'">{{
                  user.isActive ? 'check_circle' : 'cancel'
                }}</mat-icon>
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <div class="action-buttons">
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="userMenu"
                  [matMenuTriggerData]="{ user: user }"
                  aria-label="More actions"
                  (click)="$event.stopPropagation()"
                >
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #userMenu="matMenu">
                  <ng-template matMenuContent let-user="user">
                    <button mat-menu-item (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="toggleUserStatus(user)">
                      <mat-icon>{{
                        user.isActive ? 'block' : 'check_circle'
                      }}</mat-icon>
                      <span>{{
                        user.isActive ? 'Deactivate' : 'Activate'
                      }}</span>
                    </button>
                    <button mat-menu-item (click)="deleteUser(user)">
                      <mat-icon color="warn">delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </ng-template>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns"
            color="primary"
          ></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            color="primary"
          ></tr>
        </table>
      </div>

      <mat-paginator
        [length]="totalUsers"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (page)="onPageChange($event)"
      ></mat-paginator>

      @if (dataSource.data.length === 0) {
      <div class="empty-state">
        <mat-icon class="empty-icon" color="primary">people</mat-icon>
        <h3>No users found</h3>
        <p>Try adjusting your search terms or add new users to get started.</p>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .users-container {
        padding: 24px;
      }

      .users-header {
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

      .users-table {
        overflow-x: auto;
      }

      .user-table {
        width: 100%;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--theme-primary);
        color: var(--theme-on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .user-details {
        display: flex;
        flex-direction: column;
      }

      .user-name {
        font-weight: 500;
      }

      .user-email {
        font-size: 0.9rem;
      }

      .roles-container {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      mat-chip {
        font-size: 0.75rem;
        height: 24px;
      }

      .action-buttons {
        display: flex;
        gap: 4px;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
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
      }

      .empty-state p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .users-header {
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
export class UsersComponent {
  private userService = inject(UserManagementService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private searchSubject = new Subject<string>();

  dataSource = new MatTableDataSource<any>([]);
  searchTerm = '';
  displayedColumns = ['name', 'roles', 'status', 'actions'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  totalUsers = 0;
  allUsers: any[] = [];
  currentPage = 0;

  ngOnInit() {
    this.loadUsers();
    this.searchSubject.pipe(debounceTime(500)).subscribe((query) => {
      this.performSearch(query);
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users.map((user) => ({
          id: user._id || user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles || [],
          roleIds: user.roleIds || [],
          isActive: user.isActive,
          organizationId: user.organizationId,
          forcePasswordChange: user.forcePasswordChange,
          requireTwoFactor: user.requireTwoFactor,
          restrictToBusinessHours: user.restrictToBusinessHours,
          allowApiAccess: user.allowApiAccess,
          sessionTimeout: user.sessionTimeout,
          maxDevices: user.maxDevices,
          ipWhitelist: user.ipWhitelist,
        }));
        this.totalUsers = this.allUsers.length;
        this.updatePaginatedData();
      },
      error: (error) => {
        this.snackBar.open(
          `Failed to load users: ${error.message || 'Unknown error'}`,
          'Close',
          { duration: 5000 }
        );
      },
    });
  }

  onSearchChange(event: any) {
    this.currentPage = 0;
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(query: string) {
    if (!query.trim()) {
      this.loadUsers();
      return;
    }
    this.userService.searchUsers(query).subscribe({
      next: (users) => {
        this.allUsers = users.map((user) => ({
          id: user._id || user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles || [],
          roleIds: user.roleIds || [],
          isActive: user.isActive,
          organizationId: user.organizationId,
          forcePasswordChange: user.forcePasswordChange,
          requireTwoFactor: user.requireTwoFactor,
          restrictToBusinessHours: user.restrictToBusinessHours,
          allowApiAccess: user.allowApiAccess,
          sessionTimeout: user.sessionTimeout,
          maxDevices: user.maxDevices,
          ipWhitelist: user.ipWhitelist,
        }));
        this.totalUsers = this.allUsers.length;
        this.updatePaginatedData();
      },
      error: () => {
        this.allUsers = [];
        this.totalUsers = 0;
        this.dataSource.data = [];
      },
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.allUsers.slice(startIndex, endIndex);
  }

  private updatePaginatedData() {
    this.dataSource.data = this.allUsers.slice(0, this.pageSize);
  }

  getUserInitials(user: any): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('User created successfully', 'Close', {
          duration: 3000,
        });
        this.loadUsers();
      }
    });
  }

  editUser(user: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('User updated successfully', 'Close', {
          duration: 3000,
        });
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(user: any) {
    const newStatus = !user.isActive;
    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.snackBar.open(
          `User ${newStatus ? 'activated' : 'deactivated'}`,
          'Close',
          { duration: 3000 }
        );
      },
      error: (error) => {
        this.snackBar.open('Failed to update user status', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open('Failed to delete user', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
