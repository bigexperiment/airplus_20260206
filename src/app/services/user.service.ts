import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { User, RegisterRequest } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private supabaseService: SupabaseService) {}

  getAllUsers(): Observable<User[]> {
    return from(
      this.supabaseService.client
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: true })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching users:', error);
            return [];
          }
          return (data || []).map(row => this.mapUser(row));
        })
    );
  }

  getUserById(id: number): Observable<User> {
    return from(
      this.supabaseService.client
        .from('app_users')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapUser(data);
        })
    );
  }

  createUser(user: RegisterRequest): Observable<User> {
    return from(
      this.supabaseService.client
        .from('app_users')
        .insert({
          username: user.username,
          email: user.email,
          password_hash: '',
          role: 'USER',
          full_name: user.fullName || null
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapUser(data);
        })
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (user.username) updateData.username = user.username;
    if (user.email) updateData.email = user.email;
    if (user.fullName) updateData.full_name = user.fullName;
    if (user.role) updateData.role = user.role;

    return from(
      this.supabaseService.client
        .from('app_users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapUser(data);
        })
    );
  }

  deleteUser(id: number): Observable<void> {
    return from(
      this.supabaseService.client
        .from('app_users')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  private mapUser(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      fullName: row.full_name,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }
}
