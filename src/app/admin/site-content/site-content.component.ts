import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SiteContentService } from '../../services';
import {
  SiteContent,
  HeroContent,
  StatItem,
  ServiceItem,
  Testimonial,
  FAQ,
  GalleryImage,
  CulturalTour,
  CTAContent,
  CompanyInfo
} from '../../models';

@Component({
  selector: 'app-site-content',
  templateUrl: './site-content.component.html',
  styleUrls: ['./site-content.component.scss']
})
export class SiteContentComponent implements OnInit {
  content!: SiteContent;
  activeTab = 0;

  // Forms
  heroForm!: FormGroup;
  ctaForm!: FormGroup;
  companyForm!: FormGroup;
  ratingForm!: FormGroup;

  // Editable arrays
  stats: StatItem[] = [];
  services: ServiceItem[] = [];
  testimonials: Testimonial[] = [];
  faqs: FAQ[] = [];
  gallery: GalleryImage[] = [];
  culturalTours: CulturalTour[] = [];

  // Edit state tracking
  editingTestimonial: Testimonial | null = null;
  editingFaq: FAQ | null = null;
  editingGallery: GalleryImage | null = null;
  editingTour: CulturalTour | null = null;
  editingStat: StatItem | null = null;
  editingService: ServiceItem | null = null;

  // Inline forms
  testimonialForm!: FormGroup;
  faqForm!: FormGroup;
  galleryForm!: FormGroup;
  tourForm!: FormGroup;
  statForm!: FormGroup;
  serviceForm!: FormGroup;

  materialIcons = [
    'terrain', 'temple_hindu', 'sports_motorsports', 'hiking', 'flight',
    'hotel', 'restaurant', 'photo_camera', 'landscape', 'park',
    'directions_bus', 'kayaking', 'paragliding', 'snowboarding', 'water'
  ];

  colorOptions = [
    { value: '', label: 'Cyan (Default)' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' }
  ];

  constructor(
    private fb: FormBuilder,
    private siteContentService: SiteContentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.content = this.siteContentService.getContent();
    this.initForms();
    this.loadContent();
  }

  initForms(): void {
    this.heroForm = this.fb.group({
      badge: ['', Validators.required],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      backgroundImage: ['', Validators.required]
    });

    this.ctaForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      directorName: ['', Validators.required]
    });

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', Validators.required],
      address: ['', Validators.required],
      directorName: ['', Validators.required],
      registration: [''],
      license: [''],
      vat: ['']
    });

    this.ratingForm = this.fb.group({
      ratingScore: ['', Validators.required],
      ratingCount: ['', Validators.required]
    });

    // Inline item forms
    this.testimonialForm = this.fb.group({
      quote: ['', Validators.required],
      authorName: ['', Validators.required],
      authorInitials: ['', Validators.required],
      tripName: ['']
    });

    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });

    this.galleryForm = this.fb.group({
      url: ['', Validators.required],
      alt: ['']
    });

    this.tourForm = this.fb.group({
      name: ['', Validators.required],
      days: [1, [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.statForm = this.fb.group({
      value: ['', Validators.required],
      label: ['', Validators.required]
    });

    this.serviceForm = this.fb.group({
      icon: ['terrain', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      colorClass: [''],
      link: ['']
    });
  }

  loadContent(): void {
    this.content = this.siteContentService.getContent();

    this.heroForm.patchValue(this.content.hero);
    this.ctaForm.patchValue(this.content.cta);
    this.companyForm.patchValue(this.content.companyInfo);
    this.ratingForm.patchValue({
      ratingScore: this.content.ratingScore,
      ratingCount: this.content.ratingCount
    });

    this.stats = [...this.content.stats];
    this.services = [...this.content.services];
    this.testimonials = [...this.content.testimonials];
    this.faqs = [...this.content.faqs];
    this.gallery = [...this.content.gallery];
    this.culturalTours = [...this.content.culturalTours];
  }

  // ===== Save handlers =====

  saveHero(): void {
    if (this.heroForm.valid) {
      this.siteContentService.updateHero(this.heroForm.value);
      this.showSuccess('Hero section updated');
    }
  }

  saveStats(): void {
    this.siteContentService.updateStats(this.stats);
    this.showSuccess('Stats updated');
  }

  saveServices(): void {
    this.siteContentService.updateServices(this.services);
    this.showSuccess('Services updated');
  }

  saveTestimonials(): void {
    this.siteContentService.updateTestimonials(this.testimonials);
    this.showSuccess('Testimonials updated');
  }

  saveFAQs(): void {
    this.siteContentService.updateFAQs(this.faqs);
    this.showSuccess('FAQs updated');
  }

  saveGallery(): void {
    this.siteContentService.updateGallery(this.gallery);
    this.showSuccess('Gallery updated');
  }

  saveTours(): void {
    this.siteContentService.updateCulturalTours(this.culturalTours);
    this.showSuccess('Cultural tours updated');
  }

  saveCTA(): void {
    if (this.ctaForm.valid) {
      this.siteContentService.updateCTA(this.ctaForm.value);
      this.showSuccess('CTA section updated');
    }
  }

  saveCompany(): void {
    if (this.companyForm.valid) {
      this.siteContentService.updateCompanyInfo(this.companyForm.value);
      this.showSuccess('Company info updated');
    }
  }

  saveRating(): void {
    if (this.ratingForm.valid) {
      const { ratingScore, ratingCount } = this.ratingForm.value;
      this.siteContentService.updateRating(ratingScore, ratingCount);
      this.showSuccess('Rating updated');
    }
  }

  // ===== Stat CRUD =====

  addStat(): void {
    this.editingStat = null;
    this.statForm.reset();
  }

  editStat(stat: StatItem): void {
    this.editingStat = stat;
    this.statForm.patchValue(stat);
  }

  saveStat(): void {
    if (this.statForm.invalid) return;
    const val = this.statForm.value;

    if (this.editingStat) {
      const idx = this.stats.findIndex(s => s.id === this.editingStat!.id);
      if (idx !== -1) this.stats[idx] = { ...this.editingStat, ...val };
    } else {
      this.stats.push({ id: this.siteContentService.getNextId(this.stats), ...val });
    }

    this.editingStat = null;
    this.statForm.reset();
    this.saveStats();
  }

  deleteStat(stat: StatItem): void {
    this.stats = this.stats.filter(s => s.id !== stat.id);
    this.saveStats();
  }

  cancelStatEdit(): void {
    this.editingStat = null;
    this.statForm.reset();
  }

  // ===== Service CRUD =====

  addService(): void {
    this.editingService = null;
    this.serviceForm.reset({ icon: 'terrain', colorClass: '' });
  }

  editService(service: ServiceItem): void {
    this.editingService = service;
    this.serviceForm.patchValue(service);
  }

  saveService(): void {
    if (this.serviceForm.invalid) return;
    const val = this.serviceForm.value;

    if (this.editingService) {
      const idx = this.services.findIndex(s => s.id === this.editingService!.id);
      if (idx !== -1) this.services[idx] = { ...this.editingService, ...val };
    } else {
      this.services.push({ id: this.siteContentService.getNextId(this.services), ...val });
    }

    this.editingService = null;
    this.serviceForm.reset({ icon: 'terrain', colorClass: '' });
    this.saveServices();
  }

  deleteService(service: ServiceItem): void {
    this.services = this.services.filter(s => s.id !== service.id);
    this.saveServices();
  }

  cancelServiceEdit(): void {
    this.editingService = null;
    this.serviceForm.reset({ icon: 'terrain', colorClass: '' });
  }

  // ===== Testimonial CRUD =====

  addTestimonial(): void {
    this.editingTestimonial = null;
    this.testimonialForm.reset();
  }

  editTestimonial(t: Testimonial): void {
    this.editingTestimonial = t;
    this.testimonialForm.patchValue(t);
  }

  saveTestimonial(): void {
    if (this.testimonialForm.invalid) return;
    const val = this.testimonialForm.value;

    if (this.editingTestimonial) {
      const idx = this.testimonials.findIndex(t => t.id === this.editingTestimonial!.id);
      if (idx !== -1) this.testimonials[idx] = { ...this.editingTestimonial, ...val };
    } else {
      this.testimonials.push({ id: this.siteContentService.getNextId(this.testimonials), ...val });
    }

    this.editingTestimonial = null;
    this.testimonialForm.reset();
    this.saveTestimonials();
  }

  deleteTestimonial(t: Testimonial): void {
    this.testimonials = this.testimonials.filter(item => item.id !== t.id);
    this.saveTestimonials();
  }

  cancelTestimonialEdit(): void {
    this.editingTestimonial = null;
    this.testimonialForm.reset();
  }

  // ===== FAQ CRUD =====

  addFaq(): void {
    this.editingFaq = null;
    this.faqForm.reset();
  }

  editFaq(faq: FAQ): void {
    this.editingFaq = faq;
    this.faqForm.patchValue(faq);
  }

  saveFaq(): void {
    if (this.faqForm.invalid) return;
    const val = this.faqForm.value;

    if (this.editingFaq) {
      const idx = this.faqs.findIndex(f => f.id === this.editingFaq!.id);
      if (idx !== -1) this.faqs[idx] = { ...this.editingFaq, ...val };
    } else {
      this.faqs.push({ id: this.siteContentService.getNextId(this.faqs), ...val });
    }

    this.editingFaq = null;
    this.faqForm.reset();
    this.saveFAQs();
  }

  deleteFaq(faq: FAQ): void {
    this.faqs = this.faqs.filter(f => f.id !== faq.id);
    this.saveFAQs();
  }

  cancelFaqEdit(): void {
    this.editingFaq = null;
    this.faqForm.reset();
  }

  // ===== Gallery CRUD =====

  addGalleryImage(): void {
    this.editingGallery = null;
    this.galleryForm.reset();
  }

  editGalleryImage(img: GalleryImage): void {
    this.editingGallery = img;
    this.galleryForm.patchValue(img);
  }

  saveGalleryImage(): void {
    if (this.galleryForm.invalid) return;
    const val = this.galleryForm.value;

    if (this.editingGallery) {
      const idx = this.gallery.findIndex(g => g.id === this.editingGallery!.id);
      if (idx !== -1) this.gallery[idx] = { ...this.editingGallery, ...val };
    } else {
      this.gallery.push({ id: this.siteContentService.getNextId(this.gallery), ...val });
    }

    this.editingGallery = null;
    this.galleryForm.reset();
    this.saveGallery();
  }

  deleteGalleryImage(img: GalleryImage): void {
    this.gallery = this.gallery.filter(g => g.id !== img.id);
    this.saveGallery();
  }

  cancelGalleryEdit(): void {
    this.editingGallery = null;
    this.galleryForm.reset();
  }

  // ===== Cultural Tour CRUD =====

  addTour(): void {
    this.editingTour = null;
    this.tourForm.reset({ days: 1 });
  }

  editTour(tour: CulturalTour): void {
    this.editingTour = tour;
    this.tourForm.patchValue(tour);
  }

  saveTour(): void {
    if (this.tourForm.invalid) return;
    const val = this.tourForm.value;

    if (this.editingTour) {
      const idx = this.culturalTours.findIndex(t => t.id === this.editingTour!.id);
      if (idx !== -1) this.culturalTours[idx] = { ...this.editingTour, ...val };
    } else {
      this.culturalTours.push({ id: this.siteContentService.getNextId(this.culturalTours), ...val });
    }

    this.editingTour = null;
    this.tourForm.reset({ days: 1 });
    this.saveTours();
  }

  deleteTour(tour: CulturalTour): void {
    this.culturalTours = this.culturalTours.filter(t => t.id !== tour.id);
    this.saveTours();
  }

  cancelTourEdit(): void {
    this.editingTour = null;
    this.tourForm.reset({ days: 1 });
  }

  // ===== Reset =====

  resetAll(): void {
    if (confirm('Are you sure you want to reset ALL content to defaults? This cannot be undone.')) {
      this.siteContentService.resetToDefaults();
      this.loadContent();
      this.showSuccess('All content reset to defaults');
    }
  }

  // ===== Helpers =====

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}

