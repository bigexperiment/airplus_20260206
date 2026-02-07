import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SiteContentService } from '../../services';
import { CompanyInfo, RepresentativeItem, OfficeHoursItem, ContactPageContent } from '../../models';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  submitting = false;

  company!: CompanyInfo;
  representatives: RepresentativeItem[] = [];
  officeHours: OfficeHoursItem[] = [];
  contactPage!: ContactPageContent;
  private sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private siteContentService: SiteContentService
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

  ngOnInit(): void {
    this.sub = this.siteContentService.content$.subscribe(content => {
      this.company = content.companyInfo;
      this.representatives = content.representatives;
      this.officeHours = content.officeHours;
      this.contactPage = content.contactPage;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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
