import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { QuotationsService } from '../../quotations.service';
import { PresentationDialogComponent } from '../../dialogs/presentation-dialog.component';
import { QuotationDialogComponent } from '../../dialogs/quotation-dialog.component';

@Component({
  selector: 'app-presentation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule, MatTooltipModule],
  template: `
    <div class="list-container">
      <div class="list-header">
        <h2>Presentations</h2>
        <button mat-raised-button color="primary" (click)="createPresentation()">
          <mat-icon>add</mat-icon> Create Presentation
        </button>
      </div>

      <table mat-table [dataSource]="presentations" class="data-table">
        <ng-container matColumnDef="presentationNumber">
          <th mat-header-cell *matHeaderCellDef>Number</th>
          <td mat-cell *matCellDef="let p">{{p.presentationNumber}}</td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let p">{{p.title}}</td>
        </ng-container>

        <ng-container matColumnDef="clientName">
          <th mat-header-cell *matHeaderCellDef>Client</th>
          <td mat-cell *matCellDef="let p">{{p.clientName}}</td>
        </ng-container>

        <ng-container matColumnDef="slides">
          <th mat-header-cell *matHeaderCellDef>Slides</th>
          <td mat-cell *matCellDef="let p">{{p.slides?.length || 0}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let p">
            <mat-chip [style.background-color]="getStatusColor(p.status)" [style.color]="'white'">{{getStatusLabel(p.status)}}</mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let p">
            <button mat-icon-button [disabled]="p.status !== 'draft'" (click)="editPresentation(p)" matTooltip="Edit (Draft only)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button [disabled]="p.status !== 'draft'" (click)="markAsFinal(p)" matTooltip="Mark as Final"><mat-icon>check_circle</mat-icon></button>
            <button mat-icon-button [disabled]="p.status !== 'final'" (click)="sendToClient(p)" matTooltip="Send to Client"><mat-icon>send</mat-icon></button>
            <button mat-icon-button [disabled]="p.status === 'draft'" (click)="convertToQuotation(p)" [matTooltip]="p.quotationId ? 'Go to Quotation' : 'Convert to Quotation (Final/Sent only)'"><mat-icon>{{p.quotationId ? 'open_in_new' : 'request_quote'}}</mat-icon></button>
            <button mat-icon-button (click)="downloadPresentation(p._id)"><mat-icon>download</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deletePresentation(p._id)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .list-container { padding: 20px; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .data-table { width: 100%; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class PresentationListComponent implements OnInit {
  private quotationsService = inject(QuotationsService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  presentations: any[] = [];
  displayedColumns = ['presentationNumber', 'title', 'clientName', 'slides', 'status', 'actions'];

  ngOnInit() {
    this.loadPresentations();
    this.quotationsService.quotationDeleted$.subscribe(() => {
      this.loadPresentations();
    });
  }

  loadPresentations() {
    this.quotationsService.getAllPresentations().subscribe(data => {
      this.presentations = data;
      this.cdr.detectChanges();
    });
  }

  createPresentation() {
    this.dialog.open(PresentationDialogComponent, { width: '800px' }).afterClosed().subscribe(result => {
      if (result) this.loadPresentations();
    });
  }

  editPresentation(presentation: any) {
    if (presentation.status !== 'draft') {
      this.snackBar.open('Only draft presentations can be edited', 'Close', { duration: 3000 });
      return;
    }
    this.dialog.open(PresentationDialogComponent, { width: '800px', data: presentation }).afterClosed().subscribe(result => {
      if (result) this.loadPresentations();
    });
  }

  downloadPresentation(id: string) {
    this.quotationsService.downloadPresentation(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentation-${id}.pptx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  deletePresentation(id: string) {
    if (confirm('Delete this presentation?')) {
      this.quotationsService.deletePresentation(id).subscribe(() => this.loadPresentations());
    }
  }

  convertToQuotation(presentation: any) {
    if (presentation.status === 'draft') {
      this.snackBar.open('Only final or sent presentations can be converted to quotation', 'Close', { duration: 3000 });
      return;
    }
    
    if (presentation.quotationId) {
      this.quotationsService.getQuotation(presentation.quotationId).subscribe(quotation => {
        this.dialog.open(QuotationDialogComponent, {
          data: { quotation, mode: 'edit' }
        });
      });
      return;
    }
    
    this.quotationsService.convertPresentationToQuotation(presentation._id).subscribe({
      next: (result) => {
        if (result.existingQuotationId) {
          this.quotationsService.getQuotation(result.existingQuotationId).subscribe(quotation => {
            this.dialog.open(QuotationDialogComponent, {
              data: { quotation, mode: 'edit' }
            });
          });
          return;
        }
        
        this.dialog.open(QuotationDialogComponent, {
          data: { quotation: result, mode: 'create-from-presentation' }
        }).afterClosed().subscribe(savedQuotation => {
          if (savedQuotation) {
            this.quotationsService.linkQuotationToPresentation(presentation._id, savedQuotation._id).subscribe(() => {
              this.snackBar.open('Quotation created from presentation', 'Close', { duration: 3000 });
              this.loadPresentations();
            });
          }
        });
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to convert presentation', 'Close', { duration: 3000 })
    });
  }

  markAsFinal(presentation: any) {
    if (confirm('Mark this presentation as final? It will no longer be editable.')) {
      this.quotationsService.markPresentationFinal(presentation._id).subscribe({
        next: () => {
          this.snackBar.open('Presentation marked as final', 'Close', { duration: 3000 });
          this.loadPresentations();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to mark as final', 'Close', { duration: 3000 })
      });
    }
  }

  sendToClient(presentation: any) {
    if (confirm('Send this presentation to client?')) {
      this.quotationsService.sendPresentationToClient(presentation._id).subscribe({
        next: () => {
          this.snackBar.open('Presentation sent to client', 'Close', { duration: 3000 });
          this.loadPresentations();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to send to client', 'Close', { duration: 3000 })
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'draft': return '#9e9e9e';
      case 'final': return '#2196f3';
      case 'sent_to_client': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'draft': return 'Draft';
      case 'final': return 'Final';
      case 'sent_to_client': return 'Sent to Client';
      default: return status;
    }
  }
}
