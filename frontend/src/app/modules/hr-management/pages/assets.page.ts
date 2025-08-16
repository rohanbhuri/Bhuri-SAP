import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HrManagementService, AssetDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-assets-page',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card>
      <h2>Assets</h2>

      <table mat-table [dataSource]="assets()" class="full-width">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let a">{{ a.name }}</td>
        </ng-container>
        <ng-container matColumnDef="serial">
          <th mat-header-cell *matHeaderCellDef>Serial</th>
          <td mat-cell *matCellDef="let a">{{ a.serialNumber || '-' }}</td>
        </ng-container>
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Category</th>
          <td mat-cell *matCellDef="let a">{{ a.category || '-' }}</td>
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
export class AssetsPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);

  assets = signal<AssetDto[]>([]);
  cols = ['name', 'serial', 'category'];

  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (!this.organizationId) return;
    this.hr
      .listAssets(this.organizationId)
      .subscribe((list) => this.assets.set(list));
  }
}
