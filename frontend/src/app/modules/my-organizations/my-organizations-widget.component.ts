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
    <div class="my-orgs-widget">
      <div class="header">
        <div class="icon-container">
          <mat-icon>groups</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Your organization memberships</span>
        </div>
      </div>
      
      <div class="membership-overview">
        <div class="membership-card active">
          <div class="card-icon">
            <mat-icon>verified</mat-icon>
          </div>
          <div class="card-content">
            <div class="card-number">{{ myOrgsCount() }}</div>
            <div class="card-label">Active Memberships</div>
          </div>
          <div class="card-accent"></div>
        </div>
        
        <div class="membership-card available">
          <div class="card-icon">
            <mat-icon>public</mat-icon>
          </div>
          <div class="card-content">
            <div class="card-number">{{ publicOrgsCount() }}</div>
            <div class="card-label">Available to Join</div>
          </div>
          <div class="card-accent"></div>
        </div>
      </div>
      
      <div class="membership-status">
        <div class="status-item">
          <div class="status-dot active"></div>
          <span class="status-text">{{ getStatusText() }}</span>
        </div>
      </div>
      
      <div class="action-section">
        <button mat-flat-button color="primary" (click)="openMyOrganizations()">
          <mat-icon>explore</mat-icon>
          Explore Orgs
        </button>
      </div>
    </div>
  `,
  styles: [`
    .my-orgs-widget {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #9C27B0, #BA68C8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .subtitle {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    .membership-overview {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }
    
    .membership-card {
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }
    
    .membership-card.active {
      background: linear-gradient(135deg, color-mix(in srgb, #9C27B0 10%, transparent), color-mix(in srgb, #9C27B0 5%, transparent));
      border: 1px solid color-mix(in srgb, #9C27B0 20%, transparent);
    }
    
    .membership-card.available {
      background: linear-gradient(135deg, color-mix(in srgb, #4CAF50 10%, transparent), color-mix(in srgb, #4CAF50 5%, transparent));
      border: 1px solid color-mix(in srgb, #4CAF50 20%, transparent);
    }
    
    .card-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .active .card-icon {
      background: #9C27B0;
    }
    
    .available .card-icon {
      background: #4CAF50;
    }
    
    .card-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .card-content {
      flex: 1;
    }
    
    .card-number {
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1;
    }
    
    .active .card-number {
      color: #9C27B0;
    }
    
    .available .card-number {
      color: #4CAF50;
    }
    
    .card-label {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      margin-top: 4px;
    }
    
    .card-accent {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 0 12px 12px 0;
    }
    
    .active .card-accent {
      background: linear-gradient(180deg, #9C27B0, #BA68C8);
    }
    
    .available .card-accent {
      background: linear-gradient(180deg, #4CAF50, #66BB6A);
    }
    
    .membership-status {
      padding: 8px 0;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4CAF50;
      animation: pulse 2s infinite;
    }
    
    .status-text {
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      font-weight: 500;
    }
    
    .action-section button {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `],
})
export class MyOrganizationsWidgetComponent implements OnInit {
  private router = inject(Router);
  private myOrgService = inject(MyOrganizationsService);

  myOrgsCount = signal(0);
  publicOrgsCount = signal(0);
  
  getStatusText(): string {
    const myCount = this.myOrgsCount();
    const publicCount = this.publicOrgsCount();
    
    if (myCount === 0) return 'No active memberships';
    if (publicCount > 0) return `Member of ${myCount}, ${publicCount} available to join`;
    return `Active member of ${myCount} organizations`;
  }

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