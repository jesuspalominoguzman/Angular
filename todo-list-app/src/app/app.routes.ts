import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component'),
  },

  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component'),
  },

  {
    path: 'dashboard',

    loadComponent: () =>
      import('./todo-list/pages/dashboard-page/dashboard-page.component'),
    canActivate: [authGuard],

    children: [
      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./todo-list/pages/tasks-page/tasks-page.component'),
      },

      {
        path: '**',
        redirectTo: 'tasks',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
