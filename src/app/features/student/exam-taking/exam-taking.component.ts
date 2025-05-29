import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExamService } from '../../../core/services/exam.service';
import { Exam, Question, SubmitExamDto, SubmitAnswerDto } from '../../../core/models/exam.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-exam-taking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  template: `
    <div class="exam-taking-container" *ngIf="exam">
      <!-- Professional Timer Header -->
      <mat-card class="timer-card elevation-4">
        <div class="timer-content">
          <div class="exam-title-section">
            <h2 class="exam-title">{{exam.title}}</h2>
            <span class="question-counter">Question {{currentQuestionIndex + 1}} of {{exam.questions.length}}</span>
          </div>
          
          <div class="timer-section" [class.warning]="timeWarning" [class.critical]="timeCritical">
            <mat-icon class="timer-icon">schedule</mat-icon>
            <div class="time-info">
              <span class="time-display">{{formatTime(remainingTime)}}</span>
              <span class="time-label">Remaining</span>
            </div>
          </div>
        </div>
        
        <mat-progress-bar 
          [value]="getProgressPercentage()"
          color="primary"
          class="progress-bar">
        </mat-progress-bar>
      </mat-card>

      <!-- Professional Question Content -->
      <mat-card class="question-card elevation-2">
        <mat-card-header class="question-header">
          <div class="question-title-section">
            <mat-card-title class="question-title">Question {{currentQuestionIndex + 1}}</mat-card-title>
            <mat-card-subtitle class="question-subtitle">
              <span class="score-badge">{{currentQuestion.score}} Points</span>
            </mat-card-subtitle>
          </div>
        </mat-card-header>

        <mat-card-content class="question-content">
          <form [formGroup]="examForm" class="question-form">
            <div class="question-text-container">
              <p class="question-text">{{currentQuestion.text}}</p>
            </div>

            <!-- Multiple Choice Questions -->
            <div *ngIf="currentQuestion.type === 0" class="options-container">
              <mat-radio-group [formControlName]="'question_' + currentQuestion.id" class="professional-radio-group">
                <mat-radio-button 
                  *ngFor="let option of currentQuestion.options; let i = index"
                  [value]="option"
                  class="professional-radio-option">
                  <span class="option-label">{{option}}</span>
                </mat-radio-button>
              </mat-radio-group>
              <div class="validation-message" *ngIf="!isQuestionAnswered(currentQuestion.id) && showValidation">
                <mat-icon class="warning-icon">warning</mat-icon>
                <span>Please select an answer to proceed.</span>
              </div>
            </div>

            <!-- True/False Questions -->
            <div *ngIf="currentQuestion.type === 1" class="options-container">
              <mat-radio-group [formControlName]="'question_' + currentQuestion.id" class="professional-radio-group boolean-options">
                <mat-radio-button value="True" class="professional-radio-option boolean-option">
                  <span class="option-label">True</span>
                </mat-radio-button>
                <mat-radio-button value="False" class="professional-radio-option boolean-option">
                  <span class="option-label">False</span>
                </mat-radio-button>
              </mat-radio-group>
              <div class="validation-message" *ngIf="!isQuestionAnswered(currentQuestion.id) && showValidation">
                <mat-icon class="warning-icon">warning</mat-icon>
                <span>Please select either True or False.</span>
              </div>
            </div>

            <!-- Short Answer Questions -->
            <div *ngIf="currentQuestion.type === 2" class="text-answer-container">
              <mat-form-field appearance="outline" class="professional-textarea">
                <mat-label>Your Response</mat-label>
                <textarea matInput 
                  [formControlName]="'question_' + currentQuestion.id"
                  rows="6"
                  placeholder="Please provide your detailed answer here..."
                  [class.error]="!isQuestionAnswered(currentQuestion.id) && showValidation">
                </textarea>
                <mat-hint class="character-count">Minimum 10 characters recommended</mat-hint>
                <mat-error *ngIf="!isQuestionAnswered(currentQuestion.id) && showValidation">
                  A response is required to proceed.
                </mat-error>
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions class="question-actions">
          <div class="action-group left-actions">
            <button mat-stroked-button 
              (click)="previousQuestion()" 
              [disabled]="currentQuestionIndex === 0"
              class="nav-button">
              <mat-icon>chevron_left</mat-icon>
              Previous
            </button>
          </div>

          <div class="action-group center-actions">
            <button mat-raised-button 
              color="accent"
              (click)="saveAndNext()"
              class="save-button">
              <mat-icon>save</mat-icon>
              Save Answer
            </button>
          </div>

          <div class="action-group right-actions">
            <button mat-stroked-button 
              (click)="nextQuestion()" 
              [disabled]="currentQuestionIndex === exam.questions.length - 1"
              class="nav-button">
              Next
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </mat-card-actions>
      </mat-card>

      <!-- Professional Question Navigation -->
      <mat-card class="navigation-card elevation-2">
        <mat-card-header>
          <mat-card-title class="navigation-title">Question Overview</mat-card-title>
          <mat-card-subtitle>Click on any question number to navigate directly</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="question-grid">
            <button 
              *ngFor="let question of exam.questions; let i = index"
              mat-mini-fab
              [color]="getQuestionButtonColor(i, question.id)"
              (click)="goToQuestion(i)"
              class="question-nav-button"
              [class.current]="i === currentQuestionIndex"
              [class.answered]="isQuestionAnswered(question.id)"
              [attr.aria-label]="'Navigate to question ' + (i + 1)">
              {{i + 1}}
            </button>
          </div>
          
          <div class="navigation-legend">
            <div class="legend-item">
              <div class="legend-indicator current"></div>
              <span>Current</span>
            </div>
            <div class="legend-item">
              <div class="legend-indicator answered"></div>
              <span>Answered</span>
            </div>
            <div class="legend-item">
              <div class="legend-indicator unanswered"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Professional Submit Section -->
      <div class="submit-section">
        <mat-card class="submit-card elevation-3">
          <mat-card-content>
            <div class="submit-content">
              <div class="submit-info">
                <h3>Ready to Submit?</h3>
                <p>Please review your answers before final submission. This action cannot be undone.</p>
                <div class="answer-summary">
                  <span class="answered-count">{{getAnsweredCount()}} of {{exam.questions.length}} questions answered</span>
                </div>
              </div>
              <button mat-raised-button 
                color="warn" 
                (click)="onSubmitExam()"
                [disabled]="isSubmitting"
                class="submit-button">
                <mat-icon>send</mat-icon>
                {{isSubmitting ? 'Submitting...' : 'Submit Examination'}}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- Professional Loading State -->
    <div class="loading-container" *ngIf="!exam">
      <mat-card class="loading-card elevation-2">
        <mat-card-content>
          <div class="loading-content">
            <mat-progress-bar mode="indeterminate" class="loading-progress"></mat-progress-bar>
            <h3>Preparing Your Examination</h3>
            <p>Please wait while we load your exam content...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .exam-taking-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      font-family: 'Roboto', sans-serif;
    }

    /* Professional Timer Section */
    .timer-card {
      position: sticky;
      top: 80px;
      z-index: 100;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .timer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-bottom: 8px;
    }

    .exam-title-section {
      flex: 1;
    }

    .exam-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 500;
      color: white;
    }

    .question-counter {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 400;
    }

    .timer-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .timer-section.warning {
      background: rgba(255, 193, 7, 0.2);
      border: 2px solid rgba(255, 193, 7, 0.6);
    }

    .timer-section.critical {
      background: rgba(244, 67, 54, 0.2);
      border: 2px solid rgba(244, 67, 54, 0.6);
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    .timer-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .time-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .time-display {
      font-weight: 600;
      font-size: 24px;
      line-height: 1;
    }

    .time-label {
      font-size: 12px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .progress-bar {
      height: 6px;
      border-radius: 0 0 12px 12px;
    }

    /* Professional Question Card */
    .question-card {
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .question-header {
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .question-title-section {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .question-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .question-subtitle {
      margin: 0;
    }

    .score-badge {
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .question-content {
      padding: 24px;
    }

    .question-text-container {
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 12px;
      border-left: 4px solid #007bff;
    }

    .question-text {
      font-size: 18px;
      line-height: 1.7;
      margin: 0;
      color: #2c3e50;
      font-weight: 400;
    }

    /* Professional Input Styling */
    .options-container {
      margin: 24px 0;
    }

    .professional-radio-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .professional-radio-option {
      padding: 16px 20px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      background: #ffffff;
      transition: all 0.3s ease;
      margin: 0;
    }

    .professional-radio-option:hover {
      border-color: #007bff;
      background: #f8f9ff;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
    }

    .professional-radio-option.mat-mdc-radio-checked {
      border-color: #007bff;
      background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
      box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
    }

    .option-label {
      font-size: 16px;
      line-height: 1.5;
      color: #2c3e50;
      font-weight: 400;
      margin-left: 12px;
    }

    .boolean-options {
      flex-direction: row;
      gap: 24px;
      justify-content: center;
    }

    .boolean-option {
      flex: 1;
      text-align: center;
      max-width: 200px;
    }

    .professional-textarea {
      width: 100%;
      margin-bottom: 16px;
    }

    .professional-textarea .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .professional-textarea textarea {
      font-size: 16px;
      line-height: 1.6;
      padding: 16px;
    }

    .character-count {
      font-size: 12px;
      color: #6c757d;
    }

    /* Professional Validation Messages */
    .validation-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #fff3cd, #fef7e0);
      border: 1px solid #ffc107;
      border-radius: 8px;
      color: #856404;
      font-size: 14px;
      font-weight: 500;
    }

    .warning-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #ffc107;
    }

    /* Professional Action Buttons */
    .question-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #f8f9fa;
      border-radius: 0 0 16px 16px;
    }

    .action-group {
      display: flex;
      gap: 12px;
    }

    .nav-button {
      min-width: 120px;
      height: 44px;
      border-radius: 22px;
      font-weight: 500;
      text-transform: none;
    }

    .save-button {
      min-width: 160px;
      height: 44px;
      border-radius: 22px;
      font-weight: 600;
      text-transform: none;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    /* Professional Navigation Card */
    .navigation-card {
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .navigation-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .question-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
      max-height: 300px;
      overflow-y: auto;
      padding: 8px;
    }

    .question-nav-button {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .question-nav-button.current {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(63, 81, 181, 0.4);
    }

    .question-nav-button.answered {
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
    }

    .navigation-legend {
      display: flex;
      gap: 24px;
      justify-content: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6c757d;
    }

    .legend-indicator {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .legend-indicator.current {
      background: #3f51b5;
    }

    .legend-indicator.answered {
      background: #4caf50;
    }

    .legend-indicator.unanswered {
      background: #e0e0e0;
    }

    /* Professional Submit Section */
    .submit-section {
      margin-top: 32px;
    }

    .submit-card {
      border-radius: 16px;
      border: 2px solid #dc3545;
      background: linear-gradient(135deg, #fff5f5, #ffebee);
    }

    .submit-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
    }

    .submit-info h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #2c3e50;
    }

    .submit-info p {
      margin: 0 0 12px 0;
      color: #6c757d;
      font-size: 14px;
      line-height: 1.5;
    }

    .answer-summary {
      font-weight: 600;
      color: #007bff;
      font-size: 14px;
    }

    .submit-button {
      min-width: 200px;
      height: 52px;
      border-radius: 26px;
      font-size: 16px;
      font-weight: 600;
      text-transform: none;
      box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
    }

    /* Professional Loading State */
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 40px;
    }

    .loading-card {
      max-width: 400px;
      text-align: center;
      border-radius: 16px;
    }

    .loading-content h3 {
      margin: 24px 0 12px 0;
      font-size: 20px;
      font-weight: 600;
      color: #2c3e50;
    }

    .loading-content p {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }

    .loading-progress {
      margin-bottom: 24px;
      height: 6px;
      border-radius: 3px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .exam-taking-container {
        padding: 16px;
      }
      
      .timer-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .question-actions {
        flex-direction: column;
        gap: 12px;
      }

      .action-group {
        width: 100%;
        justify-content: center;
      }

      .submit-content {
        flex-direction: column;
        gap: 24px;
        text-align: center;
      }

      .boolean-options {
        flex-direction: column;
        gap: 16px;
      }

      .navigation-legend {
        flex-direction: column;
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .question-grid {
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 8px;
      }

      .question-nav-button {
        width: 40px;
        height: 40px;
        min-width: 40px;
      }
    }
  `]
})
export class ExamTakingComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  examForm: FormGroup;
  currentQuestionIndex = 0;
  remainingTime = 0;
  totalTime = 0;
  timeWarning = false;
  timeCritical = false;
  isSubmitting = false;
  showValidation = false;
  
  private timerSubscription: Subscription | null = null;
  private answers: Map<number, string> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private examService: ExamService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.examForm = this.fb.group({});
  }

  ngOnInit(): void {
    const examId = this.route.snapshot.params['id'];
    if (examId) {
      this.loadExam(parseInt(examId));
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  get currentQuestion(): Question {
    return this.exam!.questions[this.currentQuestionIndex];
  }

  private loadExam(examId: number): void {
    this.examService.startExam(examId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.exam = response.data;
          this.initializeExam();
        } else {
          this.snackBar.open('Unable to load examination. Please contact support.', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/student/exams']);
        }
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.snackBar.open('Connection error. Please check your internet connection.', 'Retry', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/student/exams']);
      }
    });
  }

  private initializeExam(): void {
    if (!this.exam) return;

    // Set up timer
    const durationParts = this.exam.duration.split(':');
    this.totalTime = parseInt(durationParts[0]) * 3600 + parseInt(durationParts[1]) * 60 + parseInt(durationParts[2]);
    this.remainingTime = this.totalTime;

    // Initialize form controls with validators
    const formControls: any = {};
    this.exam.questions.forEach(question => {
      if (question.type === 2) { // Short answer
        formControls[`question_${question.id}`] = ['', [Validators.required, Validators.minLength(10)]];
      } else {
        formControls[`question_${question.id}`] = ['', Validators.required];
      }
    });
    this.examForm = this.fb.group(formControls);

    // Start timer
    this.startTimer();
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;
      
      // Warning states
      if (this.remainingTime === 600) { // 10 minutes
        this.timeWarning = true;
        this.snackBar.open('⚠️ Important: 10 minutes remaining in your examination', 'Acknowledged', { 
          duration: 8000,
          panelClass: ['warning-snackbar']
        });
      }

      if (this.remainingTime === 300) { // 5 minutes
        this.timeCritical = true;
        this.snackBar.open('🚨 Critical: Only 5 minutes remaining! Please review and submit soon.', 'Understood', { 
          duration: 10000,
          panelClass: ['critical-snackbar']
        });
      }
      
      // Auto-submit when time expires
      if (this.remainingTime <= 0) {
        this.snackBar.open('⏰ Time expired. Your examination has been automatically submitted.', 'Close', { 
          duration: 5000,
          panelClass: ['info-snackbar']
        });
        this.onSubmitExam();
      }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getProgressPercentage(): number {
    if (!this.exam || this.exam.questions.length === 0) return 0;
    return ((this.currentQuestionIndex + 1) / this.exam.questions.length) * 100;
  }

  getQuestionButtonColor(index: number, questionId: number): string {
    if (index === this.currentQuestionIndex) return 'primary';
    if (this.isQuestionAnswered(questionId)) return 'accent';
    return '';
  }

  getAnsweredCount(): number {
    return this.answers.size;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex--;
      this.showValidation = false;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.exam!.questions.length - 1) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex++;
      this.showValidation = false;
    }
  }

  goToQuestion(index: number): void {
    this.saveCurrentAnswer();
    this.currentQuestionIndex = index;
    this.showValidation = false;
  }

  saveAndNext(): void {
    this.saveCurrentAnswer();
    
    if (this.isQuestionAnswered(this.currentQuestion.id)) {
      this.snackBar.open('✅ Answer saved successfully', 'Continue', { 
        duration: 2000,
        panelClass: ['success-snackbar']
      });
      this.showValidation = false;
    } else {
      this.showValidation = true;
      this.snackBar.open('⚠️ Please provide an answer before saving', 'Understood', { 
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  private saveCurrentAnswer(): void {
    if (!this.exam || !this.currentQuestion) return;
    
    const question = this.currentQuestion;
    const controlName = `question_${question.id}`;
    const answer = this.examForm.get(controlName)?.value;
    
    if (answer && answer.toString().trim()) {
      this.answers.set(question.id, answer.toString().trim());
    } else {
      this.answers.delete(question.id);
    }
  }

  isQuestionAnswered(questionId: number): boolean {
    const answer = this.answers.get(questionId);
    return answer !== undefined && answer.toString().trim().length > 0;
  }

  onSubmitExam(): void {
    if (this.isSubmitting) return;

    const unansweredCount = this.exam!.questions.length - this.getAnsweredCount();
    let confirmMessage = 'Are you certain you want to submit your examination? This action is irreversible.';
    
    if (unansweredCount > 0) {
      confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to proceed with submission? This action cannot be undone.`;
    }

    const confirmSubmit = confirm(confirmMessage);
    if (!confirmSubmit) return;

    // Save current answer
    this.saveCurrentAnswer();

    // Prepare submission
    const answers: SubmitAnswerDto[] = [];
    this.answers.forEach((answer, questionId) => {
      answers.push({
        questionId: questionId,
        studentAnswer: answer
      });
    });

    const submitDto: SubmitExamDto = {
      examId: this.exam!.id,
      answers: answers
    };

    this.isSubmitting = true;

    this.examService.submitExam(submitDto).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if
