export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: string; // TimeSpan as string (e.g., "01:30:00")
  passingScore: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  questions: Question[];
}

export interface CreateExamDto {
  title: string;
  description: string;
  duration: string;
  passingScore: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface UpdateExamDto {
  title: string;
  description: string;
  duration: string;
  passingScore: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Question {
  id: number;
  examId: number;
  text: string;
  type: QuestionType;
  score: number;
  options: string[];
  correctAnswer: string;
}

export interface CreateQuestionDto {
  examId: number;
  text: string;
  type: QuestionType;
  score: number;
  options: string[];
  correctAnswer: string;
}

export interface UpdateQuestionDto {
  text: string;
  type: QuestionType;
  score: number;
  options: string[];
  correctAnswer: string;
}

export enum QuestionType {
  MultipleChoice = 0,
  TrueFalse = 1,
  ShortAnswer = 2
}

// Backend Result Structure (matches ResultDto)
export interface ResultDto {
  id: number;
  userId: number;
  username: string;
  examId: number;
  examTitle: string;
  totalScore: number;
  isPassed: boolean;
  submissionDate: Date;
}

// Backend Result Detail Structure (matches ResultDetailDto)
export interface ResultDetailDto extends ResultDto {
  answers: AnswerDto[];
}

// Backend Answer Structure (matches AnswerDto)
export interface AnswerDto {
  id: number;
  questionId: number;
  studentAnswer: string;
  score?: number;
  isCorrect: boolean;
}

// Frontend ExamResult (for compatibility)
export interface ExamResult {
  id: number;
  examId: number;
  userId: number;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  startTime: Date;
  endTime: Date;
  answers: ExamAnswer[];
}

export interface ExamAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

// Backend Submit Answer Structure (matches SubmitAnswerDto)
export interface SubmitAnswerDto {
  questionId: number;
  studentAnswer: string;
}

// Backend Submit Exam Structure (matches SubmitExamDto)
export interface SubmitExamDto {
  examId: number;
  answers: SubmitAnswerDto[];
}
