import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.loading = true;
    try {
      await this.authService.signInWithGoogle();
      // User will be redirected to Google, then back to /admin/auth/callback
    } catch (error: any) {
      console.error('Login error:', error);
      this.snackBar.open('Failed to initiate Google login. Please try again.', 'Close', { duration: 3000 });
      this.loading = false;
    }
  }
}
