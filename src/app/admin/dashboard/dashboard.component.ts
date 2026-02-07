import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrekService, BookingService, CategoryService, UserService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trekCount = 0;
  bookingCount = 0;
  categoryCount = 0;
  userCount = 0;
  pendingBookings = 0;
  recentBookings: any[] = [];

  constructor(
    private trekService: TrekService,
    private bookingService: BookingService,
    private categoryService: CategoryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.trekService.getAllTreks().subscribe(treks => {
      this.trekCount = treks.length;
    });

    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookingCount = bookings.length;
      this.pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
      this.recentBookings = bookings.slice(0, 5);
    });

    this.categoryService.getAllCategories().subscribe(categories => {
      this.categoryCount = categories.length;
    });

    this.userService.getAllUsers().subscribe(users => {
      this.userCount = users.length;
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}

