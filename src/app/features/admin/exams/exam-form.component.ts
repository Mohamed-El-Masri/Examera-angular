import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamService } from '../../../core/services/exam.service';
import { CreateExamDto, UpdateExamDto, Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <div class="exam-form-container">
      <div class="page-header">
        <h1>{{isEditMode ? 'Edit Exam' : 'Create New Exam'}}</h1>
        <button mat-button routerLink="/admin/exams">
          <mat-icon>arrow_back</mat-icon>
          Back to Exams
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>{{isEditMode ? 'Edit' : 'Create'}} Exam</mat-card-title>
          <mat-card-subtitle>Fill in the exam details below</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Exam Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter exam title">
                <mat-error *ngIf="examForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="4" 
                         placeholder="Enter exam description"></textarea>
                <mat-error *ngIf="examForm.get('description')?.hasError('required')">
                  Description is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Duration (HH:MM:SS)</mat-label>
                <input matInput formControlName="duration" placeholder="01:30:00">
                <mat-error *ngIf="examForm.get('duration')?.hasError('required')">
                  Duration is required
                </mat-error>
                <mat-error *ngIf="examForm.get('duration')?.hasError('pattern')">
                  Please enter valid time format (HH:MM:SS)
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Passing Score</mat-label>
                <input matInput type="number" formControlName="passingScore" 
                       placeholder="70" min="0" max="100">
                <mat-error *ngIf="examForm.get('passingScore')?.hasError('required')">
                  Passing score is required
                </mat-error>
                <mat-error *ngIf="examForm.get('passingScore')?.hasError('min')">
                  Passing score must be at least 0
                </mat-error>
                <mat-error *ngIf="examForm.get('passingScore')?.hasError('max')">
                  Passing score cannot exceed 100
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                <mat-error *ngIf="examForm.get('startDate')?.hasError('required')">
                  Start date is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
                <mat-error *ngIf="examForm.get('endDate')?.hasError('required')">
                  End date is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-checkbox formControlName="isActive">
                Active (Students can take this exam)
              </mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/admin/exams">
                Cancel
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="examForm.invalid || isLoading">
                {{isLoading ? 'Saving...' : (isEditMode ? 'Update Exam' : 'Create Exam')}}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .exam-form-container {
      max-width: 800px;
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

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
    }
  `]
})
export class ExamFormComponent implements OnInit {
  examForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  examId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['01:30:00', [Validators.required, Validators.pattern(/^\d{2}:\d{2}:\d{2}$/)]],
      passingScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.examId = parseInt(id);
      this.isEditMode = true;
      this.loadExam();
    }
  }

  private loadExam(): void {
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.populateForm(response.data);
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to load exam', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private populateForm(exam: any): void {
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      passingScore: exam.passingScore,
      startDate: new Date(exam.startDate),
      endDate: new Date(exam.endDate),
      isActive: exam.isActive
    });
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      this.isLoading = true;
      const formValue = this.examForm.value;

      const examDto = {
        title: formValue.title,
        description: formValue.description,
        duration: formValue.duration,
        passingScore: formValue.passingScore,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        isActive: formValue.isActive
      };

      const operation = this.isEditMode
        ? this.examService.updateExam(this.examId!, examDto as UpdateExamDto)
        : this.examService.createExam(examDto as CreateExamDto);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open(
              `Exam ${this.isEditMode ? 'updated' : 'created'} successfully!`,
              'Close',
              { duration: 3000 }
            );
            this.router.navigate(['/admin/exams']);
          } else {
            this.snackBar.open(response.message || 'Operation failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
