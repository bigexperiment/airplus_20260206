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
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
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
      { id: 1, quote: 'AirPlusNepal turned my Nepal dreams into an unforgettable reality.', authorName: 'Ethan Carter', authorInitials: 'EC', tripName: 'Everest Base Camp Trek' },
      { id: 2, quote: 'Every single moment was perfectly planned and executed.', authorName: 'Abigail Johnson', authorInitials: 'AJ', tripName: 'Annapurna Circuit Trek' }
    ],
    faqs: [
      { id: 1, question: 'Do you provide guides for the treks?', answer: 'Yes, all our treks include experienced local guides.' },
      { id: 2, question: 'What fitness level is required for trekking?', answer: 'Fitness requirements vary by trek.' }
    ],
    gallery: [],
    culturalTours: [],
    cta: { title: 'Ready for Your Adventure?', message: 'Welcome to AirPlus Nepal', directorName: 'Madan Bhandari' },
    companyInfo: {
      name: 'AirPlus Nepal', phone: '+977 1 4525454', email: 'airplusnepal@gmail.com',
      whatsapp: '9779862442639', address: 'Bhagawatisthan, Thamel, Kathmandu, Nepal',
      directorName: 'Madan Bhandari', registration: '194768/075/076', license: '2605', vat: '606643944'
    },
    ratingScore: '4.8',
    ratingCount: '150+'
  };

  private contentSubject: BehaviorSubject<SiteContent>;
  public content$: Observable<SiteContent>;

  constructor(private supabaseService: SupabaseService) {
    this.contentSubject = new BehaviorSubject<SiteContent>(this.defaultContent);
    this.content$ = this.contentSubject.asObservable();
    this.loadFromSupabase();
  }

  getContent(): SiteContent {
    return this.contentSubject.value;
  }

  // ===== Load all content from Supabase =====
  private async loadFromSupabase(): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('site_content')
        .select('*');

      if (error) {
        console.error('Error loading site content from Supabase:', error);
        return;
      }

      if (data && data.length > 0) {
        const content = { ...this.defaultContent };

        for (const row of data) {
          switch (row.section_key) {
            case 'hero': content.hero = row.content; break;
            case 'stats': content.stats = row.content; break;
            case 'services': content.services = row.content; break;
            case 'testimonials': content.testimonials = row.content; break;
            case 'faqs': content.faqs = row.content; break;
            case 'gallery': content.gallery = row.content; break;
            case 'cultural_tours': content.culturalTours = row.content; break;
            case 'cta': content.cta = row.content; break;
            case 'company_info': content.companyInfo = row.content; break;
            case 'rating':
              content.ratingScore = row.content.ratingScore;
              content.ratingCount = row.content.ratingCount;
              break;
          }
        }

        this.contentSubject.next(content);
      }
    } catch (e) {
      console.error('Error loading site content:', e);
    }
  }

  // ===== Section-level updates =====

  updateHero(hero: HeroContent): void {
    const content = { ...this.getContent(), hero };
    this.contentSubject.next(content);
    this.saveSection('hero', hero);
  }

  updateStats(stats: StatItem[]): void {
    const content = { ...this.getContent(), stats };
    this.contentSubject.next(content);
    this.saveSection('stats', stats);
  }

  updateServices(services: ServiceItem[]): void {
    const content = { ...this.getContent(), services };
    this.contentSubject.next(content);
    this.saveSection('services', services);
  }

  updateTestimonials(testimonials: Testimonial[]): void {
    const content = { ...this.getContent(), testimonials };
    this.contentSubject.next(content);
    this.saveSection('testimonials', testimonials);
  }

  updateFAQs(faqs: FAQ[]): void {
    const content = { ...this.getContent(), faqs };
    this.contentSubject.next(content);
    this.saveSection('faqs', faqs);
  }

  updateGallery(gallery: GalleryImage[]): void {
    const content = { ...this.getContent(), gallery };
    this.contentSubject.next(content);
    this.saveSection('gallery', gallery);
  }

  updateCulturalTours(culturalTours: CulturalTour[]): void {
    const content = { ...this.getContent(), culturalTours };
    this.contentSubject.next(content);
    this.saveSection('cultural_tours', culturalTours);
  }

  updateCTA(cta: CTAContent): void {
    const content = { ...this.getContent(), cta };
    this.contentSubject.next(content);
    this.saveSection('cta', cta);
  }

  updateCompanyInfo(companyInfo: CompanyInfo): void {
    const content = { ...this.getContent(), companyInfo };
    this.contentSubject.next(content);
    this.saveSection('company_info', companyInfo);
  }

  updateRating(ratingScore: string, ratingCount: string): void {
    const content = { ...this.getContent(), ratingScore, ratingCount };
    this.contentSubject.next(content);
    this.saveSection('rating', { ratingScore, ratingCount });
  }

  // ===== Full content update =====

  updateAll(content: SiteContent): void {
    this.contentSubject.next(content);
    // Save each section individually
    this.saveSection('hero', content.hero);
    this.saveSection('stats', content.stats);
    this.saveSection('services', content.services);
    this.saveSection('testimonials', content.testimonials);
    this.saveSection('faqs', content.faqs);
    this.saveSection('gallery', content.gallery);
    this.saveSection('cultural_tours', content.culturalTours);
    this.saveSection('cta', content.cta);
    this.saveSection('company_info', content.companyInfo);
    this.saveSection('rating', { ratingScore: content.ratingScore, ratingCount: content.ratingCount });
  }

  resetToDefaults(): void {
    this.contentSubject.next({ ...this.defaultContent });
    this.updateAll({ ...this.defaultContent });
  }

  // ===== Save to Supabase =====

  private async saveSection(sectionKey: string, content: any): Promise<void> {
    try {
      const { error } = await this.supabaseService.client
        .from('site_content')
        .upsert(
          { section_key: sectionKey, content: content, updated_at: new Date().toISOString() },
          { onConflict: 'section_key' }
        );

      if (error) {
        console.error(`Error saving ${sectionKey}:`, error);
      }
    } catch (e) {
      console.error(`Error saving ${sectionKey}:`, e);
    }
  }

  getNextId(items: { id: number }[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }
}
