import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h1>Settings</h1>
        <p>Customize your exam experience and preferences</p>
      </div>

      <div class="settings-content">
        <!-- Exam Preferences -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>quiz</mat-icon>
              Exam Preferences
            </mat-card-title>
            <mat-card-subtitle>Configure your exam taking experience</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="examSettingsForm">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Auto-save answers</h3>
                  <p>Automatically save your answers while taking exams</p>
                </div>
                <mat-slide-toggle formControlName="autoSave" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Show timer</h3>
                  <p>Display remaining time during exams</p>
                </div>
                <mat-slide-toggle formControlName="showTimer" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Confirm before submit</h3>
                  <p>Ask for confirmation before submitting exam</p>
                </div>
                <mat-slide-toggle formControlName="confirmSubmit" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Question navigation</h3>
                  <p>Allow jumping between questions during exam</p>
                </div>
                <mat-slide-toggle formControlName="questionNavigation" color="primary"></mat-slide-toggle>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Notification Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications</mat-icon>
              Notifications
            </mat-card-title>
            <mat-card-subtitle>Manage your notification preferences</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="notificationSettingsForm">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Email notifications</h3>
                  <p>Receive exam updates and results via email</p>
                </div>
                <mat-slide-toggle formControlName="emailNotifications" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>New exam alerts</h3>
                  <p>Get notified when new exams are available</p>
                </div>
                <mat-slide-toggle formControlName="newExamAlerts" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Result notifications</h3>
                  <p>Get notified when exam results are published</p>
                </div>
                <mat-slide-toggle formControlName="resultNotifications" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Reminder notifications</h3>
                  <p>Receive reminders about upcoming exam deadlines</p>
                </div>
                <mat-slide-toggle formControlName="reminderNotifications" color="primary"></mat-slide-toggle>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Display Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>display_settings</mat-icon>
              Display & Accessibility
            </mat-card-title>
            <mat-card-subtitle>Customize the appearance and accessibility</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="displaySettingsForm">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Theme</h3>
                  <p>Choose your preferred color theme</p>
                </div>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="theme">
                    <mat-option value="light">Light</mat-option>
                    <mat-option value="dark">Dark</mat-option>
                    <mat-option value="auto">Auto (System)</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Font size</h3>
                  <p>Adjust text size for better readability</p>
                </div>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="fontSize">
                    <mat-option value="small">Small</mat-option>
                    <mat-option value="medium">Medium</mat-option>
                    <mat-option value="large">Large</mat-option>
                    <mat-option value="extra-large">Extra Large</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Language</h3>
                  <p>Select your preferred language</p>
                </div>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="language">
                    <mat-option value="en">English</mat-option>
                    <mat-option value="ar">العربية</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>High contrast mode</h3>
                  <p>Increase contrast for better visibility</p>
                </div>
                <mat-slide-toggle formControlName="highContrast" color="primary"></mat-slide-toggle>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Privacy Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>privacy_tip</mat-icon>
              Privacy & Security
            </mat-card-title>
            <mat-card-subtitle>Control your privacy and security settings</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="privacySettingsForm">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Share performance data</h3>
                  <p>Allow anonymous performance data to be used for improvements</p>
                </div>
                <mat-slide-toggle formControlName="sharePerformanceData" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Show in leaderboards</h3>
                  <p>Display your results in class leaderboards</p>
                </div>
                <mat-slide-toggle formControlName="showInLeaderboards" color="primary"></mat-slide-toggle>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Two-factor authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button mat-stroked-button color="primary">
                  <mat-icon>security</mat-icon>
                  Configure 2FA
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Save Settings -->
        <div class="save-actions">
          <button mat-button (click)="resetToDefaults()">
            <mat-icon>refresh</mat-icon>
            Reset to Defaults
          </button>
          <button mat-raised-button color="primary" (click)="saveSettings()" [disabled]="isSaving">
            <mat-icon>save</mat-icon>
            {{isSaving ? 'Saving...' : 'Save Settings'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 300;
      color: #333;
    }

    .page-header p {
      margin: 0;
      color: #666;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-card {
      width: 100%;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      min-height: 60px;
    }

    .setting-info {
      flex: 1;
      margin-right: 16px;
    }

    .setting-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .setting-info p {
      margin: 0;
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }

    mat-form-field {
      min-width: 150px;
    }

    mat-card-header mat-icon {
      margin-right: 8px;
      vertical-align: middle;
    }

    .save-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding: 24px 0;
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 16px;
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .setting-info {
        margin-right: 0;
      }

      .save-actions {
        flex-direction: column;
      }
    }
  `]
})
export class StudentSettingsComponent implements OnInit {
  examSettingsForm: FormGroup;
  notificationSettingsForm: FormGroup;
  displaySettingsForm: FormGroup;
  privacySettingsForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.examSettingsForm = this.fb.group({
      autoSave: [true],
      showTimer: [true],
      confirmSubmit: [true],
      questionNavigation: [true]
    });

    this.notificationSettingsForm = this.fb.group({
      emailNotifications: [true],
      newExamAlerts: [true],
      resultNotifications: [true],
      reminderNotifications: [false]
    });

    this.displaySettingsForm = this.fb.group({
      theme: ['light'],
      fontSize: ['medium'],
      language: ['en'],
      highContrast: [false]
    });

    this.privacySettingsForm = this.fb.group({
      sharePerformanceData: [false],
      showInLeaderboards: [true]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('studentSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.examSettingsForm.patchValue(settings.exam || {});
      this.notificationSettingsForm.patchValue(settings.notifications || {});
      this.displaySettingsForm.patchValue(settings.display || {});
      this.privacySettingsForm.patchValue(settings.privacy || {});
    }
  }

  saveSettings(): void {
    this.isSaving = true;

    const allSettings = {
      exam: this.examSettingsForm.value,
      notifications: this.notificationSettingsForm.value,
      display: this.displaySettingsForm.value,
      privacy: this.privacySettingsForm.value
    };

    // Save to localStorage (in real app, save to API)
    localStorage.setItem('studentSettings', JSON.stringify(allSettings));

    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Settings saved successfully!', 'Close', { duration: 3000 });
    }, 1000);
  }

  resetToDefaults(): void {
    this.examSettingsForm.reset({
      autoSave: true,
      showTimer: true,
      confirmSubmit: true,
      questionNavigation: true
    });

    this.notificationSettingsForm.reset({
      emailNotifications: true,
      newExamAlerts: true,
      resultNotifications: true,
      reminderNotifications: false
    });

    this.displaySettingsForm.reset({
      theme: 'light',
      fontSize: 'medium',
      language: 'en',
      highContrast: false
    });

    this.privacySettingsForm.reset({
      sharePerformanceData: false,
      showInLeaderboards: true
    });

    this.snackBar.open('Settings reset to defaults', 'Close', { duration: 3000 });
  }
}
