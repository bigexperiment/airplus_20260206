// ===== Media Asset Models =====

export interface MediaAsset {
  id: string;
  file_name: string;
  original_name: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  tags: string[];
  used_in: string[];
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaUploadResult {
  asset: MediaAsset;
  error?: string;
}

export interface MediaFilter {
  search?: string;
  tag?: string;
  usedIn?: string;
  mimeType?: string;
  sortBy?: 'created_at' | 'file_name' | 'file_size';
  sortOrder?: 'asc' | 'desc';
}

// Predefined usage locations for tracking where images are used
export const USAGE_LOCATIONS: { value: string; label: string }[] = [
  { value: 'home-hero', label: 'Home — Hero Background' },
  { value: 'home-destinations', label: 'Home — Destinations' },
  { value: 'home-gallery', label: 'Home — Gallery' },
  { value: 'home-cultural-tours', label: 'Home — Cultural Tours' },
  { value: 'about-hero', label: 'About — Hero' },
  { value: 'about-story', label: 'About — Story Image' },
  { value: 'about-team', label: 'About — Team Photos' },
  { value: 'contact-hero', label: 'Contact — Hero' },
  { value: 'trek-thumbnail', label: 'Trek — Thumbnail' },
  { value: 'trek-gallery', label: 'Trek — Gallery' },
  { value: 'category-image', label: 'Category — Image' },
  { value: 'logo', label: 'Logo / Branding' },
  { value: 'favicon', label: 'Favicon' },
  { value: 'other', label: 'Other' },
];

