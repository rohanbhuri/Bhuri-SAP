import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
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
    MatCheckboxModule,
    MatExpansionModule,

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
                  <button mat-button color="primary" (click)="switchToOrganization(org)">
                    <mat-icon>swap_horiz</mat-icon>
                    Switch To
                  </button>
                  <button mat-button>
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
        <div class="section-header">
          <h2>Discover Organizations</h2>
          <button mat-raised-button color="primary" (click)="toggleCreateForm()">
            <mat-icon>add</mat-icon>
            Create Organization
          </button>
        </div>

        @if (showCreateForm()) {
          <mat-expansion-panel [expanded]="true" class="create-form-panel">
            <mat-expansion-panel-header>
              <mat-panel-title>Create New Organization</mat-panel-title>
            </mat-expansion-panel-header>
            
            <form [formGroup]="createOrgForm" (ngSubmit)="createOrganization()" class="create-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Organization Name</mat-label>
                  <input matInput formControlName="name" placeholder="Enter organization name">
                  @if (createOrgForm.get('name')?.hasError('required') && createOrgForm.get('name')?.touched) {
                    <mat-error>Organization name is required</mat-error>
                  }
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Organization Code</mat-label>
                  <input matInput formControlName="code" placeholder="Enter unique code">
                  @if (createOrgForm.get('code')?.hasError('required') && createOrgForm.get('code')?.touched) {
                    <mat-error>Organization code is required</mat-error>
                  }
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Describe your organization"></textarea>
              </mat-form-field>
              
              <mat-checkbox formControlName="isPublic">
                Make this organization public (others can request to join)
              </mat-checkbox>
              
              <div class="form-actions">
                <button type="button" mat-button (click)="cancelCreate()">Cancel</button>
                <button type="submit" mat-raised-button color="primary" [disabled]="createOrgForm.invalid || isCreating()">
                  @if (isCreating()) {
                    <ng-container>
                      <mat-icon>hourglass_empty</mat-icon>
                      Creating...
                    </ng-container>
                  } @else {
                    <ng-container>
                      <mat-icon>add</mat-icon>
                      Create Organization
                    </ng-container>
                  }
                </button>
              </div>
            </form>
          </mat-expansion-panel>
        }
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

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .section-header h2 {
        margin: 0;
      }

      .create-form-panel {
        margin-bottom: 32px;
      }

      .create-form {
        padding: 16px 0;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
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
  private myOrgIds = signal<string[]>([]);
  searchControl = new FormControl('');
  showCreateForm = signal(false);
  isCreating = signal(false);
  
  createOrgForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    isPublic: new FormControl(true)
  });

  ngOnInit() {
    this.loadMyOrganizations();
    this.loadPublicOrganizations();
    this.setupSearch();
  }

  loadMyOrganizations() {
    this.myOrgService.getMyOrganizations().subscribe({
      next: (orgs) => {
        this.myOrganizations.set(orgs);
        this.myOrgIds.set(orgs.map(org => org.id || org._id).filter(id => id !== undefined) as string[]);
        this.filterOrganizations(this.searchControl.value || '');
      },
      error: (error) => console.error('Failed to load my organizations:', error)
    });
  }

  loadPublicOrganizations() {
    this.myOrgService.getPublicOrganizations().subscribe({
      next: (orgs) => {
        this.publicOrganizations.set(orgs);
        this.filterOrganizations(this.searchControl.value || '');
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
    const myOrgIds = this.myOrgIds();
    const lowerQuery = query.toLowerCase();
    const filtered = this.publicOrganizations().filter(org => {
      const orgId = org.id || org._id;
      if (orgId && myOrgIds.includes(orgId)) return false;
      
      return org.name.toLowerCase().includes(lowerQuery) ||
        org.code.toLowerCase().includes(lowerQuery) ||
        org.description?.toLowerCase().includes(lowerQuery);
    });
    this.filteredPublicOrgs.set(filtered);
  }

  requestToJoin(org: PublicOrganization) {
    const orgId = org.id || org._id;
    console.log('Organization:', org);
    console.log('Organization ID:', orgId);
    
    if (!orgId) {
      this.snackBar.open('Invalid organization ID', 'Close', { duration: 3000 });
      return;
    }

    this.myOrgService.requestToJoin(orgId.toString()).subscribe({
      next: (result) => {
        if (result.success !== false) {
          this.snackBar.open(`Request sent to join ${org.name}`, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(result.message || 'Failed to send request', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        const message = error.error?.message || 'Failed to send request';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
    if (!this.showCreateForm()) {
      this.createOrgForm.reset({ isPublic: true });
    }
  }

  cancelCreate() {
    this.showCreateForm.set(false);
    this.createOrgForm.reset({ isPublic: true });
  }

  createOrganization() {
    if (this.createOrgForm.invalid) return;
    
    this.isCreating.set(true);
    const formData = this.createOrgForm.value;
    
    this.myOrgService.createOrganization(formData).subscribe({
      next: (org) => {
        this.snackBar.open(`Organization "${org.name}" created successfully!`, 'Close', { duration: 3000 });
        this.showCreateForm.set(false);
        this.createOrgForm.reset({ isPublic: true });
        this.loadMyOrganizations();
        this.loadPublicOrganizations();
        this.isCreating.set(false);
      },
      error: (error) => {
        const message = error.error?.message || 'Failed to create organization';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.isCreating.set(false);
      }
    });
  }

  switchToOrganization(org: PublicOrganization) {
    const orgId = org.id || org._id;
    if (!orgId) return;

    this.myOrgService.switchOrganization(orgId).subscribe({
      next: () => {
        this.snackBar.open(`Switched to ${org.name}`, 'Close', { duration: 3000 });
        window.location.reload();
      },
      error: () => {
        this.snackBar.open('Failed to switch organization', 'Close', { duration: 3000 });
      }
    });
  }
}