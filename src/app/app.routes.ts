import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, StudentGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // Authentication routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },



  // Admin routes
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/admin/exams/exam-list.component').then(m => m.ExamListComponent)
      },
      {
        path: 'exams/create',
        loadComponent: () => import('./features/admin/exams/exam-form.component').then(m => m.ExamFormComponent)
      },
      {
        path: 'exams/edit/:id',
        loadComponent: () => import('./features/admin/exams/exam-form.component').then(m => m.ExamFormComponent)
      },
      {
        path: 'questions',
        loadComponent: () => import('./features/admin/questions/question-list.component').then(m => m.QuestionListComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./features/admin/users/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'admins',
        loadComponent: () => import('./features/admin/users/admin-list.component').then(m => m.AdminListComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/admin/results/admin-results.component').then(m => m.AdminResultsComponent)
      }
    ]
  },

  // Student routes
  {
    path: 'student',
    canActivate: [StudentGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/student/exams/available-exams.component').then(m => m.AvailableExamsComponent)
      },
      {
        path: 'exam/:id',
        loadComponent: () => import('./features/student/exam-taking/exam-taking.component').then(m => m.ExamTakingComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/student/results/student-results.component').then(m => m.StudentResultsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/student/profile/student-profile.component').then(m => m.StudentProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/student/settings/student-settings.component').then(m => m.StudentSettingsComponent)
      }
    ]
  },

  // Help route (accessible to all users)
  {
    path: 'help',
    loadComponent: () => import('./features/common/help/help.component').then(m => m.HelpComponent)
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
