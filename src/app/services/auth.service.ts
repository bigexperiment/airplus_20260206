import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private isAllowedAdmin = false;
  private initialized = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    // Get initial session
    const { data: { session } } = await this.supabaseService.client.auth.getSession();
    if (session) {
      this.sessionSubject.next(session);
      await this.handleSession(session);
    }
    this.initialized = true;

    // Listen for auth changes (login, logout, token refresh)
    this.supabaseService.client.auth.onAuthStateChange(async (event, session) => {
      this.sessionSubject.next(session);

      if (event === 'SIGNED_IN' && session) {
        await this.handleSession(session);
      } else if (event === 'SIGNED_OUT') {
        this.currentUserSubject.next(null);
        this.isAllowedAdmin = false;
      }
    });
  }

  private async handleSession(session: Session): Promise<void> {
    const user = session.user;
    if (!user?.email) {
      this.currentUserSubject.next(null);
      this.isAllowedAdmin = false;
      return;
    }

    // Check if user's email is in the allowed_admins table
    const { data: adminRecord, error } = await this.supabaseService.client
      .from('allowed_admins')
      .select('*')
      .eq('email', user.email)
      .single();

    if (adminRecord && !error) {
      this.isAllowedAdmin = true;
      const adminUser: AdminUser = {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.['full_name'] || user.user_metadata?.['name'] || user.email,
        avatarUrl: user.user_metadata?.['avatar_url'] || user.user_metadata?.['picture'] || '',
        role: 'ADMIN'
      };
      this.currentUserSubject.next(adminUser);
    } else {
      this.isAllowedAdmin = false;
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Sign in with Google OAuth
   * Redirects user to Google's login page
   */
  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabaseService.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin/auth/callback'
      }
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Handle the OAuth callback - exchange code for session
   */
  async handleAuthCallback(): Promise<boolean> {
    const { data: { session }, error } = await this.supabaseService.client.auth.getSession();

    if (error || !session) {
      return false;
    }

    await this.handleSession(session);
    return this.isAllowedAdmin;
  }

  /**
   * Sign out and clear session
   */
  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.currentUserSubject.next(null);
    this.isAllowedAdmin = false;
    this.router.navigate(['/']);
  }

  /**
   * Check if a user is currently authenticated with Supabase
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && this.isAllowedAdmin;
  }

  /**
   * Check if the current user is an admin
   */
  isAdmin(): boolean {
    return this.isAllowedAdmin;
  }

  /**
   * Get current user
   */
  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get the Supabase session (for auth tokens)
   */
  getSession(): Session | null {
    return this.sessionSubject.value;
  }

  /**
   * Wait for auth to initialize (useful for guards)
   */
  async waitForInit(): Promise<void> {
    if (this.initialized) return;
    // Poll until initialized
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.initialized) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }
}
