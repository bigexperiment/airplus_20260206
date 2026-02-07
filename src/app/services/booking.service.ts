import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking, BookingRequest, BookingStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  // Mock data for development
  private mockBookings: Booking[] = [
    {
      id: 1,
      trekId: 1,
      trekName: 'Everest Base Camp Trek',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+977-9841234567',
      numberOfPeople: 2,
      preferredDate: new Date('2024-04-15'),
      message: 'Looking forward to this trek!',
      status: BookingStatus.PENDING,
      createdAt: new Date('2024-03-01')
    },
    {
      id: 2,
      trekId: 2,
      trekName: 'Annapurna Circuit Trek',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+977-9851234567',
      numberOfPeople: 4,
      preferredDate: new Date('2024-05-20'),
      message: 'Family trip',
      status: BookingStatus.CONFIRMED,
      createdAt: new Date('2024-03-05')
    }
  ];

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Booking[]>(this.apiUrl);

    // Mock implementation
    return of(this.mockBookings);
  }

  getBookingById(id: number): Observable<Booking> {
    // TODO: Replace with actual API call
    // return this.http.get<Booking>(`${this.apiUrl}/${id}`);

    // Mock implementation
    const booking = this.mockBookings.find(b => b.id === id);
    return of(booking!);
  }

  createBooking(booking: BookingRequest): Observable<Booking> {
    // TODO: Replace with actual API call
    // return this.http.post<Booking>(this.apiUrl, booking);

    // Mock implementation
    const newBooking: Booking = {
      id: Math.max(...this.mockBookings.map(b => b.id), 0) + 1,
      ...booking,
      status: BookingStatus.PENDING,
      createdAt: new Date()
    };
    this.mockBookings.push(newBooking);
    return of(newBooking);
  }

  updateBookingStatus(id: number, status: BookingStatus): Observable<Booking> {
    // TODO: Replace with actual API call
    // return this.http.patch<Booking>(`${this.apiUrl}/${id}/status`, { status });

    // Mock implementation
    const index = this.mockBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBookings[index].status = status;
      this.mockBookings[index].updatedAt = new Date();
      return of(this.mockBookings[index]);
    }
    throw new Error('Booking not found');
  }

  deleteBooking(id: number): Observable<void> {
    // TODO: Replace with actual API call
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);

    // Mock implementation
    const index = this.mockBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBookings.splice(index, 1);
    }
    return of(void 0);
  }
}
