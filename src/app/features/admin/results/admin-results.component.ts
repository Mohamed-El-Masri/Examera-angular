import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ExamService } from '../../../core/services/exam.service';
import { AdminService } from '../../../core/services/admin.service';

interface ExamResult {
  id: number;
  studentName: string;
  examTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: Date;
  timeTaken: string;
}

@Component({
  selector: 'app-admin-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="results-container">
      <div class="page-header">
        <h1>Exam Results</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline">
            <mat-label>Filter by Exam</mat-label>
            <mat-select [(value)]="selectedExamId" (selectionChange)="filterResults()">
              <mat-option value="">All Exams</mat-option>
              <mat-option *ngFor="let exam of exams" [value]="exam.id">
                {{exam.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="exportResults()">
            <mat-icon>download</mat-icon>
            Export Results
          </button>
        </div>
      </div>

      <mat-tab-group>
        <mat-tab label="All Results">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Student Results</mat-card-title>
              <mat-card-subtitle>Overview of all exam submissions</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="loading-container" *ngIf="isLoading">
                <mat-spinner></mat-spinner>
                <p>Loading results...</p>
              </div>

              <div class="table-container" *ngIf="!isLoading">
                <table mat-table [dataSource]="filteredResults" class="results-table">
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
                      {{result.score}}/{{result.totalScore}}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="percentage">
                    <th mat-header-cell *matHeaderCellDef>Percentage</th>
                    <td mat-cell *matCellDef="let result">
                      <span [class]="getPercentageClass(result.percentage)">
                        {{result.percentage}}%
                      </span>
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

                  <ng-container matColumnDef="timeTaken">
                    <th mat-header-cell *matHeaderCellDef>Time Taken</th>
                    <td mat-cell *matCellDef="let result">{{result.timeTaken}}</td>
                  </ng-container>

                  <ng-container matColumnDef="submittedAt">
                    <th mat-header-cell *matHeaderCellDef>Submitted</th>
                    <td mat-cell *matCellDef="let result">
                      {{result.submittedAt | date:'short'}}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let result">
                      <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #actionMenu="matMenu">
                        <button mat-menu-item (click)="viewDetails(result)">
                          <mat-icon>visibility</mat-icon>
                          <span>View Details</span>
                        </button>
                        <button mat-menu-item (click)="downloadCertificate(result)" [disabled]="!result.passed">
                          <mat-icon>file_download</mat-icon>
                          <span>Download Certificate</span>
                        </button>
                      </mat-menu>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </div>

              <div class="no-data" *ngIf="!isLoading && filteredResults.length === 0">
                <mat-icon>assessment</mat-icon>
                <h3>No Results Found</h3>
                <p>No exam results available for the selected criteria.</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <mat-tab label="Statistics">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Performance Statistics</mat-card-title>
              <mat-card-subtitle>Overall exam performance metrics</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="stats-grid">
                <div class="stat-card">
                  <mat-icon color="primary">people</mat-icon>
                  <div class="stat-info">
                    <h3>{{totalStudents}}</h3>
                    <p>Total Students</p>
                  </div>
                </div>

                <div class="stat-card">
                  <mat-icon color="accent">assignment_turned_in</mat-icon>
                  <div class="stat-info">
                    <h3>{{totalSubmissions}}</h3>
                    <p>Total Submissions</p>
                  </div>
                </div>

                <div class="stat-card">
                  <mat-icon color="primary">trending_up</mat-icon>
                  <div class="stat-info">
                    <h3>{{averageScore}}%</h3>
                    <p>Average Score</p>
                  </div>
                </div>

                <div class="stat-card">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <div class="stat-info">
                    <h3>{{passRate}}%</h3>
                    <p>Pass Rate</p>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 300;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    .table-container {
      overflow-x: auto;
    }

    .results-table {
      width: 100%;
    }

    .percentage-excellent {
      color: #4caf50;
      font-weight: 500;
    }

    .percentage-good {
      color: #ff9800;
      font-weight: 500;
    }

    .percentage-poor {
      color: #f44336;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #1976d2;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .header-actions {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminResultsComponent implements OnInit {
  results: ExamResult[] = [];
  filteredResults: ExamResult[] = [];
  exams: any[] = [];
  selectedExamId: string = '';
  isLoading = true;

  // Statistics
  totalStudents = 0;
  totalSubmissions = 0;
  averageScore = 0;
  passRate = 0;

  displayedColumns: string[] = ['student', 'exam', 'score', 'percentage', 'status', 'timeTaken', 'submittedAt', 'actions'];

  constructor(
    private examService: ExamService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    
    // Load exams for filter
    this.examService.getAllExams().subscribe({
      next: (response) => {
        if (response.success) {
          this.exams = response.data;
        }
      },
      error: () => {
        this.setMockExams();
      }
    });

    // Load results - using mock data since backend endpoint might not be available
    setTimeout(() => {
      this.setMockResults();
      this.calculateStatistics();
      this.filterResults();
      this.isLoading = false;
    }, 1000);
  }

  filterResults(): void {
    if (this.selectedExamId) {
      this.filteredResults = this.results.filter(result => 
        result.examTitle === this.exams.find(e => e.id.toString() === this.selectedExamId)?.title
      );
    } else {
      this.filteredResults = [...this.results];
    }
  }

  getPercentageClass(percentage: number): string {
    if (percentage >= 80) return 'percentage-excellent';
    if (percentage >= 60) return 'percentage-good';
    return 'percentage-poor';
  }

  viewDetails(result: ExamResult): void {
    // Implementation for viewing detailed results
    console.log('View details for:', result);
  }

  downloadCertificate(result: ExamResult): void {
    // Implementation for downloading certificate
    console.log('Download certificate for:', result);
  }

  exportResults(): void {
    // Implementation for exporting results
    console.log('Export results');
  }

  private calculateStatistics(): void {
    this.totalSubmissions = this.results.length;
    this.totalStudents = new Set(this.results.map(r => r.studentName)).size;
    this.averageScore = Math.round(this.results.reduce((sum, r) => sum + r.percentage, 0) / this.results.length);
    this.passRate = Math.round((this.results.filter(r => r.passed).length / this.results.length) * 100);
  }

  private setMockExams(): void {
    this.exams = [
      { id: 1, title: 'Mathematics Final Exam' },
      { id: 2, title: 'Physics Quiz' },
      { id: 3, title: 'Chemistry Basics' }
    ];
  }

  private setMockResults(): void {
    this.results = [
      {
        id: 1,
        studentName: 'Ahmed Ali',
        examTitle: 'Mathematics Final Exam',
        score: 85,
        totalScore: 100,
        percentage: 85,
        passed: true,
        submittedAt: new Date(),
        timeTaken: '01:45:30'
      },
      {
        id: 2,
        studentName: 'Sara Mohamed',
        examTitle: 'Physics Quiz',
        score: 92,
        totalScore: 100,
        percentage: 92,
        passed: true,
        submittedAt: new Date(),
        timeTaken: '01:20:15'
      },
      {
        id: 3,
        studentName: 'Omar Hassan',
        examTitle: 'Chemistry Basics',
        score: 58,
        totalScore: 100,
        percentage: 58,
        passed: false,
        submittedAt: new Date(),
        timeTaken: '01:30:45'
      }
    ];
  }
}
