import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { CrmService, Contact, Lead } from '../crm.service';
import { ContactDialogComponent } from '../dialogs/contact-dialog.component';
import { AssignmentDialogComponent } from '../dialogs/assignment-dialog.component';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatMenuModule, MatProgressSpinnerModule, MatCheckboxModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Contacts</h2>
        <div class="header-actions">
          <div class="selection-info" *ngIf="selection.hasValue()">
            <span>{{ selection.selected.length }} selected</span>
            <button mat-button (click)="openAssignmentDialog()">
              <mat-icon>person_add</mat-icon>
              Assign
            </button>
          </div>
          <button mat-raised-button color="primary" (click)="openContactDialog()">
            <mat-icon>person_add</mat-icon>
            Add Contact
          </button>
        </div>
      </div>
      
      <div class="cards-container">
        <div class="contact-card" *ngFor="let contact of displayedContacts()">
          <mat-card class="contact-card-content" [class.selected]="selection.isSelected(contact)">
            <div class="card-header">
              <div class="contact-info">
                <mat-checkbox 
                  (click)="$event.stopPropagation()"
                  (change)="$event ? selection.toggle(contact) : null"
                  [checked]="selection.isSelected(contact)"
                  class="contact-checkbox">
                </mat-checkbox>
                <div class="contact-avatar">{{ getInitials(contact.firstName, contact.lastName) }}</div>
                <div class="contact-details">
                  <div class="contact-name">{{ contact.firstName }} {{ contact.lastName }}</div>
                  <div class="contact-email">{{ contact.email }}</div>
                </div>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="contactMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #contactMenu="matMenu">
                <button mat-menu-item (click)="editContact(contact)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="openAssignmentDialog([contact])">
                  <mat-icon>person_add</mat-icon>
                  <span>Assign</span>
                </button>
                <button mat-menu-item (click)="convertToLead(contact)">
                  <mat-icon>trending_up</mat-icon>
                  <span>Convert to Lead</span>
                </button>
                <button mat-menu-item (click)="deleteContact(contact._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item" *ngIf="contact.company">
                  <mat-icon>business</mat-icon>
                  <span>{{ contact.company }}</span>
                </div>
                <div class="info-item" *ngIf="contact.phone">
                  <mat-icon>phone</mat-icon>
                  <span>{{ contact.phone }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>trending_up</mat-icon>
                  <span>{{ getContactLeadCount(contact._id) }} leads</span>
                </div>
                <div class="info-item">
                  <mat-icon>info</mat-icon>
                  <mat-chip [color]="contact.status === 'active' ? 'primary' : 'warn'" class="status-chip">
                    {{ contact.status }}
                  </mat-chip>
                </div>
                <div class="info-item" *ngIf="contact.assignedTo">
                  <mat-icon>person</mat-icon>
                  <span>{{ contact.assignedTo.firstName }} {{ contact.assignedTo.lastName }}</span>
                </div>
                <div class="info-item" *ngIf="!contact.assignedTo">
                  <mat-icon>person_off</mat-icon>
                  <span class="unassigned">Unassigned</span>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button mat-button color="primary" (click)="editContact(contact)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="convertToLead(contact)">
                <mat-icon>trending_up</mat-icon>
                Convert
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more contacts...</span>
      </div>
      
      <div class="no-data" *ngIf="contacts().length === 0 && !loading()">
        <mat-icon>person_off</mat-icon>
        <h3>No contacts found</h3>
        <p>Start by adding your first contact</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    .header-actions { display: flex; align-items: center; gap: 16px; }
    .selection-info { display: flex; align-items: center; gap: 8px; color: #1976d2; font-weight: 500; }
    
    .cards-container { 
      display: grid; 
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
    
    .contact-card-content {
      transition: all 0.3s ease;
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
    
    .contact-card-content:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
    }
    
    .card-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 16px; 
      padding: 16px 16px 0;
    }
    
    .contact-info { display: flex; align-items: center; gap: 12px; }
    .contact-checkbox { margin-right: 8px; }
    .contact-card-content.selected { border-color: #1976d2; background: rgba(25, 118, 210, 0.05); }
    .unassigned { color: rgba(0,0,0,0.6); font-style: italic; }
    
    .contact-avatar { 
      width: 48px; 
      height: 48px; 
      border-radius: 50%; 
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)); 
      color: white; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 600; 
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .contact-details { flex: 1; min-width: 0; }
    .contact-name { font-weight: 600; margin-bottom: 4px; font-size: 16px; }
    .contact-email { font-size: 13px; opacity: 0.7; word-break: break-word; }
    
    .card-body { padding: 0 16px 16px; }
    
    .info-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
      gap: 12px; 
    }
    
    .info-item { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-size: 14px;
      padding: 8px;
      background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
      border-radius: 6px;
    }
    
    .info-item mat-icon { 
      font-size: 18px; 
      width: 18px; 
      height: 18px; 
      opacity: 0.7; 
      flex-shrink: 0;
    }
    
    .status-chip { font-size: 11px; height: 22px; }
    
    .card-actions { 
      display: flex; 
      justify-content: flex-end; 
      gap: 8px; 
      padding: 0 16px 16px;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
      margin-top: 16px;
      padding-top: 16px;
    }
    
    .loading-container { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 16px; 
      padding: 40px; 
      color: var(--theme-on-surface);
      opacity: 0.7;
    }
    
    .no-data { 
      text-align: center; 
      padding: 60px 20px; 
      color: var(--theme-on-surface); 
      opacity: 0.6; 
    }
    
    .no-data mat-icon { 
      font-size: 64px; 
      width: 64px; 
      height: 64px; 
      margin-bottom: 16px; 
    }
    
    .no-data h3 { margin: 16px 0 8px; }
    .no-data p { margin: 0; }
    
    @media (max-width: 768px) {
      .page-content { padding: 16px; }
      .cards-container { 
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .page-header { 
        flex-direction: column; 
        gap: 16px; 
        align-items: stretch; 
      }
      .header-actions { 
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      .selection-info {
        justify-content: center;
      }
      .info-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 480px) {
      .contact-avatar { width: 40px; height: 40px; font-size: 14px; }
      .contact-name { font-size: 15px; }
      .card-actions { justify-content: center; }
    }
  `]
})
export class ContactsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  contacts = signal<Contact[]>([]);
  leads = signal<Lead[]>([]);
  displayedContacts = signal<Contact[]>([]);
  loading = signal(false);
  selection = new SelectionModel<Contact>(true, []);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  ngOnInit() {
    this.loadContacts();
    this.loadLeads();
  }

  loadContacts() {
    this.loading.set(true);
    this.currentPage = 0;
    this.displayedContacts.set([]);
    this.crmService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loadMoreContacts();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreContacts() {
    const allContacts = this.contacts();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newContacts = allContacts.slice(startIndex, endIndex);
    
    if (newContacts.length > 0) {
      this.displayedContacts.set([...this.displayedContacts(), ...newContacts]);
      this.currentPage++;
      this.hasMoreData = endIndex < allContacts.length;
    } else {
      this.hasMoreData = false;
    }
  }
  
  @HostListener('window:scroll')
  onScroll() {
    if (this.hasMoreData && !this.loading()) {
      const threshold = 200;
      const position = window.pageYOffset + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      
      if (position > height - threshold) {
        this.loadMoreContacts();
      }
    }
  }

  loadLeads() {
    this.crmService.getLeads().subscribe(leads => this.leads.set(leads));
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getContactLeadCount(contactId: string): number {
    return this.leads().filter(lead => lead.contactId === contactId).length;
  }

  openContactDialog(contact?: Contact) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '600px',
      data: contact || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (contact) {
        this.crmService.updateContact(contact._id, result).subscribe({
          next: (updated) => {
            this.loadContacts();
            this.snackBar.open('Contact updated successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            const status = error?.status;
            const backendMsg = (error?.error?.message || '').toString().toLowerCase();
            let message = 'Error updating contact';
            if (status === 409 || backendMsg.includes('duplicate')) message = 'Duplicate entry: email already exists';
            else if (status === 400 && (backendMsg.includes('email') || backendMsg.includes('phone'))) message = 'Incorrect email or phone format';
            else if (status === 422) message = 'Validation failed: please check required fields';
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      } else {
        this.crmService.createContact(result).subscribe({
          next: (created) => {
            this.loadContacts();
            this.snackBar.open('Contact created successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            const status = error?.status;
            const backendMsg = (error?.error?.message || '').toString().toLowerCase();
            let message = 'Error creating contact';
            if (status === 409 || backendMsg.includes('duplicate')) message = 'Duplicate entry: email already exists';
            else if (status === 400 && (backendMsg.includes('email') || backendMsg.includes('phone'))) message = 'Incorrect email or phone format';
            else if (status === 422) message = 'Validation failed: please check required fields';
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  editContact(contact: Contact) {
    this.openContactDialog(contact);
  }

  convertToLead(contact: Contact) {
    const leadData = {
      title: `Lead from ${contact.firstName} ${contact.lastName}`,
      description: `Converted from contact: ${contact.email}`,
      status: 'new',
      source: 'contact_conversion'
    };

    this.crmService.convertContactToLead(contact._id, leadData).subscribe({
      next: () => {
        this.snackBar.open('Contact converted to lead successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error converting contact to lead', 'Close', { duration: 3000 })
    });
  }

  deleteContact(id: string) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.crmService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts();
          this.selection.clear();
          this.snackBar.open('Contact deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting contact', 'Close', { duration: 3000 })
      });
    }
  }

  openAssignmentDialog(contacts?: Contact[]) {
    const selectedContacts = contacts || this.selection.selected;
    const currentAssignee = selectedContacts.length === 1 ? selectedContacts[0].assignedTo : undefined;
    
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '500px',
      data: {
        type: 'contact',
        items: selectedContacts,
        currentAssignee
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContacts();
        this.selection.clear();
      }
    });
  }
}