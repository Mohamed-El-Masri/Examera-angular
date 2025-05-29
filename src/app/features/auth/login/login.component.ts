import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LoginUserDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header class="header">
          <div class="logo">
            <mat-icon class="logo-icon">school</mat-icon>
            <h1>Examera</h1>
          </div>
          <p class="subtitle">Online Examination System</p>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Enter your username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'"
                     formControlName="password" placeholder="Enter your password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword"
                      type="button" [attr.aria-label]="'Hide password'">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width login-button" [disabled]="loginForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading" color="accent"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="actions">
          <p>Don't have an account?
            <a routerLink="/auth/register" class="register-link">Sign up here</a>
          </p>
        </mat-card-actions>
      </mat-card>

      <div class="demo-credentials">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Demo Credentials</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="credential-item">
              <strong>Admin:</strong><br>
              Username: admin<br>
              Password: Admin&#64;123
            </div>
            <div class="credential-item">
              <strong>Student:</strong><br>
              Register as a new student
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      gap: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border-radius: 16px;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .logo-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #667eea;
    }

    .logo h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 300;
      color: #333;
    }

    .subtitle {
      color: #666;
      margin: 0;
      font-size: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
      height: 48px;
      margin-top: 16px;
      font-size: 16px;
      font-weight: 500;
    }

    .actions {
      text-align: center;
      padding-top: 16px;
    }

    .actions p {
      margin: 0;
      color: #666;
    }

    .register-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      max-width: 300px;
    }

    .demo-credentials mat-card {
      background: rgba(255,255,255,0.95);
    }

    .credential-item {
      margin-bottom: 16px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 14px;
    }

    .credential-item:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }
      
      .demo-credentials {
        max-width: 400px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginDto: LoginUserDto = this.loginForm.value;

      this.authService.login(loginDto).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
            this.redirectBasedOnRole();
          } else {
            this.snackBar.open(response.message || 'Login failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isStudent()) {
      this.router.navigate(['/student/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
