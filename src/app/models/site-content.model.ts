// ===== Site Content Models =====
// All editable content sections for the homepage & site

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

export interface SiteContent {
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
}

