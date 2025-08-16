import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PwaService } from '../services/pwa.service';
import { BrandConfigService } from '../services/brand-config.service';

@Component({
  selector: 'app-pwa-install-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="install-modal">
      <div class="modal-header">
        <img [src]="brandConfig.brand.icon" [alt]="brandConfig.brand.name" class="app-icon">
        <h2 mat-dialog-title>Install {{ brandConfig.brand.name }}</h2>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-dialog-content class="modal-content">
        <div class="install-steps">
          <div class="step">
            <div class="step-icon">
              <mat-icon>download</mat-icon>
            </div>
            <div class="step-content">
              <h3>Quick Installation</h3>
              <p>Install {{ brandConfig.brand.name }} directly to your device for faster access and offline capabilities.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <mat-icon>offline_bolt</mat-icon>
            </div>
            <div class="step-content">
              <h3>Work Offline</h3>
              <p>Access your data and continue working even without an internet connection.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-icon">
              <mat-icon>notifications</mat-icon>
            </div>
            <div class="step-content">
              <h3>Push Notifications</h3>
              <p>Stay updated with real-time notifications about important updates and tasks.</p>
            </div>
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions class="modal-actions">
        <button mat-button mat-dialog-close class="cancel-btn">Maybe Later</button>
        <button mat-raised-button color="primary" (click)="installApp()" class="install-btn">
          <mat-icon>download</mat-icon>
          Install App
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .install-modal {
      max-width: 500px;
      width: 100%;
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px;
      position: relative;
    }

    .app-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
    }

    .modal-header h2 {
      margin: 0;
      flex: 1;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-color, #1e40af);
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .modal-content {
      padding: 0 24px 16px;
    }

    .install-steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .step {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .step-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-color, #3B82F6), var(--accent-color, #F59E0B));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .step-icon mat-icon {
      color: white;
      font-size: 24px;
    }

    .step-content h3 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .step-content p {
      margin: 0;
      color: #64748b;
      line-height: 1.5;
    }

    .modal-actions {
      padding: 16px 24px 24px;
      gap: 12px;
    }

    .cancel-btn {
      color: #64748b;
    }

    .install-btn {
      background: linear-gradient(135deg, var(--primary-color, #3B82F6), var(--accent-color, #F59E0B));
      color: white;
      border-radius: 25px;
      padding: 12px 24px;
      font-weight: 600;
    }

    .install-btn mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      .install-modal {
        max-width: 100%;
        margin: 0;
      }
      
      .modal-header {
        padding: 16px;
      }
      
      .modal-content {
        padding: 0 16px 12px;
      }
      
      .modal-actions {
        padding: 12px 16px 16px;
        flex-direction: column;
      }
      
      .modal-actions button {
        width: 100%;
      }
    }
  `]
})
export class PwaInstallModalComponent {
  private pwaService = inject(PwaService);
  private dialogRef = inject(MatDialogRef<PwaInstallModalComponent>);
  private brandConfigService = inject(BrandConfigService);
  
  brandConfig = this.brandConfigService.getConfig();

  async installApp() {
    const installed = await this.pwaService.installPWA();
    if (installed) {
      this.dialogRef.close(true);
    }
  }
}