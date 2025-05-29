export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

// Backend UserDto structure (matches backend exactly)
export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponseDto {
  success: boolean;
  token: string;
  refreshToken: string;
  user: UserDto | null;
  message: string;
}

export interface TokenRequestDto {
  token: string;
  refreshToken: string;
}

export enum UserRole {
  Admin = 0,
  Student = 1
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

// Backend Response Structure (matches ResponseDto<T>)
export interface ResponseDto<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}
