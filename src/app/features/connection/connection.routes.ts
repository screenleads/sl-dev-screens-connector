import { Routes } from '@angular/router';

export const connectionRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/connection/connection.page').then((m) => m.ConnectionPage),
    }
];
