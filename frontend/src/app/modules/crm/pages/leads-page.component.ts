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
import { CrmService, Lead } from '../crm.service';
import { LeadDialogComponent } from '../dialogs/lead-dialog.component';

@Component({
  selector: 'app-leads-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatMenuModule
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
      
      <div class="table-container">
        <table mat-table [dataSource]="leads()" class="leads-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let lead">{{ lead.title }}</td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let lead">
              <mat-chip [color]="getLeadStatusColor(lead.status)">{{ lead.status }}</mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Est. Value</th>
            <td mat-cell *matCellDef="let lead">{{ lead.estimatedValue ? '$' + lead.estimatedValue : '-' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="source">
            <th mat-header-cell *matHeaderCellDef>Source</th>
            <td mat-cell *matCellDef="let lead">{{ lead.source || '-' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let lead">
              <button mat-icon-button [matMenuTriggerFor]="leadMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #leadMenu="matMenu">
                <button mat-menu-item (click)="editLead(lead)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteLead(lead._id)">
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
    .leads-table { width: 100%; }
  `]
})
export class LeadsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  leads = signal<Lead[]>([]);
  displayedColumns = ['title', 'status', 'value', 'source', 'actions'];

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.crmService.getLeads().subscribe(leads => this.leads.set(leads));
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
            const updatedList = this.leads().map(l => l._id === lead._id ? { ...l, ...updated } : l);
            this.leads.set(updatedList);
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

  deleteLead(id: string) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.crmService.deleteLead(id).subscribe({
        next: () => {
          this.loadLeads();
          this.snackBar.open('Lead deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting lead', 'Close', { duration: 3000 })
      });
    }
  }
}