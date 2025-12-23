import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CmsService } from '../../cms.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">CMS Pages</h1>
        <a routerLink="new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Page
        </a>
      </div>
      
      <table class="min-w-full bg-white border rounded">
        <thead>
          <tr class="bg-gray-50 border-b">
            <th class="py-2 px-4 text-left">Title</th>
            <th class="py-2 px-4 text-left">Slug</th>
            <th class="py-2 px-4 text-left">Status</th>
            <th class="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let page of pages$ | async" class="border-b">
            <td class="py-2 px-4">{{ page.title }}</td>
            <td class="py-2 px-4 text-gray-500">/{{ page.slug }}</td>
            <td class="py-2 px-4">
                <span [class.bg-green-100]="page.status === 'published'" 
                      [class.text-green-800]="page.status === 'published'"
                      class="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 uppercase">
                    {{ page.status }}
                </span>
            </td>
            <td class="py-2 px-4">
                <a [routerLink]="[page._id, 'edit']" class="text-blue-600 hover:underline">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PageListComponent {
  pages$: Observable<any[]>;

  constructor(private cmsService: CmsService) {
    this.pages$ = this.cmsService.getPages();
  }
}
