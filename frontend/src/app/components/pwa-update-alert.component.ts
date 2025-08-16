import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PwaService } from '../services/pwa.service';

@Component({
  selector: 'app-pwa-update-alert',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="update-alert">
      <div class="alert-content">
        <mat-icon class="update-icon">system_update</mat-icon>
        <div class="alert-text">
          <span class="alert-title">New version available!</span>
          <span class="alert-message">Update now to get the latest features</span>
        </div>
      </div>
      <div class="alert-actions">
        <button mat-button (click)="dismiss()" class="dismiss-btn">Later</button>
        <button mat-raised-button color="primary" (click)="updateApp()" class="update-btn">
          <mat-icon>refresh</mat-icon>
          Update
        </button>
      </div>
    </div>
  `,
  styles: [`
    .update-alert {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 4px;
      min-width: 350px;
    }

    .alert-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .update-icon {
      color: var(--primary-color, #3B82F6);
      font-size: 24px;
    }

    .alert-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .alert-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.95rem;
    }

    .alert-message {
      font-size: 0.85rem;
      color: #64748b;
    }

    .alert-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .dismiss-btn {
      color: #64748b;
      font-size: 0.9rem;
    }

    .update-btn {
      background: linear-gradient(135deg, var(--primary-color, #3B82F6), var(--accent-color, #F59E0B));
      color: white;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .update-btn mat-icon {
      font-size: 18px;
      margin-right: 4px;
    }

    @media (max-width: 480px) {
      .update-alert {
        min-width: 280px;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      
      .alert-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class PwaUpdateAlertComponent {
  private pwaService = inject(PwaService);
  private snackBarRef = inject(MatSnackBarRef<PwaUpdateAlertComponent>);

  updateApp() {
    this.pwaService.updatePWA();
    this.snackBarRef.dismiss();
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}