import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
    <div class="landing-container" (mousemove)="onMouseMove($event)">
      <!-- Animated Background -->
      <div class="background-effects">
        <canvas #backgroundCanvas class="background-canvas"></canvas>
        <div class="gradient-orbs">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
      </div>

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
                'Enterprise Resource Planning Platform'
            }}
          </p>
          <p class="hero-description">
            Transform your business operations with our comprehensive, cloud-based ERP solution. 
            Integrate all your departments seamlessly, from HR to finance, sales to inventory. 
            Real-time analytics, scalable architecture, and enterprise-grade security ensure 
            your business runs efficiently at every stage of growth.
          </p>
          <div class="cta-buttons">
            <button
              mat-raised-button
              color="primary"
              routerLink="/login"
              class="cta-primary"
            >
              <mat-icon>login</mat-icon>
              Get Started
            </button>
            @if (showInstallButton) {
              <button 
                mat-raised-button 
                (click)="showInstallModal()" 
                class="cta-install">
                <mat-icon>download</mat-icon>
                Install Desktop App
              </button>
            }
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">50+</span>
              <span class="stat-label">Integrated Modules</span>
            </div>
            <div class="stat">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Uptime</span>
            </div>
            <div class="stat">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">Data Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Modules Section -->
      <section class="modules-section">
        <div class="container">
          <h2>Complete Business Ecosystem</h2>
          <p class="section-subtitle">
            Over 50 integrated modules covering every aspect of modern business management
          </p>

          <div class="modules-grid">
            <!-- HR Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="HR Management - Comprehensive employee lifecycle management"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>HR Management</h3>
                <p>
                  End-to-end employee lifecycle management with automated onboarding, 
                  performance tracking, attendance monitoring, and compliance management. 
                  Streamline HR processes and enhance employee engagement with self-service portals.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Explore HR Suite</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Staff Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Staff Management - Workforce optimization and scheduling"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Staff Management</h3>
                <p>
                  Optimize workforce allocation with intelligent scheduling, shift management, 
                  and resource planning. Track employee availability, manage rotations, and 
                  ensure optimal staffing levels across all departments and locations.
                </p>
                <button mat-stroked-button color="primary">
                  <span>View Staff Tools</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Payroll Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Payroll Management - Automated salary processing"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Payroll Management</h3>
                <p>
                  Automated payroll processing with tax calculation, statutory compliance, 
                  and direct deposit capabilities. Generate payslips, manage deductions, 
                  and ensure accurate, timely payments with audit-ready reports.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Process Payroll</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Role Assignment -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Role Assignment - Granular access control system"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Role Assignment</h3>
                <p>
                  Define granular permissions and access controls with role-based security. 
                  Create custom roles, manage user privileges, and ensure data security 
                  through comprehensive authorization frameworks and audit logs.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Configure Roles</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Task Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Task Management - Collaborative task tracking"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Task Management</h3>
                <p>
                  Collaborative task tracking with Kanban boards, Gantt charts, and 
                  automated workflows. Assign tasks, set priorities, track progress, 
                  and ensure timely completion with real-time notifications and updates.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Manage Tasks</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Project Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Project Management - End-to-end project lifecycle"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Project Management</h3>
                <p>
                  Comprehensive project lifecycle management from initiation to closure. 
                  Plan resources, allocate budgets, track milestones, and collaborate 
                  with teams using integrated communication and documentation tools.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Launch Projects</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Project Tracking -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Project Tracking - Real-time progress monitoring"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Project Tracking</h3>
                <p>
                  Real-time project monitoring with dashboards, KPIs, and performance metrics. 
                  Track budget vs actuals, timeline adherence, resource utilization, and 
                  generate progress reports for stakeholders.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Monitor Progress</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Project Timesheet -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Project Timesheet - Accurate time tracking"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Project Timesheet</h3>
                <p>
                  Accurate time tracking and billing with automated timesheet approvals. 
                  Capture billable hours, track project costs, and integrate with payroll 
                  and invoicing systems for seamless financial management.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Track Time</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Reports Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Reports Management - Business intelligence dashboard"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Reports Management</h3>
                <p>
                  Advanced business intelligence with customizable dashboards, 
                    data visualization, and automated reporting. Generate insights 
                    across departments with scheduled reports and real-time analytics.
                </p>
                <button mat-stroked-button color="primary">
                  <span>View Analytics</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Goal Tracking -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Goal Tracking - OKR and KPI management"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Goal Tracking</h3>
                <p>
                  Strategic goal setting and tracking with OKR frameworks and KPI dashboards. 
                  Align team objectives with business goals, track progress, and drive 
                  organizational performance with measurable outcomes.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Set Objectives</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Events & Notice Board -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Events Management - Corporate event planning"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Events & Notice Board</h3>
                <p>
                  Centralized corporate communication platform for announcements, 
                  event management, and internal communications. Schedule meetings, 
                  share updates, and keep teams informed with interactive notice boards.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Plan Events</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Goals & Notes -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Personal productivity tools"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Goals & Notes</h3>
                <p>
                  Personal productivity suite with integrated goal setting, note-taking, 
                  and reminder systems. Capture ideas, track personal objectives, and 
                  stay organized with smart categorization and search capabilities.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Boost Productivity</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Leads Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Leads Management - Sales pipeline automation"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Leads Management</h3>
                <p>
                  Automated sales pipeline management with lead scoring, segmentation, 
                  and nurturing workflows. Capture leads from multiple sources, track 
                  interactions, and convert prospects into customers efficiently.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Manage Leads</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Performance Appraisal -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Performance Appraisal - Employee evaluation system"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Performance Appraisal</h3>
                <p>
                  360-degree employee evaluation system with customizable review cycles, 
                  competency mapping, and feedback mechanisms. Drive performance improvement 
                  with structured appraisal processes and development plans.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Conduct Reviews</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Sales Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Sales Management - Complete sales automation"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Sales Management</h3>
                <p>
                  End-to-end sales automation with opportunity tracking, quote management, 
                  and sales forecasting. Manage customer relationships, track sales performance, 
                  and drive revenue growth with intelligent sales tools.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Boost Sales</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Deal Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Deal Management - Contract and negotiation tracking"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Deal Management</h3>
                <p>
                  Streamlined deal lifecycle management from negotiation to closure. 
                  Track deal stages, manage contract terms, and automate follow-ups 
                  to ensure successful deal execution and customer onboarding.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Close Deals</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Item Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Item Management - Product catalog system"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Item Management</h3>
                <p>
                  Comprehensive product catalog management with SKU tracking, 
                  categorization, and attribute management. Organize items, 
                  manage specifications, and maintain accurate product information 
                  across sales channels.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Catalog Items</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Inventory Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Inventory Management - Real-time stock control"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Inventory Management</h3>
                <p>
                  Real-time inventory control with automated stock tracking, 
                  reorder point management, and warehouse optimization. Prevent 
                  stockouts, reduce carrying costs, and maintain optimal inventory 
                  levels across multiple locations.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Control Inventory</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Contract Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Contract Management - Legal document automation"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Contract Management</h3>
                <p>
                  Automated contract lifecycle management with template libraries, 
                  version control, and compliance tracking. Create, review, approve, 
                  and renew contracts with automated alerts and milestone tracking.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Manage Contracts</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Estimates Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1554224154-26032fced8bd?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Estimates Management - Professional quote generation"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Estimates Management</h3>
                <p>
                  Professional estimate and quote generation with customizable templates, 
                  pricing rules, and approval workflows. Convert estimates to invoices 
                  seamlessly and track quote-to-order conversion rates.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Create Estimates</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Budget Planner -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Budget Planner - Financial planning tools"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Budget Planner</h3>
                <p>
                  Comprehensive financial planning with budget creation, variance analysis, 
                  and forecasting capabilities. Allocate resources, track expenditures, 
                  and ensure financial discipline across departments and projects.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Plan Budgets</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Chat Module -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Chat Module - Real-time team collaboration"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Chat Module</h3>
                <p>
                  Real-time team collaboration with instant messaging, file sharing, 
                  and video conferencing. Create channels, share documents, and 
                  communicate seamlessly within the platform for enhanced productivity.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Start Chatting</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Customer Statement Reports -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Customer Statement Reports - Financial transparency"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Customer Statement Reports</h3>
                <p>
                  Automated customer account statements with transaction history, 
                  outstanding balances, and aging reports. Provide transparent billing 
                  and improve cash flow with scheduled statement generation.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Generate Statements</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Form Builder -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1586281380614-758384f70dfd?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Form Builder - Custom form creation"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Form Builder</h3>
                <p>
                  Drag-and-drop form creation with advanced validation rules, 
                  conditional logic, and workflow integration. Create surveys, 
                  applications, and data collection forms without coding expertise.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Build Forms</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Zoom Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Zoom Integration - Video conferencing"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Zoom Integration</h3>
                <p>
                  Seamless video conferencing integration for virtual meetings, 
                  webinars, and team collaboration. Schedule meetings, send invites, 
                  and join calls directly from the platform with calendar synchronization.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Schedule Meetings</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Slack Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Slack Integration - Team communication"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Slack Integration</h3>
                <p>
                  Unified communication platform integration for instant notifications, 
                  team channels, and automated alerts. Connect workflows and enhance 
                  collaboration across your organization's communication tools.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Connect Slack</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Telegram Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Telegram Integration - Mobile notifications"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Telegram Integration</h3>
                <p>
                  Mobile-first communication integration for instant alerts, 
                  notifications, and updates. Receive important business updates 
                  on-the-go and stay connected with your team from anywhere.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Enable Notifications</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Asset Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Asset Management - Company asset tracking"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Asset Management</h3>
                <p>
                  Complete asset lifecycle management from procurement to disposal. 
                  Track equipment, manage maintenance schedules, and optimize asset 
                  utilization with depreciation tracking and compliance reporting.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Track Assets</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Expense Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Expense Management - Cost control system"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Expense Management</h3>
                <p>
                  Streamlined expense tracking with receipt capture, approval workflows, 
                  and reimbursement processing. Control business costs, enforce policies, 
                  and gain visibility into spending patterns.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Manage Expenses</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Document Management -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Document Management - Centralized document repository"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Document Management</h3>
                <p>
                  Centralized document repository with version control, access management, 
                  and collaboration tools. Store, organize, and share business documents 
                  securely with advanced search and retrieval capabilities.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Organize Documents</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Workflow Automation -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Workflow Automation - Business process automation"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Workflow Automation</h3>
                <p>
                  Visual workflow designer for automating business processes across departments. 
                  Create approval chains, automate routine tasks, and streamline operations 
                  with conditional logic and integration triggers.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Automate Processes</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- CRM Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="CRM Integration - Customer relationship tools"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>CRM Integration</h3>
                <p>
                  Seamless integration with popular CRM platforms for unified customer data. 
                  Sync contacts, track interactions, and maintain consistent customer 
                  information across sales, marketing, and support functions.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Connect CRM</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Accounting Integration -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Accounting Integration - Financial system connectivity"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Accounting Integration</h3>
                <p>
                  Integration with accounting software for automatic journal entries, 
                  ledger updates, and financial consolidation. Ensure data consistency 
                  between operational and financial systems in real-time.
                </p>
                <button mat-stroked-button color="primary">
                  <span>Sync Accounts</span>
                </button>
              </mat-card-content>
            </mat-card>

            <!-- Analytics Dashboard -->
            <mat-card class="module-card">
              <div class="module-image">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format&q=80"
                  alt="Analytics Dashboard - Business intelligence"
                  loading="lazy"
                  width="800"
                  height="400"
                />
              </div>
              <mat-card-content>
                <h3>Analytics Dashboard</h3>
                <p>
                  Interactive business intelligence dashboard with real-time metrics, 
                  data visualization, and predictive analytics. Make data-driven decisions 
                  with customizable reports and executive summaries.
                </p>
                <button mat-stroked-button color="primary">
                  <span>View Insights</span>
                </button>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>
      
      <!-- Technology Stack -->
      <section class="tech-section">
        <div class="container">
          <h2>Enterprise-Grade Technology Stack</h2>
          <p class="section-subtitle">
            Built with cutting-edge technologies for performance, security, and scalability
          </p>
          <div class="tech-stack">
            <div class="tech-item">
              <mat-icon>web</mat-icon>
              <span>Angular 20+</span>
              <p class="tech-description">Modern frontend framework</p>
            </div>
            <div class="tech-item">
              <mat-icon>storage</mat-icon>
              <span>NestJS</span>
              <p class="tech-description">Scalable backend architecture</p>
            </div>
            <div class="tech-item">
              <mat-icon>data_object</mat-icon>
              <span>MongoDB</span>
              <p class="tech-description">NoSQL database</p>
            </div>
            <div class="tech-item">
              <mat-icon>security</mat-icon>
              <span>JWT Auth</span>
              <p class="tech-description">Enterprise security</p>
            </div>
            <div class="tech-item">
              <mat-icon>cloud_queue</mat-icon>
              <span>Redis</span>
              <p class="tech-description">Caching & session management</p>
            </div>
            <div class="tech-item">
              <mat-icon>api</mat-icon>
              <span>REST API</span>
              <p class="tech-description">Integration ready</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2>Why Choose Our Platform?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <mat-icon>security</mat-icon>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption, role-based access control, and compliance with industry standards including GDPR and SOC2.</p>
            </div>
            <div class="feature-card">
              <mat-icon>scale</mat-icon>
              <h3>Scalable Architecture</h3>
              <p>Cloud-native design that grows with your business, handling from startups to enterprise-level operations seamlessly.</p>
            </div>
            <div class="feature-card">
              <mat-icon>sync</mat-icon>
              <h3>Real-time Updates</h3>
              <p>Live data synchronization across all modules ensures everyone works with the most current information.</p>
            </div>
            <div class="feature-card">
              <mat-icon>devices</mat-icon>
              <h3>Cross-platform</h3>
              <p>Access from any device - desktop, tablet, or mobile - with responsive design and native app performance.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <h2>Ready to Transform Your Business?</h2>
          <p>Join thousands of companies that have streamlined their operations with our comprehensive ERP solution.</p>
          <div class="cta-buttons">
            <button mat-raised-button color="primary" routerLink="/login" class="cta-primary">
              <mat-icon>rocket_launch</mat-icon>
              Start Free Trial
            </button>
            <button mat-stroked-button color="primary" routerLink="/demo" class="cta-secondary">
              <mat-icon>play_circle</mat-icon>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="brand-logo">
                <img
                  [src]="brandConfig?.brand?.logo"
                  [alt]="brandConfig?.brand?.name"
                />
              </div>
              <p class="footer-description">
                Comprehensive business management platform designed to streamline operations, 
                enhance productivity, and drive growth for modern enterprises.
              </p>
            </div>
            <div class="footer-links">
              <h4>Modules</h4>
              <a href="#">HR Management</a>
              <a href="#">Sales & CRM</a>
              <a href="#">Project Management</a>
              <a href="#">Inventory</a>
              <a href="#">Financials</a>
            </div>
            <div class="footer-links">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Blog</a>
              <a href="#">Documentation</a>
            </div>
            <div class="footer-links">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Community</a>
              <a href="#">API Docs</a>
              <a href="#">Status</a>
              <a href="#">Contact Support</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>
              &copy; 2024 {{ brandConfig?.brand?.name || 'Bhuri SAP' }}. All
              rights reserved.
            </p>
            <p>Version {{ brandConfig?.app?.version || '1.0.0' }} | Enterprise Edition</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

      :root {
        --color-ink: #0a0a0a;
        --color-charcoal: #1a1a1a;
        --color-slate: #2d2d2d;
        --color-silver: #8b8b8b;
        --color-pearl: #f8f8f8;
        --color-cream: #fefdfb;
        --color-accent: #d4af37;
        --color-accent-dark: #b8941f;
        --font-display: 'Cormorant Garamond', serif;
        --font-body: 'DM Sans', sans-serif;
      }

      body {
        font-family: var(--font-body);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, .hero-title, .stat-number, .modules-section h2, .module-card h3, .features-section h2, .feature-card h3, .cta-section h2, .tech-section h2, .footer-links h4 {
        font-family: var(--font-display);
      }

      .landing-container {
        min-height: 100vh;
        background: var(--color-cream);
        position: relative;
        overflow-x: hidden;
      }

      /* Dynamic Background Effects */
      .background-effects {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }

      .background-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .gradient-orbs {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: float-orb 20s ease-in-out infinite;
      }

      .orb-1 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
        top: 10%;
        left: 15%;
        animation-duration: 25s;
        animation-delay: 0s;
      }

      .orb-2 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(184, 148, 31, 0.25) 0%, transparent 70%);
        top: 60%;
        right: 20%;
        animation-duration: 30s;
        animation-delay: 5s;
      }

      .orb-3 {
        width: 350px;
        height: 350px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
        bottom: 20%;
        left: 50%;
        animation-duration: 22s;
        animation-delay: 10s;
      }

      @keyframes float-orb {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(50px, -30px) scale(1.1);
        }
        66% {
          transform: translate(-30px, 40px) scale(0.95);
        }
      }

      .landing-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.02) 0%, transparent 50%);
        pointer-events: none;
        z-index: 1;
      }

      /* Hero Section */
      .hero-section {
        position: relative;
        padding: 160px 40px 140px;
        text-align: center;
        color: var(--color-ink);
        background: transparent;
        overflow: hidden;
        z-index: 2;
      }

      .hero-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -10%;
        width: 120%;
        height: 200%;
        background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
        animation: heroGlow 15s ease-in-out infinite alternate;
        pointer-events: none;
      }

      @keyframes heroGlow {
        0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
        100% { transform: translate(20px, 20px) scale(1.05); opacity: 0.8; }
      }

      .hero-content {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }

      .brand-logo {
        animation: fadeInDown 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .brand-logo img {
        height: 140px;
        filter: drop-shadow(0 8px 24px rgba(212, 175, 55, 0.2));
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }

      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .hero-title {
        font-size: clamp(3.5rem, 8vw, 7rem);
        font-weight: 600;
        margin-bottom: 32px;
        letter-spacing: -0.03em;
        line-height: 1.1;
        background: linear-gradient(135deg, var(--color-ink) 0%, var(--color-slate) 50%, var(--color-accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
      }

      .hero-subtitle {
        font-size: clamp(1.25rem, 2.5vw, 1.75rem);
        font-weight: 500;
        margin-bottom: 24px;
        color: var(--color-slate);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s backwards;
      }

      .hero-description {
        font-size: clamp(1.1rem, 1.8vw, 1.35rem);
        line-height: 1.8;
        margin-bottom: 56px;
        color: var(--color-silver);
        max-width: 780px;
        margin-left: auto;
        margin-right: auto;
        animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
      }

      .hero-stats {
        display: flex;
        justify-content: center;
        gap: 64px;
        margin-top: 80px;
        animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1s backwards;
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .stat-number {
        font-size: 3rem;
        font-weight: 600;
        color: var(--color-accent);
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 0.9rem;
        color: var(--color-silver);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .cta-buttons {
        display: flex;
        gap: 24px;
        justify-content: center;
        flex-wrap: wrap;
        animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s backwards;
      }

      .cta-primary, .cta-install, .cta-secondary {
        padding: 18px 48px;
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 0;
        border: 2px solid;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }

      .cta-primary {
        background: var(--color-ink);
        color: var(--color-cream);
        border-color: var(--color-ink);
      }

      .cta-install {
        background: transparent;
        color: var(--color-ink);
        border-color: var(--color-accent);
      }

      .cta-secondary {
        background: transparent;
        color: var(--color-ink);
        border-color: var(--color-slate);
      }

      .cta-primary::before, .cta-install::before, .cta-secondary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.6s;
      }

      .cta-primary:hover::before, .cta-install:hover::before, .cta-secondary:hover::before {
        left: 100%;
      }

      .cta-primary:hover, .cta-install:hover, .cta-secondary:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(10, 10, 10, 0.25);
      }

      .cta-install:hover {
        background: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--color-ink);
      }

      .cta-secondary:hover {
        background: var(--color-slate);
        color: var(--color-cream);
      }

      /* Sections Base Styles */
      .modules-section, .tech-section, .features-section, .cta-section {
        padding: 160px 40px;
        position: relative;
        z-index: 2;
      }

      .modules-section h2, .tech-section h2, .features-section h2, .cta-section h2 {
        text-align: center;
        font-weight: 600;
        letter-spacing: -0.02em;
        margin-bottom: 20px;
      }

      .section-subtitle {
        text-align: center;
        font-size: clamp(1.1rem, 2vw, 1.4rem);
        color: var(--color-silver);
        margin-bottom: 100px;
        font-weight: 400;
        letter-spacing: 0.01em;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      .container {
        max-width: 1600px;
        margin: 0 auto;
      }

      /* Modules Section */
      .modules-section {
        background: transparent;
      }

      .modules-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
        opacity: 0.3;
      }

      .modules-section h2 {
        font-size: clamp(3rem, 6vw, 5rem);
        color: var(--color-ink);
        line-height: 1.2;
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
        gap: 48px;
      }

      .module-card, .feature-card {
        border-radius: 0;
        overflow: hidden;
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(10, 10, 10, 0.06);
        background: var(--color-cream);
        position: relative;
      }

      .module-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--color-accent);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .module-card:hover::before {
        transform: scaleX(1);
      }

      .module-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 24px 64px rgba(10, 10, 10, 0.12), 0 8px 24px rgba(212, 175, 55, 0.1);
        border-color: rgba(212, 175, 55, 0.2);
      }

      .module-image {
        height: 280px;
        overflow: hidden;
        position: relative;
        background: var(--color-slate);
      }

      .module-image::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent 0%, rgba(10, 10, 10, 0.4) 100%);
        opacity: 0;
        transition: opacity 0.6s ease;
      }

      .module-card:hover .module-image::after {
        opacity: 1;
      }

      .module-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        filter: grayscale(0.2) contrast(1.05);
      }

      .module-card:hover .module-image img {
        transform: scale(1.08);
        filter: grayscale(0) contrast(1.1);
      }

      .module-image a {
        display: block;
        width: 100%;
        height: 100%;
      }

      mat-card-content {
        padding: 40px !important;
        background: var(--color-cream);
      }

      .module-card h3 {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: var(--color-ink);
        line-height: 1.3;
        letter-spacing: -0.01em;
      }

      .module-card p {
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--color-silver);
        margin-bottom: 28px;
      }

      .module-card button {
        border-radius: 0;
        padding: 12px 28px;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        border: 2px solid var(--color-ink);
        color: var(--color-ink);
        position: relative;
        overflow: hidden;
      }

      .module-card button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: var(--color-ink);
        transform: translate(-50%, -50%);
        transition: width 0.5s, height 0.5s;
      }

      .module-card button:hover::before {
        width: 300px;
        height: 300px;
      }

      .module-card button span {
        position: relative;
        z-index: 1;
        transition: color 0.4s;
      }

      .module-card button:hover span {
        color: var(--color-cream);
      }

      .module-card button:hover {
        border-color: var(--color-ink);
        transform: translateY(-2px);
      }

      /* Features Section */
      .features-section {
        background: var(--color-pearl);
      }

      .features-section h2 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        margin-bottom: 80px;
        color: var(--color-ink);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 48px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .feature-card {
        text-align: center;
        padding: 48px 32px;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 48px rgba(10, 10, 10, 0.08);
        border-color: var(--color-accent);
      }

      .feature-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: var(--color-accent);
        margin-bottom: 24px;
      }

      .feature-card h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: var(--color-ink);
      }

      .feature-card p {
        color: var(--color-silver);
        line-height: 1.6;
      }

      /* CTA Section */
      .cta-section {
        background: linear-gradient(135deg, var(--color-charcoal) 0%, var(--color-ink) 100%);
        color: var(--color-cream);
        text-align: center;
      }

      .cta-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop') center/cover;
        opacity: 0.1;
        pointer-events: none;
      }

      .cta-section h2 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        margin-bottom: 24px;
        position: relative;
        z-index: 1;
      }

      .cta-section p {
        font-size: 1.25rem;
        margin-bottom: 48px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }

      /* Tech Section */
      .tech-section {
        background: var(--color-ink);
        color: var(--color-cream);
        overflow: hidden;
      }

      .tech-section::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      .tech-section h2 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        color: var(--color-cream);
        position: relative;
        z-index: 1;
      }

      .tech-stack {
        display: flex;
        justify-content: center;
        gap: 48px;
        flex-wrap: wrap;
        position: relative;
        z-index: 1;
        max-width: 1200px;
        margin: 0 auto;
      }

      .tech-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 40px 32px;
        background: rgba(248, 248, 248, 0.03);
        border: 1px solid rgba(212, 175, 55, 0.2);
        backdrop-filter: blur(10px);
        min-width: 200px;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
      }

      .tech-item::before {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(135deg, var(--color-accent), transparent);
        opacity: 0;
        transition: opacity 0.5s;
        z-index: -1;
      }

      .tech-item:hover::before {
        opacity: 0.15;
      }

      .tech-item:hover {
        transform: translateY(-8px);
        background: rgba(248, 248, 248, 0.05);
        border-color: var(--color-accent);
      }

      .tech-item mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: var(--color-accent);
        transition: all 0.5s ease;
      }

      .tech-item:hover mat-icon {
        transform: scale(1.15) rotate(5deg);
        filter: drop-shadow(0 0 16px rgba(212, 175, 55, 0.5));
      }

      .tech-item span {
        font-weight: 600;
        font-size: 1.15rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .tech-description {
        font-size: 0.9rem;
        color: var(--color-silver);
        margin-top: 8px;
        text-align: center;
      }

      /* Footer */
      .footer {
        background: var(--color-charcoal);
        color: var(--color-pearl);
        padding: 80px 40px 40px;
        border-top: 1px solid rgba(212, 175, 55, 0.2);
        position: relative;
        z-index: 2;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 64px;
        max-width: 1200px;
        margin: 0 auto 64px;
      }

      .footer-brand {
        max-width: 350px;
      }

      .footer-brand .brand-logo img {
        height: 60px;
        margin-bottom: 24px;
      }

      .footer-description {
        line-height: 1.6;
        opacity: 0.8;
        margin-bottom: 24px;
      }

      .footer-links {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .footer-links h4 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--color-cream);
      }

      .footer-links a {
        color: var(--color-pearl);
        text-decoration: none;
        opacity: 0.7;
        transition: opacity 0.3s ease;
      }

      .footer-links a:hover {
        opacity: 1;
        color: var(--color-accent);
      }

      .footer-bottom {
        text-align: center;
        padding-top: 40px;
        border-top: 1px solid rgba(248, 248, 248, 0.1);
      }

      .footer-bottom p {
        margin: 12px 0;
        opacity: 0.7;
        font-size: 0.9rem;
        letter-spacing: 0.02em;
      }

      /* Responsive Design */
      @media (max-width: 1200px) {
        .modules-grid {
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 40px;
        }

        .tech-stack {
          gap: 32px;
        }

        .tech-item {
          min-width: 180px;
        }
      }

      @media (max-width: 768px) {
        .hero-section {
          padding: 120px 24px 80px;
        }

        .hero-stats {
          flex-direction: column;
          gap: 40px;
          margin-top: 60px;
        }

        .modules-section, .tech-section, .features-section, .cta-section {
          padding: 100px 24px;
        }

        .modules-grid {
          grid-template-columns: 1fr;
          gap: 36px;
        }

        .tech-stack {
          gap: 24px;
        }

        .tech-item {
          min-width: 160px;
          padding: 32px 24px;
        }

        .cta-buttons {
          flex-direction: column;
          align-items: stretch;
        }

        .cta-primary, .cta-install, .cta-secondary {
          width: 100%;
        }

        .brand-logo img {
          height: 100px;
        }

        .section-subtitle {
          margin-bottom: 60px;
        }

        mat-card-content {
          padding: 32px !important;
        }

        .footer-content {
          grid-template-columns: 1fr;
          gap: 48px;
        }
      }

      @media (max-width: 480px) {
        .hero-section {
          padding: 80px 20px 60px;
        }

        .modules-section, .tech-section, .features-section, .cta-section {
          padding: 80px 20px;
        }

        .footer {
          padding: 60px 20px 40px;
        }

        .module-image {
          height: 220px;
        }

        .tech-item {
          min-width: 140px;
          padding: 24px 20px;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
        }
      }

      /* Scroll animations */
      @media (prefers-reduced-motion: no-preference) {
        .module-card, .feature-card, .tech-item {
          opacity: 0;
          animation: fadeInUpScroll 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .module-card:nth-child(1) { animation-delay: 0.1s; }
        .module-card:nth-child(2) { animation-delay: 0.2s; }
        .module-card:nth-child(3) { animation-delay: 0.3s; }
        .module-card:nth-child(4) { animation-delay: 0.15s; }
        .module-card:nth-child(5) { animation-delay: 0.25s; }
        .module-card:nth-child(6) { animation-delay: 0.35s; }
        .feature-card:nth-child(1) { animation-delay: 0.2s; }
        .feature-card:nth-child(2) { animation-delay: 0.3s; }
        .feature-card:nth-child(3) { animation-delay: 0.4s; }
        .feature-card:nth-child(4) { animation-delay: 0.5s; }

        @keyframes fadeInUpScroll {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
    `,
  ],
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private brandConfigService = inject(BrandConfigService);
  private seoService = inject(SeoService);
  private seoConfigService = inject(SeoConfigService);
  private pwaService = inject(PwaService);
  private dialog = inject(MatDialog);

  @ViewChild('backgroundCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  brandConfig: any;
  showInstallButton = false;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId!: number;
  private mouseX = 0;
  private mouseY = 0;

  ngOnInit() {
    this.brandConfig = this.brandConfigService.getConfig();
    this.setupSEO();

    // Check if PWA is installable
    this.pwaService.installable$.subscribe((installable) => {
      this.showInstallButton = installable;
    });
  }

  ngAfterViewInit() {
    this.initCanvas();
    this.createParticles();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.createParticles();
    });
  }

  private createParticles() {
    this.particles = [];
    const numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 15000);

    for (let i = 0; i < numberOfParticles; i++) {
      this.particles.push(new Particle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ));
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.particles.forEach(particle => {
      particle.update(this.mouseX, this.mouseY);
      particle.draw(this.ctx);
    });

    this.connectParticles();
    this.animationId = requestAnimationFrame(this.animate);
  }

  private connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(26, 26, 26, ${0.2 * (1 - distance / 120)})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
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
          pricecurrency: 'INR',
        },
      }
    );

    this.seoService.addStructuredData(structuredData);
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.size = Math.random() * 2 + 1;
    this.density = Math.random() * 30 + 1;
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = Math.random() * 0.5 - 0.25;
  }

  update(mouseX: number, mouseY: number) {
    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = 150;
    const force = (maxDistance - distance) / maxDistance;

    if (distance < maxDistance) {
      const directionX = forceDirectionX * force * this.density * 0.6;
      const directionY = forceDirectionY * force * this.density * 0.6;
      this.x -= directionX;
      this.y -= directionY;
    } else {
      // Return to base position
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 20;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 20;
      }
    }

    // Gentle floating motion
    this.baseX += this.vx;
    this.baseY += this.vy;

    // Bounce off edges
    if (this.baseX < 0 || this.baseX > window.innerWidth) this.vx *= -1;
    if (this.baseY < 0 || this.baseY > window.innerHeight) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(26, 26, 26, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}