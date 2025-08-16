import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MyOrganizationsService, PublicOrganization } from './my-organizations.service';
import { NavbarComponent } from '../../components/navbar.component';
import { BottomNavbarComponent } from '../../components/bottom-navbar.component';

@Component({
  selector: 'app-my-organizations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,

    NavbarComponent,
    BottomNavbarComponent,
  ],
  template: `
    <app-navbar></app-navbar>

    <div class="page">
      <div class="page-header">
        <h1>My Organizations</h1>
        <p class="subtitle">Manage your organizations and discover new ones</p>
      </div>

      @if (myOrganizations().length > 0) {
        <div class="section">
          <h2>My Organizations</h2>
          <div class="organizations-grid">
            @for (org of myOrganizations(); track org.id || org._id) {
              <mat-card class="org-card my-org">
                <mat-card-header>
                  <mat-card-title>{{ org.name }}</mat-card-title>
                  <mat-card-subtitle>{{ org.code }}</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content>
                  @if (org.description) {
                    <p class="description">{{ org.description }}</p>
                  }
                  
                  <div class="org-stats">
                    <div class="stat">
                      <mat-icon>group</mat-icon>
                      <span>{{ org.memberCount }} members</span>
                    </div>
                    <div class="stat">
                      <mat-icon>apps</mat-icon>
                      <span>{{ org.activeModuleIds.length || 0 }} modules</span>
                    </div>
                  </div>
                </mat-card-content>

                <mat-card-actions align="end">
                  <button mat-button color="primary">
                    <mat-icon>dashboard</mat-icon>
                    View Dashboard
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </div>
      }

      <div class="section">
        <h2>Discover Organizations</h2>
        <div class="search-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search organizations</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Search by name or code">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="organizations-grid">
          @for (org of filteredPublicOrgs(); track org.id || org._id) {
          <mat-card class="org-card">
            <mat-card-header>
              <mat-card-title>{{ org.name }}</mat-card-title>
              <mat-card-subtitle>{{ org.code }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              @if (org.description) {
                <p class="description">{{ org.description }}</p>
              }
              
              <div class="org-stats">
                <div class="stat">
                  <mat-icon>group</mat-icon>
                  <span>{{ org.memberCount }} members</span>
                </div>
                <div class="stat">
                  <mat-icon>apps</mat-icon>
                  <span>{{ org.activeModuleIds.length || 0 }} modules</span>
                </div>
              </div>

              @if (org.activeModuleIds.length) {
                <div class="modules-chips">
                  <mat-chip-set>
                    @for (moduleId of org.activeModuleIds.slice(0, 3); track moduleId) {
                      <mat-chip>{{ moduleId }}</mat-chip>
                    }
                    @if (org.activeModuleIds.length > 3) {
                      <mat-chip>+{{ org.activeModuleIds.length - 3 }} more</mat-chip>
                    }
                  </mat-chip-set>
                </div>
              }
            </mat-card-content>

            <mat-card-actions align="end">
              <button mat-button color="primary" (click)="requestToJoin(org)">
                <mat-icon>group_add</mat-icon>
                Request to Join
              </button>
            </mat-card-actions>
          </mat-card>
          } @empty {
            <div class="empty-state">
              <mat-icon>business</mat-icon>
              <h3>No organizations found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          }
        </div>
      </div>
    </div>

    <app-bottom-navbar></app-bottom-navbar>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 32px;
      }

      .page-header h1 {
        margin: 0 0 8px;
        font-weight: 600;
      }

      .subtitle {
        color: color-mix(in srgb, var(--theme-on-surface) 65%, transparent);
        margin: 0;
      }

      .section {
        margin-bottom: 48px;
      }

      .section h2 {
        margin: 0 0 24px;
        font-weight: 600;
        color: var(--theme-on-surface);
      }

      .search-section {
        margin-bottom: 32px;
      }

      .search-field {
        width: 100%;
        max-width: 400px;
      }

      .organizations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 24px;
      }

      .org-card {
        height: fit-content;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .org-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      .my-org {
        border-left: 4px solid var(--theme-primary);
      }

      .description {
        margin: 16px 0;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
        line-height: 1.5;
      }

      .org-stats {
        display: flex;
        gap: 16px;
        margin: 16px 0;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem;
        color: color-mix(in srgb, var(--theme-on-surface) 70%, transparent);
      }

      .stat mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .modules-chips {
        margin-top: 16px;
      }

      .modules-chips mat-chip {
        font-size: 0.8rem;
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 64px 24px;
        color: color-mix(in srgb, var(--theme-on-surface) 60%, transparent);
      }

      .empty-state mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      .empty-state h3 {
        margin: 0 0 8px;
        font-weight: 500;
      }

      .empty-state p {
        margin: 0;
      }
    `,
  ],
})
export class MyOrganizationsComponent implements OnInit {
  private myOrgService = inject(MyOrganizationsService);
  private snackBar = inject(MatSnackBar);

  myOrganizations = signal<PublicOrganization[]>([]);
  publicOrganizations = signal<PublicOrganization[]>([]);
  filteredPublicOrgs = signal<PublicOrganization[]>([]);
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadMyOrganizations();
    this.loadPublicOrganizations();
    this.setupSearch();
  }

  loadMyOrganizations() {
    this.myOrgService.getMyOrganizations().subscribe({
      next: (orgs) => this.myOrganizations.set(orgs),
      error: (error) => console.error('Failed to load my organizations:', error)
    });
  }

  loadPublicOrganizations() {
    this.myOrgService.getPublicOrganizations().subscribe({
      next: (orgs) => {
        this.publicOrganizations.set(orgs);
        this.filteredPublicOrgs.set(orgs);
      },
      error: (error) => {
        console.error('Failed to load public organizations:', error);
        this.snackBar.open('Failed to load organizations', 'Close', { duration: 3000 });
      }
    });
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.filterOrganizations(query || '');
    });
  }

  filterOrganizations(query: string) {
    const filtered = this.publicOrganizations().filter(org =>
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.code.toLowerCase().includes(query.toLowerCase()) ||
      org.description?.toLowerCase().includes(query.toLowerCase())
    );
    this.filteredPublicOrgs.set(filtered);
  }

  requestToJoin(org: PublicOrganization) {
    const orgId = org.id || org._id;
    if (!orgId) return;

    this.myOrgService.requestToJoin(orgId).subscribe({
      next: (result) => {
        if (result.success !== false) {
          this.snackBar.open(`Request sent to join ${org.name}`, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Failed to send request', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to send request', 'Close', { duration: 3000 });
      }
    });
  }
}