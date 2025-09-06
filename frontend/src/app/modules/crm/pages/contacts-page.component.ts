import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrmService, Contact } from '../crm.service';
import { ContactDialogComponent } from '../dialogs/contact-dialog.component';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatMenuModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Contacts</h2>
        <button mat-raised-button color="primary" (click)="openContactDialog()">
          <mat-icon>person_add</mat-icon>
          Add Contact
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="contacts()" class="contacts-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let contact">
              <div class="contact-info">
                <div class="contact-avatar">{{ getInitials(contact.firstName, contact.lastName) }}</div>
                <div>
                  <div class="contact-name">{{ contact.firstName }} {{ contact.lastName }}</div>
                  <div class="contact-email">{{ contact.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let contact">{{ contact.company || '-' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let contact">{{ contact.phone || '-' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let contact">
              <mat-chip [color]="contact.status === 'active' ? 'primary' : 'warn'">
                {{ contact.status }}
              </mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let contact">
              <button mat-icon-button [matMenuTriggerFor]="contactMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #contactMenu="matMenu">
                <button mat-menu-item (click)="editContact(contact)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteContact(contact._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    .table-container { background: var(--theme-surface); border-radius: 8px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); }
    .contacts-table { width: 100%; }
    .contact-info { display: flex; align-items: center; gap: 12px; }
    .contact-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
    .contact-name { font-weight: 500; margin-bottom: 2px; }
    .contact-email { font-size: 12px; opacity: 0.7; }
  `]
})
export class ContactsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  contacts = signal<Contact[]>([]);
  displayedColumns = ['name', 'company', 'phone', 'status', 'actions'];

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.crmService.getContacts().subscribe(contacts => this.contacts.set(contacts));
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  openContactDialog(contact?: Contact) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '600px',
      data: contact || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (contact) {
          this.crmService.updateContact(contact._id, result).subscribe({
            next: () => {
              this.loadContacts();
              this.snackBar.open('Contact updated successfully', 'Close', { duration: 3000 });
            },
            error: (error: any) => {
              const message = error.status === 409 ? 'Email already exists' : 'Error updating contact';
              this.snackBar.open(message, 'Close', { duration: 5000 });
            }
          });
        } else {
          this.crmService.createContact(result).subscribe({
            next: () => {
              this.loadContacts();
              this.snackBar.open('Contact created successfully', 'Close', { duration: 3000 });
            },
            error: (error: any) => {
              const message = error.status === 409 ? 'Email already exists' : 'Error creating contact';
              this.snackBar.open(message, 'Close', { duration: 5000 });
            }
          });
        }
      }
    });
  }

  editContact(contact: Contact) {
    this.openContactDialog(contact);
  }

  deleteContact(id: string) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.crmService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts();
          this.snackBar.open('Contact deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting contact', 'Close', { duration: 3000 })
      });
    }
  }
}