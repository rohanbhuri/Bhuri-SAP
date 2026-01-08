import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { QuotationsService } from '../../quotations.service';

@Component({
    selector: 'app-enhanced-quotation-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule
    ],
    template: `
    <div class="container">
      <div class="header">
        <h1>Enhanced Quotation</h1>
        <div class="actions">
          <button mat-button routerLink="../../">Cancel</button>
          <button mat-raised-button color="primary" (click)="saveDraft()" [disabled]="quoteForm.invalid">
            Save Draft
          </button>
          <button mat-raised-button color="accent" (click)="sendForApproval()" 
                  [disabled]="quoteForm.invalid || !hasItems()">
            Send for Approval
          </button>
        </div>
      </div>
      
      <form [formGroup]="quoteForm" class="form-container">
        
        <!-- Client Information -->
        <mat-card class="section">
          <mat-card-header>
            <mat-card-title>Client Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Client Name</mat-label>
                <input matInput formControlName="clientName" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Client Email</mat-label>
                <input matInput type="email" formControlName="clientEmail" required>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Items Section -->
        <mat-card class="section">
          <mat-card-header>
            <mat-card-title>Items</mat-card-title>
            <div class="header-actions">
              <button type="button" mat-button (click)="addCustomItem()">
                <mat-icon>add</mat-icon>
                Add Item
              </button>
            </div>
          </mat-card-header>
          
          <mat-card-content>
            <div formArrayName="items" class="items-container">
              <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="item-row">
                <div class="item-fields">
                  <mat-form-field appearance="outline">
                    <mat-label>Product/Service</mat-label>
                    <input matInput formControlName="productName" required>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Quantity</mat-label>
                    <input matInput type="number" formControlName="quantity" min="1" required>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Unit Price</mat-label>
                    <input matInput type="number" formControlName="unitPrice" min="0" step="0.01" required>
                  </mat-form-field>
                  
                  <div class="item-total">
                    \${{getItemTotal(i)}}
                  </div>
                  
                  <button type="button" mat-icon-button color="warn" (click)="removeItem(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span class="amount">\${{calculateSubtotal()}}</span>
              </div>
              <div class="total-row">
                <span>Tax (18%):</span>
                <span class="amount">\${{calculateTax()}}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span class="amount">\${{calculateGrandTotal()}}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </form>
    </div>
  `,
    styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      gap: 1rem;
    }
    .section {
      margin-bottom: 2rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-row mat-form-field {
      flex: 1;
    }
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    .item-row {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .item-fields {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .item-fields mat-form-field {
      flex: 1;
    }
    .item-total {
      font-weight: bold;
      min-width: 80px;
      text-align: right;
    }
    .totals {
      border-top: 2px solid #ddd;
      padding-top: 1rem;
      margin-top: 2rem;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .grand-total {
      font-weight: bold;
      font-size: 1.2em;
      border-top: 1px solid #ddd;
      padding-top: 0.5rem;
    }
    .amount {
      font-family: monospace;
    }
  `]
})
export class EnhancedQuotationFormComponent implements OnInit {
    quoteForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private quotationsService: QuotationsService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.quoteForm = this.fb.group({
            clientName: ['', Validators.required],
            clientEmail: ['', [Validators.required, Validators.email]],
            currency: ['USD'],
            items: this.fb.array([])
        });
    }

    ngOnInit() {
        this.addCustomItem();
    }

    get items() {
        return this.quoteForm.get('items') as FormArray;
    }

    createItem() {
        return this.fb.group({
            productName: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            unitPrice: [0, [Validators.required, Validators.min(0)]]
        });
    }

    addCustomItem() {
        this.items.push(this.createItem());
    }

    removeItem(index: number) {
        this.items.removeAt(index);
    }

    hasItems(): boolean {
        return this.items.length > 0;
    }

    getItemTotal(index: number): number {
        const item = this.items.at(index);
        const quantity = item.get('quantity')?.value || 0;
        const unitPrice = item.get('unitPrice')?.value || 0;
        return quantity * unitPrice;
    }

    calculateSubtotal(): number {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.getItemTotal(i);
        }
        return total;
    }

    calculateTax(): number {
        return this.calculateSubtotal() * 0.18;
    }

    calculateGrandTotal(): number {
        return this.calculateSubtotal() + this.calculateTax();
    }

    saveDraft() {
        if (this.quoteForm.valid) {
            const payload = {
                ...this.quoteForm.value,
                subtotal: this.calculateSubtotal(),
                taxTotal: this.calculateTax(),
                grandTotal: this.calculateGrandTotal(),
                status: 'DRAFT'
            };

            this.quotationsService.createQuotation(payload).subscribe({
                next: () => {
                    this.snackBar.open('Quotation saved as draft', 'Close', { duration: 3000 });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: () => {
                    this.snackBar.open('Failed to save quotation', 'Close', { duration: 3000 });
                }
            });
        }
    }

    sendForApproval() {
        if (this.quoteForm.valid && this.hasItems()) {
            const payload = {
                ...this.quoteForm.value,
                subtotal: this.calculateSubtotal(),
                taxTotal: this.calculateTax(),
                grandTotal: this.calculateGrandTotal(),
                status: 'SENT'
            };

            this.quotationsService.createQuotation(payload).subscribe({
                next: (quotation) => {
                    this.quotationsService.sendQuotation(quotation._id, 'email').subscribe({
                        next: () => {
                            this.snackBar.open('Quotation sent successfully!', 'Close', { duration: 5000 });
                            this.router.navigate(['../../'], { relativeTo: this.route });
                        },
                        error: () => {
                            this.snackBar.open('Quotation created but email failed', 'Close', { duration: 3000 });
                            this.router.navigate(['../../'], { relativeTo: this.route });
                        }
                    });
                },
                error: () => {
                    this.snackBar.open('Failed to create quotation', 'Close', { duration: 3000 });
                }
            });
        }
    }
}