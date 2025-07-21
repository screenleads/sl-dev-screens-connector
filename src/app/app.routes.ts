import { Routes } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    loadChildren: () => import('./features/login/login.routes').then(feature => feature.loginRoutes),
  },
  {
    path: 'loading',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/loading/loading.routes').then(feature => feature.loadingRoutes),
  },
  {
    path: 'connect',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/connection/connection.routes').then(feature => feature.connectionRoutes),
  },
  {
    path: 'advices',
    // do not use loadComponent here as you do not want to leak the internals of your feature into your app
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/advices/advices.routes').then(feature => feature.advicesRoutes),
  },
];
