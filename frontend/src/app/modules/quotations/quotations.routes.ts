import { Routes } from '@angular/router';
import { QuotationsComponent } from './quotations.component';
import { QuotationFormComponent } from './components/quotation-form/quotation-form.component';

export const QUOTATIONS_ROUTES: Routes = [
    { 
        path: '', 
        component: QuotationsComponent,
        children: [
            { path: 'new', component: QuotationFormComponent },
            { path: ':id/edit', component: QuotationFormComponent }
        ]
    }
];
