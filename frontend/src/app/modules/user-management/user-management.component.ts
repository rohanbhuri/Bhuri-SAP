import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { UserManagementService, UserInfo } from './user-management.service';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
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
    NavbarComponent,
    BottomNavbarComponent,
    FormsModule,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">User Management</span>
        </nav>
        <h1>User Management</h1>
        <p class="subtitle">
          Manage users and their roles within your organization
        </p>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="search-bar">
            <mat-form-field appearance="outline">
              <mat-label>Search users</mat-label>
              <input
                matInput
                [(ngModel)]="searchTerm"
                (input)="filterUsers()"
                placeholder="Search by name or email"
              />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          <button
            mat-raised-button
            color="primary"
            (click)="openAddUserDialog()"
          >
            <mat-icon>person_add</mat-icon>
            Add User
          </button>
        </div>

        <div class="users-table">
          <table mat-table [dataSource]="filteredUsers()" class="user-table">
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
                  @for (role of user.roles; track role) {
                  <mat-chip color="primary">{{ role }}</mat-chip>
                  }
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [color]="user.isActive ? 'primary' : 'warn'">
                  <mat-icon>{{
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

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>

        @if (filteredUsers().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">people</mat-icon>
          <h3>No users found</h3>
          <p>
            Try adjusting your search terms or add new users to get started.
          </p>
        </div>
        }
      </div>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 24px;
      }

      .breadcrumb {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        font-size: 0.9rem;
        margin-bottom: 8px;
      }
      .breadcrumb .current {
        color: var(--theme-on-surface);
      }

      h1 {
        margin: 0 0 6px;
        font-weight: 600;
      }
      .subtitle {
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
        margin: 0;
      }

      .content-card {
        background: var(--theme-surface);
        border-radius: 12px;
        border: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
        overflow: hidden;
      }

      .card-header {
        padding: 24px;
        border-bottom: 1px solid
          color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
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
        color: var(--theme-on-surface);
      }

      .user-email {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
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
        .card-header {
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
export class UserManagementComponent {
  private userService = inject(UserManagementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  users = signal<UserInfo[]>([]);
  filteredUsers = signal<UserInfo[]>([]);
  searchTerm = '';
  displayedColumns = ['name', 'roles', 'status', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const mappedUsers = users.map((user) => ({
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roleIds || [],
          isActive: user.isActive,
          organizationId: user.organizationId,
        }));
        this.users.set(mappedUsers);
        this.filteredUsers.set(mappedUsers);
      },
      error: (error) => {
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      },
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.users().filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    this.filteredUsers.set(filtered);
  }

  getUserInitials(user: UserInfo): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  openAddUserDialog() {
    this.snackBar.open('Add user dialog would open here', 'Close', {
      duration: 3000,
    });
  }

  editUser(user: UserInfo) {
    this.snackBar.open(`Edit ${user.firstName} ${user.lastName}`, 'Close', {
      duration: 3000,
    });
  }

  toggleUserStatus(user: UserInfo) {
    user.isActive = !user.isActive;
    this.snackBar.open(
      `User ${user.isActive ? 'activated' : 'deactivated'}`,
      'Close',
      { duration: 3000 }
    );
  }

  deleteUser(user: UserInfo) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: () =>
            this.snackBar.open('Failed to delete user', 'Close', {
              duration: 3000,
            }),
        });
      }
    });
  }
}
