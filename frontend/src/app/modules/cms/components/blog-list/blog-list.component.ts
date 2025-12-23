import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CmsService } from '../../cms.service';

@Component({
    selector: 'app-blog-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <a routerLink="new" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Post
        </a>
      </div>

      <div *ngIf="blogs.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No blog posts yet. Create your first post!</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let blog of blogs" 
             class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
          <!-- Featured Image -->
          <div *ngIf="blog.featuredImage" class="aspect-video bg-gray-200">
            <img [src]="blog.featuredImage" [alt]="blog.title" class="w-full h-full object-cover">
          </div>
          <div *ngIf="!blog.featuredImage" class="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <svg class="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>

          <div class="p-6">
            <!-- Status Badge -->
            <div class="flex items-start justify-between mb-3">
              <span [ngClass]="{
                'px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                'bg-green-100 text-green-800': blog.status === 'published',
                'bg-yellow-100 text-yellow-800': blog.status === 'draft',
                'bg-gray-100 text-gray-800': blog.status === 'archived'
              }">
                {{ blog.status | uppercase }}
              </span>
              <a [routerLink]="[blog._id, 'edit']" class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors text-sm">
                Edit
              </a>
            </div>

            <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{{ blog.title }}</h3>
            <p *ngIf="blog.excerpt" class="text-sm text-gray-500 mb-3 line-clamp-3">{{ blog.excerpt }}</p>

            <!-- Tags -->
            <div *ngIf="blog.tags?.length" class="flex flex-wrap gap-2 mb-3">
              <span *ngFor="let tag of blog.tags.slice(0, 3)" 
                    class="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded">
                {{ tag }}
              </span>
            </div>

            <!-- Date -->
            <p class="text-xs text-gray-400">
              {{ blog.publishedAt || blog.createdAt | date:'MMM d, y' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class BlogListComponent implements OnInit {
    blogs: any[] = [];

    constructor(private cmsService: CmsService) { }

    ngOnInit() {
        this.loadBlogs();
    }

    loadBlogs() {
        this.cmsService.getBlogs().subscribe({
            next: (data) => this.blogs = data,
            error: (err) => console.error('Failed to load blogs', err)
        });
    }
}
