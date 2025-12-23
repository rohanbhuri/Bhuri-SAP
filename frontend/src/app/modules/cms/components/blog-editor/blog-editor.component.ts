import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CmsService } from '../../cms.service';

@Component({
    selector: 'app-blog-editor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="container mx-auto p-6 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">{{ blogId ? 'Edit Blog Post' : 'New Blog Post' }}</h1>
      
      <form [formGroup]="blogForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input formControlName="title" type="text" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     placeholder="Enter blog title">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input formControlName="slug" type="text" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     placeholder="url-friendly-slug">
              <p class="text-xs text-gray-500 mt-1">This will be the URL path for your post</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea formControlName="excerpt" rows="3"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Brief description of the post"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea formControlName="content" rows="12"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                        placeholder="HTML content goes here"></textarea>
              <p class="text-xs text-gray-500 mt-1">You can write HTML directly</p>
            </div>
          </div>
        </div>

        <!-- Media & SEO -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Media & SEO</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input formControlName="featuredImage" type="text" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     placeholder="https://example.com/image.jpg">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input type="text" 
                     [value]="tagsInput"
                     (input)="onTagsChange($event)"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     placeholder="technology, tutorial, news">
            </div>

            <!-- SEO Fields -->
            <div class="border-t pt-4 mt-4">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">SEO Settings</h3>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                  <input type="text"
                         [value]="blogForm.get('seo')?.value?.title || ''"
                         (input)="updateSeo('title', $event)"
                         class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                  <textarea rows="2"
                            [value]="blogForm.get('seo')?.value?.description || ''"
                            (input)="updateSeo('description', $event)"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Keywords</label>
                  <input type="text"
                         [value]="blogForm.get('seo')?.value?.keywords || ''"
                         (input)="updateSeo('keywords', $event)"
                         class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status & Actions -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select formControlName="status" 
                      class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div class="flex space-x-3">
              <button type="button" routerLink=".." 
                      class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" [disabled]="blogForm.invalid" 
                      class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {{ blogId ? 'Update Post' : 'Create Post' }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `
})
export class BlogEditorComponent implements OnInit {
    blogForm: FormGroup;
    blogId: string | null = null;
    tagsInput = '';

    constructor(
        private fb: FormBuilder,
        private cmsService: CmsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            slug: ['', Validators.required],
            excerpt: [''],
            content: ['', Validators.required],
            featuredImage: [''],
            tags: [[]],
            status: ['draft'],
            seo: [{}]
        });

        // Auto-generate slug from title
        this.blogForm.get('title')?.valueChanges.subscribe(title => {
            if (title && !this.blogId) {
                const slug = title.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                this.blogForm.patchValue({ slug }, { emitEvent: false });
            }
        });
    }

    ngOnInit() {
        this.blogId = this.route.snapshot.paramMap.get('id');
        if (this.blogId) {
            this.loadBlog(this.blogId);
        }
    }

    loadBlog(id: string) {
        this.cmsService.getBlog(id).subscribe({
            next: (blog) => {
                this.blogForm.patchValue(blog);
                this.tagsInput = blog.tags?.join(', ') || '';
            },
            error: (err) => {
                console.error('Failed to load blog', err);
                alert('Failed to load blog post');
            }
        });
    }

    onTagsChange(event: any) {
        this.tagsInput = event.target.value;
        const tags = event.target.value
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t);
        this.blogForm.patchValue({ tags });
    }

    updateSeo(field: string, event: any) {
        const currentSeo = this.blogForm.get('seo')?.value || {};
        this.blogForm.patchValue({
            seo: { ...currentSeo, [field]: event.target.value }
        });
    }

    onSubmit() {
        if (this.blogForm.valid) {
            const data = this.blogForm.value;
            if (data.status === 'published' && !data.publishedAt) {
                data.publishedAt = new Date();
            }

            const operation = this.blogId
                ? this.cmsService.updateBlog(this.blogId, data)
                : this.cmsService.createBlog(data);

            operation.subscribe({
                next: () => this.router.navigate(['/modules/cms/blogs']),
                error: (err) => alert(`Failed to ${this.blogId ? 'update' : 'create'} blog post`)
            });
        }
    }
}
