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
  itineraryDays: string[] = [];
  relatedTreks: Trek[] = [];

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
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTrek(+id);
    });
  }

  loadTrek(id: number): void {
    this.loading = true;
    this.trekService.getTrekById(id).subscribe({
      next: (trek) => {
        this.trek = trek;
        this.parseItinerary(trek.itinerary);
        this.loadRelatedTreks(trek);
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error loading trek:', error);
        this.loading = false;
        this.snackBar.open('Trek not found', 'Close', { duration: 3000 });
        this.router.navigate(['/treks']);
      }
    });
  }

  parseItinerary(itinerary: string): void {
    if (!itinerary) {
      this.itineraryDays = ['Arrive in Kathmandu. Hotel check-in and trip briefing.'];
      return;
    }
    // Split by "Day X:" pattern or by newlines
    const lines = itinerary.split(/\n/).filter(line => line.trim().length > 0);
    if (lines.length > 1) {
      this.itineraryDays = lines.map(line => line.replace(/^Day\s*\d+\s*[:.-]\s*/i, '').trim());
    } else {
      // If single block, split into sentences
      this.itineraryDays = itinerary.split(/\.\s+/).filter(s => s.trim().length > 3).map(s => s.trim() + '.');
    }
  }

  loadRelatedTreks(trek: Trek): void {
    this.trekService.getAllTreks().subscribe({
      next: (treks) => {
        this.relatedTreks = treks
          .filter(t => t.id !== trek.id && (t.region === trek.region || t.difficulty === trek.difficulty))
          .slice(0, 3);
      }
    });
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'diff-easy';
      case 'moderate': return 'diff-moderate';
      case 'challenging': return 'diff-challenging';
      case 'difficult': return 'diff-difficult';
      default: return '';
    }
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
        this.snackBar.open('🎉 Booking request submitted! We\'ll contact you within 24 hours.', 'Close', { duration: 5000 });
        this.bookingForm.reset({ numberOfPeople: 1 });
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error submitting booking:', error);
        this.snackBar.open('Failed to submit booking. Please try again.', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  viewRelatedTrek(id: number): void {
    this.router.navigate(['/treks', id]);
  }

  goBack(): void {
    this.router.navigate(['/treks']);
  }
}
