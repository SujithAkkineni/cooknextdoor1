import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;

          // Handle demo mode response
          if (response.demo) {
            this.snackBar.open(response.message || 'Demo registration successful!', 'Close', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
          }

          // Store user data for demo mode
          if (response.demo && typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('userRole', response.user.role);
          }

          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Registration error:', error);
          this.snackBar.open(
            error.error?.message || 'Registration failed. Please try again.',
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }
}
