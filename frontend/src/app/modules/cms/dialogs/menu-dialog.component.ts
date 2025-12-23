import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ isEdit ? 'Edit Menu' : 'Create New Menu' }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="menuForm" class="menu-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Menu Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter menu name">
          <mat-error *ngIf="menuForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Location</mat-label>
          <mat-select formControlName="location">
            <mat-option value="header">Header</mat-option>
            <mat-option value="footer">Footer</mat-option>
            <mat-option value="sidebar">Sidebar</mat-option>
            <mat-option value="mobile">Mobile</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-checkbox formControlName="isActive">Active</mat-checkbox>

        <div class="menu-items-section">
          <div class="section-header">
            <h3>Menu Items</h3>
            <button type="button" mat-raised-button color="primary" (click)="addMenuItem()">
              <mat-icon>add</mat-icon>
              Add Item
            </button>
          </div>

          <div formArrayName="items" class="menu-items">
            <div *ngFor="let item of menuItems.controls; let i = index" 
                 [formGroupName]="i" class="menu-item">
              <div class="item-header">
                <span class="item-number">{{ i + 1 }}</span>
                <button type="button" mat-icon-button (click)="removeMenuItem(i)" 
                        [disabled]="menuItems.length === 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>

              <div class="item-fields">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Label</mat-label>
                  <input matInput formControlName="label" placeholder="Menu item label">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>URL</mat-label>
                  <input matInput formControlName="url" placeholder="/page-url or https://...">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Target</mat-label>
                  <mat-select formControlName="target">
                    <mat-option value="_self">Same Window</mat-option>
                    <mat-option value="_blank">New Window</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Order</mat-label>
                  <input matInput type="number" formControlName="order" placeholder="0">
                </mat-form-field>

                <mat-checkbox formControlName="isActive" class="full-width">
                  Active
                </mat-checkbox>
              </div>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="saveMenu()" [disabled]="!menuForm.valid">
        {{ isEdit ? 'Update' : 'Create' }} Menu
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .dialog-header h2 {
      margin: 0;
    }
    
    .menu-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem 0;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      width: calc(50% - 0.5rem);
    }
    
    .menu-items-section {
      margin-top: 1rem;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .section-header h3 {
      margin: 0;
      color: #333;
    }
    
    .menu-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .menu-item {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      background: #f9f9f9;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .item-number {
      font-weight: 600;
      color: #666;
    }
    
    .item-fields {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .item-fields .full-width {
      width: 100%;
    }
  `]
})
export class MenuDialogComponent implements OnInit {
  menuForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      location: ['header', Validators.required],
      isActive: [true],
      items: this.fb.array([this.createMenuItem()])
    });
  }

  get menuItems() {
    return this.menuForm.get('items') as FormArray;
  }

  ngOnInit() {
    if (this.data?.menu) {
      this.isEdit = true;
      const menu = this.data.menu;
      
      // Clear default item
      this.menuItems.clear();
      
      // Add existing items
      if (menu.items && menu.items.length > 0) {
        menu.items.forEach((item: any) => {
          this.menuItems.push(this.createMenuItem(item));
        });
      } else {
        this.menuItems.push(this.createMenuItem());
      }
      
      this.menuForm.patchValue({
        name: menu.name,
        location: menu.location,
        isActive: menu.isActive
      });
    }
  }

  createMenuItem(item?: any): FormGroup {
    return this.fb.group({
      label: [item?.label || '', Validators.required],
      url: [item?.url || '', Validators.required],
      target: [item?.target || '_self'],
      order: [item?.order || 0],
      isActive: [item?.isActive !== undefined ? item.isActive : true]
    });
  }

  addMenuItem() {
    this.menuItems.push(this.createMenuItem());
  }

  removeMenuItem(index: number) {
    if (this.menuItems.length > 1) {
      this.menuItems.removeAt(index);
    }
  }

  saveMenu() {
    if (this.menuForm.valid) {
      const menuData = this.menuForm.value;

      const request = this.isEdit 
        ? this.cmsService.updateMenu(this.data.menu._id, menuData)
        : this.cmsService.createMenu(menuData);

      request.subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}