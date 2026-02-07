import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // TODO: Replace with actual API call
    // return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
    
    // Mock implementation
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          const response: LoginResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@trekking.com',
              role: 'ADMIN' as any,
              fullName: 'Admin User'
            }
          };
          this.setSession(response);
          observer.next(response);
          observer.complete();
        } else {
          observer.error({ error: { message: 'Invalid credentials' } });
        }
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing user from storage', e);
      }
    }
  }
}
