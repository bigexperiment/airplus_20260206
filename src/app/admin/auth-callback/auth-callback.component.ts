import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="callback-page">
      <div class="callback-container">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Verifying your access...</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .callback-container {
      text-align: center;
      color: white;
      p {
        margin-top: 20px;
        font-size: 1.2rem;
      }
    }
    ::ng-deep .callback-container .mat-mdc-progress-spinner circle {
      stroke: white !important;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const isAllowed = await this.authService.handleAuthCallback();

      if (isAllowed) {
        this.snackBar.open('Welcome back! Access granted.', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.snackBar.open('Access denied. Your email is not authorized.', 'Close', { duration: 5000 });
        await this.authService.logout();
        this.router.navigate(['/admin/login']);
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      this.snackBar.open('Authentication failed. Please try again.', 'Close', { duration: 3000 });
      this.router.navigate(['/admin/login']);
    }
  }
}

