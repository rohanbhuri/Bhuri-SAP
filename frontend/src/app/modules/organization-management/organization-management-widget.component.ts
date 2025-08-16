import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OrganizationManagementService } from './organization-management.service';

@Component({
  selector: 'app-organization-management-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ totalOrganizations() }}</div>
          <div class="stat-label">Organizations</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ pendingRequests() }}</div>
          <div class="stat-label">Requests</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openOrganizationManagement()"
        >
          <mat-icon>business</mat-icon>
          Manage Organizations
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .widget-content {
        padding: 16px;
      }

      .widget-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--theme-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .widget-actions {
        display: flex;
        justify-content: center;
      }

      button {
        width: 100%;
      }
    `,
  ],
})
export class OrganizationManagementWidgetComponent implements OnInit {
  private router = inject(Router);
  private orgService = inject(OrganizationManagementService);

  totalOrganizations = signal(0);
  pendingRequests = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.orgService.getOrganizations().subscribe({
      next: (orgs) => {
        this.totalOrganizations.set(orgs.length);
      },
      error: (error) => {
        console.error('Failed to load organizations:', error);
        this.totalOrganizations.set(0);
      },
    });

    this.orgService.getOrganizationRequests().subscribe({
      next: (requests) => {
        const pendingCount = requests.filter(r => r.status === 'pending').length;
        this.pendingRequests.set(pendingCount);
      },
      error: (error) => {
        console.error('Failed to load organization requests:', error);
        this.pendingRequests.set(0);
      },
    });
  }

  openOrganizationManagement() {
    this.router.navigate(['/modules/organization-management']);
  }
}