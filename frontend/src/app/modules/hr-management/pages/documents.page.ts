import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import {
  HrManagementService,
  DocumentRecordDto,
} from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-documents-page',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  template: `
    <mat-card>
      <h2>Documents</h2>
      <p>
        Uploads to GridFS will be enabled after server packages are installed.
        Listing metadata for now.
      </p>

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
    `,
  ],
})
export class DocumentsPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  docs = signal<DocumentRecordDto[]>([]);
  cols = ['name', 'type', 'employeeId'];

  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.hr
      .listDocumentRecords({ organizationId: this.organizationId })
      .subscribe((list) => this.docs.set(list));
  }
}
