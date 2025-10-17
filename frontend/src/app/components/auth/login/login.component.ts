import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;

          // Handle demo mode response
          if (response.demo) {
            this.snackBar.open(response.message || 'Demo login successful!', 'Close', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          }

          // Store authentication data
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('userRole', response.user.role);

          // Redirect based on role
          const role = response.user.role;
          if (role === 'seller') {
            this.router.navigate(['/seller-dashboard']);
          } else {
            this.router.navigate(['/buyer-dashboard']);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Login error:', error);
          this.snackBar.open(
            error.error?.message || 'Login failed. Please check your credentials.',
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }
}
