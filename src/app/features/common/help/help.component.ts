import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  title: string;
  icon: string;
  description: string;
  items: string[];
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <div class="help-container">
      <div class="page-header">
        <h1>Help & Support</h1>
        <p>Find answers to common questions and get help with using Examera</p>
      </div>

      <!-- Quick Help Categories -->
      <div class="help-categories">
        <mat-card class="category-card" *ngFor="let category of helpCategories">
          <mat-card-header>
            <mat-icon mat-card-avatar>{{category.icon}}</mat-icon>
            <mat-card-title>{{category.title}}</mat-card-title>
            <mat-card-subtitle>{{category.description}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <ul class="help-list">
              <li *ngFor="let item of category.items">{{item}}</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- FAQ Section -->
      <mat-card class="faq-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>help_outline</mat-icon>
            Frequently Asked Questions
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-accordion>
            <mat-expansion-panel *ngFor="let faq of faqItems" class="faq-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>{{faq.question}}</mat-panel-title>
                <mat-panel-description>{{faq.category}}</mat-panel-description>
              </mat-expansion-panel-header>
              <p>{{faq.answer}}</p>
            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
      </mat-card>

      <!-- Contact Support -->
      <mat-card class="contact-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>support_agent</mat-icon>
            Need More Help?
          </mat-card-title>
          <mat-card-subtitle>Contact our support team for personalized assistance</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="contact-options">
            <div class="contact-option">
              <mat-icon>email</mat-icon>
              <div class="contact-info">
                <h3>Email Support</h3>
                <p>support&#64;examera.com</p>
                <small>Response within 24 hours</small>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="contact-option">
              <mat-icon>phone</mat-icon>
              <div class="contact-info">
                <h3>Phone Support</h3>
                <p>+1 (555) 123-4567</p>
                <small>Mon-Fri, 9 AM - 6 PM</small>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="contact-option">
              <mat-icon>chat</mat-icon>
              <div class="contact-info">
                <h3>Live Chat</h3>
                <p>Available during business hours</p>
                <button mat-raised-button color="primary">
                  <mat-icon>chat</mat-icon>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- System Information -->
      <mat-card class="system-info-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            System Information
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">Version:</span>
              <span class="info-value">Examera v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Updated:</span>
              <span class="info-value">{{lastUpdated | date:'medium'}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Browser:</span>
              <span class="info-value">{{getBrowserInfo()}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Platform:</span>
              <span class="info-value">{{getPlatformInfo()}}</span>
            </div>
          </div>

          <div class="system-actions">
            <button mat-button (click)="checkForUpdates()">
              <mat-icon>system_update</mat-icon>
              Check for Updates
            </button>
            <button mat-button (click)="downloadLogs()">
              <mat-icon>download</mat-icon>
              Download Logs
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Useful Links -->
      <mat-card class="links-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>link</mat-icon>
            Useful Links
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="useful-links">
            <a mat-stroked-button href="#" target="_blank">
              <mat-icon>description</mat-icon>
              User Manual
            </a>
            <a mat-stroked-button href="#" target="_blank">
              <mat-icon>video_library</mat-icon>
              Video Tutorials
            </a>
            <a mat-stroked-button href="#" target="_blank">
              <mat-icon>forum</mat-icon>
              Community Forum
            </a>
            <a mat-stroked-button href="#" target="_blank">
              <mat-icon>bug_report</mat-icon>
              Report a Bug
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .help-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      margin-bottom: 32px;
      text-align: center;
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

    .help-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .category-card {
      height: 100%;
    }

    .help-list {
      margin: 0;
      padding-left: 20px;
    }

    .help-list li {
      margin-bottom: 8px;
      color: #666;
    }

    .faq-card,
    .contact-card,
    .system-info-card,
    .links-card {
      margin-bottom: 24px;
    }

    .faq-panel {
      margin-bottom: 8px;
    }

    .contact-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .contact-option {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 0;
    }

    .contact-option mat-icon {
      color: #667eea;
      margin-top: 4px;
    }

    .contact-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .contact-info p {
      margin: 0 0 4px 0;
      font-weight: 500;
      color: #333;
    }

    .contact-info small {
      color: #666;
    }

    .system-info {
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-label {
      font-weight: 500;
      color: #666;
    }

    .info-value {
      color: #333;
    }

    .system-actions {
      display: flex;
      gap: 16px;
    }

    .useful-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .useful-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    mat-card-header mat-icon {
      margin-right: 8px;
      vertical-align: middle;
    }

    @media (max-width: 768px) {
      .help-container {
        padding: 16px;
      }

      .help-categories {
        grid-template-columns: 1fr;
      }

      .system-actions {
        flex-direction: column;
      }

      .useful-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HelpComponent {
  lastUpdated = new Date();

  helpCategories: HelpCategory[] = [
    {
      title: 'Getting Started',
      icon: 'play_circle',
      description: 'Learn the basics of using Examera',
      items: [
        'How to log in to your account',
        'Navigating the dashboard',
        'Finding available exams',
        'Understanding your profile'
      ]
    },
    {
      title: 'Taking Exams',
      icon: 'quiz',
      description: 'Everything about exam taking',
      items: [
        'Starting an exam',
        'Navigating between questions',
        'Saving your answers',
        'Submitting your exam'
      ]
    },
    {
      title: 'Results & Grades',
      icon: 'grade',
      description: 'Understanding your performance',
      items: [
        'Viewing your results',
        'Understanding score calculations',
        'Reviewing incorrect answers',
        'Tracking your progress'
      ]
    },
    {
      title: 'Account Settings',
      icon: 'settings',
      description: 'Manage your account preferences',
      items: [
        'Updating your profile',
        'Changing your password',
        'Setting notifications',
        'Customizing your experience'
      ]
    }
  ];

  faqItems: FAQItem[] = [
    {
      question: 'How do I start taking an exam?',
      answer: 'To start an exam, go to the "Available Exams" section from your dashboard, find the exam you want to take, and click the "Start Exam" button. Make sure you have enough time to complete the exam before starting.',
      category: 'Exams'
    },
    {
      question: 'Can I save my progress during an exam?',
      answer: 'Yes, your answers are automatically saved as you progress through the exam. You can also manually save by clicking the save button. However, once you submit the exam, you cannot make any changes.',
      category: 'Exams'
    },
    {
      question: 'What happens if I lose internet connection during an exam?',
      answer: 'If you lose internet connection, your progress is saved locally. When you reconnect, you can continue from where you left off. However, the timer continues running, so try to maintain a stable connection.',
      category: 'Technical'
    },
    {
      question: 'How are my exam scores calculated?',
      answer: 'Your score is calculated based on the number of correct answers divided by the total number of questions, multiplied by 100. Some questions may have different point values, which will be clearly indicated.',
      category: 'Results'
    },
    {
      question: 'Can I retake an exam?',
      answer: 'Exam retake policies depend on your instructor\'s settings. Some exams allow multiple attempts, while others are one-time only. Check the exam details before starting.',
      category: 'Exams'
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to your Profile page and scroll down to the "Change Password" section. Enter your current password and your new password twice, then click "Change Password".',
      category: 'Account'
    },
    {
      question: 'Why can\'t I see my exam results?',
      answer: 'Exam results are published by your instructor after grading is complete. You will receive a notification when results are available. Check the "My Results" section regularly.',
      category: 'Results'
    },
    {
      question: 'How do I contact technical support?',
      answer: 'You can contact technical support through email at support&#64;examera.com, phone at +1 (555) 123-4567, or use the live chat feature available during business hours.',
      category: 'Support'
    }
  ];

  getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Google Chrome';
    if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Microsoft Edge';
    return 'Unknown Browser';
  }

  getPlatformInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    return 'Unknown Platform';
  }

  checkForUpdates(): void {
    // Simulate checking for updates
    alert('You are using the latest version of Examera!');
  }

  downloadLogs(): void {
    // Simulate downloading logs
    alert('System logs downloaded successfully!');
  }
}
