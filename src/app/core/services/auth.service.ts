import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import {
  User,
  UserDto,
  LoginUserDto,
  RegisterUserDto,
  AuthResponseDto,
  TokenRequestDto,
  ResponseDto
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        this.tokenSubject.next(token);
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(loginDto: LoginUserDto): Observable<ResponseDto<AuthResponseDto>> {
    console.log('🔐 Attempting login with:', loginDto);
    console.log('🌐 API URL:', `${this.API_URL}/Auth/login`);

    return this.http.post<ResponseDto<AuthResponseDto>>(`${this.API_URL}/Auth/login`, loginDto)
      .pipe(
        timeout(30000), // 30 seconds timeout
        tap(response => {
          console.log('✅ Login response received:', response);
          if (response.success && response.data) {
            this.setAuthData(response.data);
          }
        }),
        catchError(error => {
          console.error('❌ Login error:', error);
          throw error;
        })
      );
  }

  register(registerDto: RegisterUserDto): Observable<ResponseDto<AuthResponseDto>> {
    return this.http.post<ResponseDto<AuthResponseDto>>(`${this.API_URL}/Auth/register`, registerDto)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
          }
        })
      );
  }

  // Note: Refresh token endpoint not available in backend
  // refreshToken(): Observable<ResponseDto<AuthResponseDto>> {
  //   // This endpoint is not implemented in the backend
  //   throw new Error('Refresh token endpoint not available');
  // }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setAuthData(authResponse: AuthResponseDto): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('refreshToken', authResponse.refreshToken);

      if (authResponse.user) {
        localStorage.setItem('user', JSON.stringify(authResponse.user));
      }
    }

    if (authResponse.user) {
      this.currentUserSubject.next(authResponse.user);
    }

    this.tokenSubject.next(authResponse.token);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 0; // Admin role
  }

  isStudent(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 1; // Student role
  }
}
