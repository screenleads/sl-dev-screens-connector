import { Routes } from '@angular/router';

export const loadingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/loading/loading.page').then((m) => m.LoadingPage),
  }
];
