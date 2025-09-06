import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrmService, Task } from '../crm.service';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatMenuModule
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Tasks & Reminders</h2>
        <button mat-raised-button color="primary" (click)="openTaskDialog()">
          <mat-icon>add_task</mat-icon>
          Add Task
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="tasks()" class="tasks-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let task">{{ task.title }}</td>
          </ng-container>
          
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let task">
              <mat-chip>{{ task.type }}</mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef>Priority</th>
            <td mat-cell *matCellDef="let task">
              <mat-chip [color]="getTaskPriorityColor(task.priority)">{{ task.priority }}</mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let task">
              <mat-chip [color]="task.status === 'completed' ? 'primary' : 'accent'">{{ task.status }}</mat-chip>
            </td>
          </ng-container>
          
          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let task">{{ task.dueDate ? (task.dueDate | date:'short') : '-' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let task">
              <button mat-icon-button [matMenuTriggerFor]="taskMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #taskMenu="matMenu">
                <button mat-menu-item (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteTask(task._id)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; color: var(--theme-on-surface); }
    .table-container { background: var(--theme-surface); border-radius: 8px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--theme-on-surface) 12%, transparent); }
    .tasks-table { width: 100%; }
  `]
})
export class TasksPageComponent implements OnInit {
  private crmService = inject(CrmService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  tasks = signal<Task[]>([]);
  displayedColumns = ['title', 'type', 'priority', 'status', 'dueDate', 'actions'];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.crmService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  getTaskPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': 'primary',
      'medium': 'accent',
      'high': 'warn',
      'urgent': 'warn'
    };
    return colors[priority] || '';
  }

  openTaskDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: task || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.crmService.updateTask(task._id, result).subscribe({
            next: () => {
              this.loadTasks();
              this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error updating task', 'Close', { duration: 3000 })
          });
        } else {
          this.crmService.createTask(result).subscribe({
            next: () => {
              this.loadTasks();
              this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error creating task', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  editTask(task: Task) {
    this.openTaskDialog(task);
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.crmService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error deleting task', 'Close', { duration: 3000 })
      });
    }
  }
}