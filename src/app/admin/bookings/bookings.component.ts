import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking, BookingStatus } from '../../models';
import { BookingService } from '../../services';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'trekName', 'customerName', 'customerEmail', 'numberOfPeople', 'preferredDate', 'status', 'actions'];
  dataSource: MatTableDataSource<Booking>;
  loading = true;

  bookingStatuses = Object.values(BookingStatus);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Booking>([]);
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.dataSource.data = bookings;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.snackBar.open('Error loading bookings', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStatus(booking: Booking, status: BookingStatus): void {
    this.bookingService.updateBookingStatus(booking.id, status).subscribe({
      next: () => {
        this.snackBar.open('Booking status updated', 'Close', { duration: 3000 });
        this.loadBookings();
      },
      error: (error) => {
        console.error('Error updating booking:', error);
        this.snackBar.open('Error updating booking', 'Close', { duration: 3000 });
      }
    });
  }

  deleteBooking(booking: Booking): void {
    if (confirm(`Are you sure you want to delete booking #${booking.id}?`)) {
      this.bookingService.deleteBooking(booking.id).subscribe({
        next: () => {
          this.snackBar.open('Booking deleted successfully', 'Close', { duration: 3000 });
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          this.snackBar.open('Error deleting booking', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING:
        return 'warn';
      case BookingStatus.CONFIRMED:
        return 'primary';
      case BookingStatus.COMPLETED:
        return 'accent';
      case BookingStatus.CANCELLED:
        return '';
      default:
        return '';
    }
  }
}
