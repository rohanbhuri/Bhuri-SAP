import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HrManagementService, AssetDto } from '../hr-management.service';
import { AuthService } from '../../../services/auth.service';
import { AssetDialogComponent } from '../dialogs/asset-dialog.component';

@Component({
  selector: 'app-hr-assets-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Asset Management</h2>
        <button mat-raised-button color="primary" (click)="openAssetDialog()">
          <mat-icon>add</mat-icon>
          Add Asset
        </button>
      </div>



      <div class="cards-container">
        <div class="asset-card" *ngFor="let asset of displayedAssets()">
          <mat-card class="asset-card-content">
            <div class="card-header">
              <div class="asset-info">
                <mat-icon [class]="getCategoryIcon(asset.category)">{{ getCategoryIcon(asset.category) }}</mat-icon>
                <div class="asset-details">
                  <span class="asset-name">{{ asset.name }}</span>
                  <span class="asset-serial">{{ asset.serialNumber || 'No Serial' }}</span>
                </div>
              </div>
              <mat-chip class="category-chip">{{ asset.category || 'General' }}</mat-chip>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>qr_code</mat-icon>
                  <div class="info-details">
                    <span class="info-label">Serial Number</span>
                    <code class="serial-code">{{ asset.serialNumber || 'N/A' }}</code>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>category</mat-icon>
                  <div class="info-details">
                    <span class="info-label">Category</span>
                    <span class="info-value">{{ asset.category || 'General' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more assets...</span>
      </div>
      
      <div class="no-data" *ngIf="assets().length === 0 && !loading()">
        <mat-icon>inventory_2</mat-icon>
        <h3>No assets found</h3>
        <p>Register your first asset above</p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-content { padding: 24px; min-height: 100vh; }
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .page-header h2 { margin: 0; color: var(--theme-on-surface); font-size: 24px; font-weight: 500; }
      
      .asset-form-section {
        background: var(--theme-surface);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .asset-form-section h3 { margin: 0 0 16px 0; color: var(--theme-on-surface); font-size: 18px; font-weight: 500; }
      .new-asset { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; align-items: end; }
      
      .cards-container { 
        display: grid; 
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
      
      .asset-card-content {
        transition: all 0.3s ease;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
      }
      
      .asset-card-content:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
      }
      
      .card-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 16px; 
        padding: 16px 16px 0;
      }
      
      .asset-info { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
      .asset-info mat-icon { color: var(--theme-primary); flex-shrink: 0; font-size: 32px; width: 32px; height: 32px; }
      .asset-details { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .asset-name { font-weight: 500; word-break: break-word; }
      .asset-serial { font-size: 12px; opacity: 0.7; font-family: 'Courier New', monospace; }
      
      .category-chip { font-size: 11px; height: 22px; flex-shrink: 0; }
      
      .card-body { padding: 0 16px 16px; }
      
      .info-grid { display: grid; gap: 12px; }
      
      .info-item { 
        display: flex; 
        align-items: center; 
        gap: 12px; 
        padding: 12px;
        background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
        border-radius: 8px;
      }
      
      .info-item mat-icon { color: var(--theme-primary); flex-shrink: 0; }
      .info-details { display: flex; flex-direction: column; gap: 2px; }
      .info-label { font-size: 12px; opacity: 0.7; }
      .info-value { font-weight: 500; }
      
      .serial-code {
        background: color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        font-weight: 500;
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
      
      .no-data mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
      .no-data h3 { margin: 16px 0 8px; }
      .no-data p { margin: 0; }
      
      @media (max-width: 768px) {
        .page-content { padding: 16px; }
        .cards-container { grid-template-columns: 1fr; gap: 16px; }
        .page-header { flex-direction: column; gap: 16px; align-items: stretch; }
        .new-asset { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class AssetsPageComponent implements OnInit {
  private hr = inject(HrManagementService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  assets = signal<AssetDto[]>([]);
  displayedAssets = signal<AssetDto[]>([]);
  loading = signal(false);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  private get organizationId(): string {
    return this.auth.getCurrentUser()?.organizationId || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const orgId = this.organizationId;
    if (!orgId) return;
    this.loading.set(true);
    this.currentPage = 0;
    this.hasMoreData = true;
    this.displayedAssets.set([]);
    
    this.hr.listAssets(orgId).subscribe({
      next: (list) => {
        this.assets.set(list);
        this.loadMoreAssets();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreAssets(): void {
    const allAssets = this.assets();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newAssets = allAssets.slice(startIndex, endIndex);
    
    if (newAssets.length > 0) {
      this.displayedAssets.set([...this.displayedAssets(), ...newAssets]);
      this.currentPage++;
      this.hasMoreData = endIndex < allAssets.length;
    } else {
      this.hasMoreData = false;
    }
  }
  
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.hasMoreData && !this.loading()) {
      const threshold = 200;
      const position = window.pageYOffset + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      
      if (position > height - threshold) {
        this.loadMoreAssets();
      }
    }
  }

  openAssetDialog(asset?: AssetDto): void {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '500px',
      data: asset || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.hr.createAsset(result).subscribe({
        next: (created) => {
          if (created && created._id) {
            this.assets.set([created, ...this.assets()]);
            this.displayedAssets.set([created, ...this.displayedAssets()]);
          } else {
            this.load();
          }
          this.snackBar.open('Asset created successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error creating asset', 'Close', { duration: 3000 })
      });
    });
  }
  
  getCategoryIcon(category?: string): string {
    switch (category?.toLowerCase()) {
      case 'it equipment': return 'computer';
      case 'furniture': return 'chair';
      case 'mobile device': return 'phone_android';
      default: return 'inventory_2';
    }
  }
}
