import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ExamService } from '../../../core/services/exam.service';

interface DashboardStats {
  totalStudents: number;
  totalExams: number;
  totalQuestions: number;
  activeExams: number;
  recentResults: any[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your exam system.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card students">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{stats.totalStudents}}</h3>
                <p>Total Students</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card exams">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{stats.totalExams}}</h3>
                <p>Total Exams</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card questions">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>quiz</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{stats.totalQuestions}}</h3>
                <p>Total Questions</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card active">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>play_circle</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{stats.activeExams}}</h3>
                <p>Active Exams</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="quick-actions-card">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/admin/exams/create">
              <mat-icon>add</mat-icon>
              Create New Exam
            </button>
            <button mat-raised-button color="accent" routerLink="/admin/students">
              <mat-icon>person_add</mat-icon>
              Manage Students
            </button>
            <button mat-raised-button routerLink="/admin/results">
              <mat-icon>assessment</mat-icon>
              View Results
            </button>
            <button mat-raised-button routerLink="/admin/questions">
              <mat-icon>quiz</mat-icon>
              Question Bank
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Activity -->
      <mat-card class="recent-activity-card">
        <mat-card-header>
          <mat-card-title>Recent Exam Results</mat-card-title>
          <mat-card-subtitle>Latest student submissions</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="recentResults" class="results-table">
              <ng-container matColumnDef="student">
                <th mat-header-cell *matHeaderCellDef>Student</th>
                <td mat-cell *matCellDef="let result">{{result.studentName}}</td>
              </ng-container>

              <ng-container matColumnDef="exam">
                <th mat-header-cell *matHeaderCellDef>Exam</th>
                <td mat-cell *matCellDef="let result">{{result.examTitle}}</td>
              </ng-container>

              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Score</th>
                <td mat-cell *matCellDef="let result">
                  {{result.score}}/{{result.totalScore}} ({{result.percentage}}%)
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let result">
                  <mat-chip [color]="result.passed ? 'primary' : 'warn'" selected>
                    {{result.passed ? 'Passed' : 'Failed'}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let result">{{result.submittedAt | date:'short'}}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
          
          <div class="table-actions">
            <button mat-button routerLink="/admin/results">View All Results</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 300;
      color: #333;
    }

    .dashboard-header p {
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

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .students .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .exams .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .questions .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .active .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

    .stat-details h3 {
      margin: 0 0 4px 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .stat-details p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .quick-actions-card {
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

    .table-container {
      overflow-x: auto;
    }

    .results-table {
      width: 100%;
    }

    .table-actions {
      margin-top: 16px;
      text-align: right;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalStudents: 0,
    totalExams: 0,
    totalQuestions: 0,
    activeExams: 0,
    recentResults: []
  };

  recentResults: any[] = [];
  displayedColumns: string[] = ['student', 'exam', 'score', 'status', 'date'];

  constructor(
    private adminService: AdminService,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load dashboard statistics
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        // Set mock data for demonstration
        this.setMockData();
      }
    });

    // Load recent results
    this.examService.getAllResults().subscribe({
      next: (response) => {
        if (response.success) {
          this.recentResults = response.data.slice(0, 5); // Show only latest 5
        }
      },
      error: (error) => {
        console.error('Error loading recent results:', error);
        this.setMockResults();
      }
    });
  }

  private setMockData(): void {
    this.stats = {
      totalStudents: 156,
      totalExams: 23,
      totalQuestions: 342,
      activeExams: 5,
      recentResults: []
    };
  }

  private setMockResults(): void {
    this.recentResults = [
      {
        studentName: 'John Doe',
        examTitle: 'Mathematics Final',
        score: 85,
        totalScore: 100,
        percentage: 85,
        passed: true,
        submittedAt: new Date()
      },
      {
        studentName: 'Jane Smith',
        examTitle: 'Physics Quiz',
        score: 72,
        totalScore: 80,
        percentage: 90,
        passed: true,
        submittedAt: new Date()
      }
    ];
  }
}
