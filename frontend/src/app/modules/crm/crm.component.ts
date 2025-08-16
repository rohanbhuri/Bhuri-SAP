import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { CrmService, Contact, Lead, Deal, Task, CrmStats } from './crm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    NavbarComponent,
    BottomNavbarComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">CRM</span>
        </nav>
        <h1>Customer Relationship Management</h1>
        <p class="subtitle">
          Manage your contacts, leads, deals, and sales pipeline
        </p>
      </div>



      <mat-tab-group class="crm-tabs">
        <mat-tab label="Contacts">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Contacts</h2>
              <button mat-raised-button color="primary">
                <mat-icon>person_add</mat-icon>
                Add Contact
              </button>
            </div>
            
            <div class="table-container">
              <table mat-table [dataSource]="contacts()" class="crm-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let contact">
                    <div class="contact-info">
                      <div class="contact-avatar">
                        {{ getInitials(contact.firstName, contact.lastName) }}
                      </div>
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

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let contact">
                    <mat-chip [color]="contact.status === 'active' ? 'primary' : 'warn'">
                      {{ contact.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="contactColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: contactColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Leads">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Leads</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Add Lead
              </button>
            </div>
            
            <div class="table-container">
              <table mat-table [dataSource]="leads()" class="crm-table">
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Title</th>
                  <td mat-cell *matCellDef="let lead">{{ lead.title }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let lead">
                    <mat-chip [color]="getLeadStatusColor(lead.status)">
                      {{ lead.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef>Est. Value</th>
                  <td mat-cell *matCellDef="let lead">
                    {{ lead.estimatedValue ? '$' + lead.estimatedValue : '-' }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="leadColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: leadColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Deals">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Deals</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Add Deal
              </button>
            </div>
            
            <div class="table-container">
              <table mat-table [dataSource]="deals()" class="crm-table">
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Title</th>
                  <td mat-cell *matCellDef="let deal">{{ deal.title }}</td>
                </ng-container>

                <ng-container matColumnDef="stage">
                  <th mat-header-cell *matHeaderCellDef>Stage</th>
                  <td mat-cell *matCellDef="let deal">
                    <mat-chip [color]="getDealStageColor(deal.stage)">
                      {{ deal.stage }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef>Value</th>
                  <td mat-cell *matCellDef="let deal">\${{ deal.value }}</td>
                </ng-container>

                <ng-container matColumnDef="probability">
                  <th mat-header-cell *matHeaderCellDef>Probability</th>
                  <td mat-cell *matCellDef="let deal">{{ deal.probability }}%</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="dealColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: dealColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Reporting">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Reports & Analytics</h2>
            </div>
            
            <div class="stats-grid">
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().contacts }}</div>
                  <div class="stat-label">Total Contacts</div>
                </div>
                <mat-icon class="stat-icon">people</mat-icon>
              </mat-card>
              
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().leads }}</div>
                  <div class="stat-label">Active Leads</div>
                </div>
                <mat-icon class="stat-icon">trending_up</mat-icon>
              </mat-card>
              
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ stats().deals }}</div>
                  <div class="stat-label">Open Deals</div>
                </div>
                <mat-icon class="stat-icon">handshake</mat-icon>
              </mat-card>
              
              <mat-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">\${{ formatCurrency(stats().pipelineValue) }}</div>
                  <div class="stat-label">Pipeline Value</div>
                </div>
                <mat-icon class="stat-icon">attach_money</mat-icon>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Tasks">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Tasks & Reminders</h2>
              <button mat-raised-button color="primary">
                <mat-icon>add_task</mat-icon>
                Add Task
              </button>
            </div>
            
            <div class="table-container">
              <table mat-table [dataSource]="tasks()" class="crm-table">
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Title</th>
                  <td mat-cell *matCellDef="let task">{{ task.title }}</td>
                </ng-container>

                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Type</th>
                  <td mat-cell *matCellDef="let task">
                    <mat-chip>{{ task.type }}</mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="priority">
                  <th mat-header-cell *matHeaderCellDef>Priority</th>
                  <td mat-cell *matCellDef="let task">
                    <mat-chip [color]="getTaskPriorityColor(task.priority)">
                      {{ task.priority }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let task">
                    <mat-chip [color]="task.status === 'completed' ? 'primary' : 'accent'">
                      {{ task.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="taskColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: taskColumns"></tr>
              </table>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
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

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-content {
        flex: 1;
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.9rem;
      }

      .stat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: rgba(0, 0, 0, 0.3);
      }

      .crm-tabs {
        background: var(--theme-surface);
        border-radius: 12px;
        overflow: hidden;
      }

      .tab-content {
        padding: 24px;
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .tab-header h2 {
        margin: 0;
        font-weight: 600;
      }

      .table-container {
        overflow-x: auto;
      }

      .crm-table {
        width: 100%;
      }

      .contact-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .contact-avatar {
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

      .contact-name {
        font-weight: 500;
      }

      .contact-email {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      mat-chip {
        font-size: 0.75rem;
        height: 24px;
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        .tab-header {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
        }
      }
    `,
  ],
})
export class CrmComponent {
  private crmService = inject(CrmService);
  private router = inject(Router);

  stats = signal<CrmStats>({
    contacts: 0,
    leads: 0,
    deals: 0,
    pendingTasks: 0,
    pipelineValue: 0
  });

  contacts = signal<Contact[]>([]);
  leads = signal<Lead[]>([]);
  deals = signal<Deal[]>([]);
  tasks = signal<Task[]>([]);

  contactColumns = ['name', 'company', 'status'];
  leadColumns = ['title', 'status', 'value'];
  dealColumns = ['title', 'stage', 'value', 'probability'];
  taskColumns = ['title', 'type', 'priority', 'status'];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.crmService.getDashboardStats().subscribe(stats => this.stats.set(stats));
    this.crmService.getContacts().subscribe(contacts => this.contacts.set(contacts));
    this.crmService.getLeads().subscribe(leads => this.leads.set(leads));
    this.crmService.getDeals().subscribe(deals => this.deals.set(deals));
    this.crmService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  formatCurrency(value: number): string {
    return (value / 1000).toFixed(0) + 'K';
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getLeadStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'new': 'accent',
      'qualified': 'primary',
      'contacted': 'primary',
      'converted': 'primary',
      'lost': 'warn'
    };
    return colors[status] || 'accent';
  }

  getDealStageColor(stage: string): string {
    const colors: { [key: string]: string } = {
      'prospecting': 'accent',
      'qualification': 'accent',
      'proposal': 'primary',
      'negotiation': 'primary',
      'closed-won': 'primary',
      'closed-lost': 'warn'
    };
    return colors[stage] || 'accent';
  }

  getTaskPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': 'accent',
      'medium': 'primary',
      'high': 'warn',
      'urgent': 'warn'
    };
    return colors[priority] || 'accent';
  }
}