import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientPortalService } from '../../client-portal.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Client Dashboard</h1>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Quotations</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Pending</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Accepted</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.accepted }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Value</p>
              <p class="text-3xl font-bold text-indigo-600">{{ stats.totalValue | currency }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Quotations -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">  <h2 class="text-xl font-semibold text-gray-900">Recent Quotations</h2>
          <a routerLink="/client-portal/quotations" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All →
          </a>
        </div>

        <div *ngIf="recentQuotations.length === 0" class="text-center py-8">
          <p class="text-gray-500">No quotations yet</p>
        </div>

        <div class="space-y-4">
          <div *ngFor="let quote of recentQuotations" 
               class="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer"
               [routerLink]="['/client-portal/quotations', quote._id]">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-semibold text-gray-900">Quotation #{{ quote._id?.toString().slice(-6) }}</h3>
                <p class="text-sm text-gray-500">{{ quote.createdAt | date:'MMM d, y' }}</p>
              </div>
              <span [ngClass]="{
                'px-3 py-1 rounded-full text-xs font-medium': true,
                'bg-yellow-100 text-yellow-800': quote.status === 'SENT',
                'bg-green-100 text-green-800': quote.status === 'ACCEPTED',
                'bg-red-100 text-red-800': quote.status === 'DECLINED',
                'bg-gray-100 text-gray-800': quote.status === 'DRAFT'
              }">
                {{ quote.status }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-600">{{ quote.items?.length || 0 }} items</p>
              <p class="text-lg font-bold text-gray-900">{{ quote.totalAmount | currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ClientDashboardComponent implements OnInit {
  stats = {
    total: 0,
    pending: 0,
    accepted: 0,
    totalValue: 0
  };
  recentQuotations: any[] = [];

  constructor(private clientPortalService: ClientPortalService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    // Load quotations and calculate stats
    this.clientPortalService.getMyQuotations().subscribe({
      next: (quotations) => {
        this.recentQuotations = quotations.slice(0, 5);
        this.stats.total = quotations.length;
        this.stats.pending = quotations.filter(q => q.status === 'SENT').length;
        this.stats.accepted = quotations.filter(q => q.status === 'ACCEPTED').length;
        this.stats.totalValue = quotations.reduce((sum, q) => sum + (q.totalAmount || 0), 0);
      },
      error: (err) => console.error('Failed to load quotations', err)
    });
  }
}
