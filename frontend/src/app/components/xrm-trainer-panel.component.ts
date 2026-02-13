import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { XrmTrainerService } from '../services/xrm-trainer.service';

@Component({
  selector: 'app-xrm-trainer-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    @if (trainerService.isOpen()) {
    <div class="trainer-overlay" (click)="trainerService.close()"></div>
    <div class="trainer-panel" [@slideIn]>
      <div class="trainer-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <mat-icon class="trainer-icon">school</mat-icon>
          </div>
          <div class="header-text">
            <h2>XRM Trainer</h2>
            <span class="header-subtitle">Contextual Help & Guidance</span>
          </div>
        </div>
        <button
          mat-icon-button
          (click)="trainerService.close()"
          class="close-button"
          aria-label="Close trainer"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Page Navigation Chips -->
      @if (trainerService.availablePages().length > 0) {
      <div class="page-navigation">
        <div class="nav-chips">
          @for (page of trainerService.availablePages(); track page.key) {
          <button 
            class="nav-chip"
            [class.active]="trainerService.currentPageKey() === page.key"
            (click)="trainerService.loadPage(page.key)"
          >
            <mat-icon class="chip-icon">{{ page.icon }}</mat-icon>
            <span class="chip-label">{{ page.label }}</span>
          </button>
          }
        </div>
      </div>
      }

      <div class="trainer-content">
        @if (trainerService.currentContent(); as content) {
        
        <!-- Title Section -->
        <div class="content-section title-section">
          <div class="title-wrapper">
            <mat-icon class="section-icon">info</mat-icon>
            <h3 class="section-title">{{ content.title }}</h3>
          </div>
          <p class="section-description">{{ content.description }}</p>
        </div>

        <!-- Features Section -->
        @if (content.features.length > 0) {
        <mat-divider></mat-divider>
        <div class="content-section features-section">
          <div class="subsection-header">
            <mat-icon class="header-icon">star</mat-icon>
            <h4 class="subsection-title">Features & Capabilities</h4>
            <span class="feature-count">{{ content.features.length }}</span>
          </div>
          
          <div class="features-grid">
            @for (feature of content.features; track feature.title) {
            <div class="feature-card">
              <div class="feature-header">
                <div class="feature-icon-wrapper">
                  <mat-icon class="feature-icon">{{ feature.icon }}</mat-icon>
                </div>
                <h5 class="feature-title">{{ feature.title }}</h5>
              </div>
              <p class="feature-description">{{ feature.description }}</p>
              @if (feature.steps && feature.steps.length > 0) {
              <div class="feature-steps">
                <div class="steps-header">
                  <mat-icon class="steps-icon">list</mat-icon>
                  <strong>How to use:</strong>
                </div>
                <ol class="steps-list">
                  @for (step of feature.steps; track $index) {
                  <li>{{ step }}</li>
                  }
                </ol>
              </div>
              }
            </div>
            }
          </div>
        </div>
        }

        <!-- FAQs Section -->
        @if (content.faqs.length > 0) {
        <mat-divider></mat-divider>
        <div class="content-section faqs-section">
          <div class="subsection-header">
            <mat-icon class="header-icon">help_outline</mat-icon>
            <h4 class="subsection-title">Frequently Asked Questions</h4>
            <span class="feature-count">{{ content.faqs.length }}</span>
          </div>
          <mat-accordion class="faq-accordion">
            @for (faq of content.faqs; track faq.question) {
            <mat-expansion-panel class="faq-panel">
              <mat-expansion-panel-header>
                <mat-panel-title class="faq-question">
                  <mat-icon class="question-icon">help</mat-icon>
                  {{ faq.question }}
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="faq-answer">
                <mat-icon class="answer-icon">check_circle</mat-icon>
                <p>{{ faq.answer }}</p>
              </div>
            </mat-expansion-panel>
            }
          </mat-accordion>
        </div>
        }

        <!-- CTA Section -->
        @if (content.cta) {
        <mat-divider></mat-divider>
        <div class="content-section cta-section" [class.highlight]="content.cta.highlight">
          <div class="cta-card">
            @if (content.cta.icon) {
            <div class="cta-icon-wrapper">
              <mat-icon class="cta-icon">{{ content.cta.icon }}</mat-icon>
            </div>
            }
            <h4 class="cta-title">{{ content.cta.title }}</h4>
            <p class="cta-description">{{ content.cta.description }}</p>
            <a [href]="content.cta.buttonLink" target="_blank" rel="noopener noreferrer" class="cta-button">
              <mat-icon>open_in_new</mat-icon>
              {{ content.cta.buttonText }}
            </a>
          </div>
        </div>
        }

        <!-- Footer Tip -->
        <div class="trainer-footer">
          <mat-icon class="footer-icon">lightbulb</mat-icon>
          <span class="footer-text">Press <kbd>Ctrl+/</kbd> to toggle trainer • <kbd>ESC</kbd> to close</span>
        </div>
        
        }
      </div>
    </div>
    }
  `,
  styles: [
    `
      .trainer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .trainer-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 480px;
        max-width: 90vw;
        height: 100vh;
        background: #ffffff;
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      :host-context(body.dark-theme) .trainer-panel {
        background: #1a1a1a;
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.6);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Header Styles */
      .trainer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
        background: linear-gradient(
          135deg,
          var(--theme-primary) 0%,
          color-mix(in srgb, var(--theme-primary) 85%, #000) 100%
        );
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      :host-context(body.dark-theme) .trainer-header {
        border-bottom-color: #374151;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }

      .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }

      .trainer-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .header-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .trainer-header h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        line-height: 1.2;
      }

      .header-subtitle {
        font-size: 13px;
        opacity: 0.9;
        font-weight: 400;
      }

      .close-button {
        color: #ffffff;
        transition: all 0.2s ease;
      }

      .close-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }

      /* Page Navigation Chips */
      .page-navigation {
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        padding: 16px 20px;
        overflow-x: auto;
        overflow-y: hidden;
      }

      :host-context(body.dark-theme) .page-navigation {
        background: #111827;
        border-bottom-color: #374151;
      }

      .page-navigation::-webkit-scrollbar {
        height: 4px;
      }

      .page-navigation::-webkit-scrollbar-track {
        background: transparent;
      }

      .page-navigation::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 2px;
      }

      :host-context(body.dark-theme) .page-navigation::-webkit-scrollbar-thumb {
        background: #4b5563;
      }

      .nav-chips {
        display: flex;
        gap: 8px;
        flex-wrap: nowrap;
      }

      .nav-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        color: #4b5563;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        flex-shrink: 0;
      }

      :host-context(body.dark-theme) .nav-chip {
        background: #1f2937;
        border-color: #4b5563;
        color: #9ca3af;
      }

      .nav-chip:hover {
        background: color-mix(in srgb, var(--theme-primary) 10%, #ffffff);
        border-color: var(--theme-primary);
        color: var(--theme-primary);
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      :host-context(body.dark-theme) .nav-chip:hover {
        background: color-mix(in srgb, var(--theme-primary) 20%, #1f2937);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .nav-chip.active {
        background: var(--theme-primary);
        border-color: var(--theme-primary);
        color: #ffffff;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--theme-primary) 30%, transparent);
      }

      .nav-chip.active:hover {
        background: color-mix(in srgb, var(--theme-primary) 90%, #000);
        transform: translateY(-2px);
      }

      .chip-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .chip-label {
        line-height: 1;
      }

      /* Content Styles */
      .trainer-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0;
        scroll-behavior: smooth;
      }

      .trainer-content::-webkit-scrollbar {
        width: 8px;
      }

      .trainer-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .trainer-content::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }

      :host-context(body.dark-theme) .trainer-content::-webkit-scrollbar-thumb {
        background: #4b5563;
      }

      .content-section {
        padding: 24px;
      }

      /* Title Section */
      .title-section {
        background: linear-gradient(
          to bottom,
          color-mix(in srgb, var(--theme-primary) 5%, transparent),
          transparent
        );
        border-bottom: 1px solid #e5e7eb;
      }

      :host-context(body.dark-theme) .title-section {
        border-bottom-color: #374151;
      }

      .title-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .section-icon {
        color: var(--theme-primary);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .section-title {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
        color: #111827;
        line-height: 1.3;
      }

      :host-context(body.dark-theme) .section-title {
        color: #f9fafb;
      }

      .section-description {
        font-size: 15px;
        color: #4b5563;
        margin: 0;
        line-height: 1.7;
      }

      :host-context(body.dark-theme) .section-description {
        color: #9ca3af;
      }

      /* Subsection Headers */
      .subsection-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid color-mix(in srgb, var(--theme-primary) 20%, transparent);
      }

      .header-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: var(--theme-primary);
      }

      .subsection-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        color: #111827;
        flex: 1;
      }

      :host-context(body.dark-theme) .subsection-title {
        color: #f9fafb;
      }

      .feature-count {
        background: var(--theme-primary);
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 12px;
        min-width: 24px;
        text-align: center;
      }

      /* Features Grid */
      .features-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .feature-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 20px;
        border-left: 4px solid var(--theme-primary);
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .feature-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(4px);
      }

      :host-context(body.dark-theme) .feature-card {
        background: #111827;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      :host-context(body.dark-theme) .feature-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      .feature-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 12px;
      }

      .feature-icon-wrapper {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--theme-primary) 15%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .feature-icon {
        color: var(--theme-primary);
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .feature-title {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        color: #111827;
        line-height: 1.3;
      }

      :host-context(body.dark-theme) .feature-title {
        color: #f9fafb;
      }

      .feature-description {
        font-size: 14px;
        color: #6b7280;
        margin: 0 0 16px 0;
        line-height: 1.6;
      }

      :host-context(body.dark-theme) .feature-description {
        color: #9ca3af;
      }

      /* Feature Steps */
      .feature-steps {
        background: #ffffff;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #e5e7eb;
      }

      :host-context(body.dark-theme) .feature-steps {
        background: #0a0a0a;
        border-color: #374151;
      }

      .steps-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: var(--theme-primary);
        font-weight: 600;
        font-size: 14px;
      }

      .steps-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .steps-list {
        margin: 0;
        padding-left: 24px;
        color: #374151;
      }

      :host-context(body.dark-theme) .steps-list {
        color: #d1d5db;
      }

      .steps-list li {
        margin-bottom: 8px;
        line-height: 1.6;
        font-size: 14px;
      }

      .steps-list li:last-child {
        margin-bottom: 0;
      }

      /* FAQs Section */
      .faq-accordion {
        display: block;
      }

      ::ng-deep .faq-panel {
        margin-bottom: 12px !important;
        border-radius: 10px !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
        overflow: hidden;
        border: 1px solid #e5e7eb !important;
      }

      :host-context(body.dark-theme) ::ng-deep .faq-panel {
        border-color: #374151 !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
      }

      ::ng-deep .faq-panel .mat-expansion-panel-header {
        padding: 16px 20px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      ::ng-deep .faq-panel .mat-expansion-panel-header:hover {
        background: color-mix(in srgb, var(--theme-primary) 5%, transparent) !important;
      }

      .faq-question {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 500;
      }

      .question-icon {
        color: var(--theme-primary);
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .faq-answer {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        background: color-mix(in srgb, var(--theme-primary) 3%, transparent);
      }

      .answer-icon {
        color: #10b981;
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .faq-answer p {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: #4b5563;
      }

      :host-context(body.dark-theme) .faq-answer p {
        color: #9ca3af;
      }

      /* CTA Section */
      .cta-section {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--theme-primary) 5%, transparent),
          color-mix(in srgb, var(--theme-accent, var(--theme-primary)) 5%, transparent)
        );
        border-top: 2px solid var(--theme-primary);
      }

      .cta-section.highlight {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--theme-primary) 10%, transparent),
          color-mix(in srgb, var(--theme-accent, var(--theme-primary)) 10%, transparent)
        );
        animation: ctaPulse 3s ease-in-out infinite;
      }

      @keyframes ctaPulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.95;
        }
      }

      .cta-card {
        text-align: center;
        padding: 32px 24px;
      }

      .cta-icon-wrapper {
        width: 64px;
        height: 64px;
        margin: 0 auto 20px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--theme-primary),
          color-mix(in srgb, var(--theme-primary) 80%, #000)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px color-mix(in srgb, var(--theme-primary) 40%, transparent);
        animation: ctaIconFloat 3s ease-in-out infinite;
      }

      @keyframes ctaIconFloat {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      .cta-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: #ffffff;
      }

      .cta-title {
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 16px 0;
        color: #111827;
        line-height: 1.3;
      }

      :host-context(body.dark-theme) .cta-title {
        color: #f9fafb;
      }

      .cta-description {
        font-size: 15px;
        color: #4b5563;
        margin: 0 0 24px 0;
        line-height: 1.7;
      }

      :host-context(body.dark-theme) .cta-description {
        color: #9ca3af;
      }

      .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 28px;
        background: var(--theme-primary);
        color: #ffffff;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent);
      }

      .cta-button:hover {
        background: color-mix(in srgb, var(--theme-primary) 90%, #000);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 40%, transparent);
      }

      .cta-button:active {
        transform: translateY(0);
      }

      .cta-button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      /* Footer */
      .trainer-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 20px 24px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        margin-top: 24px;
      }

      :host-context(body.dark-theme) .trainer-footer {
        background: #111827;
        border-top-color: #374151;
      }

      .footer-icon {
        color: #f59e0b;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .footer-text {
        font-size: 13px;
        color: #6b7280;
      }

      :host-context(body.dark-theme) .footer-text {
        color: #9ca3af;
      }

      kbd {
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 12px;
        color: #374151;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      :host-context(body.dark-theme) kbd {
        background: #0a0a0a;
        border-color: #4b5563;
        color: #d1d5db;
      }

      mat-divider {
        margin: 0;
        border-top-color: #e5e7eb;
      }

      :host-context(body.dark-theme) mat-divider {
        border-top-color: #374151;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .trainer-panel {
          width: 100vw;
          max-width: 100vw;
        }

        .content-section {
          padding: 20px;
        }

        .section-title {
          font-size: 20px;
        }

        .subsection-title {
          font-size: 18px;
        }

        .feature-card {
          padding: 16px;
        }
      }

      @media (max-width: 480px) {
        .trainer-header {
          padding: 16px;
        }

        .icon-wrapper {
          width: 40px;
          height: 40px;
        }

        .trainer-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        .trainer-header h2 {
          font-size: 18px;
        }

        .header-subtitle {
          font-size: 12px;
        }

        .content-section {
          padding: 16px;
        }

        .section-title {
          font-size: 18px;
        }

        .footer-text {
          font-size: 11px;
        }
      }
    `,
  ],
})
export class XrmTrainerPanelComponent {
  protected trainerService = inject(XrmTrainerService);
}
