import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HrManagementService, Employee } from '../hr-management.service';
import { EmployeeDialogComponent } from '../dialogs/employee-dialog.component';

@Component({
  selector: 'app-hr-employees-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatMenuModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Employee Management</h2>
        <button mat-raised-button color="primary" (click)="openEmployeeDialog()">
          <mat-icon>person_add</mat-icon>
          Add Employee
        </button>
      </div>
      
      <div class="cards-container">
        <div class="employee-card" *ngFor="let employee of displayedEmployees()">
          <mat-card class="employee-card-content">
            <div class="card-header">
              <div class="employee-info">
                <div class="employee-avatar">{{ getInitials(employee.firstName, employee.lastName) }}</div>
                <div class="employee-details">
                  <div class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</div>
                  <div class="employee-id">{{ employee.employeeId }}</div>
                </div>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="employeeMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #employeeMenu="matMenu">
                <button mat-menu-item (click)="editEmployee(employee)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteEmployee(employee._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item" *ngIf="employee.email">
                  <mat-icon>email</mat-icon>
                  <span>{{ employee.email }}</span>
                </div>
                <div class="info-item" *ngIf="employee.phone">
                  <mat-icon>phone</mat-icon>
                  <span>{{ employee.phone }}</span>
                </div>
                <div class="info-item" *ngIf="employee.department">
                  <mat-icon>business</mat-icon>
                  <span>{{ employee.department }}</span>
                </div>
                <div class="info-item" *ngIf="employee.position">
                  <mat-icon>work</mat-icon>
                  <span>{{ employee.position }}</span>
                </div>
                <div class="info-item" *ngIf="employee.salary">
                  <mat-icon>attach_money</mat-icon>
                  <span>\${{ employee.salary | number }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>info</mat-icon>
                  <mat-chip [color]="employee.status === 'active' ? 'primary' : 'warn'" class="status-chip">
                    {{ employee.status }}
                  </mat-chip>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button mat-button color="primary" (click)="editEmployee(employee)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="accent" (click)="viewDetails(employee)">
                <mat-icon>visibility</mat-icon>
                View
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <div class="loading-container" *ngIf="loading()">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Loading more employees...</span>
      </div>
      
      <div class="no-data" *ngIf="employees().length === 0 && !loading()">
        <mat-icon>people_off</mat-icon>
        <h3>No employees found</h3>
        <p>Start by adding your first employee</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    
    .cards-container { 
      display: grid; 
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
    
    .employee-card-content {
      transition: all 0.3s ease;
      border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent);
    }
    
    .employee-card-content:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--theme-on-surface) 15%, transparent);
    }
    
    .card-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 16px; 
      padding: 16px 16px 0;
    }
    
    .employee-info { display: flex; align-items: center; gap: 12px; }
    
    .employee-avatar { 
      width: 48px; 
      height: 48px; 
      border-radius: 50%; 
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)); 
      color: white; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 600; 
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .employee-details { flex: 1; min-width: 0; }
    .employee-name { font-weight: 600; margin-bottom: 4px; font-size: 16px; }
    .employee-id { font-size: 13px; opacity: 0.7; font-family: 'Courier New', monospace; }
    
    .card-body { padding: 0 16px 16px; }
    
    .info-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
      gap: 12px; 
    }
    
    .info-item { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-size: 14px;
      padding: 8px;
      background: color-mix(in srgb, var(--theme-primary) 5%, transparent);
      border-radius: 6px;
    }
    
    .info-item mat-icon { 
      font-size: 18px; 
      width: 18px; 
      height: 18px; 
      opacity: 0.7; 
      flex-shrink: 0;
    }
    
    .status-chip { font-size: 11px; height: 22px; }
    
    .card-actions { 
      display: flex; 
      justify-content: flex-end; 
      gap: 8px; 
      padding: 0 16px 16px;
      border-top: 1px solid color-mix(in srgb, var(--theme-on-surface) 8%, transparent);
      margin-top: 16px;
      padding-top: 16px;
    }
    
    .loading-container { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 16px; 
      padding: 40px; 
      color: var(--theme-on-surface);
      opacity: 0.7;
    }
    
    .no-data { 
      text-align: center; 
      padding: 60px 20px; 
      color: var(--theme-on-surface); 
      opacity: 0.6; 
    }
    
    .no-data mat-icon { 
      font-size: 64px; 
      width: 64px; 
      height: 64px; 
      margin-bottom: 16px; 
    }
    
    .no-data h3 { margin: 16px 0 8px; }
    .no-data p { margin: 0; }
    
    @media (max-width: 768px) {
      .page-content { padding: 16px; }
      .cards-container { 
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .page-header { 
        flex-direction: column; 
        gap: 16px; 
        align-items: stretch; 
      }
      .info-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 480px) {
      .employee-avatar { width: 40px; height: 40px; font-size: 14px; }
      .employee-name { font-size: 15px; }
      .card-actions { justify-content: center; }
    }
  `]
})
export class EmployeesPageComponent implements OnInit {
  private hrService = inject(HrManagementService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  employees = signal<Employee[]>([]);
  displayedEmployees = signal<Employee[]>([]);
  loading = signal(false);
  
  private pageSize = 12;
  private currentPage = 0;
  private hasMoreData = true;

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading.set(true);
    this.hrService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loadMoreEmployees();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  loadMoreEmployees() {
    const allEmployees = this.employees();
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newEmployees = allEmployees.slice(startIndex, endIndex);
    
    if (newEmployees.length > 0) {
      this.displayedEmployees.set([...this.displayedEmployees(), ...newEmployees]);
      this.currentPage++;
      this.hasMoreData = endIndex < allEmployees.length;
    } else {
      this.hasMoreData = false;
    }
  }
  
  @HostListener('window:scroll')
  onScroll() {
    if (this.hasMoreData && !this.loading()) {
      const threshold = 200;
      const position = window.pageYOffset + window.innerHeight;
      const height = document.documentElement.scrollHeight;
      
      if (position > height - threshold) {
        this.loadMoreEmployees();
      }
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  openEmployeeDialog(employee?: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px',
      data: employee || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (employee) {
        this.hrService.updateEmployee(employee._id, result).subscribe({
          next: (updated) => {
            const updatedEmployees = this.employees().map(e => e._id === employee._id ? { ...e, ...updated } : e);
            const updatedDisplayed = this.displayedEmployees().map(e => e._id === employee._id ? { ...e, ...updated } : e);
            this.employees.set(updatedEmployees);
            this.displayedEmployees.set(updatedDisplayed);
            this.snackBar.open('Employee updated successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            const status = error?.status;
            const backendMsg = (error?.error?.message || '').toString().toLowerCase();
            let message = 'Error updating employee';
            if (status === 409 || backendMsg.includes('duplicate')) message = 'Duplicate entry: employee ID or email already exists';
            else if (status === 400 && (backendMsg.includes('email') || backendMsg.includes('phone'))) message = 'Incorrect email or phone format';
            else if (status === 422) message = 'Validation failed: please check required fields';
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      } else {
        this.hrService.createEmployee(result).subscribe({
          next: (created) => {
            if (created && created._id) {
              this.employees.set([created, ...this.employees()]);
              this.displayedEmployees.set([created, ...this.displayedEmployees()]);
            } else {
              this.loadEmployees();
            }
            this.snackBar.open('Employee created successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            const status = error?.status;
            const backendMsg = (error?.error?.message || '').toString().toLowerCase();
            let message = 'Error creating employee';
            if (status === 409 || backendMsg.includes('duplicate')) message = 'Duplicate entry: employee ID or email already exists';
            else if (status === 400 && (backendMsg.includes('email') || backendMsg.includes('phone'))) message = 'Incorrect email or phone format';
            else if (status === 422) message = 'Validation failed: please check required fields';
            this.snackBar.open(message, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  editEmployee(employee: Employee) {
    this.openEmployeeDialog(employee);
  }

  viewDetails(employee: Employee) {
    this.snackBar.open(`Viewing details for ${employee.firstName} ${employee.lastName}`, 'Close', { duration: 2000 });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.hrService.deleteEmployee(id).subscribe({
        next: () => {
          const updatedEmployees = this.employees().filter(e => e._id !== id);
          const updatedDisplayed = this.displayedEmployees().filter(e => e._id !== id);
          this.employees.set(updatedEmployees);
          this.displayedEmployees.set(updatedDisplayed);
          this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting employee', 'Close', { duration: 3000 })
      });
    }
  }
}