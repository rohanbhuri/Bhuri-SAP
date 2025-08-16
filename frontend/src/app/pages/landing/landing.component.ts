import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BrandConfigService } from '../../services/brand-config.service';
import { SeoService } from '../../services/seo.service';
import { SeoConfigService } from '../../services/seo-config.service';
import { PwaService } from '../../services/pwa.service';
import { PwaInstallModalComponent } from '../../components/pwa-install-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  template: `
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="brand-logo">
            <img
              [src]="brandConfig?.brand?.logo"
              [alt]="brandConfig?.brand?.name"
            />
          </div>
          <h1 class="hero-title">
            {{ brandConfig?.brand?.name || 'Bhuri SAP' }}
          </h1>
          <p class="hero-subtitle">
            {{
              brandConfig?.app?.description ||
                'Complete Business Management Solution'
            }}
          </p>
          <p class="hero-description">
            Streamline your business operations with our comprehensive resource
            management platform. Built with modern technologies for maximum
            efficiency and scalability.
          </p>
          <div class="cta-buttons">
            <button
              mat-raised-button
              color="primary"
              routerLink="/login"
              class="cta-primary"
            >
              <mat-icon>login</mat-icon>
              Login
            </button>
            <button
              mat-raised-button
              color="primary"
              routerLink="/signup"
              class="cta-primary"
            >
              <mat-icon>person_add</mat-icon>
              Sign Up
            </button>
            <button 
              *ngIf="showInstallButton" 
              mat-raised-button 
              (click)="showInstallModal()" 
              class="cta-install">
              <mat-icon>download</mat-icon>
              Install App
            </button>
          </div>
        </div>
      </section>

      <!-- Modules Section -->
      <section class="modules-section">
        <div class="container">
          <h2>Comprehensive Business Modules</h2>
          <p class="section-subtitle">
            Everything you need to manage your business efficiently
          </p>

          <div class="modules-grid">
            <!-- HR Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="HR Management - Effortlessly manage employee data and schedules"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>HR Management</h3>
                <p>
                  Effortlessly manage employee data, schedules, and HR processes
                  to optimize team performance.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Staff Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Staff Management - Organize workforce with scheduling tools"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Staff Management</h3>
                <p>
                  Organize your workforce with comprehensive staff scheduling
                  and performance tracking tools.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Payroll Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Payroll Management - Automate salary calculations and payments"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Payroll Management</h3>
                <p>
                  Automate salary calculations, tax deductions, and payment
                  processing for accurate payroll.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Assigning Roles -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Role Assignment - Define user roles with granular permissions"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Role Assignment</h3>
                <p>
                  Define and assign user roles with granular permissions for
                  secure access control.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Tasks Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Task Management - Create and track tasks with deadlines"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Task Management</h3>
                <p>
                  Create, assign, and track tasks with deadlines and priority
                  levels for better productivity.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Projects Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Project Management - Plan and execute projects collaboratively"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Project Management</h3>
                <p>
                  Plan, execute, and monitor projects from inception to
                  completion with collaborative tools.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Project Tracking -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Project Tracking - Monitor progress with real-time updates"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Project Tracking</h3>
                <p>
                  Monitor project progress with real-time updates and milestone
                  tracking dashboards.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Project Timesheet -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Timesheet - Track time for accurate billing and analysis"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Project Timesheet</h3>
                <p>
                  Track time spent on projects and tasks for accurate billing
                  and productivity analysis.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Reports Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Reports Management - Generate comprehensive analytics"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Reports Management</h3>
                <p>
                  Generate comprehensive reports and analytics for data-driven
                  business decisions.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Goal Tracking -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Goal Tracking - Set and monitor business objectives"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Goal Tracking</h3>
                <p>
                  Set, monitor, and achieve business objectives with measurable
                  goal tracking systems.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Events and Notice Board -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Events and Notice Board - Manage company events and announcements"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Events & Notice Board</h3>
                <p>
                  Manage company events and announcements with an interactive
                  notice board system.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Goals and Notes -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Goals and Notes - Organize goals with integrated note-taking"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Goals & Notes</h3>
                <p>
                  Organize personal and team goals with integrated note-taking
                  and reminder features.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Leads Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Leads Management - Capture and convert leads effectively"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Leads Management</h3>
                <p>
                  Capture, nurture, and convert leads with automated follow-up
                  and scoring systems.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Indicator Appraisal -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Performance Appraisal - Conduct comprehensive employee evaluations"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Performance Appraisal</h3>
                <p>
                  Conduct fair and comprehensive employee evaluations with
                  customizable KPI indicators.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Sales Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Sales Management - Streamline sales process and forecasting"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Sales Management</h3>
                <p>
                  Streamline your sales process with pipeline management and
                  revenue forecasting tools.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Deal Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop&auto=format&q=75"
                  alt="Deal Management - Track and close deals efficiently"
                  loading="lazy"
                  width="400"
                  height="250"
                />
              </div>
              <mat-card-content>
                <h3>Deal Management</h3>
                <p>
                  Track and close deals efficiently with automated workflows and
                  negotiation tracking.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Item Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop"
                    alt="Item Management"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Item Management</h3>
                <p>
                  Organize and categorize products with detailed specifications
                  and pricing information.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Inventory Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=250&fit=crop"
                    alt="Inventory Management"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Inventory Management</h3>
                <p>
                  Monitor stock levels, automate reordering, and prevent
                  stockouts with smart inventory control.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Contract Module -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop"
                    alt="Contract Management"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Contract Management</h3>
                <p>
                  Create, manage, and track contracts with automated renewals
                  and compliance monitoring.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Estimates Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=250&fit=crop"
                    alt="Estimates"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Estimates Management</h3>
                <p>
                  Generate professional estimates and quotes with customizable
                  templates and pricing rules.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Budget Planner -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop"
                    alt="Budget Planning"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Budget Planner</h3>
                <p>
                  Plan and track budgets with variance analysis and financial
                  forecasting capabilities.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Chat Module -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=250&fit=crop"
                    alt="Chat"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Chat Module</h3>
                <p>
                  Enable real-time team communication with instant messaging and
                  file sharing features.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Customer Statement Report -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop"
                    alt="Customer Reports"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Customer Statement Reports</h3>
                <p>
                  Generate detailed customer statements and transaction
                  histories for transparent billing.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Form Builder -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1586281380614-758384f70dfd?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1586281380614-758384f70dfd?w=400&h=250&fit=crop"
                    alt="Form Builder"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Form Builder</h3>
                <p>
                  Create custom forms and surveys with drag-and-drop interface
                  and data validation.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Zoom Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400&h=250&fit=crop"
                    alt="Video Conferencing"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Zoom Integration</h3>
                <p>
                  Schedule and join video meetings directly from the platform
                  with seamless Zoom integration.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Slack Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=250&fit=crop"
                    alt="Slack Integration"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Slack Integration</h3>
                <p>
                  Connect with your Slack workspace for unified communication
                  and notification management.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>

            <!-- Telegram Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <a
                  href="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400"
                  target="_blank"
                >
                  <img
                    src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=250&fit=crop"
                    alt="Telegram Integration"
                  />
                </a>
              </div>
              <mat-card-content>
                <h3>Telegram Integration</h3>
                <p>
                  Receive notifications and updates through Telegram for instant
                  mobile communication.
                </p>
                <button mat-stroked-button color="primary">Learn More</button>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="tech-section">
        <div class="container">
          <h2>Built with Modern Technology</h2>
          <div class="tech-stack">
            <div class="tech-item">
              <mat-icon>web</mat-icon>
              <span>Angular 20+</span>
            </div>
            <div class="tech-item">
              <mat-icon>storage</mat-icon>
              <span>NestJS</span>
            </div>
            <div class="tech-item">
              <mat-icon>data_object</mat-icon>
              <span>MongoDB</span>
            </div>
            <div class="tech-item">
              <mat-icon>security</mat-icon>
              <span>JWT Auth</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p>
            &copy; 2024 {{ brandConfig?.brand?.name || 'Bhuri SAP' }}. All
            rights reserved.
          </p>
          <p>Version {{ brandConfig?.app?.version || '1.0.0' }}</p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .landing-container {
        min-height: 100vh;
        background: linear-gradient(
          135deg,
          var(--primary-color, #3b82f6) 0%,
          var(--accent-color, #f59e0b) 100%
        );
      }

      .hero-section {
        padding: 100px 20px 80px;
        text-align: center;
        color: white;
        background: linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.9) 0%,
          rgba(245, 158, 11, 0.9) 100%
        );
      }

      .hero-content {
        max-width: 900px;
        margin: 0 auto;
      }

      .brand-logo img {
        height: 200px;
        margin-bottom: 24px;
        filter: brightness(0) invert(1);
      }

      .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        letter-spacing: -0.02em;
      }

      .hero-subtitle {
        font-size: 1.6rem;
        margin-bottom: 28px;
        opacity: 0.95;
        font-weight: 300;
      }

      .hero-description {
        font-size: 1.2rem;
        margin-bottom: 48px;
        opacity: 0.9;
        line-height: 1.7;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
      }

      .cta-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .cta-primary, .cta-install {
        padding: 16px 40px;
        font-size: 1.1rem;
        font-weight: 600;
        min-width: 160px;
        border-radius: 50px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      .cta-install {
        background: rgba(34, 197, 94, 0.2);
        border-color: rgba(34, 197, 94, 0.3);
      }

      .cta-install:hover {
        background: rgba(34, 197, 94, 0.3);
        transform: translateY(-2px);
      }

      .modules-section {
        background: linear-gradient(
          to bottom,
          #f8fafc 0%,
          #ffffff 50%,
          #f1f5f9 100%
        );
        padding: 100px 20px;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
      }

      .modules-section h2 {
        text-align: center;
        font-size: 3rem;
        margin-bottom: 16px;
        color: var(--primary-color, #1e40af);
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .section-subtitle {
        text-align: center;
        font-size: 1.3rem;
        color: #64748b;
        margin-bottom: 80px;
        font-weight: 300;
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 32px;
      }

      .module-card {
        border-radius: 20px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(226, 232, 240, 0.8);
        background: white;
      }

      .module-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .module-image {
        height: 220px;
        overflow: hidden;
        position: relative;
      }

      .module-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .module-card:hover .module-image img {
        transform: scale(1.1);
      }

      .module-image a {
        display: block;
        width: 100%;
        height: 100%;
      }

      mat-card-content {
        padding: 28px !important;
      }

      .module-card h3 {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-color, #1e40af);
        line-height: 1.3;
      }

      .module-card p {
        font-size: 1rem;
        line-height: 1.6;
        color: #64748b;
        margin-bottom: 20px;
      }

      .module-card button {
        border-radius: 25px;
        padding: 10px 24px;
        font-weight: 500;
        text-transform: none;
        transition: all 0.3s ease;
      }

      .module-card button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .tech-section {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        padding: 80px 20px;
        color: white;
      }

      .tech-section h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 50px;
        color: white;
        font-weight: 600;
      }

      .tech-stack {
        display: flex;
        justify-content: center;
        gap: 50px;
        flex-wrap: wrap;
      }

      .tech-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 30px 25px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        min-width: 140px;
        transition: all 0.3s ease;
      }

      .tech-item:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.15);
      }

      .tech-item mat-icon {
        font-size: 2.5rem;
        color: #60a5fa;
      }

      .tech-item span {
        font-weight: 500;
        font-size: 1.1rem;
      }

      .footer {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        padding: 50px 20px;
        text-align: center;
      }

      .footer p {
        margin: 10px 0;
        opacity: 0.8;
        font-size: 1rem;
      }

      @media (max-width: 1024px) {
        .modules-grid {
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 28px;
        }
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: 2.5rem;
        }

        .hero-subtitle {
          font-size: 1.3rem;
        }

        .hero-description {
          font-size: 1.1rem;
        }

        .modules-section h2 {
          font-size: 2.2rem;
        }

        .modules-grid {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .tech-stack {
          gap: 30px;
        }

        .cta-buttons {
          flex-direction: column;
          align-items: center;
        }

        .container {
          max-width: 100%;
          padding: 0 16px;
        }
      }

      @media (max-width: 480px) {
        .hero-section {
          padding: 60px 16px 50px;
        }

        .modules-section {
          padding: 60px 16px;
        }

        .module-image {
          height: 180px;
        }

        mat-card-content {
          padding: 20px !important;
        }
      }
    `,
  ],
})
export class LandingComponent implements OnInit {
  private brandConfigService = inject(BrandConfigService);
  private seoService = inject(SeoService);
  private seoConfigService = inject(SeoConfigService);
  private pwaService = inject(PwaService);
  private dialog = inject(MatDialog);
  
  brandConfig: any;
  showInstallButton = false;

  ngOnInit() {
    this.brandConfig = this.brandConfigService.getConfig();
    this.setupSEO();
    
    // Check if PWA is installable
    this.pwaService.installable$.subscribe((installable) => {
      this.showInstallButton = installable;
    });
  }

  showInstallModal() {
    this.dialog.open(PwaInstallModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'pwa-install-dialog'
    });
  }

  private setupSEO() {
    const seoData = this.seoConfigService.getPageSEO('home');
    this.seoService.updateSEO(seoData);

    // Add structured data
    const structuredData = this.seoService.generateStructuredData(
      'WebApplication',
      {
        name: seoData.siteName,
        description: seoData.description,
        url: seoData.url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        author: {
          '@type': 'Person',
          name: seoData.author,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }
    );

    this.seoService.addStructuredData(structuredData);
  }
}
