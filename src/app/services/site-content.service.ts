import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
  private storageKey = 'airplus_site_content';

  private defaultContent: SiteContent = {
    hero: {
      badge: '🏔️ Nepal\'s Premier Adventure Company',
      title: 'Discover the Magic\nof Nepal',
      subtitle: 'Embark on a journey through breathtaking landscapes, ancient cultures, and unforgettable Himalayan adventures.',
      backgroundImage: 'https://www.airplusnepal.com/information/assets/hero_main.png'
    },
    stats: [
      { id: 1, value: '12+', label: 'Years Experience' },
      { id: 2, value: '100+', label: 'Curated Treks' },
      { id: 3, value: '25+', label: 'Local Guides' },
      { id: 4, value: '24/7', label: 'Support' }
    ],
    services: [
      { id: 1, icon: 'terrain', title: 'Trekking', description: 'Explore the majestic Himalayas with expert guides on world-renowned trails.', colorClass: '', link: 'trekking' },
      { id: 2, icon: 'temple_hindu', title: 'Cultural Tours', description: 'Immerse yourself in Nepal\'s rich heritage, temples, and traditions.', colorClass: 'purple', link: 'tours' },
      { id: 3, icon: 'sports_motorsports', title: 'Adventure Sports', description: 'Paragliding, rafting, bungee jumping, and more thrilling activities.', colorClass: 'orange', link: '/contact' }
    ],
    testimonials: [
      { id: 1, quote: 'AirPlusNepal turned my Nepal dreams into an unforgettable reality. The guides were incredibly knowledgeable and the service was stellar throughout!', authorName: 'Ethan Carter', authorInitials: 'EC', tripName: 'Everest Base Camp Trek' },
      { id: 2, quote: 'From the majestic Himalayas to the cultural richness of Kathmandu, every single moment was perfectly planned and executed.', authorName: 'Abigail Johnson', authorInitials: 'AJ', tripName: 'Annapurna Circuit Trek' }
    ],
    faqs: [
      { id: 1, question: 'Do you provide guides for the treks?', answer: 'Yes, all our treks include experienced local guides who are well-trained in first aid, altitude sickness management, and have extensive knowledge of the trails and local culture.' },
      { id: 2, question: 'What fitness level is required for trekking?', answer: 'Fitness requirements vary by trek. Easy treks like Poon Hill require basic fitness, while challenging treks like Everest Base Camp require good cardiovascular fitness and prior hiking experience.' },
      { id: 3, question: 'Is drinking water safe during treks?', answer: 'We recommend using water purification tablets or bringing a water filter. Bottled water is available but we encourage eco-friendly alternatives to reduce plastic waste.' },
      { id: 4, question: 'Can I charge my devices during the trek?', answer: 'Charging facilities are available at most tea houses along popular routes, though there may be a small fee. We recommend bringing a portable power bank for backup.' }
    ],
    gallery: [
      { id: 1, url: 'https://www.airplusnepal.com/information/assets/gallery_1.jpg', alt: 'Nepal Gallery 1' },
      { id: 2, url: 'https://www.airplusnepal.com/information/assets/gallery_2.jpg', alt: 'Nepal Gallery 2' },
      { id: 3, url: 'https://www.airplusnepal.com/information/assets/gallery_3.jpg', alt: 'Nepal Gallery 3' },
      { id: 4, url: 'https://www.airplusnepal.com/information/assets/gallery_4.jpg', alt: 'Nepal Gallery 4' },
      { id: 5, url: 'https://www.airplusnepal.com/information/assets/gallery_5.jpg', alt: 'Nepal Gallery 5' },
      { id: 6, url: 'https://www.airplusnepal.com/information/assets/gallery_6.jpg', alt: 'Nepal Gallery 6' },
      { id: 7, url: 'https://www.airplusnepal.com/information/assets/gallery_7.jpg', alt: 'Nepal Gallery 7' },
      { id: 8, url: 'https://www.airplusnepal.com/information/assets/gallery_8.jpg', alt: 'Nepal Gallery 8' }
    ],
    culturalTours: [
      { id: 101, name: 'Kathmandu & Nagarkot', days: 4, imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_4.jpg', description: 'Explore ancient temples and enjoy Himalayan sunrise views' },
      { id: 102, name: 'Kathmandu & Pokhara', days: 5, imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_5.jpg', description: 'Visit cultural sites and the beautiful lakeside city' },
      { id: 103, name: 'Kathmandu & Chitwan', days: 6, imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_6.jpg', description: 'Culture meets wildlife in this diverse tour' },
      { id: 104, name: 'Kathmandu & Lumbini', days: 5, imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_7.jpg', description: 'Spiritual journey to the birthplace of Buddha' }
    ],
    cta: {
      title: 'Ready for Your Adventure?',
      message: 'Welcome to AirPlus Nepal — we\'re thrilled to help plan seamless, memorable adventures across the Himalayas.',
      directorName: 'Madan Bhandari'
    },
    companyInfo: {
      name: 'AirPlus Nepal',
      phone: '+977 1 4525454, +977 9862442639',
      email: 'airplusnepal@gmail.com',
      whatsapp: '9779862442639',
      address: 'Bhagawatisthan, Thamel, Kathmandu, Nepal',
      directorName: 'Madan Bhandari',
      registration: '194768/075/076',
      license: '2605',
      vat: '606643944'
    },
    ratingScore: '4.8',
    ratingCount: '150+'
  };

  private contentSubject: BehaviorSubject<SiteContent>;
  public content$: Observable<SiteContent>;

  constructor() {
    const saved = this.loadFromStorage();
    this.contentSubject = new BehaviorSubject<SiteContent>(saved || this.defaultContent);
    this.content$ = this.contentSubject.asObservable();
  }

  getContent(): SiteContent {
    return this.contentSubject.value;
  }

  // ===== Section-level updates =====

  updateHero(hero: HeroContent): void {
    const content = { ...this.getContent(), hero };
    this.save(content);
  }

  updateStats(stats: StatItem[]): void {
    const content = { ...this.getContent(), stats };
    this.save(content);
  }

  updateServices(services: ServiceItem[]): void {
    const content = { ...this.getContent(), services };
    this.save(content);
  }

  updateTestimonials(testimonials: Testimonial[]): void {
    const content = { ...this.getContent(), testimonials };
    this.save(content);
  }

  updateFAQs(faqs: FAQ[]): void {
    const content = { ...this.getContent(), faqs };
    this.save(content);
  }

  updateGallery(gallery: GalleryImage[]): void {
    const content = { ...this.getContent(), gallery };
    this.save(content);
  }

  updateCulturalTours(culturalTours: CulturalTour[]): void {
    const content = { ...this.getContent(), culturalTours };
    this.save(content);
  }

  updateCTA(cta: CTAContent): void {
    const content = { ...this.getContent(), cta };
    this.save(content);
  }

  updateCompanyInfo(companyInfo: CompanyInfo): void {
    const content = { ...this.getContent(), companyInfo };
    this.save(content);
  }

  updateRating(ratingScore: string, ratingCount: string): void {
    const content = { ...this.getContent(), ratingScore, ratingCount };
    this.save(content);
  }

  // ===== Full content update =====

  updateAll(content: SiteContent): void {
    this.save(content);
  }

  resetToDefaults(): void {
    this.save({ ...this.defaultContent });
  }

  // ===== Helpers =====

  private save(content: SiteContent): void {
    this.contentSubject.next(content);
    this.saveToStorage(content);
  }

  private saveToStorage(content: SiteContent): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving site content to storage:', e);
    }
  }

  private loadFromStorage(): SiteContent | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Error loading site content from storage:', e);
      return null;
    }
  }

  getNextId(items: { id: number }[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }
}

