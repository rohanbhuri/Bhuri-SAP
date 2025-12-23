import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { EnquiryManagementComponent } from '../enquiry/enquiry-management.component';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    NavbarComponent,
    BottomNavbarComponent,
    QuotationListComponent,
    EnquiryManagementComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="page">
      <div class="page-header">
        <nav class="breadcrumb">
          <span>Modules</span>
          <mat-icon>chevron_right</mat-icon>
          <span class="current">Quotations</span>
        </nav>
        <h1>Quotation Management</h1>
        <p class="subtitle">Cart-based enquiry system with automated quotation generation</p>
      </div>

      <mat-tab-group class="quotations-tabs" [selectedIndex]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Quotations">
          <app-quotation-list></app-quotation-list>
        </mat-tab>
        <mat-tab label="Enquiries">
          <app-enquiry-management></app-enquiry-management>
        </mat-tab>
      </mat-tab-group>
    </div>
    <app-bottom-navbar></app-bottom-navbar>
  `,
  styleUrls: ['../crm/crm.component.css']
})
export class QuotationsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  selectedTabIndex = 0;
  private tabs = ['quotations', 'enquiries'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.includes(tab)) {
        this.selectedTabIndex = this.tabs.indexOf(tab);
      }
    });
  }

  onTabChange(event: any) {
    const tabName = this.tabs[event.index];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    });
  }
}