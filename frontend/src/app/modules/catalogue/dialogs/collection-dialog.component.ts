import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CatalogueService } from '../catalogue.service';

@Component({
  selector: 'app-collection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.collection ? 'Edit Collection' : 'Add Collection' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="collectionForm" class="collection-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Collection Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter collection name">
            <mat-error *ngIf="collectionForm.get('name')?.hasError('required')">
              Collection name is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Slug</mat-label>
            <input matInput formControlName="slug" placeholder="collection-slug">
            <mat-error *ngIf="collectionForm.get('slug')?.hasError('required')">
              Slug is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Collection description"></textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-checkbox formControlName="isActive">Active</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!collectionForm.valid">
        {{ data.collection ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .collection-form {
      min-width: 500px;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class CollectionDialogComponent implements OnInit {
  collectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private dialogRef: MatDialogRef<CollectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.collectionForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data?.collection) {
      const collection = this.data.collection;
      this.collectionForm.patchValue({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        isActive: collection.isActive
      });
    }

    // Auto-generate slug from name
    this.collectionForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.data?.collection) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        this.collectionForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  onSave() {
    if (this.collectionForm.valid) {
      const collectionData = this.collectionForm.value;

      const request = this.data?.collection 
        ? this.catalogueService.updateCollection(this.data.collection._id, collectionData)
        : this.catalogueService.createCollection(collectionData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}