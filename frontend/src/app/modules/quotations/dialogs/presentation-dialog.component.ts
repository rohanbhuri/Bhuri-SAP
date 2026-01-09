import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { QuotationsService } from '../quotations.service';
import { CatalogueService } from '../../catalogue/catalogue.service';
import { ClientManagementService } from '../../client-management/services/client-management.service';
import { HttpClient } from '@angular/common/http';
import { getBrandConfig } from '../../../brand.config';

@Component({
  selector: 'app-presentation-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Create'}} Presentation</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Client</mat-label>
          <mat-select formControlName="clientId" required (selectionChange)="onClientChange($event)">
            <mat-option *ngFor="let client of clients" [value]="client._id">
              {{client.companyName}} - {{client.contactPerson}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Enquiry (Optional)</mat-label>
          <mat-select formControlName="enquiryId">
            <mat-option [value]="null">None</mat-option>
            <mat-option *ngFor="let enq of enquiries" [value]="enq._id">{{enq.enquiryNumber}}</mat-option>
          </mat-select>
        </mat-form-field>

        <h3>Cover Slide Settings</h3>
        <div class="slide-item">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Background Image</mat-label>
            <input matInput formControlName="coverBackground" readonly>
          </mat-form-field>
          <input type="file" #coverFile (change)="onCoverImageSelect($event)" accept="image/*" style="display:none">
          <button mat-button type="button" (click)="coverFile.click()">
            <mat-icon>upload</mat-icon> Upload Background
          </button>
          <img *ngIf="coverImagePreview" [src]="coverImagePreview" style="max-width:200px;margin-top:10px">

          <div class="color-controls">
            <div class="color-field">
              <label>Overlay Color</label>
              <input type="color" formControlName="overlayColor">
            </div>
            <mat-form-field appearance="outline" class="slider-field">
              <mat-label>Overlay Transparency (%)</mat-label>
              <input matInput type="number" formControlName="overlayTransparency" min="0" max="100">
            </mat-form-field>
            <div class="color-field">
              <label>Text Color</label>
              <input type="color" formControlName="textColor">
            </div>
          </div>
        </div>

        <h3>Slides</h3>
        <div formArrayName="slides">
          <div *ngFor="let slide of slides.controls; let i = index" [formGroupName]="i" class="slide-item">
            <h4>Slide {{i + 2}}</h4>
            <mat-radio-group formControlName="layout">
              <mat-radio-button value="single">Single Product</mat-radio-button>
              <mat-radio-button value="multiple">Multiple Products</mat-radio-button>
            </mat-radio-group>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Products</mat-label>
              <mat-select formControlName="productIds" multiple required>
                <mat-option *ngFor="let product of products" [value]="product._id">{{product.name}}</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-icon-button color="warn" (click)="removeSlide(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <button mat-button (click)="addSlide()">
          <mat-icon>add</mat-icon> Add Slide
        </button>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.valid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
    .slide-item { border: 1px solid #ddd; padding: 16px; margin-bottom: 16px; border-radius: 4px; }
    mat-radio-button { margin-right: 16px; }
    .color-controls { display: flex; gap: 16px; margin-top: 16px; align-items: flex-end; }
    .color-field { display: flex; flex-direction: column; gap: 4px; }
    .color-field label { font-size: 12px; color: #666; }
    .color-field input[type="color"] { width: 60px; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
    .slider-field { flex: 1; margin-bottom: 0 !important; }
  `]
})
export class PresentationDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private quotationsService = inject(QuotationsService);
  private catalogueService = inject(CatalogueService);
  private clientService = inject(ClientManagementService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  dialogRef = inject(MatDialogRef<PresentationDialogComponent>);

  form: FormGroup;
  clients: any[] = [];
  enquiries: any[] = [];
  products: any[] = [];
  coverImagePreview: string | null = null;
  coverImageFile: File | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      clientId: ['', Validators.required],
      clientName: [''],
      enquiryId: [null],
      coverBackground: [''],
      overlayColor: ['#000000'],
      overlayTransparency: [50],
      textColor: ['#FFFFFF'],
      slides: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadEnquiries();
    this.loadProducts();

    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.coverBackground) {
        const apiUrl = getBrandConfig().app.apiUrl.replace('/api', '');
        this.coverImagePreview = this.data.coverBackground.startsWith('http') 
          ? this.data.coverBackground 
          : `${apiUrl}${this.data.coverBackground}`;
      }
      this.data.slides?.forEach((slide: any) => {
        this.slides.push(this.fb.group({
          slideNumber: [slide.slideNumber],
          layout: [slide.layout],
          productIds: [slide.productIds]
        }));
      });
    }
  }

  get slides() {
    return this.form.get('slides') as FormArray;
  }

  loadClients() {
    this.clientService.getAllClients().subscribe(clients => {
      this.clients = clients;
      this.cdr.detectChanges();
    });
  }

  loadEnquiries() {
    this.quotationsService.getAllEnquiries().subscribe(data => {
      this.enquiries = data;
      this.cdr.detectChanges();
    });
  }

  loadProducts() {
    this.catalogueService.getProducts().subscribe(data => {
      this.products = data;
      this.cdr.detectChanges();
    });
  }

  onClientChange(event: any) {
    const client = this.clients.find(c => c._id === event.value);
    if (client) {
      this.form.patchValue({ 
        clientName: `${client.companyName} - ${client.contactPerson}`
      });
    }
  }

  addSlide() {
    this.slides.push(this.fb.group({
      slideNumber: [this.slides.length + 2],
      layout: ['single'],
      productIds: [[], Validators.required]
    }));
  }

  removeSlide(index: number) {
    this.slides.removeAt(index);
  }

  onCoverImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.coverImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadCoverImage(): Promise<string | null> {
    if (!this.coverImageFile) return null;
    
    const formData = new FormData();
    formData.append('file', this.coverImageFile);
    
    try {
      const response: any = await this.http.post(`${getBrandConfig().app.apiUrl}/catalogue/upload`, formData).toPromise();
      return response.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  async save() {
    if (this.form.valid) {
      let formData = this.form.value;
      
      if (this.coverImageFile) {
        const uploadedUrl = await this.uploadCoverImage();
        if (uploadedUrl) {
          formData.coverBackground = uploadedUrl;
        }
      }
      
      const request = this.data
        ? this.quotationsService.updatePresentation(this.data._id, formData)
        : this.quotationsService.createPresentation(formData);

      request.subscribe(() => this.dialogRef.close(true));
    }
  }
}
