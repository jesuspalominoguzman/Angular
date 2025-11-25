import { inject } from '@angular/core';
import { AuthService } from '../todo-list/services/auth.service';
import { Router } from '@angular/router';

/**
 * Guard that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};
