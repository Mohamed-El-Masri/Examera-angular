import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExamService } from '../../../core/services/exam.service';
import { Exam, ExamResult } from '../../../core/models/exam.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Welcome to Your Dashboard</h1>
        <p>Track your progress and access available exams</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">assignment</mat-icon>
              <div>
                <h3>{{availableExams}}</h3>
                <p>Available Exams</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="accent">assessment</mat-icon>
              <div>
                <h3>{{completedExams}}</h3>
                <p>Completed Exams</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">trending_up</mat-icon>
              <div>
                <h3>{{averageScore}}%</h3>
                <p>Average Score</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="actions-card">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/student/exams">
              <mat-icon>play_circle</mat-icon>
              Take Exam
            </button>
            <button mat-raised-button color="accent" routerLink="/student/results">
              <mat-icon>assessment</mat-icon>
              View Results
            </button>
            <button mat-raised-button routerLink="/student/profile">
              <mat-icon>person</mat-icon>
              Update Profile
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Activity -->
      <mat-card class="recent-activity-card">
        <mat-card-header>
          <mat-card-title>Recent Exam Activity</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="activity-list" *ngIf="recentResults.length > 0; else noActivity">
            <div class="activity-item" *ngFor="let result of recentResults">
              <div class="activity-info">
                <h4>{{result.examTitle}}</h4>
                <p>Score: {{result.score}}/{{result.totalScore}} ({{result.percentage}}%)</p>
                <small>{{result.submittedAt | date:'short'}}</small>
              </div>
              <mat-icon [color]="result.passed ? 'primary' : 'warn'">
                {{result.passed ? 'check_circle' : 'cancel'}}
              </mat-icon>
            </div>
          </div>
          <ng-template #noActivity>
            <div class="no-activity">
              <mat-icon>info</mat-icon>
              <p>No recent exam activity</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 300;
      color: #333;
    }

    .welcome-section p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-content mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stat-content h3 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .actions-card {
      margin-bottom: 32px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .actions-grid button {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .recent-activity-card {
      margin-bottom: 32px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .activity-info h4 {
      margin: 0 0 4px 0;
      color: #333;
    }

    .activity-info p {
      margin: 0 0 4px 0;
      color: #666;
      font-size: 14px;
    }

    .activity-info small {
      color: #999;
      font-size: 12px;
    }

    .no-activity {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-activity mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  availableExams = 0;
  completedExams = 0;
  averageScore = 0;
  recentResults: any[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load available exams
    this.examService.getAvailableExams().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableExams = response.data.length;
        }
      },
      error: () => {
        this.availableExams = 3; // Mock data
      }
    });

    // Load student results
    this.examService.getStudentResults().subscribe({
      next: (response) => {
        if (response.success) {
          this.completedExams = response.data.length;
          this.recentResults = response.data.slice(0, 5);
          this.calculateAverageScore(response.data);
        }
      },
      error: () => {
        // Mock data
        this.completedExams = 2;
        this.averageScore = 85;
        this.recentResults = [
          {
            examTitle: 'Mathematics Quiz',
            score: 85,
            totalScore: 100,
            percentage: 85,
            passed: true,
            submittedAt: new Date()
          }
        ];
      }
    });
  }

  private calculateAverageScore(results: any[]): void {
    if (results.length === 0) {
      this.averageScore = 0;
      return;
    }

    const totalScore = results.reduce((sum, result) => sum + result.percentage, 0);
    this.averageScore = Math.round(totalScore / results.length);
  }
}
