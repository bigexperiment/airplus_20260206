import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  CompanyInfo,
  DestinationItem,
  WhyChooseItem,
  HowItWorksStep,
  TrustBadge,
  RepresentativeItem,
  OfficeHoursItem,
  ContactPageContent,
  AboutHeroContent,
  AboutStoryContent,
  ValueItem,
  TeamMember,
  CertificationItem,
  AboutCTAContent
} from '../../models';

@Component({
  selector: 'app-site-content',
  templateUrl: './site-content.component.html',
  styleUrls: ['./site-content.component.scss']
})
export class SiteContentComponent implements OnInit {
  content!: SiteContent;
  activeTab = 0;

  // ===== Existing Forms =====
  heroForm!: FormGroup;
  ctaForm!: FormGroup;
  companyForm!: FormGroup;
  ratingForm!: FormGroup;

  // ===== Existing Editable arrays =====
  stats: StatItem[] = [];
  services: ServiceItem[] = [];
  testimonials: Testimonial[] = [];
  faqs: FAQ[] = [];
  gallery: GalleryImage[] = [];
  culturalTours: CulturalTour[] = [];

  // ===== Existing Edit state =====
  editingTestimonial: Testimonial | null = null;
  editingFaq: FAQ | null = null;
  editingGallery: GalleryImage | null = null;
  editingTour: CulturalTour | null = null;
  editingStat: StatItem | null = null;
  editingService: ServiceItem | null = null;

  // ===== Existing Inline forms =====
  testimonialForm!: FormGroup;
  faqForm!: FormGroup;
  galleryForm!: FormGroup;
  tourForm!: FormGroup;
  statForm!: FormGroup;
  serviceForm!: FormGroup;

  // ===== NEW: Forms =====
  footerTaglineForm!: FormGroup;
  contactPageForm!: FormGroup;
  aboutHeroForm!: FormGroup;
  aboutStoryForm!: FormGroup;
  aboutCtaForm!: FormGroup;

  // ===== NEW: Editable arrays =====
  destinations: DestinationItem[] = [];
  whyChooseUs: WhyChooseItem[] = [];
  howItWorks: HowItWorksStep[] = [];
  trustBadges: TrustBadge[] = [];
  representatives: RepresentativeItem[] = [];
  officeHours: OfficeHoursItem[] = [];
  aboutValues: ValueItem[] = [];
  teamMembers: TeamMember[] = [];
  aboutWhyChooseUs: WhyChooseItem[] = [];
  certifications: CertificationItem[] = [];

  // ===== NEW: Edit state =====
  editingDestination: DestinationItem | null = null;
  editingWhyChoose: WhyChooseItem | null = null;
  editingStep: HowItWorksStep | null = null;
  editingTrustBadge: TrustBadge | null = null;
  editingRep: RepresentativeItem | null = null;
  editingOfficeHour: OfficeHoursItem | null = null;
  editingValue: ValueItem | null = null;
  editingTeamMember: TeamMember | null = null;
  editingAboutWhy: WhyChooseItem | null = null;
  editingCert: CertificationItem | null = null;

  // ===== NEW: Inline forms =====
  destinationForm!: FormGroup;
  whyChooseForm!: FormGroup;
  stepForm!: FormGroup;
  trustBadgeForm!: FormGroup;
  repForm!: FormGroup;
  officeHourForm!: FormGroup;
  valueForm!: FormGroup;
  teamMemberForm!: FormGroup;
  aboutWhyForm!: FormGroup;
  certForm!: FormGroup;

  materialIcons = [
    'terrain', 'temple_hindu', 'sports_motorsports', 'hiking', 'flight',
    'hotel', 'restaurant', 'photo_camera', 'landscape', 'park',
    'directions_bus', 'kayaking', 'paragliding', 'snowboarding', 'water',
    'verified', 'explore', 'tune', 'security', 'star', 'eco', 'payments',
    'verified_user', 'groups', 'support_agent', 'local_atm', 'emoji_events',
    'shield', 'diversity_3', 'workspace_premium', 'flag', 'edit_calendar',
    'backpack', 'business', 'card_membership', 'receipt_long', 'chat',
    'schedule', 'route', 'language', 'arrow_downward', 'person'
  ];

  colorOptions = [
    { value: '', label: 'Cyan (Default)' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' }
  ];

  valueColorOptions = [
    { value: 'safety', label: 'Blue (Safety)' },
    { value: 'eco', label: 'Green (Eco)' },
    { value: 'community', label: 'Purple (Community)' },
    { value: 'quality', label: 'Gold (Quality)' }
  ];

  sizeOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large (Featured)' }
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
    // ===== EXISTING =====
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

    // ===== NEW FORMS =====
    this.footerTaglineForm = this.fb.group({
      tagline: ['', Validators.required]
    });

    this.contactPageForm = this.fb.group({
      heroTitle: ['', Validators.required],
      heroSubtitle: ['', Validators.required],
      formTitle: ['', Validators.required],
      formSubtitle: ['', Validators.required],
      timezone: ['', Validators.required]
    });

    this.aboutHeroForm = this.fb.group({
      badge: ['', Validators.required],
      title: ['', Validators.required],
      subtitle: ['', Validators.required]
    });

    this.aboutStoryForm = this.fb.group({
      imageUrl: ['', Validators.required],
      yearsValue: ['', Validators.required],
      yearsLabel: ['', Validators.required],
      eyebrow: ['', Validators.required],
      title: ['', Validators.required],
      paragraph1: ['', Validators.required],
      paragraph2: ['']
    });

    this.aboutCtaForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required]
    });

    this.destinationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      trekCount: ['', Validators.required],
      size: ['normal']
    });

    this.whyChooseForm = this.fb.group({
      icon: ['verified', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.stepForm = this.fb.group({
      number: ['', Validators.required],
      icon: ['explore', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.trustBadgeForm = this.fb.group({
      icon: ['verified_user', Validators.required],
      label: ['', Validators.required]
    });

    this.repForm = this.fb.group({
      country: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.officeHourForm = this.fb.group({
      days: ['', Validators.required],
      hours: ['', Validators.required]
    });

    this.valueForm = this.fb.group({
      icon: ['shield', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      colorClass: ['safety']
    });

    this.teamMemberForm = this.fb.group({
      name: ['', Validators.required],
      initials: ['', Validators.required],
      role: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.aboutWhyForm = this.fb.group({
      icon: ['verified_user', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.certForm = this.fb.group({
      icon: ['business', Validators.required],
      label: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  loadContent(): void {
    this.content = this.siteContentService.getContent();

    // Existing
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

    // New
    this.footerTaglineForm.patchValue({ tagline: this.content.footerTagline });
    this.contactPageForm.patchValue(this.content.contactPage);
    this.aboutHeroForm.patchValue(this.content.aboutHero);
    this.aboutStoryForm.patchValue({
      ...this.content.aboutStory,
      paragraph1: this.content.aboutStory.paragraphs[0] || '',
      paragraph2: this.content.aboutStory.paragraphs[1] || ''
    });
    this.aboutCtaForm.patchValue(this.content.aboutCta);

    this.destinations = [...this.content.destinations];
    this.whyChooseUs = [...this.content.whyChooseUs];
    this.howItWorks = [...this.content.howItWorks];
    this.trustBadges = [...this.content.trustBadges];
    this.representatives = [...this.content.representatives];
    this.officeHours = [...this.content.officeHours];
    this.aboutValues = [...this.content.aboutValues];
    this.teamMembers = [...this.content.teamMembers];
    this.aboutWhyChooseUs = [...this.content.aboutWhyChooseUs];
    this.certifications = [...this.content.certifications];
  }

  // ==========================================
  // EXISTING SAVE HANDLERS
  // ==========================================

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

  // ==========================================
  // EXISTING CRUD: Stats
  // ==========================================

  addStat(): void { this.editingStat = null; this.statForm.reset(); }
  editStat(stat: StatItem): void { this.editingStat = stat; this.statForm.patchValue(stat); }
  saveStat(): void {
    if (this.statForm.invalid) return;
    const val = this.statForm.value;
    if (this.editingStat) {
      const idx = this.stats.findIndex(s => s.id === this.editingStat!.id);
      if (idx !== -1) this.stats[idx] = { ...this.editingStat, ...val };
    } else {
      this.stats.push({ id: this.siteContentService.getNextId(this.stats), ...val });
    }
    this.editingStat = null; this.statForm.reset(); this.saveStats();
  }
  deleteStat(stat: StatItem): void { this.stats = this.stats.filter(s => s.id !== stat.id); this.saveStats(); }
  cancelStatEdit(): void { this.editingStat = null; this.statForm.reset(); }

  // ==========================================
  // EXISTING CRUD: Services
  // ==========================================

  addService(): void { this.editingService = null; this.serviceForm.reset({ icon: 'terrain', colorClass: '' }); }
  editService(service: ServiceItem): void { this.editingService = service; this.serviceForm.patchValue(service); }
  saveService(): void {
    if (this.serviceForm.invalid) return;
    const val = this.serviceForm.value;
    if (this.editingService) {
      const idx = this.services.findIndex(s => s.id === this.editingService!.id);
      if (idx !== -1) this.services[idx] = { ...this.editingService, ...val };
    } else {
      this.services.push({ id: this.siteContentService.getNextId(this.services), ...val });
    }
    this.editingService = null; this.serviceForm.reset({ icon: 'terrain', colorClass: '' }); this.saveServices();
  }
  deleteService(service: ServiceItem): void { this.services = this.services.filter(s => s.id !== service.id); this.saveServices(); }
  cancelServiceEdit(): void { this.editingService = null; this.serviceForm.reset({ icon: 'terrain', colorClass: '' }); }

  // ==========================================
  // EXISTING CRUD: Testimonials
  // ==========================================

  addTestimonial(): void { this.editingTestimonial = null; this.testimonialForm.reset(); }
  editTestimonial(t: Testimonial): void { this.editingTestimonial = t; this.testimonialForm.patchValue(t); }
  saveTestimonial(): void {
    if (this.testimonialForm.invalid) return;
    const val = this.testimonialForm.value;
    if (this.editingTestimonial) {
      const idx = this.testimonials.findIndex(t => t.id === this.editingTestimonial!.id);
      if (idx !== -1) this.testimonials[idx] = { ...this.editingTestimonial, ...val };
    } else {
      this.testimonials.push({ id: this.siteContentService.getNextId(this.testimonials), ...val });
    }
    this.editingTestimonial = null; this.testimonialForm.reset(); this.saveTestimonials();
  }
  deleteTestimonial(t: Testimonial): void { this.testimonials = this.testimonials.filter(item => item.id !== t.id); this.saveTestimonials(); }
  cancelTestimonialEdit(): void { this.editingTestimonial = null; this.testimonialForm.reset(); }

  // ==========================================
  // EXISTING CRUD: FAQs
  // ==========================================

  addFaq(): void { this.editingFaq = null; this.faqForm.reset(); }
  editFaq(faq: FAQ): void { this.editingFaq = faq; this.faqForm.patchValue(faq); }
  saveFaq(): void {
    if (this.faqForm.invalid) return;
    const val = this.faqForm.value;
    if (this.editingFaq) {
      const idx = this.faqs.findIndex(f => f.id === this.editingFaq!.id);
      if (idx !== -1) this.faqs[idx] = { ...this.editingFaq, ...val };
    } else {
      this.faqs.push({ id: this.siteContentService.getNextId(this.faqs), ...val });
    }
    this.editingFaq = null; this.faqForm.reset(); this.saveFAQs();
  }
  deleteFaq(faq: FAQ): void { this.faqs = this.faqs.filter(f => f.id !== faq.id); this.saveFAQs(); }
  cancelFaqEdit(): void { this.editingFaq = null; this.faqForm.reset(); }

  // ==========================================
  // EXISTING CRUD: Gallery
  // ==========================================

  addGalleryImage(): void { this.editingGallery = null; this.galleryForm.reset(); }
  editGalleryImage(img: GalleryImage): void { this.editingGallery = img; this.galleryForm.patchValue(img); }
  saveGalleryImage(): void {
    if (this.galleryForm.invalid) return;
    const val = this.galleryForm.value;
    if (this.editingGallery) {
      const idx = this.gallery.findIndex(g => g.id === this.editingGallery!.id);
      if (idx !== -1) this.gallery[idx] = { ...this.editingGallery, ...val };
    } else {
      this.gallery.push({ id: this.siteContentService.getNextId(this.gallery), ...val });
    }
    this.editingGallery = null; this.galleryForm.reset(); this.saveGallery();
  }
  deleteGalleryImage(img: GalleryImage): void { this.gallery = this.gallery.filter(g => g.id !== img.id); this.saveGallery(); }
  cancelGalleryEdit(): void { this.editingGallery = null; this.galleryForm.reset(); }

  // ==========================================
  // EXISTING CRUD: Cultural Tours
  // ==========================================

  addTour(): void { this.editingTour = null; this.tourForm.reset({ days: 1 }); }
  editTour(tour: CulturalTour): void { this.editingTour = tour; this.tourForm.patchValue(tour); }
  saveTour(): void {
    if (this.tourForm.invalid) return;
    const val = this.tourForm.value;
    if (this.editingTour) {
      const idx = this.culturalTours.findIndex(t => t.id === this.editingTour!.id);
      if (idx !== -1) this.culturalTours[idx] = { ...this.editingTour, ...val };
    } else {
      this.culturalTours.push({ id: this.siteContentService.getNextId(this.culturalTours), ...val });
    }
    this.editingTour = null; this.tourForm.reset({ days: 1 }); this.saveTours();
  }
  deleteTour(tour: CulturalTour): void { this.culturalTours = this.culturalTours.filter(t => t.id !== tour.id); this.saveTours(); }
  cancelTourEdit(): void { this.editingTour = null; this.tourForm.reset({ days: 1 }); }

  // ==========================================
  // NEW SAVE HANDLERS
  // ==========================================

  saveFooterTagline(): void {
    if (this.footerTaglineForm.valid) {
      this.siteContentService.updateFooterTagline(this.footerTaglineForm.value.tagline);
      this.showSuccess('Footer tagline updated');
    }
  }

  saveContactPage(): void {
    if (this.contactPageForm.valid) {
      this.siteContentService.updateContactPage(this.contactPageForm.value);
      this.showSuccess('Contact page updated');
    }
  }

  saveAboutHero(): void {
    if (this.aboutHeroForm.valid) {
      this.siteContentService.updateAboutHero(this.aboutHeroForm.value);
      this.showSuccess('About hero updated');
    }
  }

  saveAboutStory(): void {
    if (this.aboutStoryForm.valid) {
      const val = this.aboutStoryForm.value;
      const story: AboutStoryContent = {
        imageUrl: val.imageUrl,
        yearsValue: val.yearsValue,
        yearsLabel: val.yearsLabel,
        eyebrow: val.eyebrow,
        title: val.title,
        paragraphs: [val.paragraph1, val.paragraph2].filter((p: string) => p && p.trim()),
        stats: this.content.aboutStory.stats // Keep existing stats
      };
      this.siteContentService.updateAboutStory(story);
      this.showSuccess('About story updated');
    }
  }

  saveAboutCta(): void {
    if (this.aboutCtaForm.valid) {
      this.siteContentService.updateAboutCta(this.aboutCtaForm.value);
      this.showSuccess('About CTA updated');
    }
  }

  saveDestinations(): void {
    this.siteContentService.updateDestinations(this.destinations);
    this.showSuccess('Destinations updated');
  }

  saveWhyChooseUs(): void {
    this.siteContentService.updateWhyChooseUs(this.whyChooseUs);
    this.showSuccess('Why Choose Us updated');
  }

  saveHowItWorks(): void {
    this.siteContentService.updateHowItWorks(this.howItWorks);
    this.showSuccess('How It Works updated');
  }

  saveTrustBadges(): void {
    this.siteContentService.updateTrustBadges(this.trustBadges);
    this.showSuccess('Trust badges updated');
  }

  saveRepresentatives(): void {
    this.siteContentService.updateRepresentatives(this.representatives);
    this.showSuccess('Representatives updated');
  }

  saveOfficeHours(): void {
    this.siteContentService.updateOfficeHours(this.officeHours);
    this.showSuccess('Office hours updated');
  }

  saveAboutValues(): void {
    this.siteContentService.updateAboutValues(this.aboutValues);
    this.showSuccess('About values updated');
  }

  saveTeamMembers(): void {
    this.siteContentService.updateTeamMembers(this.teamMembers);
    this.showSuccess('Team members updated');
  }

  saveAboutWhyChooseUs(): void {
    this.siteContentService.updateAboutWhyChooseUs(this.aboutWhyChooseUs);
    this.showSuccess('About Why Choose Us updated');
  }

  saveCertifications(): void {
    this.siteContentService.updateCertifications(this.certifications);
    this.showSuccess('Certifications updated');
  }

  // ==========================================
  // NEW CRUD: Destinations
  // ==========================================

  addDestination(): void { this.editingDestination = null; this.destinationForm.reset({ size: 'normal' }); }
  editDestination(d: DestinationItem): void { this.editingDestination = d; this.destinationForm.patchValue(d); }
  saveDestination(): void {
    if (this.destinationForm.invalid) return;
    const val = this.destinationForm.value;
    if (this.editingDestination) {
      const idx = this.destinations.findIndex(d => d.id === this.editingDestination!.id);
      if (idx !== -1) this.destinations[idx] = { ...this.editingDestination, ...val };
    } else {
      this.destinations.push({ id: this.siteContentService.getNextId(this.destinations), ...val });
    }
    this.editingDestination = null; this.destinationForm.reset({ size: 'normal' }); this.saveDestinations();
  }
  deleteDestination(d: DestinationItem): void { this.destinations = this.destinations.filter(x => x.id !== d.id); this.saveDestinations(); }
  cancelDestinationEdit(): void { this.editingDestination = null; this.destinationForm.reset({ size: 'normal' }); }

  // ==========================================
  // NEW CRUD: Why Choose Us (Home)
  // ==========================================

  addWhyChoose(): void { this.editingWhyChoose = null; this.whyChooseForm.reset({ icon: 'verified' }); }
  editWhyChoose(w: WhyChooseItem): void { this.editingWhyChoose = w; this.whyChooseForm.patchValue(w); }
  saveWhyChoose(): void {
    if (this.whyChooseForm.invalid) return;
    const val = this.whyChooseForm.value;
    if (this.editingWhyChoose) {
      const idx = this.whyChooseUs.findIndex(w => w.id === this.editingWhyChoose!.id);
      if (idx !== -1) this.whyChooseUs[idx] = { ...this.editingWhyChoose, ...val };
    } else {
      this.whyChooseUs.push({ id: this.siteContentService.getNextId(this.whyChooseUs), ...val });
    }
    this.editingWhyChoose = null; this.whyChooseForm.reset({ icon: 'verified' }); this.saveWhyChooseUs();
  }
  deleteWhyChoose(w: WhyChooseItem): void { this.whyChooseUs = this.whyChooseUs.filter(x => x.id !== w.id); this.saveWhyChooseUs(); }
  cancelWhyChooseEdit(): void { this.editingWhyChoose = null; this.whyChooseForm.reset({ icon: 'verified' }); }

  // ==========================================
  // NEW CRUD: How It Works
  // ==========================================

  addStep(): void { this.editingStep = null; this.stepForm.reset({ icon: 'explore' }); }
  editStep(s: HowItWorksStep): void { this.editingStep = s; this.stepForm.patchValue(s); }
  saveStep(): void {
    if (this.stepForm.invalid) return;
    const val = this.stepForm.value;
    if (this.editingStep) {
      const idx = this.howItWorks.findIndex(s => s.id === this.editingStep!.id);
      if (idx !== -1) this.howItWorks[idx] = { ...this.editingStep, ...val };
    } else {
      this.howItWorks.push({ id: this.siteContentService.getNextId(this.howItWorks), ...val });
    }
    this.editingStep = null; this.stepForm.reset({ icon: 'explore' }); this.saveHowItWorks();
  }
  deleteStep(s: HowItWorksStep): void { this.howItWorks = this.howItWorks.filter(x => x.id !== s.id); this.saveHowItWorks(); }
  cancelStepEdit(): void { this.editingStep = null; this.stepForm.reset({ icon: 'explore' }); }

  // ==========================================
  // NEW CRUD: Trust Badges
  // ==========================================

  addTrustBadge(): void { this.editingTrustBadge = null; this.trustBadgeForm.reset({ icon: 'verified_user' }); }
  editTrustBadge(b: TrustBadge): void { this.editingTrustBadge = b; this.trustBadgeForm.patchValue(b); }
  saveTrustBadge(): void {
    if (this.trustBadgeForm.invalid) return;
    const val = this.trustBadgeForm.value;
    if (this.editingTrustBadge) {
      const idx = this.trustBadges.findIndex(b => b.id === this.editingTrustBadge!.id);
      if (idx !== -1) this.trustBadges[idx] = { ...this.editingTrustBadge, ...val };
    } else {
      this.trustBadges.push({ id: this.siteContentService.getNextId(this.trustBadges), ...val });
    }
    this.editingTrustBadge = null; this.trustBadgeForm.reset({ icon: 'verified_user' }); this.saveTrustBadges();
  }
  deleteTrustBadge(b: TrustBadge): void { this.trustBadges = this.trustBadges.filter(x => x.id !== b.id); this.saveTrustBadges(); }
  cancelTrustBadgeEdit(): void { this.editingTrustBadge = null; this.trustBadgeForm.reset({ icon: 'verified_user' }); }

  // ==========================================
  // NEW CRUD: Representatives
  // ==========================================

  addRep(): void { this.editingRep = null; this.repForm.reset(); }
  editRep(r: RepresentativeItem): void { this.editingRep = r; this.repForm.patchValue(r); }
  saveRep(): void {
    if (this.repForm.invalid) return;
    const val = this.repForm.value;
    if (this.editingRep) {
      const idx = this.representatives.findIndex(r => r.id === this.editingRep!.id);
      if (idx !== -1) this.representatives[idx] = { ...this.editingRep, ...val };
    } else {
      this.representatives.push({ id: this.siteContentService.getNextId(this.representatives), ...val });
    }
    this.editingRep = null; this.repForm.reset(); this.saveRepresentatives();
  }
  deleteRep(r: RepresentativeItem): void { this.representatives = this.representatives.filter(x => x.id !== r.id); this.saveRepresentatives(); }
  cancelRepEdit(): void { this.editingRep = null; this.repForm.reset(); }

  // ==========================================
  // NEW CRUD: Office Hours
  // ==========================================

  addOfficeHour(): void { this.editingOfficeHour = null; this.officeHourForm.reset(); }
  editOfficeHour(oh: OfficeHoursItem): void { this.editingOfficeHour = oh; this.officeHourForm.patchValue(oh); }
  saveOfficeHour(): void {
    if (this.officeHourForm.invalid) return;
    const val = this.officeHourForm.value;
    if (this.editingOfficeHour) {
      const idx = this.officeHours.findIndex(o => o.id === this.editingOfficeHour!.id);
      if (idx !== -1) this.officeHours[idx] = { ...this.editingOfficeHour, ...val };
    } else {
      this.officeHours.push({ id: this.siteContentService.getNextId(this.officeHours), ...val });
    }
    this.editingOfficeHour = null; this.officeHourForm.reset(); this.saveOfficeHours();
  }
  deleteOfficeHour(oh: OfficeHoursItem): void { this.officeHours = this.officeHours.filter(x => x.id !== oh.id); this.saveOfficeHours(); }
  cancelOfficeHourEdit(): void { this.editingOfficeHour = null; this.officeHourForm.reset(); }

  // ==========================================
  // NEW CRUD: About Values
  // ==========================================

  addValue(): void { this.editingValue = null; this.valueForm.reset({ icon: 'shield', colorClass: 'safety' }); }
  editValue(v: ValueItem): void { this.editingValue = v; this.valueForm.patchValue(v); }
  saveValue(): void {
    if (this.valueForm.invalid) return;
    const val = this.valueForm.value;
    if (this.editingValue) {
      const idx = this.aboutValues.findIndex(v => v.id === this.editingValue!.id);
      if (idx !== -1) this.aboutValues[idx] = { ...this.editingValue, ...val };
    } else {
      this.aboutValues.push({ id: this.siteContentService.getNextId(this.aboutValues), ...val });
    }
    this.editingValue = null; this.valueForm.reset({ icon: 'shield', colorClass: 'safety' }); this.saveAboutValues();
  }
  deleteValue(v: ValueItem): void { this.aboutValues = this.aboutValues.filter(x => x.id !== v.id); this.saveAboutValues(); }
  cancelValueEdit(): void { this.editingValue = null; this.valueForm.reset({ icon: 'shield', colorClass: 'safety' }); }

  // ==========================================
  // NEW CRUD: Team Members
  // ==========================================

  addTeamMember(): void { this.editingTeamMember = null; this.teamMemberForm.reset(); }
  editTeamMember(m: TeamMember): void { this.editingTeamMember = m; this.teamMemberForm.patchValue(m); }
  saveTeamMember(): void {
    if (this.teamMemberForm.invalid) return;
    const val = this.teamMemberForm.value;
    if (this.editingTeamMember) {
      const idx = this.teamMembers.findIndex(m => m.id === this.editingTeamMember!.id);
      if (idx !== -1) this.teamMembers[idx] = { ...this.editingTeamMember, ...val };
    } else {
      this.teamMembers.push({ id: this.siteContentService.getNextId(this.teamMembers), ...val });
    }
    this.editingTeamMember = null; this.teamMemberForm.reset(); this.saveTeamMembers();
  }
  deleteTeamMember(m: TeamMember): void { this.teamMembers = this.teamMembers.filter(x => x.id !== m.id); this.saveTeamMembers(); }
  cancelTeamMemberEdit(): void { this.editingTeamMember = null; this.teamMemberForm.reset(); }

  // ==========================================
  // NEW CRUD: About Why Choose Us
  // ==========================================

  addAboutWhy(): void { this.editingAboutWhy = null; this.aboutWhyForm.reset({ icon: 'verified_user' }); }
  editAboutWhy(w: WhyChooseItem): void { this.editingAboutWhy = w; this.aboutWhyForm.patchValue(w); }
  saveAboutWhy(): void {
    if (this.aboutWhyForm.invalid) return;
    const val = this.aboutWhyForm.value;
    if (this.editingAboutWhy) {
      const idx = this.aboutWhyChooseUs.findIndex(w => w.id === this.editingAboutWhy!.id);
      if (idx !== -1) this.aboutWhyChooseUs[idx] = { ...this.editingAboutWhy, ...val };
    } else {
      this.aboutWhyChooseUs.push({ id: this.siteContentService.getNextId(this.aboutWhyChooseUs), ...val });
    }
    this.editingAboutWhy = null; this.aboutWhyForm.reset({ icon: 'verified_user' }); this.saveAboutWhyChooseUs();
  }
  deleteAboutWhy(w: WhyChooseItem): void { this.aboutWhyChooseUs = this.aboutWhyChooseUs.filter(x => x.id !== w.id); this.saveAboutWhyChooseUs(); }
  cancelAboutWhyEdit(): void { this.editingAboutWhy = null; this.aboutWhyForm.reset({ icon: 'verified_user' }); }

  // ==========================================
  // NEW CRUD: Certifications
  // ==========================================

  addCert(): void { this.editingCert = null; this.certForm.reset({ icon: 'business' }); }
  editCert(c: CertificationItem): void { this.editingCert = c; this.certForm.patchValue(c); }
  saveCert(): void {
    if (this.certForm.invalid) return;
    const val = this.certForm.value;
    if (this.editingCert) {
      const idx = this.certifications.findIndex(c => c.id === this.editingCert!.id);
      if (idx !== -1) this.certifications[idx] = { ...this.editingCert, ...val };
    } else {
      this.certifications.push({ id: this.siteContentService.getNextId(this.certifications), ...val });
    }
    this.editingCert = null; this.certForm.reset({ icon: 'business' }); this.saveCertifications();
  }
  deleteCert(c: CertificationItem): void { this.certifications = this.certifications.filter(x => x.id !== c.id); this.saveCertifications(); }
  cancelCertEdit(): void { this.editingCert = null; this.certForm.reset({ icon: 'business' }); }

  // ==========================================
  // RESET
  // ==========================================

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
