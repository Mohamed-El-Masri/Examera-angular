import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './core/services/auth.service';
import { UserDto } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="app-container" *ngIf="currentUser">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="toggleSidenav()" *ngIf="currentUser">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">Examera - Online Exam System</span>
        <span class="spacer"></span>
        
        <div class="user-menu" *ngIf="currentUser">
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            {{currentUser.firstName}} {{currentUser.lastName}}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="goToProfile()">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened="true" class="app-sidenav">
          <mat-nav-list>
            <!-- Admin Menu -->
            <div *ngIf="isAdmin()">
              <h3 matSubheader>Administration</h3>
              <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                <span matListItemTitle>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/admin/exams" routerLinkActive="active">
                <mat-icon matListItemIcon>assignment</mat-icon>
                <span matListItemTitle>Exams</span>
              </a>
              <a mat-list-item routerLink="/admin/questions" routerLinkActive="active">
                <mat-icon matListItemIcon>quiz</mat-icon>
                <span matListItemTitle>Questions</span>
              </a>
              <a mat-list-item routerLink="/admin/students" routerLinkActive="active">
                <mat-icon matListItemIcon>school</mat-icon>
                <span matListItemTitle>Students</span>
              </a>
              <a mat-list-item routerLink="/admin/admins" routerLinkActive="active">
                <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                <span matListItemTitle>Administrators</span>
              </a>
            </div>

            <!-- Student Menu -->
            <div *ngIf="isStudent()">
              <h3 matSubheader>Student Portal</h3>
              <a mat-list-item routerLink="/student/dashboard" routerLinkActive="active">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                <span matListItemTitle>Dashboard</span>
              </a>
              <a mat-list-item routerLink="/student/exams" routerLinkActive="active">
                <mat-icon matListItemIcon>assignment</mat-icon>
                <span matListItemTitle>Available Exams</span>
              </a>
              <a mat-list-item routerLink="/student/results" routerLinkActive="active">
                <mat-icon matListItemIcon>assessment</mat-icon>
                <span matListItemTitle>My Results</span>
              </a>
              <a mat-list-item routerLink="/student/profile" routerLinkActive="active">
                <mat-icon matListItemIcon>person</mat-icon>
                <span matListItemTitle>Profile</span>
              </a>
            </div>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>

    <!-- Login/Register Pages -->
    <div class="auth-container" *ngIf="!currentUser">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      font-size: 20px;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .app-sidenav {
      width: 280px;
      box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }

    .main-content {
      padding: 24px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .auth-container {
      height: 100vh;
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1) !important;
      color: #3f51b5 !important;
    }

    mat-nav-list h3[matSubheader] {
      color: #666;
      font-weight: 500;
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .app-sidenav {
        width: 100%;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: UserDto | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.navigateBasedOnRole();
      }
    });
  }

  private navigateBasedOnRole(): void {
    if (this.currentUser) {
      if (this.router.url === '/' || this.router.url === '/auth/login') {
        if (this.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.isStudent()) {
          this.router.navigate(['/student/dashboard']);
        }
      }
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  toggleSidenav(): void {
    // This will be handled by the sidenav component
  }

  goToProfile(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/profile']);
    } else {
      this.router.navigate(['/student/profile']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
