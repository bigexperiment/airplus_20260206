import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    // Wait for auth to initialize (important for page refresh)
    await this.authService.waitForInit();

    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    return this.router.createUrlTree(['/admin/login']);
  }
}
