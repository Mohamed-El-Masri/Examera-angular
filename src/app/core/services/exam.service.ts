import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Exam,
  CreateExamDto,
  UpdateExamDto,
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  ResultDto,
  ResultDetailDto,
  SubmitExamDto
} from '../models/exam.model';
import { ResponseDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Exam Management
  getAllExams(): Observable<ResponseDto<Exam[]>> {
    return this.http.get<ResponseDto<Exam[]>>(`${this.API_URL}/Exam`);
  }

  getExamById(id: number): Observable<ResponseDto<Exam>> {
    return this.http.get<ResponseDto<Exam>>(`${this.API_URL}/Exam/${id}`);
  }

  createExam(examDto: CreateExamDto): Observable<ResponseDto<Exam>> {
    return this.http.post<ResponseDto<Exam>>(`${this.API_URL}/Exam`, examDto);
  }

  updateExam(id: number, examDto: UpdateExamDto): Observable<ResponseDto<Exam>> {
    return this.http.put<ResponseDto<Exam>>(`${this.API_URL}/Exam/${id}`, examDto);
  }

  deleteExam(id: number): Observable<ResponseDto<boolean>> {
    return this.http.delete<ResponseDto<boolean>>(`${this.API_URL}/Exam/${id}`);
  }

  // Question Management (Get exam with questions)
  getQuestionsByExamId(examId: number): Observable<ResponseDto<Exam>> {
    return this.http.get<ResponseDto<Exam>>(`${this.API_URL}/Exam/${examId}/questions`);
  }

  getQuestionById(id: number): Observable<ResponseDto<Question>> {
    return this.http.get<ResponseDto<Question>>(`${this.API_URL}/Question/${id}`);
  }

  createQuestion(questionDto: CreateQuestionDto): Observable<ResponseDto<Question>> {
    return this.http.post<ResponseDto<Question>>(`${this.API_URL}/Question`, questionDto);
  }

  updateQuestion(id: number, questionDto: UpdateQuestionDto): Observable<ResponseDto<Question>> {
    return this.http.put<ResponseDto<Question>>(`${this.API_URL}/Question/${id}`, questionDto);
  }

  deleteQuestion(id: number): Observable<ResponseDto<boolean>> {
    return this.http.delete<ResponseDto<boolean>>(`${this.API_URL}/Question/${id}`);
  }

  // Student Exam Operations
  getAvailableExams(): Observable<ResponseDto<Exam[]>> {
    return this.http.get<ResponseDto<Exam[]>>(`${this.API_URL}/Exam/active`);
  }

  startExam(examId: number): Observable<ResponseDto<Exam>> {
    return this.http.get<ResponseDto<Exam>>(`${this.API_URL}/Exam/${examId}/questions`);
  }

  submitExam(submitDto: SubmitExamDto): Observable<ResponseDto<ResultDto>> {
    return this.http.post<ResponseDto<ResultDto>>(`${this.API_URL}/Student/submit-exam`, submitDto);
  }

  getStudentResults(): Observable<ResponseDto<ResultDto[]>> {
    return this.http.get<ResponseDto<ResultDto[]>>(`${this.API_URL}/Student/results`);
  }

  getExamResult(examId: number): Observable<ResponseDto<ResultDetailDto>> {
    return this.http.get<ResponseDto<ResultDetailDto>>(`${this.API_URL}/Student/results/${examId}`);
  }

  // Admin Operations (Note: These endpoints don't exist in backend, using alternative approach)
  getAllResults(): Observable<ResponseDto<ResultDto[]>> {
    return this.http.get<ResponseDto<ResultDto[]>>(`${this.API_URL}/Student/results`);
  }

  getResultsByExam(examId: number): Observable<ResponseDto<ResultDto[]>> {
    return this.http.get<ResponseDto<ResultDto[]>>(`${this.API_URL}/Student/results`);
  }

  getResultsByStudent(studentId: number): Observable<ResponseDto<ResultDto[]>> {
    return this.http.get<ResponseDto<ResultDto[]>>(`${this.API_URL}/Student/results`);
  }
}
