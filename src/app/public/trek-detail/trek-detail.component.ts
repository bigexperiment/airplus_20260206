import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Trek, BookingRequest } from '../../models';
import { TrekService, BookingService } from '../../services';

@Component({
  selector: 'app-trek-detail',
  templateUrl: './trek-detail.component.html',
  styleUrls: ['./trek-detail.component.scss']
})
export class TrekDetailComponent implements OnInit {
  trek: Trek | null = null;
  loading = true;
  bookingForm: FormGroup;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trekService: TrekService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      preferredDate: ['', Validators.required],
      message: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadTrek(+id);
  }

  loadTrek(id: number): void {
    this.trekService.getTrekById(id).subscribe({
      next: (trek) => {
        this.trek = trek;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trek:', error);
        this.loading = false;
        this.snackBar.open('Trek not found', 'Close', { duration: 3000 });
        this.router.navigate(['/treks']);
      }
    });
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || !this.trek) {
      return;
    }

    this.submitting = true;
    const bookingData: BookingRequest = {
      trekId: this.trek.id,
      ...this.bookingForm.value
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        this.snackBar.open('Booking request submitted successfully!', 'Close', { duration: 5000 });
        this.bookingForm.reset();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error submitting booking:', error);
        this.snackBar.open('Failed to submit booking. Please try again.', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/treks']);
  }
}
