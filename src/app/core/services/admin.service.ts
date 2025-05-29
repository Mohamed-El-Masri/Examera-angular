import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, ResponseDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // User Management
  getAllAdmins(): Observable<ResponseDto<User[]>> {
    return this.http.get<ResponseDto<User[]>>(`${this.API_URL}/Admin/admins`);
  }

  getAllStudents(): Observable<ResponseDto<User[]>> {
    return this.http.get<ResponseDto<User[]>>(`${this.API_URL}/Admin/students`);
  }

  getUserById(id: number): Observable<ResponseDto<User>> {
    return this.http.get<ResponseDto<User>>(`${this.API_URL}/Admin/user/${id}`);
  }

  createAdmin(adminDto: any): Observable<ResponseDto<User>> {
    return this.http.post<ResponseDto<User>>(`${this.API_URL}/Admin/create-admin`, adminDto);
  }

  updateUser(id: number, userDto: any): Observable<ResponseDto<User>> {
    return this.http.put<ResponseDto<User>>(`${this.API_URL}/Admin/user/${id}`, userDto);
  }

  deleteUser(id: number): Observable<ResponseDto<boolean>> {
    return this.http.delete<ResponseDto<boolean>>(`${this.API_URL}/Admin/user/${id}`);
  }

  toggleUserStatus(id: number): Observable<ResponseDto<boolean>> {
    return this.http.patch<ResponseDto<boolean>>(`${this.API_URL}/Admin/user/${id}/toggle-status`, {});
  }

  // Statistics
  getDashboardStats(): Observable<ResponseDto<any>> {
    return this.http.get<ResponseDto<any>>(`${this.API_URL}/Admin/dashboard-stats`);
  }
}
