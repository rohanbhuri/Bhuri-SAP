import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { QuotationsService } from './quotations.service';

@Component({
  selector: 'app-quotations-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="widget-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>request_quote</mat-icon>
        <mat-card-title>Quotations</mat-card-title>
        <mat-card-subtitle>Cart-based enquiry system with auto-generation</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="widget-stats">
          <div class="stat-item">
            <span class="stat-number">{{ draftCount }}</span>
            <span class="stat-label">Drafts</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ sentCount }}</span>
            <span class="stat-label">Sent</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ enquiryCount }}</span>
            <span class="stat-label">Enquiries</span>
          </div>
        </div>
        <div class="widget-actions">
          <button mat-button (click)="navigateToNewQuotation()" class="action-btn">
            <mat-icon>add</mat-icon>
            New Quotation
          </button>
          <button mat-button (click)="navigateToEnquiries()" class="action-btn">
            <mat-icon>shopping_cart</mat-icon>
            Enquiry Form
          </button>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="navigateToModule()">
          <mat-icon>launch</mat-icon>
          Open Module
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .widget-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .widget-stats {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
      color: #FF9800;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }
    .widget-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .action-btn {
      justify-content: flex-start;
    }
  `]
})
export class QuotationsWidgetComponent implements OnInit {
  draftCount = 0;
  sentCount = 0;
  enquiryCount = 0;

  constructor(
    private router: Router,
    private quotationsService: QuotationsService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.quotationsService.getQuotations().subscribe(quotations => {
      this.draftCount = quotations.filter(q => q.status === 'DRAFT').length;
      this.sentCount = quotations.filter(q => q.status === 'SENT').length;
    });
  }

  navigateToModule() {
    this.router.navigate(['/modules/quotations']);
  }

  navigateToQuotations() {
    this.router.navigate(['/modules/quotations']);
  }

  navigateToEnquiries() {
    this.router.navigate(['/enquiry']);
  }

  navigateToNewQuotation() {
    this.router.navigate(['/modules/quotations/new']);
  }
}