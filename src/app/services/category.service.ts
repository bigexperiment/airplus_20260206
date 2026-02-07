import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  // Mock data for development
  private mockCategories: Category[] = [
    {
      id: 1,
      name: 'High Altitude Treks',
      description: 'Treks above 4000m altitude',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Cultural Treks',
      description: 'Treks focused on local culture and traditions',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 3,
      name: 'Tea House Treks',
      description: 'Treks with tea house accommodations',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 4,
      name: 'Camping Treks',
      description: 'Treks requiring camping equipment',
      createdAt: new Date('2024-01-01')
    }
  ];

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Category[]>(this.apiUrl);

    // Mock implementation
    return of(this.mockCategories);
  }

  getCategoryById(id: number): Observable<Category> {
    // TODO: Replace with actual API call
    // return this.http.get<Category>(`${this.apiUrl}/${id}`);

    // Mock implementation
    const category = this.mockCategories.find(c => c.id === id);
    return of(category!);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    // TODO: Replace with actual API call
    // return this.http.post<Category>(this.apiUrl, category);

    // Mock implementation
    const newCategory: Category = {
      id: Math.max(...this.mockCategories.map(c => c.id)) + 1,
      name: category.name!,
      description: category.description,
      createdAt: new Date()
    };
    this.mockCategories.push(newCategory);
    return of(newCategory);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    // TODO: Replace with actual API call
    // return this.http.put<Category>(`${this.apiUrl}/${id}`, category);

    // Mock implementation
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories[index] = { 
        ...this.mockCategories[index], 
        ...category,
        updatedAt: new Date()
      };
      return of(this.mockCategories[index]);
    }
    throw new Error('Category not found');
  }

  deleteCategory(id: number): Observable<void> {
    // TODO: Replace with actual API call
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);

    // Mock implementation
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
    }
    return of(void 0);
  }
}
