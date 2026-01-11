import { Routes } from '@angular/router';
import { QuotationsComponent } from './quotations.component';
import { QuotationFormComponent } from './components/quotation-form/quotation-form.component';
import { QuotationsApiDocsComponent } from './pages/api-docs-page.component';

export const QUOTATIONS_ROUTES: Routes = [
    { 
        path: '', 
        component: QuotationsComponent,
        children: [
            { path: 'new', component: QuotationFormComponent },
            { path: ':id/edit', component: QuotationFormComponent }
        ]
    },
    { path: 'api-doc', component: QuotationsApiDocsComponent }
];
