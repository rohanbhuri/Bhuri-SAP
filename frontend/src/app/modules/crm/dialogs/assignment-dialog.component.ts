import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { CrmService, CrmUser } from '../crm.service';

export interface AssignmentDialogData {
  type: 'contact' | 'lead' | 'deal' | 'task';
  items: any[];
  currentAssignee?: CrmUser;
}

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="assignment-dialog">
      <h2 mat-dialog-title>
        <mat-icon>person_add</mat-icon>
        {{ getTitle() }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="assignmentForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Assign to</mat-label>
            <input matInput formControlName="assignedToSearch" [matAutocomplete]="auto" placeholder="Search users...">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayUser" (optionSelected)="onUserSelected($event)">
              <mat-option value="">Unassigned</mat-option>
              <mat-option *ngFor="let user of filteredUsers | async" [value]="user">
                {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <div class="info" *ngIf="data.items.length > 1">
            <mat-icon>info</mat-icon>
            <span>This will assign {{ data.items.length }} {{ data.type }}{{ data.items.length > 1 ? 's' : '' }}</span>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" [disabled]="isLoading">Cancel</button>
        <button mat-raised-button color="primary" (click)="onAssign()" [disabled]="isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          {{ isLoading ? 'Assigning...' : 'Assign' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .assignment-dialog { min-width: 400px; }
    .full-width { width: 100%; }
    .info { display: flex; align-items: center; gap: 8px; margin: 16px 0; color: #1976d2; }
    h2[mat-dialog-title] { display: flex; align-items: center; gap: 8px; }
    mat-spinner { margin-right: 8px; }
  `]
})
export class AssignmentDialogComponent implements OnInit {
  assignmentForm: FormGroup;
  filteredUsers: Observable<CrmUser[]>;
  selectedUser: CrmUser | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private crmService: CrmService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AssignmentDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AssignmentDialogData
  ) {
    this.assignmentForm = this.fb.group({
      assignedToSearch: [{value: '', disabled: false}]
    });
    
    this.filteredUsers = this.assignmentForm.get('assignedToSearch')!.valueChanges.pipe(
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
  }

  ngOnInit() {
    if (this.data.items.length === 1 && this.data.currentAssignee) {
      this.selectedUser = this.data.currentAssignee;
      this.assignmentForm.patchValue({
        assignedToSearch: this.data.currentAssignee
      });
    }
  }

  searchUsers(query: string): Observable<CrmUser[]> {
    return this.crmService.getOrganizationUsers().pipe(
      map(users => users.filter(user => 
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  displayUser = (user: CrmUser | null): string => {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onUserSelected(event: any) {
    this.selectedUser = event.option.value === '' ? null : event.option.value;
  }

  getTitle(): string {
    const count = this.data.items.length;
    return count === 1 ? `Assign ${this.data.type}` : `Assign ${count} ${this.data.type}s`;
  }

  onAssign() {
    const assignedToId = this.selectedUser?._id || '';
    const items = this.data.items;
    
    this.isLoading = true;
    this.assignmentForm.get('assignedToSearch')?.disable();

    if (items.length === 1) {
      this.performSingleAssignment(items[0]._id, assignedToId);
    } else {
      this.performBulkAssignment(items.map(item => item._id), assignedToId);
    }
  }

  private performSingleAssignment(itemId: string, assignedToId: string) {
    let operation: any;
    
    if (assignedToId) {
      switch (this.data.type) {
        case 'contact': operation = this.crmService.assignContact(itemId, assignedToId); break;
        case 'lead': operation = this.crmService.assignLead(itemId, assignedToId); break;
        case 'deal': operation = this.crmService.assignDeal(itemId, assignedToId); break;
        case 'task': operation = this.crmService.assignTask(itemId, assignedToId); break;
      }
    } else {
      switch (this.data.type) {
        case 'contact': operation = this.crmService.unassignContact(itemId); break;
        case 'lead': operation = this.crmService.unassignLead(itemId); break;
        case 'deal': operation = this.crmService.unassignDeal(itemId); break;
        case 'task': operation = this.crmService.unassignTask(itemId); break;
      }
    }

    operation.subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.assignmentForm.get('assignedToSearch')?.enable();
        const action = assignedToId ? 'assigned' : 'unassigned';
        this.snackBar.open(`${this.data.type} ${action} successfully`, 'Close', { duration: 3000 });
        this.dialogRef.close(result);
      },
      error: () => {
        this.isLoading = false;
        this.assignmentForm.get('assignedToSearch')?.enable();
        this.snackBar.open('Error updating assignment', 'Close', { duration: 3000 });
      }
    });
  }

  private performBulkAssignment(itemIds: string[], assignedToId: string) {
    if (!assignedToId) {
      this.snackBar.open('Please select a user for bulk assignment', 'Close', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    let operation: any;
    switch (this.data.type) {
      case 'contact': operation = this.crmService.bulkAssignContacts(itemIds, assignedToId); break;
      case 'lead': operation = this.crmService.bulkAssignLeads(itemIds, assignedToId); break;
      case 'deal': operation = this.crmService.bulkAssignDeals(itemIds, assignedToId); break;
      case 'task': operation = this.crmService.bulkAssignTasks(itemIds, assignedToId); break;
    }
    
    operation.subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.assignmentForm.get('assignedToSearch')?.enable();
        this.snackBar.open(`${result.updated} ${this.data.type}s assigned successfully`, 'Close', { duration: 3000 });
        this.dialogRef.close(result);
      },
      error: () => {
        this.isLoading = false;
        this.assignmentForm.get('assignedToSearch')?.enable();
        this.snackBar.open('Error updating assignments', 'Close', { duration: 3000 });
      }
    });
  }



  onCancel() {
    this.dialogRef.close();
  }
}