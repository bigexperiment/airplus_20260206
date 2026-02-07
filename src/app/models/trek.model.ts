export interface Trek {
  id: number;
  name: string;
  region: string;
  difficulty: string;
  days: number;
  price: number;
  summary: string;
  itinerary: string;
  bestSeason: string;
  imageUrl: string;
  categoryId?: number;
  categoryName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrekFilter {
  region?: string;
  difficulty?: string;
  minDays?: number;
  maxDays?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
