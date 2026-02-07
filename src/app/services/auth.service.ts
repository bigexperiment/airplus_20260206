import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      this.supabaseService.client
        .from('app_users')
        .select('*')
        .eq('username', credentials.username)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            observer.error({ error: { message: 'Invalid credentials' } });
            return;
          }

          // For demo: check admin/admin, otherwise check username matches
          if (credentials.username === 'admin' && credentials.password === 'admin') {
            const user: User = {
              id: data.id,
              username: data.username,
              email: data.email,
              role: data.role as any,
              fullName: data.full_name
            };

            const response: LoginResponse = {
              token: 'supabase-session-' + Date.now(),
              user
            };

            this.setSession(response);
            observer.next(response);
            observer.complete();
          } else {
            observer.error({ error: { message: 'Invalid credentials' } });
          }
        });
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
