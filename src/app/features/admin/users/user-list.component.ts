import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="users-container">
      <div class="page-header">
        <h1>Student Management</h1>
        <button mat-raised-button color="primary" (click)="createStudent()">
          <mat-icon>person_add</mat-icon>
          Add Student
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>All Students</mat-card-title>
          <mat-card-subtitle>Manage student accounts</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container" *ngIf="students.length > 0; else noStudents">
            <table mat-table [dataSource]="students" class="users-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <strong>{{user.firstName}} {{user.lastName}}</strong>
                    <div class="user-email">{{user.email}}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef>Username</th>
                <td mat-cell *matCellDef="let user">{{user.username}}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="user.isActive ? 'primary' : 'warn'" selected>
                    {{user.isActive ? 'Active' : 'Inactive'}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let user">{{user.createdAt | date:'short'}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="viewUserResults(user)">
                      <mat-icon>assessment</mat-icon>
                      <span>View Results</span>
                    </button>
                    <button mat-menu-item (click)="toggleUserStatus(user)">
                      <mat-icon>{{user.isActive ? 'block' : 'check_circle'}}</mat-icon>
                      <span>{{user.isActive ? 'Deactivate' : 'Activate'}}</span>
                    </button>
                    <button mat-menu-item (click)="deleteUser(user)" class="delete-action">
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

          <ng-template #noStudents>
            <div class="no-users">
              <mat-icon>people</mat-icon>
              <h3>No Students Found</h3>
              <p>No students have been registered yet.</p>
              <button mat-raised-button color="primary" (click)="createStudent()">
                <mat-icon>person_add</mat-icon>
                Add First Student
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Statistics Card -->
      <mat-card class="stats-card">
        <mat-card-header>
          <mat-card-title>Student Statistics</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{students.length}}</div>
              <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{getActiveCount()}}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{getInactiveCount()}}</div>
              <div class="stat-label">Inactive</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{getRecentCount()}}</div>
              <div class="stat-label">This Month</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
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

    .users-table {
      width: 100%;
    }

    .user-info strong {
      font-size: 14px;
      color: #333;
    }

    .user-email {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .delete-action {
      color: #f44336 !important;
    }

    .no-users {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-users mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-users h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .no-users p {
      margin: 0 0 24px 0;
    }

    .stats-card {
      margin-top: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  students: User[] = [];
  displayedColumns: string[] = ['name', 'username', 'status', 'createdAt', 'actions'];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.adminService.getAllStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data;
        }
      },
      error: () => {
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
        this.setMockStudents();
      }
    });
  }

  createStudent(): void {
    console.log('Create new student');
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  viewUserResults(user: User): void {
    console.log('View results for user:', user);
  }

  toggleUserStatus(user: User): void {
    this.adminService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          user.isActive = !user.isActive;
          this.snackBar.open(
            `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            'Close',
            { duration: 3000 }
          );
        }
      },
      error: () => {
        this.snackBar.open('Failed to update user status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.students = this.students.filter(s => s.id !== user.id);
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getActiveCount(): number {
    return this.students.filter(s => s.isActive).length;
  }

  getInactiveCount(): number {
    return this.students.filter(s => !s.isActive).length;
  }

  getRecentCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.students.filter(s => new Date(s.createdAt) > oneMonthAgo).length;
  }

  private setMockStudents(): void {
    this.students = [
      {
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.Student,
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 2,
        username: 'jane_smith',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.Student,
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 3,
        username: 'bob_wilson',
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: UserRole.Student,
        isActive: false,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
  }
}
