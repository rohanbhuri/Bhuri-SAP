import { Routes } from '@angular/router';

export const CLIENT_PORTAL_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/client-dashboard/client-dashboard.component')
            .then(m => m.ClientDashboardComponent)
    },
    {
        path: 'quotations',
        loadComponent: () => import('./components/client-quotations/client-quotations.component')
            .then(m => m.ClientQuotationsComponent)
    },
    {
        path: 'quotations/:id',
        loadComponent: () => import('./components/quotation-view/quotation-view.component')
            .then(m => m.QuotationViewComponent)
    }
];
