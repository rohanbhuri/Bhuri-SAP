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
import { CrmService, Lead, Contact } from '../crm.service';
import { LeadDialogComponent } from '../dialogs/lead-dialog.component';

@Component({
  selector: 'app-leads-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatMenuModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Leads</h2>
        <button mat-raised-button color="primary" (click)="openLeadDialog()">
          <mat-icon>add</mat-icon>
          Add Lead
        </button>
      </div>
      
      <div class="cards-container">
        <div class="lead-card" *ngFor="let lead of displayedLeads()">
          <mat-card class="lead-card-content">
            <div class="card-header">
              <div class="lead-info">
                <div class="lead-title">{{ lead.title }}</div>
                <div class="lead-contact" *ngIf="getContactName(lead.contactId)">
                  Contact: {{ getContactName(lead.contactId) }}
                </div>
                <div class="lead-description" *ngIf="lead.description">
                  {{ lead.description | slice:0:100 }}{{ lead.description && lead.description.length > 100 ? '...' : '' }}
                </div>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="leadMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #leadMenu="matMenu">
                <button mat-menu-item (click)="editLead(lead)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="convertToDeal(lead)" [disabled]="lead.status === 'converted'">
                  <mat-icon>handshake</mat-icon>
                  <span>Convert to Deal</span>
                </button>
                <button mat-menu-item (click)="deleteLead(lead._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>info</mat-icon>
                  <mat-chip [color]="getLeadStatusColor(lead.status)" class="status-chip">
                    {{ lead.status }}
                  </mat-chip>
                </div>
                <div class="info-item" *ngIf="lead.estimatedValue">
                  <mat-icon>attach_money</mat-icon>
                  <span>\${{ lead.estimatedValue | number:'1.0-0' }}</span>
                </div>
                <div class="info-item" *ngIf="lead.source">
                  <mat-icon>source</mat-icon>
                  <span>{{ lead.source }}</span>
                </div>

              </div>
            </div>
            
            <div class="card-actions">
              <button mat-button color="primary" (click)="editLead(lead)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="convertToDeal(lead)" [disabled]="lead.status === 'converted'">
                <mat-icon>handshake</mat-icon>
                Convert
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more leads...</span>
      </div>
      
      <div class="no-data" *ngIf="leads().length === 0 && !loading()">
        <mat-icon>trending_up</mat-icon>
        <h3>No leads found</h3>
        <p>Start by adding your first lead</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    
    .cards-container { 
      display: grid; 
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
    
    .lead-card-content {
      transition: all 0.3s ease;
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
    
    .lead-card-content:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
    }
    
    .card-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 16px; 
      padding: 16px 16px 0;
    }
    
    .lead-info { flex: 1; min-width: 0; }
    .lead-title { font-weight: 600; margin-bottom: 6px; font-size: 16px; }
    .lead-contact { font-size: 13px; opacity: 0.7; margin-bottom: 8px; }
    .lead-description { font-size: 14px; opacity: 0.8; line-height: 1.4; }
    
    .card-body { padding: 0 16px 16px; }
    
    .info-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
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
      .info-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 480px) {
      .card-actions { justify-content: center; }
    }
  `]
})
export class LeadsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  leads = signal<Lead[]>([]);
  contacts = signal<Contact[]>([]);
  displayedLeads = signal<Lead[]>([]);
  loading = signal(false);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  ngOnInit() {
    this.loadLeads();
    this.loadContacts();
  }

  loadLeads() {
    this.loading.set(true);
    this.crmService.getLeads().subscribe({
      next: (leads) => {
        this.leads.set(leads);
        this.loadMoreLeads();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreLeads() {
    const allLeads = this.leads();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newLeads = allLeads.slice(startIndex, endIndex);
    
    if (newLeads.length > 0) {
      this.displayedLeads.set([...this.displayedLeads(), ...newLeads]);
      this.currentPage++;
      this.hasMoreData = endIndex < allLeads.length;
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
        this.loadMoreLeads();
      }
    }
  }

  loadContacts() {
    this.crmService.getContacts().subscribe(contacts => this.contacts.set(contacts));
  }

  getContactName(contactId?: string): string {
    if (!contactId) return '';
    const contact = this.contacts().find(c => c._id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : '';
  }

  getLeadStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'new': 'primary',
      'qualified': 'accent',
      'contacted': 'warn',
      'converted': 'primary',
      'lost': ''
    };
    return colors[status] || '';
  }

  openLeadDialog(lead?: Lead) {
    const dialogRef = this.dialog.open(LeadDialogComponent, {
      width: '600px',
      data: lead || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (lead) {
        this.crmService.updateLead(lead._id, result).subscribe({
          next: (updated) => {
            const updatedLeads = this.leads().map(l => l._id === lead._id ? { ...l, ...updated } : l);
            const updatedDisplayed = this.displayedLeads().map(l => l._id === lead._id ? { ...l, ...updated } : l);
            this.leads.set(updatedLeads);
            this.displayedLeads.set(updatedDisplayed);
            this.snackBar.open('Lead updated successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            const status = error?.status;
            const backendMsg = (error?.error?.message || '').toString().toLowerCase();
            let message = 'Error updating lead';
            if (status === 409 || backendMsg.includes('duplicate')) message = 'Duplicate entry: lead already exists';
            else if (status === 400) message = 'Validation failed: please check form fields';
            else if (status === 422) message = 'Validation failed: please check required fields';
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      } else {
        this.crmService.createLead(result).subscribe({
          next: (created) => {
            if (created && created._id) {
              this.leads.set([created, ...this.leads()]);
              this.displayedLeads.set([created, ...this.displayedLeads()]);
            } else {
              this.loadLeads();
            }
            this.snackBar.open('Lead created successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            const status = error?.status;
            const backendMsg = (error?.error?.message || '').toString().toLowerCase();
            let message = 'Error creating lead';
            if (status === 409 || backendMsg.includes('duplicate')) message = 'Duplicate entry: lead already exists';
            else if (status === 400) message = 'Validation failed: please check form fields';
            else if (status === 422) message = 'Validation failed: please check required fields';
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  editLead(lead: Lead) {
    this.openLeadDialog(lead);
  }

  convertToDeal(lead: Lead) {
    const dealData = {
      title: lead.title,
      description: `Converted from lead: ${lead.description || lead.title}`,
      value: lead.estimatedValue || 0,
      stage: 'prospecting',
      probability: 50
    };

    this.crmService.convertLeadToDeal(lead._id, dealData).subscribe({
      next: () => {
        const updatedLeads = this.leads().map(l => 
          l._id === lead._id ? { ...l, status: 'converted' } : l
        );
        const updatedDisplayed = this.displayedLeads().map(l => 
          l._id === lead._id ? { ...l, status: 'converted' } : l
        );
        this.leads.set(updatedLeads);
        this.displayedLeads.set(updatedDisplayed);
        this.snackBar.open('Lead converted to deal successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error converting lead to deal', 'Close', { duration: 3000 })
    });
  }

  deleteLead(id: string) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.crmService.deleteLead(id).subscribe({
        next: () => {
          const updatedLeads = this.leads().filter(l => l._id !== id);
          const updatedDisplayed = this.displayedLeads().filter(l => l._id !== id);
          this.leads.set(updatedLeads);
          this.displayedLeads.set(updatedDisplayed);
          this.snackBar.open('Lead deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting lead', 'Close', { duration: 3000 })
      });
    }
  }
}