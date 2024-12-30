import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService) as AuthService;

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};