import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuotationsService } from '../../quotations.service';
import { PresentationDialogComponent } from '../../dialogs/presentation-dialog.component';
import { QuotationDialogComponent } from '../../dialogs/quotation-dialog.component';

@Component({
  selector: 'app-presentation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule],
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
            <mat-chip [color]="p.status === 'completed' ? 'primary' : 'accent'">{{p.status}}</mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let p">
            <button mat-icon-button (click)="editPresentation(p)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button (click)="convertToQuotation(p)" matTooltip="Convert to Quotation"><mat-icon>request_quote</mat-icon></button>
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
  `]
})
export class PresentationListComponent implements OnInit {
  private quotationsService = inject(QuotationsService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  presentations: any[] = [];
  displayedColumns = ['presentationNumber', 'title', 'clientName', 'slides', 'status', 'actions'];

  ngOnInit() {
    this.loadPresentations();
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
    this.quotationsService.convertPresentationToQuotation(presentation._id).subscribe({
      next: (quotationData) => {
        this.dialog.open(QuotationDialogComponent, {
          width: '95vw',
          maxWidth: '1100px',
          data: { quotation: quotationData, mode: 'create-from-presentation' }
        }).afterClosed().subscribe(result => {
          if (result) {
            this.snackBar.open('Quotation created from presentation', 'Close', { duration: 3000 });
          }
        });
      },
      error: () => this.snackBar.open('Failed to convert presentation', 'Close', { duration: 3000 })
    });
  }
}
