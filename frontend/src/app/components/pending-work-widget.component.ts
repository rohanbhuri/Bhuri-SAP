import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { OrganizationManagementService } from '../modules/organization-management/organization-management.service';

@Component({
  selector: 'app-pending-work-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatListModule],
  template: `
    <mat-card class="pending-work-card" color="primary">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>pending_actions</mat-icon>
          Pending Work
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="pending-summary">
          <div class="summary-item">
            <span class="count">{{ pendingRequests() }}</span>
            <span class="label">Organization Requests</span>
          </div>
        </div>

        @if (pendingRequests() > 0) {
          <mat-list class="pending-list">
            <mat-list-item>
              <mat-icon matListItemIcon>group_add</mat-icon>
              <div matListItemTitle>{{ pendingRequests() }} organization membership requests</div>
              <button mat-icon-button (click)="viewOrganizationRequests()">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        } @else {
          <div class="no-pending">
            <mat-icon>check_circle</mat-icon>
            <p>No pending work</p>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .pending-work-card {
      height: 100%;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
    }

    .pending-summary {
      margin-bottom: 16px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .count {
      font-size: 2rem;
      font-weight: 700;
      color: var(--theme-primary);
    }

    .label {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }

    .pending-list {
      padding: 0;
    }

    .no-pending {
      text-align: center;
      padding: 24px;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
    }

    .no-pending mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #4caf50;
      margin-bottom: 8px;
    }

    .no-pending p {
      margin: 0;
    }
  `],
})
export class PendingWorkWidgetComponent implements OnInit {
  private router = inject(Router);
  private orgService = inject(OrganizationManagementService);

  pendingRequests = signal(0);

  ngOnInit() {
    this.loadPendingWork();
  }

  loadPendingWork() {
    this.orgService.getOrganizationRequests().subscribe({
      next: (requests) => {
        const pendingCount = requests.filter(r => r.status === 'pending').length;
        this.pendingRequests.set(pendingCount);
      },
      error: () => {
        this.pendingRequests.set(0);
      },
    });
  }

  viewOrganizationRequests() {
    this.router.navigate(['/modules/organization-management/requests']);
  }
}