import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientManagementService } from '../services/client-management.service';
import { CreateClientLoginDialogComponent } from './create-client-login-dialog.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="clients-container">
      <div class="header-section">
        <h2 class="section-title">Clients</h2>
        <button mat-raised-button color="primary" (click)="addClientManually()">
          <mat-icon>add</mat-icon>
          Add Client
        </button>
      </div>

      <div class="filters-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by Name</mat-label>
          <input matInput [(ngModel)]="searchName" (ngModelChange)="filterClients()" placeholder="Enter name">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by Email</mat-label>
          <input matInput [(ngModel)]="searchEmail" (ngModelChange)="filterClients()" placeholder="Enter email">
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by Phone</mat-label>
          <input matInput [(ngModel)]="searchPhone" (ngModelChange)="filterClients()" placeholder="Enter phone">
          <mat-icon matSuffix>phone</mat-icon>
        </mat-form-field>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="clients" class="data-table">
          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>CLIENT NAME</th>
            <td mat-cell *matCellDef="let client">{{ client.contactPerson }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>EMAIL</th>
            <td mat-cell *matCellDef="let client">{{ client.email }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>PHONE</th>
            <td mat-cell *matCellDef="let client">{{ client.phone }}</td>
          </ng-container>


          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>STATUS</th>
            <td mat-cell *matCellDef="let client">
              <mat-chip [class]="client.isActive ? 'status-active' : 'status-inactive'">
                {{ client.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>ACTIONS</th>
            <td mat-cell *matCellDef="let client">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="toggleStatus(client._id, !client.isActive)">
                  <mat-icon>{{ client.isActive ? 'block' : 'check_circle' }}</mat-icon>
                  <span>{{ client.isActive ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button mat-menu-item (click)="deleteClient(client._id)">
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
    </div>
  `,
  styles: [`
    .clients-container {
      padding: 0;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 200px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .data-table {
      width: 100%;
    }

    ::ng-deep .mat-mdc-header-cell {
      background-color: #f3f4f6;
      color: #374151;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 16px;
    }

    ::ng-deep .mat-mdc-cell {
      padding: 16px;
      color: #1f2937;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: #f9fafb;
    }

    mat-chip {
      font-size: 0.75rem;
      min-height: 24px;
      padding: 4px 12px;
    }

    mat-chip.status-active {
      background-color: #d1fae5;
      color: #065f46;
    }

    mat-chip.status-inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }
  `]
})
export class ClientsListComponent implements OnInit {
  allClients: any[] = [];
  clients: any[] = [];
  displayedColumns = ['contact', 'email', 'phone', 'status', 'actions'];

  searchName: string = '';
  searchEmail: string = '';
  searchPhone: string = '';

  constructor(
    private clientManagementService: ClientManagementService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientManagementService.getAllClients().subscribe({
      next: (data) => {
        this.allClients = data;
        this.filterClients();
      },
      error: (err) => console.error('Failed to load clients', err)
    });
  }

  filterClients() {
    const nameTerm = this.searchName.toLowerCase().trim();
    const emailTerm = this.searchEmail.toLowerCase().trim();
    const phoneTerm = this.searchPhone.toLowerCase().trim();

    this.clients = this.allClients.filter(client => {
      const matchName = !nameTerm || (client.contactPerson && client.contactPerson.toLowerCase().includes(nameTerm));
      const matchEmail = !emailTerm || (client.email && client.email.toLowerCase().includes(emailTerm));
      const matchPhone = !phoneTerm || (client.phone && client.phone.toLowerCase().includes(phoneTerm));
      
      return matchName && matchEmail && matchPhone;
    });
    
    this.cdr.detectChanges();
  }

  toggleStatus(clientId: string, isActive: boolean) {
    this.clientManagementService.toggleClientStatus(clientId, isActive).subscribe({
      next: () => this.loadClients(),
      error: (err) => console.error('Failed to update status', err)
    });
  }

  deleteClient(clientId: string) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientManagementService.deleteClient(clientId).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Failed to delete client', err)
      });
    }
  }

  addClientManually() {
    const dialogRef = this.dialog.open(CreateClientLoginDialogComponent, {
      width: '800px',
      data: null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }
}
