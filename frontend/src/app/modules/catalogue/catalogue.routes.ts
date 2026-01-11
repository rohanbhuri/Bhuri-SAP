import { Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueApiDocsComponent } from './pages/api-docs-page.component';

export const CATALOGUE_ROUTES: Routes = [
    { path: '', component: CatalogueComponent },
    { path: 'api-doc', component: CatalogueApiDocsComponent }
];
