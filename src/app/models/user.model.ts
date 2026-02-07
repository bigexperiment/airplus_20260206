export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}
