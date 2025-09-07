import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
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
    MatIconModule,
    MatChipsModule,
    FormsModule,
  ],
  template: `
    <div class="tab-content">
      <div class="tab-header">
        <h2>Document Management</h2>
        <button mat-raised-button color="primary" (click)="create()">
          <mat-icon>upload_file</mat-icon>
          Add Document
        </button>
      </div>

      <div class="info-section">
        <mat-icon>info</mat-icon>
        <p>
          Document uploads to GridFS will be enabled after server packages are installed.
          Currently managing document metadata and references.
        </p>
      </div>

      <div class="document-form-section">
        <h3>Add New Document</h3>
        <div class="new-doc">
          <mat-form-field appearance="outline">
            <mat-label>Document Name</mat-label>
            <input matInput [(ngModel)]="docName" placeholder="e.g., Employment Contract" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>File ID</mat-label>
            <input matInput [(ngModel)]="docFileId" placeholder="File reference ID" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Document Type</mat-label>
            <input matInput [(ngModel)]="docType" placeholder="e.g., Contract, Certificate" />
          </mat-form-field>
        </div>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="docs()" class="hr-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Document Name</th>
            <td mat-cell *matCellDef="let d">
              <div class="document-info">
                <mat-icon>description</mat-icon>
                <span>{{ d.name }}</span>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let d">
              <mat-chip>{{ d.type || 'General' }}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="employeeId">
            <th mat-header-cell *matHeaderCellDef>Employee ID</th>
            <td mat-cell *matCellDef="let d">{{ d.employeeId }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
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
        color: var(--theme-on-surface);
        font-size: 24px;
        font-weight: 500;
      }

      .info-section {
        display: flex;
        align-items: center;
        gap: 12px;
        background: color-mix(in srgb, var(--theme-primary) 10%, transparent);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        border-left: 4px solid var(--theme-primary);
      }

      .info-section mat-icon {
        color: var(--theme-primary);
      }

      .info-section p {
        margin: 0;
        color: var(--theme-on-surface);
      }

      .document-form-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }

      .document-form-section h3 {
        margin: 0 0 16px 0;
        color: var(--theme-on-surface);
        font-size: 18px;
        font-weight: 500;
      }

      .new-doc {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        align-items: end;
      }

      .table-container {
        background: var(--theme-surface);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }

      .hr-table {
        width: 100%;
        background: var(--theme-surface);
      }

      .document-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .document-info mat-icon {
        color: var(--theme-primary);
      }

      @media (max-width: 768px) {
        .tab-content {
          padding: 16px;
        }
        
        .tab-header {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
        }
        
        .new-doc {
          grid-template-columns: 1fr;
        }
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
