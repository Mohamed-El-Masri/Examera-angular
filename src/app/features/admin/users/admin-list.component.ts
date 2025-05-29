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
  selector: 'app-admin-list',
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
    <div class="admins-container">
      <div class="page-header">
        <h1>Administrator Management</h1>
        <button mat-raised-button color="primary" (click)="createAdmin()">
          <mat-icon>admin_panel_settings</mat-icon>
          Add Administrator
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>All Administrators</mat-card-title>
          <mat-card-subtitle>Manage administrator accounts</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container" *ngIf="admins.length > 0; else noAdmins">
            <table mat-table [dataSource]="admins" class="admins-table">
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
                    <button mat-menu-item (click)="editAdmin(user)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="toggleAdminStatus(user)">
                      <mat-icon>{{user.isActive ? 'block' : 'check_circle'}}</mat-icon>
                      <span>{{user.isActive ? 'Deactivate' : 'Activate'}}</span>
                    </button>
                    <button mat-menu-item (click)="deleteAdmin(user)" class="delete-action" [disabled]="user.id === currentUserId">
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

          <ng-template #noAdmins>
            <div class="no-admins">
              <mat-icon>admin_panel_settings</mat-icon>
              <h3>No Administrators Found</h3>
              <p>Add administrators to help manage the system.</p>
              <button mat-raised-button color="primary" (click)="createAdmin()">
                <mat-icon>admin_panel_settings</mat-icon>
                Add Administrator
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Admin Privileges Info -->
      <mat-card class="privileges-card">
        <mat-card-header>
          <mat-card-title>Administrator Privileges</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="privileges-grid">
            <div class="privilege-item">
              <mat-icon>assignment</mat-icon>
              <div class="privilege-text">
                <h4>Exam Management</h4>
                <p>Create, edit, and delete exams</p>
              </div>
            </div>
            <div class="privilege-item">
              <mat-icon>quiz</mat-icon>
              <div class="privilege-text">
                <h4>Question Bank</h4>
                <p>Manage exam questions and answers</p>
              </div>
            </div>
            <div class="privilege-item">
              <mat-icon>people</mat-icon>
              <div class="privilege-text">
                <h4>User Management</h4>
                <p>Manage student and admin accounts</p>
              </div>
            </div>
            <div class="privilege-item">
              <mat-icon>assessment</mat-icon>
              <div class="privilege-text">
                <h4>Results & Analytics</h4>
                <p>View and analyze exam results</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admins-container {
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

    .admins-table {
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

    .no-admins {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-admins mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-admins h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .no-admins p {
      margin: 0 0 24px 0;
    }

    .privileges-card {
      margin-top: 24px;
    }

    .privileges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .privilege-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .privilege-item mat-icon {
      color: #667eea;
      margin-top: 4px;
    }

    .privilege-text h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .privilege-text p {
      margin: 0;
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      
      .privileges-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminListComponent implements OnInit {
  admins: User[] = [];
  currentUserId: number = 1; // This should come from AuthService
  displayedColumns: string[] = ['name', 'username', 'status', 'createdAt', 'actions'];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  private loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (response) => {
        if (response.success) {
          this.admins = response.data;
        }
      },
      error: () => {
        this.snackBar.open('Failed to load administrators', 'Close', { duration: 3000 });
        this.setMockAdmins();
      }
    });
  }

  createAdmin(): void {
    console.log('Create new administrator');
  }

  editAdmin(admin: User): void {
    console.log('Edit administrator:', admin);
  }

  toggleAdminStatus(admin: User): void {
    this.adminService.toggleUserStatus(admin.id).subscribe({
      next: (response) => {
        if (response.success) {
          admin.isActive = !admin.isActive;
          this.snackBar.open(
            `Administrator ${admin.isActive ? 'activated' : 'deactivated'} successfully`,
            'Close',
            { duration: 3000 }
          );
        }
      },
      error: () => {
        this.snackBar.open('Failed to update administrator status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteAdmin(admin: User): void {
    if (admin.id === this.currentUserId) {
      this.snackBar.open('You cannot delete your own account', 'Close', { duration: 3000 });
      return;
    }

    if (confirm(`Are you sure you want to delete administrator ${admin.firstName} ${admin.lastName}?`)) {
      this.adminService.deleteUser(admin.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.admins = this.admins.filter(a => a.id !== admin.id);
            this.snackBar.open('Administrator deleted successfully', 'Close', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Failed to delete administrator', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private setMockAdmins(): void {
    this.admins = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@examera.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: UserRole.Admin,
        isActive: true,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 4,
        username: 'sarah_admin',
        email: 'sarah@examera.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: UserRole.Admin,
        isActive: true,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
  }
}
