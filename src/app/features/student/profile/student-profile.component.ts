import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UserDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="profile-container">
      <div class="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div class="profile-content">
        <mat-card class="profile-card">
          <mat-card-header>
            <div class="profile-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="profile-info">
              <mat-card-title>{{currentUser?.firstName}} {{currentUser?.lastName}}</mat-card-title>
              <mat-card-subtitle>{{currentUser?.username}} • Student</mat-card-subtitle>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName">
                  <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                    First name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName">
                  <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                    Last name is required
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" readonly>
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="profileForm.invalid || isUpdating">
                  <mat-icon>save</mat-icon>
                  Update Profile
                </button>
                <button mat-button type="button" (click)="resetForm()">
                  <mat-icon>refresh</mat-icon>
                  Reset
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card class="password-card">
          <mat-card-header>
            <mat-card-title>Change Password</mat-card-title>
            <mat-card-subtitle>Update your account password</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Current Password</mat-label>
                <input matInput [type]="hideCurrentPassword ? 'password' : 'text'" 
                       formControlName="currentPassword">
                <button mat-icon-button matSuffix 
                        (click)="hideCurrentPassword = !hideCurrentPassword" type="button">
                  <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                  Current password is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>New Password</mat-label>
                <input matInput [type]="hideNewPassword ? 'password' : 'text'" 
                       formControlName="newPassword">
                <button mat-icon-button matSuffix 
                        (click)="hideNewPassword = !hideNewPassword" type="button">
                  <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                  New password is required
                </mat-error>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirm New Password</mat-label>
                <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" 
                       formControlName="confirmPassword">
                <button mat-icon-button matSuffix 
                        (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                  <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                  Please confirm your new password
                </mat-error>
                <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                  Passwords do not match
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="accent" type="submit" 
                        [disabled]="passwordForm.invalid || isChangingPassword">
                  <mat-icon>lock</mat-icon>
                  Change Password
                </button>
                <button mat-button type="button" (click)="resetPasswordForm()">
                  <mat-icon>clear</mat-icon>
                  Clear
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 300;
      color: #333;
    }

    .page-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .profile-card mat-card-header {
      margin-bottom: 24px;
    }

    .profile-avatar {
      margin-right: 16px;
    }

    .profile-avatar mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #666;
    }

    .profile-info {
      flex: 1;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }

    .form-actions button {
      height: 48px;
    }

    .password-card {
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: UserDto | null = null;
  
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isUpdating = false;
  isChangingPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        username: this.currentUser.username,
        email: this.currentUser.email
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      
      // In a real app, call profile update service
      setTimeout(() => {
        this.isUpdating = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      
      // In a real app, call password change service
      setTimeout(() => {
        this.isChangingPassword = false;
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
        this.resetPasswordForm();
      }, 1000);
    }
  }

  resetForm(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        username: this.currentUser.username,
        email: this.currentUser.email
      });
    }
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
  }
}
