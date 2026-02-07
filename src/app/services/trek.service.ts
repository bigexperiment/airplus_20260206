import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Trek, TrekFilter } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TrekService {

  constructor(private supabaseService: SupabaseService) {}

  getAllTreks(filter?: TrekFilter): Observable<Trek[]> {
    return from(this.fetchTreks(filter));
  }

  private async fetchTreks(filter?: TrekFilter): Promise<Trek[]> {
    let query = this.supabaseService.client
      .from('treks')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (filter) {
      if (filter.region) {
        query = query.eq('region', filter.region);
      }
      if (filter.difficulty) {
        query = query.eq('difficulty', filter.difficulty);
      }
      if (filter.minDays) {
        query = query.gte('days', filter.minDays);
      }
      if (filter.maxDays) {
        query = query.lte('days', filter.maxDays);
      }
      if (filter.minPrice) {
        query = query.gte('price', filter.minPrice);
      }
      if (filter.maxPrice) {
        query = query.lte('price', filter.maxPrice);
      }
      if (filter.search) {
        query = query.or(`name.ilike.%${filter.search}%,summary.ilike.%${filter.search}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching treks:', error);
      return [];
    }

    return (data || []).map(row => this.mapTrek(row));
  }

  getTrekById(id: number): Observable<Trek> {
    return from(
      this.supabaseService.client
        .from('treks')
        .select('*, categories(name)')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapTrek(data);
        })
    );
  }

  createTrek(trek: Partial<Trek>): Observable<Trek> {
    return from(
      this.supabaseService.client
        .from('treks')
        .insert({
          name: trek.name,
          region: trek.region,
          difficulty: trek.difficulty,
          days: trek.days,
          price: trek.price,
          summary: trek.summary,
          itinerary: trek.itinerary,
          best_season: trek.bestSeason,
          image_url: trek.imageUrl,
          category_id: trek.categoryId || null
        })
        .select('*, categories(name)')
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapTrek(data);
        })
    );
  }

  updateTrek(id: number, trek: Partial<Trek>): Observable<Trek> {
    return from(
      this.supabaseService.client
        .from('treks')
        .update({
          name: trek.name,
          region: trek.region,
          difficulty: trek.difficulty,
          days: trek.days,
          price: trek.price,
          summary: trek.summary,
          itinerary: trek.itinerary,
          best_season: trek.bestSeason,
          image_url: trek.imageUrl,
          category_id: trek.categoryId || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, categories(name)')
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapTrek(data);
        })
    );
  }

  deleteTrek(id: number): Observable<void> {
    return from(
      this.supabaseService.client
        .from('treks')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  getRegions(): string[] {
    return ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Dolpo'];
  }

  getDifficulties(): string[] {
    return ['Easy', 'Moderate', 'Challenging', 'Difficult'];
  }

  private mapTrek(row: any): Trek {
    return {
      id: row.id,
      name: row.name,
      region: row.region,
      difficulty: row.difficulty,
      days: row.days,
      price: row.price,
      summary: row.summary,
      itinerary: row.itinerary,
      bestSeason: row.best_season,
      imageUrl: row.image_url,
      categoryId: row.category_id,
      categoryName: row.categories?.name || undefined,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }
}
