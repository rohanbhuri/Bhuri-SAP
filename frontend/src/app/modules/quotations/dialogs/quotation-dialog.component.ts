import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { QuotationsService } from '../quotations.service';
import { ClientManagementService } from '../../client-management/services/client-management.service';
import { CatalogueService } from '../../catalogue/catalogue.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-quotation-dialog',
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
    MatAutocompleteModule
  ],
  template: `
    <h2 mat-dialog-title>Create Manual Quotation</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Search Client</mat-label>
          <input matInput formControlName="clientSearch" [matAutocomplete]="autoClient" placeholder="Type to search...">
          <mat-autocomplete #autoClient="matAutocomplete" (optionSelected)="onClientSelected($event)" [displayWith]="displayClient">
            <mat-option *ngFor="let client of filteredClients | async" [value]="client">
              {{ client.companyName }} - {{ client.email }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>

        <h3>Items</h3>
        <div formArrayName="items">
          <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="item-row">
            <mat-form-field appearance="outline">
              <mat-label>Search Product</mat-label>
              <input matInput formControlName="productSearch" [matAutocomplete]="autoProduct" placeholder="Type to search...">
              <mat-autocomplete #autoProduct="matAutocomplete" (optionSelected)="onProductSelected(i, $event)" [displayWith]="displayProduct">
                <mat-option *ngFor="let product of getFilteredProducts(i) | async" [value]="product">
                  {{ product.name }} - {{ product.basePrice | currency }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Quantity</mat-label>
              <input matInput type="number" formControlName="quantity" min="1" required>
            </mat-form-field>

            <button mat-icon-button color="warn" type="button" (click)="removeItem(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <button mat-button type="button" (click)="addItem()">
          <mat-icon>add</mat-icon>
          Add Item
        </button>

        <div class="totals" *ngIf="items.length > 0">
          <p>Subtotal: {{ calculateSubtotal() | currency }}</p>
          <p>Tax (18%): {{ calculateTax() | currency }}</p>
          <p><strong>Total: {{ calculateTotal() | currency }}</strong></p>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!selectedClient || items.length === 0">
        Create Quotation
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { min-width: 500px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .item-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .item-row mat-form-field { flex: 1; }
    .totals { margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px; }
    h3 { margin: 16px 0 8px; }
  `]
})
export class QuotationDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<QuotationDialogComponent>);
  private fb = inject(FormBuilder);
  private quotationsService = inject(QuotationsService);
  private clientService = inject(ClientManagementService);
  private catalogueService = inject(CatalogueService);

  form: FormGroup;
  clients: any[] = [];
  products: any[] = [];
  filteredClients!: Observable<any[]>;
  selectedClient: any = null;

  constructor() {
    this.form = this.fb.group({
      clientSearch: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadProducts();
    this.addItem();
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.group({
      productSearch: [''],
      productId: [''],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  loadClients() {
    this.clientService.getAllClients().subscribe((clients: any) => {
      this.clients = clients;
      this.filteredClients = this.form.get('clientSearch')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterClients(typeof value === 'string' ? value : value?.companyName || ''))
      );
    });
  }

  loadProducts() {
    this.catalogueService.getProducts().subscribe((products: any) => {
      this.products = products;
    });
  }

  private _filterClients(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client => 
      client.companyName?.toLowerCase().includes(filterValue) || 
      client.email?.toLowerCase().includes(filterValue)
    ).slice(0, 50);
  }

  private _filterProducts(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => 
      product.name?.toLowerCase().includes(filterValue) ||
      product.sku?.toLowerCase().includes(filterValue)
    ).slice(0, 50);
  }

  getFilteredProducts(index: number): Observable<any[]> {
    const item = this.items.at(index);
    return item.get('productSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProducts(typeof value === 'string' ? value : value?.name || ''))
    );
  }

  displayClient(client: any): string {
    return client ? `${client.companyName} - ${client.email}` : '';
  }

  displayProduct(product: any): string {
    return product ? product.name : '';
  }

  onClientSelected(event: any) {
    this.selectedClient = event.option.value;
  }

  onProductSelected(index: number, event: any) {
    const product = event.option.value;
    this.items.at(index).patchValue({ productId: product._id });
  }

  calculateSubtotal(): number {
    let total = 0;
    this.items.controls.forEach(item => {
      const productId = item.get('productId')?.value;
      const quantity = item.get('quantity')?.value || 0;
      const product = this.products.find(p => p._id === productId);
      if (product) {
        total += product.basePrice * quantity;
      }
    });
    return total;
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.18;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  save() {
    if (this.selectedClient && this.items.length > 0) {
      const quotationItems = this.items.controls
        .filter(item => item.get('productId')?.value)
        .map(item => {
          const productId = item.get('productId')?.value;
          const quantity = item.get('quantity')?.value;
          const product = this.products.find(p => p._id === productId);
          return {
            productId,
            productName: product?.name || '',
            quantity,
            unitPrice: product?.basePrice || 0,
            total: (product?.basePrice || 0) * quantity
          };
        });

      const quotation = {
        clientId: this.selectedClient._id,
        clientName: this.selectedClient.companyName,
        clientEmail: this.selectedClient.email,
        items: quotationItems,
        subtotal: this.calculateSubtotal(),
        taxTotal: this.calculateTax(),
        discountTotal: 0,
        grandTotal: this.calculateTotal(),
        currency: 'USD',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      this.quotationsService.createQuotation(quotation).subscribe({
        next: (result) => this.dialogRef.close(result),
        error: (err: any) => console.error('Failed to create quotation', err)
      });
    }
  }
}
