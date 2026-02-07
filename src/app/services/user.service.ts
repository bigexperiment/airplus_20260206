import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  // Mock data for development
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@trekking.com',
      role: 'ADMIN' as any,
      fullName: 'Admin User',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com',
      role: 'USER' as any,
      fullName: 'Regular User',
      createdAt: new Date('2024-02-01')
    }
  ];

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    // TODO: Replace with actual API call
    // return this.http.get<User[]>(this.apiUrl);

    // Mock implementation
    return of(this.mockUsers);
  }

  getUserById(id: number): Observable<User> {
    // TODO: Replace with actual API call
    // return this.http.get<User>(`${this.apiUrl}/${id}`);

    // Mock implementation
    const user = this.mockUsers.find(u => u.id === id);
    return of(user!);
  }

  createUser(user: RegisterRequest): Observable<User> {
    // TODO: Replace with actual API call
    // return this.http.post<User>(this.apiUrl, user);

    // Mock implementation
    const newUser: User = {
      id: Math.max(...this.mockUsers.map(u => u.id)) + 1,
      username: user.username,
      email: user.email,
      role: 'USER' as any,
      fullName: user.fullName,
      createdAt: new Date()
    };
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    // TODO: Replace with actual API call
    // return this.http.put<User>(`${this.apiUrl}/${id}`, user);

    // Mock implementation
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { 
        ...this.mockUsers[index], 
        ...user,
        updatedAt: new Date()
      };
      return of(this.mockUsers[index]);
    }
    throw new Error('User not found');
  }

  deleteUser(id: number): Observable<void> {
    // TODO: Replace with actual API call
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);

    // Mock implementation
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
    }
    return of(void 0);
  }
}
