import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { CrmFunnelService } from './crm-funnel.service';

@Component({
  selector: 'app-crm-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="crm-widget" (mouseenter)="pauseAutoSlide()" (mouseleave)="resumeAutoSlide()">
      <div class="header">
        <div class="icon-container">
          <mat-icon>business_center</mat-icon>
        </div>
        <div class="title-section">
          <span class="subtitle">Customer relationship management</span>
        </div>
      </div>

      <div class="slider-container">
        <div
          class="slider-wrapper"
          [style.transform]="'translateX(-' + currentSlide() * 100 + '%)'"
        >
          <!-- Overview Card -->
          <div class="slide">
            <div class="card-content">
              <div class="pipeline-overview">
                <div class="pipeline-value">
                  <div class="value">
                    \${{ formatCurrency(dashboard()?.revenue?.pipeline || 0) }}
                  </div>
                  <div class="label">Pipeline</div>
                </div>
                <div class="conversion-rate">
                  <div class="rate">
                    {{ dashboard()?.conversion?.quotationToOrder || 0 }}%
                  </div>
                  <div class="label">Win Rate</div>
                </div>
              </div>
              <div class="metrics-grid">
                <div class="metric">
                  <div class="metric-number contacts">
                    {{ dashboard()?.funnel?.contacts || 0 }}
                  </div>
                  <div class="metric-label">Contacts</div>
                </div>
                <div class="metric">
                  <div class="metric-number leads">{{ dashboard()?.funnel?.enquiries || 0 }}</div>
                  <div class="metric-label">Enquiries</div>
                </div>
                <div class="metric">
                  <div class="metric-number deals">{{ dashboard()?.funnel?.quotations || 0 }}</div>
                  <div class="metric-label">Quotations</div>
                </div>
                <div class="metric">
                  <div class="metric-number tasks">
                    {{ dashboard()?.funnel?.orders || 0 }}
                  </div>
                  <div class="metric-label">Orders</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Funnel Card -->
          <div class="slide">
            <div class="card-content">
              <div class="card-title">Conversion Funnel</div>
              <div class="funnel-stages">
                <div class="stage">
                  <div class="stage-value">
                    {{ dashboard()?.funnel?.contacts || 0 }}
                  </div>
                  <div class="stage-label">Contacts</div>
                </div>
                <div class="stage-arrow">→</div>
                <div class="stage">
                  <div class="stage-value">
                    {{ dashboard()?.funnel?.enquiries || 0 }}
                  </div>
                  <div class="stage-label">Enquiries</div>
                  <div class="stage-rate">
                    {{ dashboard()?.conversion?.contactToEnquiry || 0 }}%
                  </div>
                </div>
                <div class="stage-arrow">→</div>
                <div class="stage">
                  <div class="stage-value">
                    {{ dashboard()?.funnel?.orders || 0 }}
                  </div>
                  <div class="stage-label">Orders</div>
                  <div class="stage-rate">
                    {{ dashboard()?.conversion?.quotationToOrder || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pipeline Card -->
          <div class="slide">
            <div class="card-content">
              <div class="card-title">Enquiry Pipeline</div>
              <div class="pipeline-stages" *ngIf="pipeline()">
                <div class="stage-item">
                  <div class="stage-header">
                    <span class="stage-name">New</span>
                    <span class="stage-count">{{ pipeline()?.new?.length || 0 }}</span>
                  </div>
                  <mat-progress-bar [value]="getPercentage(pipeline()?.new?.length)" mode="determinate"></mat-progress-bar>
                </div>
                <div class="stage-item">
                  <div class="stage-header">
                    <span class="stage-name">Processing</span>
                    <span class="stage-count">{{ pipeline()?.processing?.length || 0 }}</span>
                  </div>
                  <mat-progress-bar [value]="getPercentage(pipeline()?.processing?.length)" mode="determinate"></mat-progress-bar>
                </div>
                <div class="stage-item">
                  <div class="stage-header">
                    <span class="stage-name">Quoted</span>
                    <span class="stage-count">{{ pipeline()?.quoted?.length || 0 }}</span>
                  </div>
                  <mat-progress-bar [value]="getPercentage(pipeline()?.quoted?.length)" mode="determinate"></mat-progress-bar>
                </div>
                <div class="stage-item">
                  <div class="stage-header">
                    <span class="stage-name">Won</span>
                    <span class="stage-count">{{ pipeline()?.converted?.length || 0 }}</span>
                  </div>
                  <mat-progress-bar [value]="getPercentage(pipeline()?.converted?.length)" mode="determinate"></mat-progress-bar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <div class="slider-dots">
          <button
            class="dot"
            [class.active]="currentSlide() === 0"
            (click)="goToSlide(0)"
          ></button>
          <button
            class="dot"
            [class.active]="currentSlide() === 1"
            (click)="goToSlide(1)"
          ></button>
          <button
            class="dot"
            [class.active]="currentSlide() === 2"
            (click)="goToSlide(2)"
          ></button>
        </div>
        <button
          mat-flat-button
          color="primary"
          class="crm-button"
          (click)="openCrm()"
        >
          <mat-icon>business_center</mat-icon>
          Open CRM
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .crm-widget {
        padding: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* Expanded view styles */
      :host-context([data-view="expanded"]) .crm-widget {
        padding: 20px;
        gap: 16px;
      }

      :host-context([data-view="expanded"]) .header {
        margin-bottom: 12px;
      }

      :host-context([data-view="expanded"]) .icon-container {
        width: 48px;
        height: 48px;
      }

      :host-context([data-view="expanded"]) .icon-container mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      :host-context([data-view="expanded"]) .subtitle {
        font-size: 1.1rem;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .icon-container {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #4caf50, #66bb6a);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .icon-container mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .subtitle {
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        font-weight: 600;
      }

      .slider-container {
        flex: 1;
        overflow: hidden;
        border-radius: 8px;
      }

      .slider-wrapper {
        display: flex;
        transition: transform 0.3s ease;
        height: 100%;
      }

      .slide {
        min-width: 100%;
        height: 100%;
      }

      .card-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card-title {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--theme-on-surface);
        margin-bottom: 8px;
      }

      .pipeline-overview {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 8px;
        padding: 10px;
        background: transparent;
        border-radius: 6px;
        border: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
      }

      :host-context([data-view="expanded"]) .pipeline-overview {
        padding: 20px;
        border-radius: 12px;
        gap: 16px;
      }

      .pipeline-value .value {
        font-size: 1.4rem;
        font-weight: 700;
        color: #4caf50;
        line-height: 1;
      }

      :host-context([data-view="expanded"]) .pipeline-value .value {
        font-size: 2.2rem;
      }

      .conversion-rate .rate {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ff9800;
        line-height: 1;
      }

      :host-context([data-view="expanded"]) .conversion-rate .rate {
        font-size: 1.8rem;
      }

      .pipeline-value .label,
      .conversion-rate .label {
        font-size: 0.7rem;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
        margin-top: 2px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }

      :host-context([data-view="expanded"]) .metrics-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .metric {
        text-align: center;
        padding: 6px;
        border-radius: 4px;
        background: transparent;
      }

      :host-context([data-view="expanded"]) .metric {
        padding: 16px;
        border-radius: 8px;
      }

      .metric-number {
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1;
      }

      :host-context([data-view="expanded"]) .metric-number {
        font-size: 1.6rem;
      }

      .metric-number.contacts {
        color: #9c27b0;
      }
      .metric-number.leads {
        color: #2196f3;
      }
      .metric-number.deals {
        color: #ff5722;
      }
      .metric-number.tasks {
        color: #ff9800;
      }

      .metric-label {
        font-size: 0.65rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        margin-top: 2px;
      }

      .funnel-stages {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        padding: 8px;
        background: transparent;
        border-radius: 6px;
      }

      .stage {
        text-align: center;
        flex: 1;
      }

      .stage-value {
        font-size: 1rem;
        font-weight: 700;
        color: var(--theme-primary);
      }

      .stage-label {
        font-size: 0.6rem;
        color: var(--theme-on-surface);
        opacity: 0.7;
        margin-top: 2px;
      }

      .stage-rate {
        font-size: 0.55rem;
        color: var(--theme-accent);
        font-weight: 600;
        margin-top: 1px;
      }

      .stage-arrow {
        font-size: 12px;
        color: var(--theme-on-surface);
        opacity: 0.5;
      }

      .pipeline-stages {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .stage-item {
        margin-bottom: 6px;
      }

      .stage-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
      }

      .stage-name {
        font-size: 0.65rem;
        font-weight: 500;
      }

      .stage-count {
        font-size: 0.65rem;
        color: var(--theme-primary);
        font-weight: 600;
      }

      .navigation {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .slider-dots {
        display: flex;
        gap: 6px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        background: color-mix(
          in srgb,
          var(--theme-on-surface) 30%,
          transparent
        );
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .dot.active {
        background: var(--theme-primary);
      }

      .crm-button {
        height: 32px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      :host-context([data-view="expanded"]) .crm-button {
        height: 48px;
        font-size: 1rem;
        border-radius: 8px;
      }

      .crm-button mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      :host-context([data-view="expanded"]) .crm-button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
    `,
  ],
})
export class CrmWidgetComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private funnelService = inject(CrmFunnelService);

  dashboard = signal<any>(null);
  pipeline = signal<any>(null);
  currentSlide = signal(0);
  private slideInterval: any;

  ngOnInit() {
    this.loadAllData();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      const nextSlide = (this.currentSlide() + 1) % 3;
      this.currentSlide.set(nextSlide);
    }, 5000);
  }

  pauseAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  loadAllData() {
    this.funnelService.getDashboard().subscribe(data => this.dashboard.set(data));
    this.funnelService.getPipeline().subscribe(data => this.pipeline.set(data));
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  }

  getPercentage(count: number): number {
    const total = (this.pipeline()?.new?.length || 0) +
      (this.pipeline()?.processing?.length || 0) +
      (this.pipeline()?.quoted?.length || 0) +
      (this.pipeline()?.converted?.length || 0);
    return total > 0 ? (count / total) * 100 : 0;
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  openCrm() {
    this.router.navigate(['/modules/crm/funnel']);
  }
}
