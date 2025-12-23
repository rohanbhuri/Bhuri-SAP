import { Routes } from '@angular/router';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { QuotationFormComponent } from './components/quotation-form/quotation-form.component';

export const QUOTATIONS_ROUTES: Routes = [
    { path: '', component: QuotationListComponent },
    { path: 'new', component: QuotationFormComponent },
    { path: ':id/edit', component: QuotationFormComponent }
];
