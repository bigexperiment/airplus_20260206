import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
