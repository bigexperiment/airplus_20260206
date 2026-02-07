import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.contactForm.invalid) {
      return;
    }

    this.submitting = true;

    // Simulate API call
    setTimeout(() => {
      this.snackBar.open('Thank you! Your message has been sent. We will contact you within 24 hours.', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.contactForm.reset();
      this.submitting = false;
    }, 1500);
  }
}
