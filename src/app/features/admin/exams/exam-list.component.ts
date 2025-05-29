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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-exam-list',
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
    MatDividerModule
  ],
  template: `
    <div class="exam-list-container">
      <div class="page-header">
        <h1>Exam Management</h1>
        <button mat-raised-button color="primary" routerLink="/admin/exams/create">
          <mat-icon>add</mat-icon>
          Create New Exam
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>All Exams</mat-card-title>
          <mat-card-subtitle>Manage your examination system</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="exams" class="exams-table">
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="exam-title">
                    <strong>{{exam.title}}</strong>
                    <p>{{exam.description}}</p>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="duration">
                <th mat-header-cell *matHeaderCellDef>Duration</th>
                <td mat-cell *matCellDef="let exam">{{exam.duration}}</td>
              </ng-container>

              <ng-container matColumnDef="questions">
                <th mat-header-cell *matHeaderCellDef>Questions</th>
                <td mat-cell *matCellDef="let exam">{{exam.questions.length}}</td>
              </ng-container>

              <ng-container matColumnDef="passingScore">
                <th mat-header-cell *matHeaderCellDef>Passing Score</th>
                <td mat-cell *matCellDef="let exam">{{exam.passingScore}}%</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let exam">
                  <mat-chip [color]="exam.isActive ? 'primary' : 'warn'" selected>
                    {{exam.isActive ? 'Active' : 'Inactive'}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Schedule</th>
                <td mat-cell *matCellDef="let exam">
                  <div class="date-info">
                    <small>Start: {{exam.startDate | date:'short'}}</small>
                    <small>End: {{exam.endDate | date:'short'}}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let exam">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item [routerLink]="['/admin/exams/edit', exam.id]">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/admin/questions']" [queryParams]="{examId: exam.id}">
                      <mat-icon>quiz</mat-icon>
                      <span>Manage Questions</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/admin/results']" [queryParams]="{examId: exam.id}">
                      <mat-icon>assessment</mat-icon>
                      <span>View Results</span>
                    </button>

                    <button mat-menu-item (click)="deleteExam(exam)" class="delete-action">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="no-data" *ngIf="exams.length === 0">
            <mat-icon>assignment</mat-icon>
            <h3>No Exams Found</h3>
            <p>Create your first exam to get started.</p>
            <button mat-raised-button color="primary" routerLink="/admin/exams/create">
              Create Exam
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .exam-list-container {
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

    .table-container {
      overflow-x: auto;
    }

    .exams-table {
      width: 100%;
    }

    .exam-title strong {
      font-size: 16px;
      color: #333;
    }

    .exam-title p {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: #666;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date-info small {
      font-size: 12px;
      color: #666;
    }

    .delete-action {
      color: #f44336 !important;
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

    .no-data h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .no-data p {
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .page-header h1 {
        text-align: center;
      }
    }
  `]
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  displayedColumns: string[] = ['title', 'duration', 'questions', 'passingScore', 'status', 'dates', 'actions'];

  constructor(
    private examService: ExamService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  private loadExams(): void {
    this.examService.getAllExams().subscribe({
      next: (response) => {
        if (response.success) {
          this.exams = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.snackBar.open('Failed to load exams', 'Close', { duration: 3000 });
        // Set mock data for demonstration
        this.setMockData();
      }
    });
  }

  deleteExam(exam: Exam): void {
    if (confirm(`Are you sure you want to delete "${exam.title}"?`)) {
      this.examService.deleteExam(exam.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Exam deleted successfully', 'Close', { duration: 3000 });
            this.loadExams();
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to delete exam', 'Close', { duration: 3000 });
        }
      });
    }
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
      },
      {
        id: 3,
        title: 'Chemistry Basics',
        description: 'Introduction to chemical principles and reactions.',
        duration: '01:45:00',
        passingScore: 65,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isActive: false,
        questions: new Array(20).fill(null)
      }
    ];
  }
}
