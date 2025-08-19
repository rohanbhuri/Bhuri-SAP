import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface GanttTask {
  id: string | number;
  name: string;
  startDate: Date;
  endDate: Date;
  progress?: number;
  [key: string]: any; // Allow additional properties
}

export interface GanttConfig {
  taskNameField?: string;
  startDateField?: string;
  endDateField?: string;
  progressField?: string;
  idField?: string;
  displayFields?: string[];
  colorField?: string;
  colorMap?: { [key: string]: string };
  title?: string;
}

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="gantt-container">
      <div class="gantt-header">
        <h3>{{ config.title || 'Gantt Chart' }}</h3>
        <div class="gantt-controls">
          <button mat-button (click)="zoomIn()"><mat-icon>zoom_in</mat-icon></button>
          <button mat-button (click)="zoomOut()"><mat-icon>zoom_out</mat-icon></button>
          <button mat-button (click)="resetZoom()"><mat-icon>fit_screen</mat-icon></button>
        </div>
      </div>

      <div class="gantt-content">
        <div class="gantt-sidebar">
          <div class="task-header">Tasks</div>
          <div *ngFor="let task of processedTasks" class="task-row">
            <div class="task-info">
              <div class="task-name" [matTooltip]="getTaskName(task)">{{ getTaskName(task) }}</div>
              <div class="task-meta" *ngIf="config.displayFields?.length">
                <span *ngFor="let field of config.displayFields" class="meta-item">
                  {{ task[field] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="gantt-timeline">
          <div class="timeline-header">
            <div *ngFor="let date of timelineDates" class="date-column">
              {{ date | date:'MMM dd' }}
            </div>
          </div>
          
          <div class="timeline-body">
            <div *ngFor="let task of processedTasks" class="timeline-row">
              <div class="task-bar-container">
                <div class="task-bar"
                     [style.left.%]="getTaskPosition(task).left"
                     [style.width.%]="getTaskPosition(task).width"
                     [style.background]="getTaskColor(task)"
                     [matTooltip]="getTaskTooltip(task)">
                  <div class="task-progress" 
                       *ngIf="getTaskProgress(task) !== undefined"
                       [style.width.%]="getTaskProgress(task)"></div>
                  <span class="task-label">{{ getTaskName(task) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gantt-container {
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
      background: var(--theme-surface);
      border-radius: 12px;
      overflow: hidden;
    }
    .gantt-header {
      padding: 16px;
      background: var(--theme-primary);
      color: var(--theme-on-primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .gantt-header h3 { margin: 0; font-size: 1.2rem; }
    .gantt-controls { display: flex; gap: 8px; }
    .gantt-controls button { color: var(--theme-on-primary); min-width: 40px; }
    .gantt-content { flex: 1; display: flex; overflow: hidden; }
    .gantt-sidebar {
      width: 300px;
      background: var(--theme-surface-variant);
      border-right: 1px solid var(--theme-outline);
      overflow-y: auto;
    }
    .task-header {
      padding: 16px;
      font-weight: 600;
      background: var(--theme-surface-container);
      border-bottom: 1px solid var(--theme-outline);
    }
    .task-row {
      padding: 12px 16px;
      border-bottom: 1px solid var(--theme-outline);
      height: 60px;
      display: flex;
      align-items: center;
    }
    .task-info { width: 100%; }
    .task-name {
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .task-meta { display: flex; gap: 8px; font-size: 0.8rem; }
    .meta-item {
      padding: 2px 6px;
      background: var(--theme-surface-container);
      border-radius: 4px;
      font-size: 0.7rem;
    }
    .gantt-timeline { flex: 1; overflow-x: auto; overflow-y: hidden; }
    .timeline-header {
      display: flex;
      background: var(--theme-surface-container);
      border-bottom: 1px solid var(--theme-outline);
      min-width: 800px;
    }
    .date-column {
      flex: 1;
      padding: 16px 8px;
      text-align: center;
      font-weight: 500;
      font-size: 0.9rem;
      border-right: 1px solid var(--theme-outline);
      min-width: 80px;
    }
    .timeline-body { min-width: 800px; }
    .timeline-row {
      height: 60px;
      border-bottom: 1px solid var(--theme-outline);
      position: relative;
    }
    .task-bar-container { height: 100%; position: relative; padding: 15px 0; }
    .task-bar {
      position: absolute;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      color: white;
      font-size: 0.8rem;
      font-weight: 500;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }
    .task-bar:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .task-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: rgba(255,255,255,0.3);
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .task-label {
      position: relative;
      z-index: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class GanttChartComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() config: GanttConfig = {};

  processedTasks: GanttTask[] = [];
  timelineDates: Date[] = [];
  private zoomLevel = 1;

  ngOnInit() {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['config']) {
      this.processData();
    }
  }

  private processData() {
    console.log('Gantt processData called with:', this.data);
    if (!this.data?.length) {
      console.log('No data available for Gantt chart');
      return;
    }

    this.processedTasks = this.data.map(item => {
      const startDate = new Date(item[this.config.startDateField || 'startDate']);
      const endDate = new Date(item[this.config.endDateField || 'endDate']);
      
      console.log('Processing item:', item, 'startDate:', startDate, 'endDate:', endDate);
      
      return {
        id: item[this.config.idField || 'id'] || Math.random().toString(),
        name: item[this.config.taskNameField || 'name'] || 'Unnamed Task',
        startDate,
        endDate,
        progress: item[this.config.progressField || 'progress'],
        ...item
      };
    });

    console.log('Processed tasks:', this.processedTasks);
    this.generateTimeline();
  }

  private generateTimeline() {
    if (!this.processedTasks.length) return;

    const startDate = new Date(Math.min(...this.processedTasks.map(t => (t.startDate as Date).getTime())));
    const endDate = new Date(Math.max(...this.processedTasks.map(t => (t.endDate as Date).getTime())));
    
    startDate.setDate(startDate.getDate() - 2);
    endDate.setDate(endDate.getDate() + 2);

    this.timelineDates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      this.timelineDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getTaskPosition(task: GanttTask): { left: number; width: number } {
    if (this.timelineDates.length === 0) return { left: 0, width: 0 };

    const timelineStart = this.timelineDates[0].getTime();
    const timelineEnd = this.timelineDates[this.timelineDates.length - 1].getTime();
    const timelineWidth = timelineEnd - timelineStart;

    const taskStart = (task.startDate as Date).getTime();
    const taskEnd = (task.endDate as Date).getTime();

    const left = ((taskStart - timelineStart) / timelineWidth) * 100;
    const width = ((taskEnd - taskStart) / timelineWidth) * 100;

    return { left: Math.max(0, left), width: Math.max(1, width) };
  }

  getTaskName(task: GanttTask): string {
    return task.name || 'Unnamed Task';
  }

  getTaskProgress(task: GanttTask): number | undefined {
    return task.progress;
  }

  getTaskColor(task: GanttTask): string {
    if (this.config.colorField && this.config.colorMap) {
      const colorKey = task[this.config.colorField];
      return this.config.colorMap[colorKey] || 'linear-gradient(135deg, #2196f3, #1976d2)';
    }
    return 'linear-gradient(135deg, #2196f3, #1976d2)';
  }

  getTaskTooltip(task: GanttTask): string {
    const lines = [
      `Name: ${this.getTaskName(task)}`,
      `Start: ${(task.startDate as Date).toDateString()}`,
      `End: ${(task.endDate as Date).toDateString()}`
    ];

    if (task.progress !== undefined) {
      lines.push(`Progress: ${task.progress}%`);
    }

    // Add additional fields from config
    if (this.config.displayFields) {
      this.config.displayFields.forEach(field => {
        if (task[field] !== undefined) {
          lines.push(`${field}: ${task[field]}`);
        }
      });
    }

    return lines.join('\n');
  }

  zoomIn() { this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3); }
  zoomOut() { this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5); }
  resetZoom() { this.zoomLevel = 1; }
}