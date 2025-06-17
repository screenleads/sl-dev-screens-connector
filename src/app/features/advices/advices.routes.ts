import { Routes } from '@angular/router';

export const advicesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/advices/advices.page').then((m) => m.AdvicesPage),
    }
];
