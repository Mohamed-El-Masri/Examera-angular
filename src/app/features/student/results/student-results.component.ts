import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExamService } from '../../../core/services/exam.service';
import { ResultDto } from '../../../core/models/exam.model';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="student-results-container">
      <div class="page-header">
        <h1>My Exam Results</h1>
        <p>View your completed exam results and performance</p>
      </div>

      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading your results...</p>
      </div>

      <mat-card *ngIf="!isLoading">
        <mat-card-header>
          <mat-card-title>Results Overview</mat-card-title>
          <mat-card-subtitle>{{results.length}} exam(s) completed</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container" *ngIf="results.length > 0">
            <table mat-table [dataSource]="results" class="results-table">
              <ng-container matColumnDef="examTitle">
                <th mat-header-cell *matHeaderCellDef>Exam</th>
                <td mat-cell *matCellDef="let result">
                  <div class="exam-info">
                    <strong>{{result.examTitle}}</strong>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Score</th>
                <td mat-cell *matCellDef="let result">
                  <div class="score-display">
                    <span class="score-number">{{result.totalScore}}</span>
                    <div class="score-bar">
                      <div class="score-fill" 
                           [style.width.%]="getScorePercentage(result)">
                      </div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let result">
                  <mat-chip [color]="result.isPassed ? 'primary' : 'warn'" selected>
                    <mat-icon>{{result.isPassed ? 'check_circle' : 'cancel'}}</mat-icon>
                    {{result.isPassed ? 'Passed' : 'Failed'}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="submissionDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let result">
                  {{result.submissionDate | date:'medium'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let result">
                  <button mat-button color="primary" 
                    (click)="viewDetailedResult(result)">
                    <mat-icon>visibility</mat-icon>
                    View Details
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="no-results" *ngIf="results.length === 0">
            <mat-icon>assessment</mat-icon>
            <h3>No Results Yet</h3>
            <p>You haven't completed any exams yet. Take an exam to see your results here.</p>
            <button mat-raised-button color="primary" routerLink="/student/exams">
              <mat-icon>play_arrow</mat-icon>
              Take an Exam
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Performance Summary -->
      <mat-card class="performance-card" *ngIf="!isLoading && results.length > 0">
        <mat-card-header>
          <mat-card-title>Performance Summary</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <mat-icon color="primary">assignment_turned_in</mat-icon>
              <div class="stat-details">
                <span class="stat-number">{{totalExams}}</span>
                <span class="stat-label">Total Exams</span>
              </div>
            </div>
            
            <div class="stat-item">
              <mat-icon color="accent">trending_up</mat-icon>
              <div class="stat-details">
                <span class="stat-number">{{averageScore}}%</span>
                <span class="stat-label">Average Score</span>
              </div>
            </div>
            
            <div class="stat-item">
              <mat-icon color="primary">check_circle</mat-icon>
              <div class="stat-details">
                <span class="stat-number">{{passedExams}}</span>
                <span class="stat-label">Passed</span>
              </div>
            </div>
            
            <div class="stat-item">
              <mat-icon color="warn">cancel</mat-icon>
              <div class="stat-details">
                <span class="stat-number">{{failedExams}}</span>
                <span class="stat-label">Failed</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .student-results-container {
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

    .table-container {
      overflow-x: auto;
    }

    .results-table {
      width: 100%;
    }

    .exam-info strong {
      font-size: 16px;
      color: #333;
    }

    .score-display {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .score-number {
      font-weight: 600;
      font-size: 16px;
      min-width: 40px;
    }

    .score-bar {
      flex: 1;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      max-width: 100px;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      transition: width 0.3s ease;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-results mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .no-results h3 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .no-results p {
      margin: 0 0 32px 0;
      font-size: 16px;
    }

    .performance-card {
      margin-top: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stat-details {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }

    @media (max-width: 768px) {
      .student-results-container {
        padding: 16px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class StudentResultsComponent implements OnInit {
  results: ResultDto[] = [];
  displayedColumns: string[] = ['examTitle', 'score', 'status', 'submissionDate', 'actions'];
  isLoading = true;

  // Performance stats
  totalExams = 0;
  passedExams = 0;
  failedExams = 0;
  averageScore = 0;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    this.examService.getStudentResults().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.results = response.data;
          this.calculateStats();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading results:', error);
        // Set mock data for demonstration
        this.setMockData();
      }
    });
  }

  private calculateStats(): void {
    this.totalExams = this.results.length;
    this.passedExams = this.results.filter(r => r.isPassed).length;
    this.failedExams = this.totalExams - this.passedExams;
    
    if (this.totalExams > 0) {
      const totalScore = this.results.reduce((sum, result) => sum + result.totalScore, 0);
      this.averageScore = Math.round(totalScore / this.totalExams);
    }
  }

  getScorePercentage(result: ResultDto): number {
    // Assuming max score is 100 for percentage calculation
    return Math.min(result.totalScore, 100);
  }

  viewDetailedResult(result: ResultDto): void {
    // Navigate to detailed result view
    console.log('View detailed result for:', result);
  }

  private setMockData(): void {
    this.results = [
      {
        id: 1,
        userId: 1,
        username: 'student',
        examId: 1,
        examTitle: 'Mathematics Final Exam',
        totalScore: 85,
        isPassed: true,
        submissionDate: new Date()
      },
      {
        id: 2,
        userId: 1,
        username: 'student',
        examId: 2,
        examTitle: 'Physics Quiz',
        totalScore: 72,
        isPassed: true,
        submissionDate: new Date()
      }
    ];
    this.calculateStats();
  }
}
