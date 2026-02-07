import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AdminUser } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  isScrolled = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll')
  checkScroll(): void {
    this.isScrolled = window.scrollY > 40;
  }

  get currentUser(): AdminUser | null {
    return this.authService.getCurrentUser();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
