import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AdminUser } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  mobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get currentUser(): AdminUser | null {
    return this.authService.getCurrentUser();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
