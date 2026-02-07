// ===== Site Content Models =====
// All editable content sections for the entire website

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface StatItem {
  id: number;
  value: string;
  label: string;
}

export interface ServiceItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  colorClass: string; // '', 'purple', 'orange'
  link: string; // section id or route
}

export interface Testimonial {
  id: number;
  quote: string;
  authorName: string;
  authorInitials: string;
  tripName: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

export interface CulturalTour {
  id: number;
  name: string;
  days: number;
  imageUrl: string;
  description: string;
}

export interface CTAContent {
  title: string;
  message: string;
  directorName: string;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  directorName: string;
  registration: string;
  license: string;
  vat: string;
}

// ===== NEW: Footer =====
export interface RepresentativeItem {
  id: number;
  country: string;
  email: string;
  name: string;
}

// ===== NEW: Contact Page =====
export interface OfficeHoursItem {
  id: number;
  days: string;
  hours: string;
}

export interface ContactPageContent {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  timezone: string;
}

// ===== NEW: About Page =====
export interface AboutHeroContent {
  badge: string;
  title: string;
  subtitle: string;
}

export interface AboutStoryContent {
  imageUrl: string;
  yearsValue: string;
  yearsLabel: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  stats: { value: string; label: string }[];
}

export interface ValueItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  colorClass: string; // 'safety', 'eco', 'community', 'quality'
}

export interface TeamMember {
  id: number;
  name: string;
  initials: string;
  role: string;
  description: string;
}

export interface WhyChooseItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface CertificationItem {
  id: number;
  icon: string;
  label: string;
  value: string;
}

export interface AboutCTAContent {
  title: string;
  subtitle: string;
}

// ===== NEW: Home Page =====
export interface DestinationItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  trekCount: string;
  size: string; // 'large' or 'normal'
}

export interface HowItWorksStep {
  id: number;
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface TrustBadge {
  id: number;
  icon: string;
  label: string;
}

// ===== Master SiteContent =====
export interface SiteContent {
  // --- Homepage (existing) ---
  hero: HeroContent;
  stats: StatItem[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  gallery: GalleryImage[];
  culturalTours: CulturalTour[];
  cta: CTAContent;
  companyInfo: CompanyInfo;
  ratingScore: string;
  ratingCount: string;

  // --- Homepage (new sections) ---
  destinations: DestinationItem[];
  whyChooseUs: WhyChooseItem[];
  howItWorks: HowItWorksStep[];
  trustBadges: TrustBadge[];

  // --- Footer ---
  footerTagline: string;
  representatives: RepresentativeItem[];

  // --- Contact Page ---
  contactPage: ContactPageContent;
  officeHours: OfficeHoursItem[];

  // --- About Page ---
  aboutHero: AboutHeroContent;
  aboutStory: AboutStoryContent;
  aboutValues: ValueItem[];
  teamMembers: TeamMember[];
  aboutWhyChooseUs: WhyChooseItem[];
  certifications: CertificationItem[];
  aboutCta: AboutCTAContent;
}
