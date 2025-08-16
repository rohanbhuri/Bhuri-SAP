import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MyOrganizationsService } from './my-organizations.service';

@Component({
  selector: 'app-my-organizations-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="widget-content">
      <div class="widget-stats">
        <div class="stat-item">
          <div class="stat-number">{{ myOrgsCount() }}</div>
          <div class="stat-label">My Organizations</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ publicOrgsCount() }}</div>
          <div class="stat-label">Public Organizations</div>
        </div>
      </div>
      <div class="widget-actions">
        <button
          mat-raised-button
          color="primary"
          (click)="openMyOrganizations()"
        >
          <mat-icon>groups</mat-icon>
          View Organizations
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
export class MyOrganizationsWidgetComponent implements OnInit {
  private router = inject(Router);
  private myOrgService = inject(MyOrganizationsService);

  myOrgsCount = signal(0);
  publicOrgsCount = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      myOrgs: this.myOrgService.getMyOrganizations(),
      publicOrgs: this.myOrgService.getPublicOrganizations()
    }).subscribe({
      next: ({ myOrgs, publicOrgs }) => {
        this.myOrgsCount.set(myOrgs.length);
        this.publicOrgsCount.set(publicOrgs.length);
      },
      error: () => {
        this.myOrgsCount.set(0);
        this.publicOrgsCount.set(0);
      }
    });
  }

  openMyOrganizations() {
    this.router.navigate(['/modules/my-organizations']);
  }
}