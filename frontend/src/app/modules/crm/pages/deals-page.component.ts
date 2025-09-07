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
import { CrmService, Deal, Lead, Contact } from '../crm.service';
import { DealDialogComponent } from '../dialogs/deal-dialog.component';

@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatMenuModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Deals</h2>
        <button mat-raised-button color="primary" (click)="openDealDialog()">
          <mat-icon>add</mat-icon>
          Add Deal
        </button>
      </div>
      
      <div class="cards-container">
        <div class="deal-card" *ngFor="let deal of displayedDeals()">
          <mat-card class="deal-card-content">
            <div class="card-header">
              <div class="deal-info">
                <div class="deal-title">{{ deal.title }}</div>
                <div class="deal-lead" *ngIf="getLeadTitle(deal.leadId)">
                  Lead: {{ getLeadTitle(deal.leadId) }}
                </div>
                <div class="deal-contact" *ngIf="getContactName(deal.contactId)">
                  Contact: {{ getContactName(deal.contactId) }}
                </div>
                <div class="deal-description" *ngIf="deal.description">
                  {{ deal.description | slice:0:100 }}{{ deal.description && deal.description.length > 100 ? '...' : '' }}
                </div>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="dealMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #dealMenu="matMenu">
                <button mat-menu-item (click)="editDeal(deal)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="createTaskForDeal(deal)">
                  <mat-icon>task</mat-icon>
                  <span>Create Task</span>
                </button>
                <button mat-menu-item (click)="deleteDeal(deal._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </div>
            
            <div class="card-body">
              <div class="value-section">
                <div class="deal-value">
                  <mat-icon>attach_money</mat-icon>
                  <span class="value-amount">\${{ deal.value | number:'1.0-0' }}</span>
                </div>
                <div class="deal-probability">
                  <mat-icon>trending_up</mat-icon>
                  <span>{{ deal.probability }}% probability</span>
                </div>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>info</mat-icon>
                  <mat-chip [color]="getDealStageColor(deal.stage)" class="status-chip">
                    {{ deal.stage | titlecase }}
                  </mat-chip>
                </div>
                <div class="info-item" *ngIf="deal.expectedCloseDate">
                  <mat-icon>event</mat-icon>
                  <span>{{ deal.expectedCloseDate | date:'MMM d, y' }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button mat-button color="primary" (click)="editDeal(deal)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="createTaskForDeal(deal)">
                <mat-icon>task</mat-icon>
                Task
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more deals...</span>
      </div>
      
      <div class="no-data" *ngIf="deals().length === 0 && !loading()">
        <mat-icon>handshake</mat-icon>
        <h3>No deals found</h3>
        <p>Start by adding your first deal</p>
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
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    }
    
    .deal-card-content {
      transition: all 0.3s ease;
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
    
    .deal-card-content:hover {
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
    
    .deal-info { flex: 1; min-width: 0; }
    .deal-title { font-weight: 600; margin-bottom: 6px; font-size: 16px; }
    .deal-lead, .deal-contact { font-size: 13px; opacity: 0.7; margin-bottom: 4px; }
    .deal-description { font-size: 14px; opacity: 0.8; line-height: 1.4; margin-top: 8px; }
    
    .card-body { padding: 0 16px 16px; }
    
    .value-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px;
      background: linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 8%, transparent), color-mix(in srgb, var(--theme-accent) 8%, transparent));
      border-radius: 8px;
    }
    
    .deal-value {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .value-amount {
      font-size: 20px;
      font-weight: 700;
      color: var(--theme-primary);
    }
    
    .deal-probability {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--theme-accent);
      font-weight: 500;
    }
    
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
      .info-grid { grid-template-columns: 1fr; }
      .value-section { flex-direction: column; gap: 12px; text-align: center; }
    }
    
    @media (max-width: 480px) {
      .card-actions { justify-content: center; }
    }
  `]
})
export class DealsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  deals = signal<Deal[]>([]);
  leads = signal<Lead[]>([]);
  contacts = signal<Contact[]>([]);
  displayedDeals = signal<Deal[]>([]);
  loading = signal(false);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  ngOnInit() {
    this.loadDeals();
    this.loadLeads();
    this.loadContacts();
  }

  loadDeals() {
    this.loading.set(true);
    this.crmService.getDeals().subscribe({
      next: (deals) => {
        this.deals.set(deals);
        this.loadMoreDeals();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreDeals() {
    const allDeals = this.deals();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newDeals = allDeals.slice(startIndex, endIndex);
    
    if (newDeals.length > 0) {
      this.displayedDeals.set([...this.displayedDeals(), ...newDeals]);
      this.currentPage++;
      this.hasMoreData = endIndex < allDeals.length;
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
        this.loadMoreDeals();
      }
    }
  }

  loadLeads() {
    this.crmService.getLeads().subscribe(leads => this.leads.set(leads));
  }

  loadContacts() {
    this.crmService.getContacts().subscribe(contacts => this.contacts.set(contacts));
  }

  getLeadTitle(leadId?: string): string {
    if (!leadId) return '';
    const lead = this.leads().find(l => l._id === leadId);
    return lead ? lead.title : '';
  }

  getContactName(contactId?: string): string {
    if (!contactId) return '';
    const contact = this.contacts().find(c => c._id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : '';
  }

  getDealStageColor(stage: string): string {
    const colors: { [key: string]: string } = {
      'prospecting': 'primary',
      'qualification': 'accent',
      'proposal': 'warn',
      'negotiation': 'primary',
      'closed-won': 'primary',
      'closed-lost': ''
    };
    return colors[stage] || '';
  }

  openDealDialog(deal?: Deal) {
    const dialogRef = this.dialog.open(DealDialogComponent, {
      width: '600px',
      data: deal || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (deal) {
          this.crmService.updateDeal(deal._id, result).subscribe({
            next: (updated) => {
              const updatedDeals = this.deals().map(d => d._id === deal._id ? { ...d, ...updated } : d);
              const updatedDisplayed = this.displayedDeals().map(d => d._id === deal._id ? { ...d, ...updated } : d);
              this.deals.set(updatedDeals);
              this.displayedDeals.set(updatedDisplayed);
              this.snackBar.open('Deal updated successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error updating deal', 'Close', { duration: 3000 })
          });
        } else {
          this.crmService.createDeal(result).subscribe({
            next: (created) => {
              if (created && created._id) {
                this.deals.set([created, ...this.deals()]);
                this.displayedDeals.set([created, ...this.displayedDeals()]);
              } else {
                this.loadDeals();
              }
              this.snackBar.open('Deal created successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error creating deal', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  editDeal(deal: Deal) {
    this.openDealDialog(deal);
  }

  createTaskForDeal(deal: Deal) {
    const taskData = {
      title: `Follow up on ${deal.title}`,
      description: `Task created for deal: ${deal.title}`,
      status: 'pending',
      priority: 'medium',
      type: 'follow-up'
    };

    this.crmService.createTaskForDeal(deal._id, taskData).subscribe({
      next: () => {
        this.snackBar.open('Task created for deal successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error creating task for deal', 'Close', { duration: 3000 })
    });
  }

  deleteDeal(id: string) {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.crmService.deleteDeal(id).subscribe({
        next: () => {
          const updatedDeals = this.deals().filter(d => d._id !== id);
          const updatedDisplayed = this.displayedDeals().filter(d => d._id !== id);
          this.deals.set(updatedDeals);
          this.displayedDeals.set(updatedDisplayed);
          this.snackBar.open('Deal deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting deal', 'Close', { duration: 3000 })
      });
    }
  }
}