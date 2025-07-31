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
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/loading/loading.routes').then(m => m.loadingRoutes),
  },
  {
    path: 'connect',
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/connection/connection.routes').then(m => m.connectionRoutes),
  },
  {
    path: 'advices',
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/advices/advices.routes').then(m => m.advicesRoutes),
  },
  // {
  //   path: 'not-found',
  //   loadComponent: () => import('./shared/pages/not-found.page').then(m => m.NotFoundPage),
  // },
  {
    path: '**',
    redirectTo: 'not-found',
  }
];
