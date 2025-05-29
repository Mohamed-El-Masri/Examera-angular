import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { UserDto } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <button mat-icon-button (click)="toggleSidebar()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="logo" routerLink="/">
        <mat-icon class="logo-icon">school</mat-icon>
        Examera
      </span>

      <span class="spacer"></span>

      <div class="user-section" *ngIf="currentUser">
        <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-btn">
          <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
        </button>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
          <div class="user-info">
            <span class="user-name">{{currentUser.firstName}} {{currentUser.lastName}}</span>
            <span class="user-role">{{getUserRoleText()}}</span>
          </div>
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu" xPosition="before">
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>

      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>

    <!-- Notification Menu -->
    <mat-menu #notificationMenu="matMenu" xPosition="before">
      <div class="notification-header">
        <h3>Notifications</h3>
      </div>

      <button mat-menu-item>
        <div class="notification-item">
          <mat-icon>assignment</mat-icon>
          <div class="notification-content">
            <span class="notification-title">New exam available</span>
            <span class="notification-time">2 hours ago</span>
          </div>
        </div>
      </button>
      <button mat-menu-item>
        <div class="notification-item">
          <mat-icon>grade</mat-icon>
          <div class="notification-content">
            <span class="notification-title">Exam results published</span>
            <span class="notification-time">1 day ago</span>
          </div>
        </div>
      </button>

      <button mat-menu-item class="view-all-btn">
        <span>View all notifications</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .menu-button {
      margin-right: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .logo-icon {
      margin-right: 8px;
      font-size: 24px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-btn {
      margin-right: 8px;
    }

    .user-menu-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
      line-height: 1.2;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.8;
      line-height: 1.2;
    }

    .notification-header {
      padding: 16px;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .notification-content {
      display: flex;
      flex-direction: column;
    }

    .notification-title {
      font-size: 14px;
      font-weight: 500;
    }

    .notification-time {
      font-size: 12px;
      color: #666;
    }

    .view-all-btn {
      text-align: center;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .user-info {
        display: none;
      }

      .user-menu-btn {
        padding: 8px;
        min-width: auto;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();

  currentUser: UserDto | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  getUserRoleText(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role === 0 ? 'Administrator' : 'Student';
  }

  logout(): void {
    this.authService.logout();
  }
}
