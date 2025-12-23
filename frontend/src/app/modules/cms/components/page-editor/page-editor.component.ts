import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CmsService } from '../../cms.service';

@Component({
    selector: 'app-page-editor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container mx-auto p-4 max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">Edit Page</h1>
      
      <form [formGroup]="pageForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="bg-white p-6 rounded shadow">
             <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Page Title</label>
                <input formControlName="title" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
            </div>
             <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Slug</label>
                <input formControlName="slug" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50">
            </div>
             <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Content (HTML)</label>
                <textarea formControlName="content" rows="10" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 font-mono text-sm"></textarea>
                <p class="text-xs text-gray-500 mt-1">HTML is supported.</p>
            </div>
             <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select formControlName="status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>
        </div>

        <div class="flex justify-end space-x-4">
             <button type="button" routerLink=".." class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
             <button type="submit" [disabled]="pageForm.invalid" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save Page
            </button>
        </div>
      </form>
    </div>
  `
})
export class PageEditorComponent {
    pageForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private cmsService: CmsService,
        private router: Router
    ) {
        this.pageForm = this.fb.group({
            title: ['', Validators.required],
            slug: ['', Validators.required],
            content: [''],
            status: ['draft']
        });
    }

    onSubmit() {
        if (this.pageForm.valid) {
            this.cmsService.createPage(this.pageForm.value).subscribe({
                next: () => this.router.navigate(['../']),
                error: (err) => alert('Failed to save page')
            });
        }
    }
}
