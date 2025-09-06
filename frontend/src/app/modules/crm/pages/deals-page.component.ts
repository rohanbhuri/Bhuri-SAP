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
import { CrmService, Deal } from '../crm.service';
import { DealDialogComponent } from '../dialogs/deal-dialog.component';

@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatMenuModule
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
      
      <div class="table-container">
        <table mat-table [dataSource]="deals()" class="deals-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let deal">{{ deal.title }}</td>
          </ng-container>
          
          <ng-container matColumnDef="stage">
            <th mat-header-cell *matHeaderCellDef>Stage</th>
            <td mat-cell *matCellDef="let deal">
              <mat-chip [color]="getDealStageColor(deal.stage)">{{ deal.stage }}</mat-chip>
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
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let deal">
              <button mat-icon-button [matMenuTriggerFor]="dealMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #dealMenu="matMenu">
                <button mat-menu-item (click)="editDeal(deal)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteDeal(deal._id)">
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
    .deals-table { width: 100%; }
  `]
})
export class DealsPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  deals = signal<Deal[]>([]);
  displayedColumns = ['title', 'stage', 'value', 'probability', 'actions'];

  ngOnInit() {
    this.loadDeals();
  }

  loadDeals() {
    this.crmService.getDeals().subscribe(deals => this.deals.set(deals));
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
            next: () => {
              this.loadDeals();
              this.snackBar.open('Deal updated successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error updating deal', 'Close', { duration: 3000 })
          });
        } else {
          this.crmService.createDeal(result).subscribe({
            next: () => {
              this.loadDeals();
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

  deleteDeal(id: string) {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.crmService.deleteDeal(id).subscribe({
        next: () => {
          this.loadDeals();
          this.snackBar.open('Deal deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting deal', 'Close', { duration: 3000 })
      });
    }
  }
}