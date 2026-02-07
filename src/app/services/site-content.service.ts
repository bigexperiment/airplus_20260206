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
  CompanyInfo,
  RepresentativeItem,
  OfficeHoursItem,
  ContactPageContent,
  AboutHeroContent,
  AboutStoryContent,
  ValueItem,
  TeamMember,
  WhyChooseItem,
  CertificationItem,
  AboutCTAContent,
  DestinationItem,
  HowItWorksStep,
  TrustBadge
} from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
  private defaultContent: SiteContent = {
    // ===== HOMEPAGE (existing) =====
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
    ratingCount: '150+',

    // ===== HOMEPAGE (new sections) =====
    destinations: [
      { id: 1, name: 'Everest Region', description: 'Home to the world\'s highest peak', imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800', trekCount: '5+ Treks', size: 'large' },
      { id: 2, name: 'Annapurna Region', description: 'The most diverse trekking area', imageUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600', trekCount: '8+ Treks', size: 'normal' },
      { id: 3, name: 'Langtang Region', description: 'The valley of glaciers', imageUrl: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=600', trekCount: '4+ Treks', size: 'normal' },
      { id: 4, name: 'Manaslu Region', description: 'Off the beaten path', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', trekCount: '3+ Treks', size: 'normal' }
    ],
    whyChooseUs: [
      { id: 1, icon: 'verified', title: 'Certified & Trusted', description: 'Registered company with valid tourism licenses, VAT, and decades of expertise in Himalayan adventures.' },
      { id: 2, icon: 'explore', title: 'Local Expertise', description: 'Our trained guides have deep knowledge of trails, culture, and safety protocols.' },
      { id: 3, icon: 'tune', title: 'Tailor-made Itineraries', description: 'Customized routes, proper acclimatization, and seamless logistics for your perfect trip.' },
      { id: 4, icon: 'security', title: 'Safety First', description: 'Reliable communication, emergency plans, and ethical operations ensuring your wellbeing.' }
    ],
    howItWorks: [
      { id: 1, number: '01', icon: 'explore', title: 'Choose Your Trek', description: 'Browse our curated collection of treks and find the perfect adventure for your fitness level and interests.' },
      { id: 2, number: '02', icon: 'edit_calendar', title: 'Book & Customize', description: 'Select your dates, group size, and any special requests. We\'ll tailor the itinerary just for you.' },
      { id: 3, number: '03', icon: 'backpack', title: 'Prepare & Pack', description: 'We\'ll send you a detailed packing list, fitness tips, and everything you need to get ready.' },
      { id: 4, number: '04', icon: 'flag', title: 'Trek & Enjoy!', description: 'Our expert guides will lead you through some of the most spectacular trails on Earth.' }
    ],
    trustBadges: [
      { id: 1, icon: 'verified_user', label: 'Nepal Tourism Board Licensed' },
      { id: 2, icon: 'security', label: 'Fully Insured Treks' },
      { id: 3, icon: 'eco', label: 'Eco-Friendly Operations' },
      { id: 4, icon: 'star', label: '5-Star Rated Company' },
      { id: 5, icon: 'payments', label: 'Secure Payments' }
    ],

    // ===== FOOTER =====
    footerTagline: 'Your trusted partner for unforgettable Himalayan adventures. Licensed and registered trekking company with 12+ years of experience.',
    representatives: [
      { id: 1, country: 'Australia', name: 'Homnath Bhandari', email: 'homnathbhandari2016@gmail.com' },
      { id: 2, country: 'Canada', name: 'Subash Bhandari', email: 'Subashbhandari1902@gmail.com' },
      { id: 3, country: 'Japan', name: 'Raju Bhandari', email: 'bhandariraju575@gmail.com' },
      { id: 4, country: 'USA', name: 'Ganesh Adhikari', email: 'ganeshadhikari332@gmail.com' }
    ],

    // ===== CONTACT PAGE =====
    contactPage: {
      heroTitle: 'Contact Us',
      heroSubtitle: 'Plan your perfect Himalayan adventure with us',
      formTitle: 'Plan Your Trek',
      formSubtitle: 'Fill out the form below and we\'ll get back to you within 24 hours',
      timezone: 'Nepal Standard Time (UTC+5:45)'
    },
    officeHours: [
      { id: 1, days: 'Sunday - Friday', hours: '9:00 AM - 6:00 PM' },
      { id: 2, days: 'Saturday', hours: '10:00 AM - 4:00 PM' }
    ],

    // ===== ABOUT PAGE =====
    aboutHero: {
      badge: 'Est. 2012',
      title: 'Your Adventure Starts Here',
      subtitle: 'We\'ve been guiding travelers through Nepal\'s most breathtaking landscapes for over a decade. Our passion is your journey.'
    },
    aboutStory: {
      imageUrl: 'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800',
      yearsValue: '12+',
      yearsLabel: 'Years of Excellence',
      eyebrow: 'Our Story',
      title: 'Born From a Love of the Himalayas',
      paragraphs: [
        'AirPlus Nepal began as a dream shared by passionate mountaineers and travel enthusiasts. Founded in the heart of Thamel, Kathmandu, we\'ve grown from a small trekking agency into one of Nepal\'s most trusted adventure companies.',
        'We believe that trekking is more than just walking in the mountains — it\'s about connecting with nature, experiencing local cultures, and creating memories that last a lifetime. Every step on the trail is a story waiting to be told.'
      ],
      stats: [
        { value: '1,200+', label: 'Happy Trekkers' },
        { value: '50+', label: 'Trek Routes' },
        { value: '98%', label: 'Success Rate' }
      ]
    },
    aboutValues: [
      { id: 1, icon: 'shield', title: 'Safety First', description: 'Your safety is our top priority. Every trek is planned with comprehensive risk assessments, emergency protocols, and experienced guides.', colorClass: 'safety' },
      { id: 2, icon: 'eco', title: 'Eco-Conscious', description: 'We practice leave-no-trace principles and actively support environmental conservation in the Himalayan region.', colorClass: 'eco' },
      { id: 3, icon: 'diversity_3', title: 'Community Impact', description: 'We employ local guides and porters, support local businesses, and contribute to community development projects.', colorClass: 'community' },
      { id: 4, icon: 'workspace_premium', title: 'Premium Quality', description: 'From equipment to accommodation, we ensure every aspect of your trek meets the highest standards of quality.', colorClass: 'quality' }
    ],
    teamMembers: [
      { id: 1, name: 'Madan Bhandari', initials: 'MB', role: 'Founder & Director', description: '20+ years of Himalayan expertise. Madan\'s passion for the mountains drives every expedition we organize.' },
      { id: 2, name: 'Ram Gurung', initials: 'RG', role: 'Head Guide', description: 'Certified mountaineer with extensive knowledge of all major trekking routes in Nepal.' },
      { id: 3, name: 'Sita Tamang', initials: 'ST', role: 'Operations Manager', description: 'Ensures every trek runs smoothly from start to finish with meticulous planning and coordination.' },
      { id: 4, name: 'Pasang Sherpa', initials: 'PS', role: 'Senior Trek Guide', description: 'Born in the Khumbu region, Pasang\'s intimate knowledge of the trails makes every trek special.' }
    ],
    aboutWhyChooseUs: [
      { id: 1, icon: 'verified_user', title: 'Licensed & Registered', description: 'Fully licensed by Nepal Tourism Board with all required permits and insurance coverage.' },
      { id: 2, icon: 'groups', title: 'Expert Local Guides', description: 'All our guides are certified, first-aid trained, and deeply knowledgeable about the trails.' },
      { id: 3, icon: 'tune', title: 'Custom Itineraries', description: 'Every trek can be customized to your fitness level, interests, and timeline.' },
      { id: 4, icon: 'support_agent', title: '24/7 Support', description: 'Round-the-clock assistance before, during, and after your trek through our Nepal team.' },
      { id: 5, icon: 'local_atm', title: 'Fair Transparent Pricing', description: 'No hidden fees. What you see is what you pay, with the best value for your money.' },
      { id: 6, icon: 'emoji_events', title: 'Proven Track Record', description: '1,200+ successful treks with a 98% success rate and glowing reviews from travelers worldwide.' }
    ],
    certifications: [
      { id: 1, icon: 'business', label: 'Company Reg.', value: '194768/075/076' },
      { id: 2, icon: 'card_membership', label: 'Tourism License', value: '2605' },
      { id: 3, icon: 'receipt_long', label: 'VAT Registration', value: '606643944' },
      { id: 4, icon: 'verified', label: 'Nepal Tourism Board', value: 'Certified' }
    ],
    aboutCta: {
      title: 'Ready to Trek With Us?',
      subtitle: 'Start planning your Himalayan adventure today. Our team is ready to help you create the trip of a lifetime.'
    }
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
            // New sections
            case 'destinations': content.destinations = row.content; break;
            case 'why_choose_us': content.whyChooseUs = row.content; break;
            case 'how_it_works': content.howItWorks = row.content; break;
            case 'trust_badges': content.trustBadges = row.content; break;
            case 'footer_tagline': content.footerTagline = row.content; break;
            case 'representatives': content.representatives = row.content; break;
            case 'contact_page': content.contactPage = row.content; break;
            case 'office_hours': content.officeHours = row.content; break;
            case 'about_hero': content.aboutHero = row.content; break;
            case 'about_story': content.aboutStory = row.content; break;
            case 'about_values': content.aboutValues = row.content; break;
            case 'team_members': content.teamMembers = row.content; break;
            case 'about_why_choose_us': content.aboutWhyChooseUs = row.content; break;
            case 'certifications': content.certifications = row.content; break;
            case 'about_cta': content.aboutCta = row.content; break;
          }
        }

        this.contentSubject.next(content);
      }
    } catch (e) {
      console.error('Error loading site content:', e);
    }
  }

  // ===== Existing section-level updates =====

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

  // ===== NEW: Homepage section updates =====

  updateDestinations(destinations: DestinationItem[]): void {
    const content = { ...this.getContent(), destinations };
    this.contentSubject.next(content);
    this.saveSection('destinations', destinations);
  }

  updateWhyChooseUs(whyChooseUs: WhyChooseItem[]): void {
    const content = { ...this.getContent(), whyChooseUs };
    this.contentSubject.next(content);
    this.saveSection('why_choose_us', whyChooseUs);
  }

  updateHowItWorks(howItWorks: HowItWorksStep[]): void {
    const content = { ...this.getContent(), howItWorks };
    this.contentSubject.next(content);
    this.saveSection('how_it_works', howItWorks);
  }

  updateTrustBadges(trustBadges: TrustBadge[]): void {
    const content = { ...this.getContent(), trustBadges };
    this.contentSubject.next(content);
    this.saveSection('trust_badges', trustBadges);
  }

  // ===== NEW: Footer updates =====

  updateFooterTagline(footerTagline: string): void {
    const content = { ...this.getContent(), footerTagline };
    this.contentSubject.next(content);
    this.saveSection('footer_tagline', footerTagline);
  }

  updateRepresentatives(representatives: RepresentativeItem[]): void {
    const content = { ...this.getContent(), representatives };
    this.contentSubject.next(content);
    this.saveSection('representatives', representatives);
  }

  // ===== NEW: Contact page updates =====

  updateContactPage(contactPage: ContactPageContent): void {
    const content = { ...this.getContent(), contactPage };
    this.contentSubject.next(content);
    this.saveSection('contact_page', contactPage);
  }

  updateOfficeHours(officeHours: OfficeHoursItem[]): void {
    const content = { ...this.getContent(), officeHours };
    this.contentSubject.next(content);
    this.saveSection('office_hours', officeHours);
  }

  // ===== NEW: About page updates =====

  updateAboutHero(aboutHero: AboutHeroContent): void {
    const content = { ...this.getContent(), aboutHero };
    this.contentSubject.next(content);
    this.saveSection('about_hero', aboutHero);
  }

  updateAboutStory(aboutStory: AboutStoryContent): void {
    const content = { ...this.getContent(), aboutStory };
    this.contentSubject.next(content);
    this.saveSection('about_story', aboutStory);
  }

  updateAboutValues(aboutValues: ValueItem[]): void {
    const content = { ...this.getContent(), aboutValues };
    this.contentSubject.next(content);
    this.saveSection('about_values', aboutValues);
  }

  updateTeamMembers(teamMembers: TeamMember[]): void {
    const content = { ...this.getContent(), teamMembers };
    this.contentSubject.next(content);
    this.saveSection('team_members', teamMembers);
  }

  updateAboutWhyChooseUs(aboutWhyChooseUs: WhyChooseItem[]): void {
    const content = { ...this.getContent(), aboutWhyChooseUs };
    this.contentSubject.next(content);
    this.saveSection('about_why_choose_us', aboutWhyChooseUs);
  }

  updateCertifications(certifications: CertificationItem[]): void {
    const content = { ...this.getContent(), certifications };
    this.contentSubject.next(content);
    this.saveSection('certifications', certifications);
  }

  updateAboutCta(aboutCta: AboutCTAContent): void {
    const content = { ...this.getContent(), aboutCta };
    this.contentSubject.next(content);
    this.saveSection('about_cta', aboutCta);
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
    // New sections
    this.saveSection('destinations', content.destinations);
    this.saveSection('why_choose_us', content.whyChooseUs);
    this.saveSection('how_it_works', content.howItWorks);
    this.saveSection('trust_badges', content.trustBadges);
    this.saveSection('footer_tagline', content.footerTagline);
    this.saveSection('representatives', content.representatives);
    this.saveSection('contact_page', content.contactPage);
    this.saveSection('office_hours', content.officeHours);
    this.saveSection('about_hero', content.aboutHero);
    this.saveSection('about_story', content.aboutStory);
    this.saveSection('about_values', content.aboutValues);
    this.saveSection('team_members', content.teamMembers);
    this.saveSection('about_why_choose_us', content.aboutWhyChooseUs);
    this.saveSection('certifications', content.certifications);
    this.saveSection('about_cta', content.aboutCta);
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
