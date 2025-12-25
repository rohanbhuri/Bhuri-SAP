import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientManagementService } from '../services/client-management.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Clients</h1>
      </div>

      <div class="bg-white rounded-lg shadow">
        <table mat-table [dataSource]="clients" class="w-full">
          <ng-container matColumnDef="companyName">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let client">{{ client.companyName }}</td>
          </ng-container>

          <ng-container matColumnDef="contactPerson">
            <th mat-header-cell *matHeaderCellDef>Contact Person</th>
            <td mat-cell *matCellDef="let client">{{ client.contactPerson }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let client">{{ client.email }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let client">{{ client.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="industry">
            <th mat-header-cell *matHeaderCellDef>Industry</th>
            <td mat-cell *matCellDef="let client">{{ client.industry || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="isActive">
            <th mat-header-cell *matHeaderCellDef>Active</th>
            <td mat-cell *matCellDef="let client">
              <mat-slide-toggle 
                [checked]="client.isActive" 
                (change)="toggleStatus(client._id, $event.checked)">
              </mat-slide-toggle>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let client">
              <button mat-icon-button [routerLink]="['/client-management/clients', client._id]">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteClient(client._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class ClientsListComponent implements OnInit {
  clients: any[] = [];
  displayedColumns = ['companyName', 'contactPerson', 'email', 'phone', 'industry', 'isActive', 'actions'];

  constructor(private clientManagementService: ClientManagementService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientManagementService.getAllClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Failed to load clients', err)
    });
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
}
