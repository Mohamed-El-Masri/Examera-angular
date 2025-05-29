import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { UserDto } from '../../core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: number[]; // 0 = Admin, 1 = Student
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav [opened]="isOpen" [mode]="sidenavMode" class="sidenav">
        <div class="sidenav-header">
          <div class="user-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <div class="user-details" *ngIf="currentUser">
            <h3>{{currentUser.firstName}} {{currentUser.lastName}}</h3>
            <p>{{getUserRoleText()}}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <mat-nav-list class="nav-list">
          <ng-container *ngFor="let item of getFilteredMenuItems()">
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link">
              <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
              <span matListItemTitle>{{item.label}}</span>
            </a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      padding: 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .user-avatar {
      margin-bottom: 12px;
    }

    .user-avatar mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .user-details h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .user-details p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .nav-list {
      padding-top: 8px;
    }

    .nav-list a {
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-list a:hover {
      background-color: #e3f2fd;
    }

    .active-link {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
    }

    .active-link mat-icon {
      color: #1976d2 !important;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() sidenavMode: 'over' | 'push' | 'side' = 'side';

  currentUser: UserDto | null = null;

  private menuItems: MenuItem[] = [
    // Admin Menu Items
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard', roles: [0] },
    { label: 'Exams', icon: 'assignment', route: '/admin/exams', roles: [0] },
    { label: 'Questions', icon: 'quiz', route: '/admin/questions', roles: [0] },
    { label: 'Students', icon: 'people', route: '/admin/students', roles: [0] },
    { label: 'Admins', icon: 'admin_panel_settings', route: '/admin/admins', roles: [0] },
    { label: 'Results', icon: 'assessment', route: '/admin/results', roles: [0] },

    // Student Menu Items
    { label: 'Dashboard', icon: 'dashboard', route: '/student/dashboard', roles: [1] },
    { label: 'Available Exams', icon: 'assignment', route: '/student/exams', roles: [1] },
    { label: 'My Results', icon: 'grade', route: '/student/results', roles: [1] },
    { label: 'Profile', icon: 'person', route: '/student/profile', roles: [1] },
    { label: 'Settings', icon: 'settings', route: '/student/settings', roles: [1] },

    // Common Menu Items
    { label: 'Help', icon: 'help', route: '/help' }
  ];

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getFilteredMenuItems(): MenuItem[] {
    if (!this.currentUser) return [];

    return this.menuItems.filter(item =>
      !item.roles || item.roles.includes(this.currentUser!.role)
    );
  }

  getUserRoleText(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role === 0 ? 'Administrator' : 'Student';
  }
}
