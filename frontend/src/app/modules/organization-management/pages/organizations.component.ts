import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { OrganizationManagementService, OrganizationInfo } from '../organization-management.service';
import { OrganizationDialogComponent } from '../dialogs/organization-dialog.component';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DatePipe,
  ],
  template: `
    <div class="page-actions">
      <button mat-raised-button color="primary" (click)="createOrganization()">
        <mat-icon>add</mat-icon>
        Create Organization
      </button>
    </div>

    <div class="table-container">
      <table mat-table [dataSource]="organizations()" class="organizations-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let org">{{ org.name }}</td>
        </ng-container>

        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef>Code</th>
          <td mat-cell *matCellDef="let org">{{ org.code }}</td>
        </ng-container>

        <ng-container matColumnDef="modules">
          <th mat-header-cell *matHeaderCellDef>Active Modules</th>
          <td mat-cell *matCellDef="let org">{{ org.activeModuleIds?.length || 0 }}</td>
        </ng-container>

        <ng-container matColumnDef="userCount">
          <th mat-header-cell *matHeaderCellDef>Users</th>
          <td mat-cell *matCellDef="let org">{{ org.userCount || 0 }}</td>
        </ng-container>

        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Created</th>
          <td mat-cell *matCellDef="let org">{{ org.createdAt | date:'short' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let org">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="editOrganization(org)">
                <mat-icon>edit</mat-icon>
                <span>Edit</span>
              </button>
              <button mat-menu-item (click)="deleteOrganization(org)">
                <mat-icon>delete</mat-icon>
                <span>Delete</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [
    `
      .page-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 24px;
      }

      .table-container {
        background: var(--theme-surface);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .organizations-table {
        width: 100%;
      }

      .mat-mdc-header-cell {
        font-weight: 600;
        color: var(--theme-on-surface);
      }
    `,
  ],
})
export class OrganizationsComponent implements OnInit {
  private orgService = inject(OrganizationManagementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  organizations = signal<OrganizationInfo[]>([]);
  displayedColumns = ['name', 'code', 'modules', 'userCount', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.orgService.getOrganizations().subscribe({
      next: (orgs) => this.organizations.set(orgs),
      error: (error) => {
        console.error('Failed to load organizations:', error);
        this.snackBar.open('Failed to load organizations', 'Close', { duration: 3000 });
      }
    });
  }

  createOrganization() {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orgService.createOrganization(result).subscribe({
          next: () => {
            this.snackBar.open('Organization created successfully', 'Close', { duration: 3000 });
            this.loadOrganizations();
          },
          error: (error) => {
            console.error('Failed to create organization:', error);
            this.snackBar.open('Failed to create organization', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  editOrganization(org: OrganizationInfo) {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      width: '600px',
      data: { organization: org }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const orgId = org.id || (org as any)._id;
        this.orgService.updateOrganization(orgId, result).subscribe({
          next: () => {
            this.snackBar.open('Organization updated successfully', 'Close', { duration: 3000 });
            this.loadOrganizations();
          },
          error: (error) => {
            console.error('Failed to update organization:', error);
            this.snackBar.open('Failed to update organization', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteOrganization(org: OrganizationInfo) {
    if (confirm(`Are you sure you want to delete "${org.name}"?`)) {
      const orgId = org.id || (org as any)._id;
      this.orgService.deleteOrganization(orgId).subscribe({
        next: () => {
          this.snackBar.open('Organization deleted successfully', 'Close', { duration: 3000 });
          this.loadOrganizations();
        },
        error: (error) => {
          console.error('Failed to delete organization:', error);
          this.snackBar.open('Failed to delete organization', 'Close', { duration: 3000 });
        }
      });
    }
  }
}