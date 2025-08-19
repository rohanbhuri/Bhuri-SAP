import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProjectTimesheetService, TimesheetEntry } from './project-timesheet.service';
import { GanttChartComponent, GanttConfig } from '../../components/gantt-chart.component';

@Component({
  selector: 'app-project-timesheet-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, GanttChartComponent],
  template: `
    <div class="widget-content">
      <div class="widget-header">
        <h3>Project Timesheet</h3>
        <button mat-raised-button color="primary" (click)="openModule()">
          <mat-icon>schedule</mat-icon>
          Manage
        </button>
      </div>
      <div class="gantt-container">
        <app-gantt-chart 
          [data]="timesheetData()" 
          [config]="ganttConfig">
        </app-gantt-chart>
      </div>
    </div>
  `,
  styles: [
    `
      .widget-content {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--theme-outline);
      }
      .widget-header h3 {
        margin: 0;
        font-size: 1.1rem;
      }
      .gantt-container {
        flex: 1;
        min-height: 300px;
      }
    `,
  ],
})
export class ProjectTimesheetWidgetComponent implements OnInit {
  private router = inject(Router);
  private timesheetService = inject(ProjectTimesheetService);
  timesheetData = signal<TimesheetEntry[]>([]);
  
  ganttConfig: GanttConfig = {
    title: 'Recent Timesheet Entries',
    taskNameField: 'name',
    startDateField: 'startDate',
    endDateField: 'endDate',
    displayFields: ['totalHours', 'status'],
    colorField: 'status',
    colorMap: {
      'draft': 'linear-gradient(135deg, #ff9800, #f57c00)',
      'submitted': 'linear-gradient(135deg, #2196f3, #1976d2)',
      'approved': 'linear-gradient(135deg, #4caf50, #388e3c)',
      'rejected': 'linear-gradient(135deg, #f44336, #d32f2f)'
    }
  };

  ngOnInit() {
    this.loadTimesheetData();
  }

  loadTimesheetData() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    this.timesheetService.getTimesheetEntries({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }).subscribe((data) => {
      console.log('Timesheet data received:', data);
      if (data.length === 0) {
        // Use mock data if no real data
        data = this.timesheetService.getMockData();
        console.log('Using mock data:', data);
      }
      const processedData = data.map(entry => {
        const startDate = new Date(entry.date);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + (entry.totalHours || 1));
        
        return {
          ...entry,
          startDate,
          endDate,
          name: entry.description || 'Timesheet Entry'
        };
      });
      
      console.log('Final processed data for Gantt:', processedData);
      this.timesheetData.set(processedData);
    });
  }

  openModule() {
    this.router.navigate(['/modules/project-timesheet']);
  }
}