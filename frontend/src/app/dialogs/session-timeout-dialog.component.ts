import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-session-timeout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="session-timeout-dialog">
      <mat-icon class="warning-icon">warning</mat-icon>
      <h2>Session Timed Out</h2>
      <p>Your session has expired. Please login again to continue.</p>
      <button mat-raised-button color="primary" (click)="login()">
        Login Again
      </button>
    </div>
  `,
  styles: [`
    .session-timeout-dialog {
      text-align: center;
      padding: 2rem;
      min-width: 300px;
    }
    .warning-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #ff9800;
      margin-bottom: 1rem;
    }
    h2 {
      margin: 1rem 0 0.5rem;
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
  `]
})
export class SessionTimeoutDialogComponent {
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<SessionTimeoutDialogComponent>);

  login() {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}
