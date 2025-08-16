import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  HrManagementService,
  DocumentRecordDto,
} from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hr-documents-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <mat-card>
      <h2>Documents</h2>
      <p>
        Uploads to GridFS will be enabled after server packages are installed.
        Listing and creating metadata for now.
      </p>

      <div class="new-doc">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="docName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>File ID</mat-label>
          <input matInput [(ngModel)]="docFileId" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <input matInput [(ngModel)]="docType" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="create()">
          Add
        </button>
      </div>

      <table mat-table [dataSource]="docs()" class="full-width">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let d">{{ d.name }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let d">{{ d.type || '-' }}</td>
        </ng-container>
        <ng-container matColumnDef="employeeId">
          <th mat-header-cell *matHeaderCellDef>Employee</th>
          <td mat-cell *matCellDef="let d">{{ d.employeeId }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
      .new-doc {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 16px 0;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class DocumentsPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  docs = signal<DocumentRecordDto[]>([]);
  cols = ['name', 'type', 'employeeId'];

  docName = '';
  docFileId = '';
  docType = '';

  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  private get employeeId(): string {
    return this.auth.getCurrentUser()?.id || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.hr
      .listDocumentRecords({ organizationId: this.organizationId })
      .subscribe((list) => this.docs.set(list));
  }

  create(): void {
    if (!this.docName || !this.docFileId) return;
    this.hr
      .createDocumentRecord({
        name: this.docName,
        fileId: this.docFileId,
        employeeId: this.employeeId,
        type: this.docType || undefined,
      })
      .subscribe(() => {
        this.docName = '';
        this.docFileId = '';
        this.docType = '';
        this.load();
      });
  }
}
