import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Deal, Lead, CrmUser, CrmService } from '../crm.service';

@Component({
  selector: 'app-deal-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule, MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">handshake</mat-icon>
        {{ data ? 'Edit Deal' : 'Add Deal' }}
      </h2>
    </div>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required />
          <mat-icon matPrefix>title</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="3" formControlName="description"></textarea>
          <mat-icon matPrefix>description</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Lead</mat-label>
          <input matInput formControlName="leadSearch" [matAutocomplete]="leadAuto" placeholder="Search leads...">
          <mat-autocomplete #leadAuto="matAutocomplete" [displayWith]="displayLead" (optionSelected)="onLeadSelected($event)">
            <mat-option value="">No Lead</mat-option>
            <mat-option *ngFor="let lead of filteredLeads | async" [value]="lead">
              {{ lead.title }} ({{ lead.status }})
            </mat-option>
          </mat-autocomplete>
          <mat-icon matPrefix>trending_up</mat-icon>
        </mat-form-field>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Value</mat-label>
            <input matInput formControlName="value" type="number" min="0" required />
            <mat-icon matPrefix>attach_money</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Stage</mat-label>
            <mat-select formControlName="stage">
              <mat-option value="prospecting">Prospecting</mat-option>
              <mat-option value="qualification">Qualification</mat-option>
              <mat-option value="proposal">Proposal</mat-option>
              <mat-option value="negotiation">Negotiation</mat-option>
              <mat-option value="closed-won">Closed Won</mat-option>
              <mat-option value="closed-lost">Closed Lost</mat-option>
            </mat-select>
            <mat-icon matPrefix>timeline</mat-icon>
          </mat-form-field>
        </div>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Probability (%)</mat-label>
            <input matInput formControlName="probability" type="number" min="0" max="100" />
            <mat-icon matPrefix>percent</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Expected Close Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="expectedCloseDate" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-icon matPrefix>event</mat-icon>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Assign to</mat-label>
          <input matInput formControlName="assignedToSearch" [matAutocomplete]="userAuto" placeholder="Search users...">
          <mat-autocomplete #userAuto="matAutocomplete" [displayWith]="displayUser" (optionSelected)="onUserSelected($event)">
            <mat-option value="">Unassigned</mat-option>
            <mat-option *ngFor="let user of filteredUsers | async" [value]="user">
              {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
            </mat-option>
          </mat-autocomplete>
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>
        <div class="dialog-actions" mat-dialog-actions>
          <button mat-button type="button" (click)="close()" class="cancel-btn">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="save-btn">
            <mat-icon>save</mat-icon>
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      max-width: 640px;
      background: var(--theme-surface);
      color: var(--theme-on-surface);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .dialog-header {
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface)),
        color-mix(in srgb, var(--theme-accent) 4%, var(--theme-surface))
      );
      padding: 20px 24px;
      border-bottom: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
    
    .dialog-title { 
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
      color: var(--theme-on-surface);
    }
    
    .dialog-icon {
      color: var(--theme-primary);
      background-color: color-mix(in srgb, var(--theme-primary) 15%, transparent);
      border-radius: 50%;
      padding: 8px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .dialog-content { 
      padding: 24px;
      background: var(--theme-surface);
    }
    
    form { 
      display: grid; 
      grid-auto-rows: min-content; 
      row-gap: 20px; 
    }
    
    .form-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 16px; 
    }
    
    mat-form-field { 
      width: 100%;
    }
    
    .dialog-actions { 
      display: flex; 
      justify-content: flex-end; 
      gap: 12px; 
      padding: 20px 0 0;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
      margin-top: 20px;
    }
    
    .cancel-btn {
      background-color: transparent;
      color: var(--theme-secondary);
      border: 1px solid var(--theme-secondary);
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .cancel-btn:hover {
      background-color: color-mix(in srgb, var(--theme-secondary) 10%, transparent);
    }
    
    .save-btn {
      background-color: var(--theme-primary);
      color: white;
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
    }
    
    .save-btn:hover {
      background-color: color-mix(in srgb, var(--theme-primary) 85%, black);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 25%, transparent);
    }
    
    @media (max-width: 768px) {
      :host { max-width: 95vw; }
      .form-grid { grid-template-columns: 1fr; }
      .dialog-header { padding: 16px 20px; }
      .dialog-content { padding: 20px; }
    }
    
    :host-context(body.dark-theme) .dialog-header {
      border-bottom-color: color-mix(in srgb, var(--theme-on-surface) 20%, transparent);
    }
    
    :host-context(body.dark-theme) .dialog-actions {
      border-top-color: color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
    }
  `]
})
export class DealDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private crmService = inject(CrmService);
  dialogRef = inject(MatDialogRef<DealDialogComponent>);
  form!: FormGroup;
  filteredLeads!: Observable<Lead[]>;
  selectedLead: Lead | null = null;
  users: CrmUser[] = [];
  filteredUsers!: Observable<CrmUser[]>;
  selectedUser: CrmUser | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Deal | null) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || ''],
      value: [this.data?.value || null, [Validators.required, Validators.min(0)]],
      stage: [this.data?.stage || 'prospecting', Validators.required],
      probability: [this.data?.probability || 0, [Validators.min(0), Validators.max(100)]],
      expectedCloseDate: [this.data?.expectedCloseDate || null],
      leadSearch: [''],
      leadId: [this.data?.leadId || null],
      assignedToId: [this.data?.assignedToId || ''],
      assignedToSearch: ['']
    });
    
    this.filteredLeads = this.form.get('leadSearch')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : '';
        if (searchTerm.length >= 2) {
          return this.searchLeads(searchTerm);
        }
        return of([]);
      })
    );
    
    if (this.data?.leadId) {
      this.loadCurrentLead();
    }
    
    this.loadUsers();
    
    this.filteredUsers = this.form.get('assignedToSearch')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : '';
        if (searchTerm.length >= 2) {
          return this.searchUsers(searchTerm);
        }
        return of([]);
      })
    );
    
    if (this.data?.assignedTo) {
      this.selectedUser = this.data.assignedTo;
      this.form.patchValue({ assignedToSearch: this.data.assignedTo });
    }
  }

  loadCurrentLead() {
    this.crmService.getLeads().subscribe(leads => {
      const currentLead = leads.find(l => l._id === this.data?.leadId);
      if (currentLead) {
        this.selectedLead = currentLead;
        this.form.patchValue({ leadSearch: currentLead });
      }
    });
  }

  searchLeads(query: string): Observable<Lead[]> {
    return this.crmService.getLeads().pipe(
      map(leads => leads.filter(lead => 
        lead.status !== 'converted' &&
        (lead.title.toLowerCase().includes(query.toLowerCase()) ||
         lead.description?.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  displayLead = (lead: Lead | null): string => {
    return lead ? lead.title : '';
  }

  onLeadSelected(event: any) {
    this.selectedLead = event.option.value === '' ? null : event.option.value;
    this.form.patchValue({ leadId: this.selectedLead?._id || null });
  }

  loadUsers() {
    this.crmService.getOrganizationUsers().subscribe({
      next: (users) => this.users = users,
      error: () => console.error('Error loading users')
    });
  }

  searchUsers(query: string): Observable<CrmUser[]> {
    return of(this.users.filter(user => 
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    ));
  }

  displayUser = (user: CrmUser | null): string => {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onUserSelected(event: any) {
    this.selectedUser = event.option.value === '' ? null : event.option.value;
    this.form.patchValue({ assignedToId: this.selectedUser?._id || '' });
  }

  close() { this.dialogRef.close(); }
  
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}