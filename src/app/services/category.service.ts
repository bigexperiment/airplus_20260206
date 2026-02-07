import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Category } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private supabaseService: SupabaseService) {}

  getAllCategories(): Observable<Category[]> {
    return from(
      this.supabaseService.client
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching categories:', error);
            return [];
          }
          return (data || []).map(row => this.mapCategory(row));
        })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return from(
      this.supabaseService.client
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapCategory(data);
        })
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return from(
      this.supabaseService.client
        .from('categories')
        .insert({
          name: category.name,
          description: category.description
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapCategory(data);
        })
    );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return from(
      this.supabaseService.client
        .from('categories')
        .update({
          name: category.name,
          description: category.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapCategory(data);
        })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return from(
      this.supabaseService.client
        .from('categories')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  private mapCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }
}
