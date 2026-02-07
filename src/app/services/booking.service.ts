import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Booking, BookingRequest, BookingStatus } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private supabaseService: SupabaseService) {}

  getAllBookings(): Observable<Booking[]> {
    return from(
      this.supabaseService.client
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching bookings:', error);
            return [];
          }
          return (data || []).map(row => this.mapBooking(row));
        })
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return from(
      this.supabaseService.client
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapBooking(data);
        })
    );
  }

  createBooking(booking: BookingRequest): Observable<Booking> {
    return from(
      this.supabaseService.client
        .from('bookings')
        .insert({
          trek_id: booking.trekId,
          customer_name: booking.customerName,
          customer_email: booking.customerEmail,
          customer_phone: booking.customerPhone,
          number_of_people: booking.numberOfPeople,
          preferred_date: booking.preferredDate,
          message: booking.message || null,
          status: 'PENDING'
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapBooking(data);
        })
    );
  }

  updateBookingStatus(id: number, status: BookingStatus): Observable<Booking> {
    return from(
      this.supabaseService.client
        .from('bookings')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return this.mapBooking(data);
        })
    );
  }

  deleteBooking(id: number): Observable<void> {
    return from(
      this.supabaseService.client
        .from('bookings')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }

  private mapBooking(row: any): Booking {
    return {
      id: row.id,
      trekId: row.trek_id,
      trekName: row.trek_name,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      numberOfPeople: row.number_of_people,
      preferredDate: row.preferred_date ? new Date(row.preferred_date) : new Date(),
      message: row.message,
      status: row.status as BookingStatus,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }
}
