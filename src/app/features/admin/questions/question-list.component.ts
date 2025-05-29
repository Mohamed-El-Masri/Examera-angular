import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExamService } from '../../../core/services/exam.service';
import { Question, QuestionType, Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-question-list',
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
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="questions-container">
      <div class="page-header">
        <h1>Question Bank</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline">
            <mat-label>Filter by Exam</mat-label>
            <mat-select [(value)]="selectedExamId" (selectionChange)="onExamFilterChange()">
              <mat-option value="">All Exams</mat-option>
              <mat-option *ngFor="let exam of exams" [value]="exam.id">
                {{exam.title}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="createQuestion()">
            <mat-icon>add</mat-icon>
            Add Question
          </button>
        </div>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Questions</mat-card-title>
          <mat-card-subtitle>Manage exam questions</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container" *ngIf="filteredQuestions.length > 0; else noQuestions">
            <table mat-table [dataSource]="filteredQuestions" class="questions-table">
              <ng-container matColumnDef="text">
                <th mat-header-cell *matHeaderCellDef>Question</th>
                <td mat-cell *matCellDef="let question">
                  <div class="question-text">
                    {{question.text | slice:0:100}}{{question.text.length > 100 ? '...' : ''}}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let question">
                  <mat-chip [color]="getQuestionTypeColor(question.type)" selected>
                    {{getQuestionTypeText(question.type)}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Score</th>
                <td mat-cell *matCellDef="let question">{{question.score}} pts</td>
              </ng-container>

              <ng-container matColumnDef="exam">
                <th mat-header-cell *matHeaderCellDef>Exam</th>
                <td mat-cell *matCellDef="let question">
                  {{getExamTitle(question.examId)}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let question">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="editQuestion(question)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="viewQuestion(question)">
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item (click)="deleteQuestion(question)" class="delete-action">
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

          <ng-template #noQuestions>
            <div class="no-questions">
              <mat-icon>quiz</mat-icon>
              <h3>No Questions Found</h3>
              <p>{{selectedExamId ? 'No questions found for the selected exam.' : 'Start building your question bank by adding your first question.'}}</p>
              <button mat-raised-button color="primary" (click)="createQuestion()">
                <mat-icon>add</mat-icon>
                Add Question
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .questions-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 20px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 300;
      color: #333;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .table-container {
      overflow-x: auto;
    }

    .questions-table {
      width: 100%;
    }

    .question-text {
      max-width: 300px;
      line-height: 1.4;
    }

    .delete-action {
      color: #f44336 !important;
    }

    .no-questions {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-questions mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-questions h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .no-questions p {
      margin: 0 0 24px 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  exams: Exam[] = [];
  selectedExamId: number | string = '';
  displayedColumns: string[] = ['text', 'type', 'score', 'exam', 'actions'];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadQuestions();
  }

  private loadExams(): void {
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
  }

  private loadQuestions(): void {
    // Since there's no getAllQuestions endpoint, we'll load questions for each exam
    this.examService.getAllExams().subscribe({
      next: (response) => {
        if (response.success) {
          this.questions = response.data.flatMap(exam => exam.questions);
          this.filterQuestions();
        }
      },
      error: () => {
        this.setMockQuestions();
      }
    });
  }

  onExamFilterChange(): void {
    this.filterQuestions();
  }

  private filterQuestions(): void {
    if (this.selectedExamId) {
      this.filteredQuestions = this.questions.filter(q => q.examId === Number(this.selectedExamId));
    } else {
      this.filteredQuestions = [...this.questions];
    }
  }

  getQuestionTypeText(type: QuestionType): string {
    switch (type) {
      case QuestionType.MultipleChoice: return 'Multiple Choice';
      case QuestionType.TrueFalse: return 'True/False';
      case QuestionType.ShortAnswer: return 'Short Answer';
      default: return 'Unknown';
    }
  }

  getQuestionTypeColor(type: QuestionType): 'primary' | 'accent' | 'warn' | '' {
    switch (type) {
      case QuestionType.MultipleChoice: return 'primary';
      case QuestionType.TrueFalse: return 'accent';
      case QuestionType.ShortAnswer: return 'warn';
      default: return '';
    }
  }

  getExamTitle(examId: number): string {
    const exam = this.exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  }

  createQuestion(): void {
    console.log('Create new question');
  }

  editQuestion(question: Question): void {
    console.log('Edit question:', question);
  }

  viewQuestion(question: Question): void {
    console.log('View question:', question);
  }

  deleteQuestion(question: Question): void {
    if (confirm(`Are you sure you want to delete this question?`)) {
      console.log('Delete question:', question);
    }
  }

  private setMockExams(): void {
    this.exams = [
      { id: 1, title: 'Mathematics Final', description: '', duration: '02:00:00', passingScore: 70, startDate: new Date(), endDate: new Date(), isActive: true, questions: [] },
      { id: 2, title: 'Physics Quiz', description: '', duration: '01:30:00', passingScore: 75, startDate: new Date(), endDate: new Date(), isActive: true, questions: [] }
    ];
  }

  private setMockQuestions(): void {
    this.questions = [
      {
        id: 1,
        examId: 1,
        text: 'What is the derivative of x²?',
        type: QuestionType.MultipleChoice,
        score: 5,
        options: ['2x', 'x²', '2', 'x'],
        correctAnswer: '2x'
      },
      {
        id: 2,
        examId: 1,
        text: 'The integral of 1/x is ln(x). True or False?',
        type: QuestionType.TrueFalse,
        score: 3,
        options: ['True', 'False'],
        correctAnswer: 'True'
      },
      {
        id: 3,
        examId: 2,
        text: 'Explain Newton\'s first law of motion.',
        type: QuestionType.ShortAnswer,
        score: 10,
        options: [],
        correctAnswer: 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.'
      }
    ];
    this.filterQuestions();
  }
}
