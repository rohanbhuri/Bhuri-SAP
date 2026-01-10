import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CrmFunnelService } from '../crm-funnel.service';

@Component({
  selector: 'app-pipeline-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Sales Pipeline</h1>

      <div class="flex gap-4 overflow-x-auto pb-4">
        <div class="flex-shrink-0 w-80">
          <div class="bg-blue-50 dark:bg-blue-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-blue-900 dark:text-blue-100">New Enquiries</h3>
            <span class="bg-white dark:bg-blue-800 px-3 py-1 rounded-full text-sm font-bold text-blue-600">{{pipeline?.new?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.new" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{item.items?.length || 0}} items</span>
                  <mat-chip class="!bg-blue-100 !text-blue-700 !text-xs !h-6">New</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="flex-shrink-0 w-80">
          <div class="bg-purple-50 dark:bg-purple-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-purple-900 dark:text-purple-100">Processing</h3>
            <span class="bg-white dark:bg-purple-800 px-3 py-1 rounded-full text-sm font-bold text-purple-600">{{pipeline?.processing?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.processing" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{item.items?.length || 0}} items</span>
                  <mat-chip class="!bg-purple-100 !text-purple-700 !text-xs !h-6">Processing</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="flex-shrink-0 w-80">
          <div class="bg-indigo-50 dark:bg-indigo-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-indigo-900 dark:text-indigo-100">Presentation Sent</h3>
            <span class="bg-white dark:bg-indigo-800 px-3 py-1 rounded-full text-sm font-bold text-indigo-600">{{pipeline?.presentationSent?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.presentationSent" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{item.items?.length || 0}} items</span>
                  <mat-chip class="!bg-indigo-100 !text-indigo-700 !text-xs !h-6">Presented</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="flex-shrink-0 w-80">
          <div class="bg-orange-50 dark:bg-orange-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-orange-900 dark:text-orange-100">Quoted</h3>
            <span class="bg-white dark:bg-orange-800 px-3 py-1 rounded-full text-sm font-bold text-orange-600">{{pipeline?.quoted?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.quoted" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{item.items?.length || 0}} items</span>
                  <mat-chip class="!bg-orange-100 !text-orange-700 !text-xs !h-6">Quoted</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="flex-shrink-0 w-80">
          <div class="bg-green-50 dark:bg-green-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-green-900 dark:text-green-100">Won</h3>
            <span class="bg-white dark:bg-green-800 px-3 py-1 rounded-full text-sm font-bold text-green-600">{{pipeline?.converted?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.converted" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{item.items?.length || 0}} items</span>
                  <mat-chip class="!bg-green-100 !text-green-700 !text-xs !h-6">Won</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="flex-shrink-0 w-80">
          <div class="bg-red-50 dark:bg-red-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-red-900 dark:text-red-100">Lost</h3>
            <span class="bg-white dark:bg-red-800 px-3 py-1 rounded-full text-sm font-bold text-red-600">{{pipeline?.lost?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.lost" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-red-500">{{item.lostReason}}</span>
                  <mat-chip class="!bg-red-100 !text-red-700 !text-xs !h-6">Lost</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="flex-shrink-0 w-80">
          <div class="bg-yellow-50 dark:bg-yellow-900 rounded-t-xl p-4 flex items-center justify-between">
            <h3 class="font-semibold text-yellow-900 dark:text-yellow-100">On Hold</h3>
            <span class="bg-white dark:bg-yellow-800 px-3 py-1 rounded-full text-sm font-bold text-yellow-600">{{pipeline?.onHold?.length || 0}}</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-b-xl p-4 min-h-[500px] space-y-3">
            <mat-card *ngFor="let item of pipeline?.onHold" class="!rounded-lg !shadow-sm hover:!shadow-md transition-shadow cursor-pointer">
              <mat-card-content class="!p-4">
                <div class="font-semibold text-gray-900 dark:text-white mb-1">{{item.customerName}}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{item.company}}</div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{item.followUpDate | date:'short'}}</span>
                  <mat-chip class="!bg-yellow-100 !text-yellow-700 !text-xs !h-6">On Hold</mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PipelineViewComponent implements OnInit {
  private funnelService = inject(CrmFunnelService);
  pipeline: any;

  ngOnInit() {
    this.loadPipeline();
  }

  loadPipeline() {
    this.funnelService.getPipeline().subscribe(data => {
      this.pipeline = data;
    });
  }
}
