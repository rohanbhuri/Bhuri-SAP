import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

export const CATALOGUE_ROUTES: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'new', component: ProductFormComponent },
    { path: ':id/edit', component: ProductFormComponent }
];
