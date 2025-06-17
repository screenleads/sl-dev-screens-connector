import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    loadChildren: () => import('./features/loading/loading.routes').then(feature => feature.loadingRoutes),
  },
  {
    path: 'connect',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    loadChildren: () => import('./features/connection/connection.routes').then(feature => feature.connectionRoutes),
  },
  {
    path: 'advices',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    loadChildren: () => import('./features/advices/advices.routes').then(feature => feature.advicesRoutes),
  },
];
