import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-available-exams',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="available-exams-container">
      <div class="page-header">
        <h1>Available Exams</h1>
        <p>Select an exam to start taking it</p>
      </div>

      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading available exams...</p>
      </div>

      <div class="exams-grid" *ngIf="!isLoading && exams.length > 0">
        <mat-card class="exam-card" *ngFor="let exam of exams">
          <mat-card-header>
            <mat-card-title>{{exam.title}}</mat-card-title>
            <mat-card-subtitle>{{exam.description}}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="exam-info">
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <span>Duration: {{formatDuration(exam.duration)}}</span>
              </div>
              <div class="info-item">
                <mat-icon>quiz</mat-icon>
                <span>Questions: {{exam.questions.length || 0}}</span>
              </div>
              <div class="info-item">
                <mat-icon>assignment_turned_in</mat-icon>
                <span>Passing Score: {{exam.passingScore}}%</span>
              </div>
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <span>Ends: {{exam.endDate | date:'short'}}</span>
              </div>
            </div>

            <div class="exam-status">
              <mat-chip color="primary" selected>
                <mat-icon>play_circle</mat-icon>
                Available
              </mat-chip>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button color="primary" 
                    [routerLink]="['/student/exam', exam.id]"
                    [disabled]="!isExamAvailable(exam)">
              <mat-icon>play_arrow</mat-icon>
              Start Exam
            </button>
            <button mat-button (click)="viewExamDetails(exam)">
              <mat-icon>info</mat-icon>
              Details
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-exams" *ngIf="!isLoading && exams.length === 0">
        <mat-icon>assignment</mat-icon>
        <h3>No Available Exams</h3>
        <p>There are currently no exams available for you to take.</p>
        <button mat-raised-button color="primary" routerLink="/student/dashboard">
          <mat-icon>dashboard</mat-icon>
          Back to Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .available-exams-container {
      max-width: 1200px;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .loading-container p {
      margin-top: 16px;
      font-size: 16px;
    }

    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .exam-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .exam-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .exam-info {
      margin: 16px 0;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #666;
    }

    .info-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .exam-status {
      margin: 16px 0;
    }

    .exam-status mat-chip {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .exam-status mat-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .no-exams {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-exams mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .no-exams h3 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .no-exams p {
      margin: 0 0 32px 0;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .available-exams-container {
        padding: 16px;
      }
      
      .exams-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AvailableExamsComponent implements OnInit {
  exams: Exam[] = [];
  isLoading = true;

  constructor(
    private examService: ExamService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAvailableExams();
  }

  private loadAvailableExams(): void {
    this.examService.getAvailableExams().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.exams = response.data;
        } else {
          this.snackBar.open('Failed to load exams', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading available exams:', error);
        this.snackBar.open('Failed to load exams', 'Close', { duration: 3000 });
        
        // Set mock data for demonstration
        this.setMockData();
      }
    });
  }

  formatDuration(duration: string): string {
    // Assuming duration is in format "HH:mm:ss"
    const parts = duration.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  }

  isExamAvailable(exam: Exam): boolean {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    
    return exam.isActive && now >= startDate && now <= endDate;
  }

  viewExamDetails(exam: Exam): void {
    this.snackBar.open(`Exam: ${exam.title} - ${exam.description}`, 'Close', { 
      duration: 5000 
    });
  }

  private setMockData(): void {
    this.exams = [
      {
        id: 1,
        title: 'Mathematics Final Exam',
        description: 'Comprehensive exam covering algebra, geometry, and calculus topics.',
        duration: '02:00:00',
        passingScore: 70,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        questions: new Array(25).fill(null)
      },
      {
        id: 2,
        title: 'Physics Quiz',
        description: 'Quick assessment on mechanics and thermodynamics.',
        duration: '01:30:00',
        passingScore: 75,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isActive: true,
        questions: new Array(15).fill(null)
      }
    ];
  }
}
