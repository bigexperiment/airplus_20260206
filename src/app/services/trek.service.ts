import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trek, TrekFilter } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TrekService {
  private apiUrl = `${environment.apiUrl}/treks`;

  // AirPlus Nepal Trek Data
  private mockTreks: Trek[] = [
    {
      id: 1,
      name: 'Everest Base Camp',
      region: 'Everest',
      difficulty: 'Moderate',
      days: 11,
      price: 1200,
      summary: 'Trek to the base of the world\'s highest mountain through stunning Sherpa villages and breathtaking Himalayan scenery.',
      itinerary: 'Day 1: Fly to Lukla, trek to Phakding\nDay 2-3: Trek to Namche Bazaar\nDay 4: Acclimatization day\nDay 5-8: Trek to Everest Base Camp\nDay 9-11: Return journey to Lukla',
      bestSeason: 'March-May, September-November',
      imageUrl: 'https://www.airplusnepal.com/information/assets/trekking_everest1.jpg'
    },
    {
      id: 2,
      name: 'Annapurna Base Camp',
      region: 'Annapurna',
      difficulty: 'Moderate',
      days: 11,
      price: 1100,
      summary: 'Journey through diverse landscapes to the heart of the Annapurna sanctuary with panoramic mountain views.',
      itinerary: 'Day 1: Drive to Nayapul, trek to Tikhedhunga\nDay 2-5: Trek through Ghorepani, Tadapani to ABC\nDay 6-8: Explore ABC and return\nDay 9-11: Trek back and drive to Pokhara',
      bestSeason: 'March-May, October-November',
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_1.jpg'
    },
    {
      id: 3,
      name: 'Annapurna Circuit',
      region: 'Annapurna',
      difficulty: 'Moderate',
      days: 15,
      price: 1500,
      summary: 'Complete circuit around the Annapurna massif crossing the famous Thorong La Pass at 5,416m.',
      itinerary: 'Day 1-5: Trek through lower Annapurna region\nDay 6-10: High altitude trekking and acclimatization\nDay 11: Cross Thorong La Pass\nDay 12-15: Descend through Muktinath and return',
      bestSeason: 'March-May, October-November',
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_2.jpg'
    },
    {
      id: 4,
      name: 'Manaslu Circuit',
      region: 'Manaslu',
      difficulty: 'Moderate',
      days: 15,
      price: 1400,
      summary: 'Off-the-beaten-path trek around the eighth highest mountain in the world through remote villages.',
      itinerary: 'Day 1-7: Trek through remote villages and forests\nDay 8-10: High altitude trekking\nDay 11: Cross Larkya La Pass (5,160m)\nDay 12-15: Descend and return',
      bestSeason: 'March-May, September-November',
      imageUrl: 'https://www.airplusnepal.com/information/assets/trekking_manaslu1.jpg'
    },
    {
      id: 5,
      name: 'Poon Hill',
      region: 'Annapurna',
      difficulty: 'Easy',
      days: 8,
      price: 700,
      summary: 'Perfect short trek with stunning sunrise views over the Annapurna and Dhaulagiri ranges.',
      itinerary: 'Day 1: Drive to Nayapul, trek to Tikhedhunga\nDay 2-3: Trek to Ghorepani\nDay 4: Sunrise at Poon Hill, trek to Tadapani\nDay 5-8: Return journey',
      bestSeason: 'Year-round (except monsoon)',
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_3.jpg'
    }
  ];

  // Cultural Tours Data
  private culturalTours = [
    {
      id: 101,
      name: 'Kathmandu & Nagarkot',
      days: 4,
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_4.jpg',
      description: 'Explore ancient temples and enjoy Himalayan sunrise views'
    },
    {
      id: 102,
      name: 'Kathmandu & Pokhara',
      days: 5,
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_5.jpg',
      description: 'Visit cultural sites and the beautiful lakeside city'
    },
    {
      id: 103,
      name: 'Kathmandu & Chitwan',
      days: 6,
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_6.jpg',
      description: 'Culture meets wildlife in this diverse tour'
    },
    {
      id: 104,
      name: 'Kathmandu & Lumbini',
      days: 5,
      imageUrl: 'https://www.airplusnepal.com/information/assets/gallery_7.jpg',
      description: 'Spiritual journey to the birthplace of Buddha'
    }
  ];

  constructor(private http: HttpClient) {}

  getAllTreks(filter?: TrekFilter): Observable<Trek[]> {
    let filtered = [...this.mockTreks];

    if (filter) {
      if (filter.region) {
        filtered = filtered.filter(t => t.region === filter.region);
      }
      if (filter.difficulty) {
        filtered = filtered.filter(t => t.difficulty === filter.difficulty);
      }
      if (filter.minDays) {
        filtered = filtered.filter(t => t.days >= filter.minDays!);
      }
      if (filter.maxDays) {
        filtered = filtered.filter(t => t.days <= filter.maxDays!);
      }
      if (filter.search) {
        const search = filter.search.toLowerCase();
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(search) ||
          t.summary.toLowerCase().includes(search)
        );
      }
    }

    return of(filtered);
  }

  getTrekById(id: number): Observable<Trek> {
    const trek = this.mockTreks.find(t => t.id === id);
    return of(trek!);
  }

  getCulturalTours(): Observable<any[]> {
    return of(this.culturalTours);
  }

  createTrek(trek: Partial<Trek>): Observable<Trek> {
    const newTrek: Trek = {
      ...trek as Trek,
      id: Math.max(...this.mockTreks.map(t => t.id)) + 1
    };
    this.mockTreks.push(newTrek);
    return of(newTrek);
  }

  updateTrek(id: number, trek: Partial<Trek>): Observable<Trek> {
    const index = this.mockTreks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTreks[index] = { ...this.mockTreks[index], ...trek };
      return of(this.mockTreks[index]);
    }
    throw new Error('Trek not found');
  }

  deleteTrek(id: number): Observable<void> {
    const index = this.mockTreks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTreks.splice(index, 1);
    }
    return of(void 0);
  }

  getRegions(): string[] {
    return ['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Mustang', 'Dolpo'];
  }

  getDifficulties(): string[] {
    return ['Easy', 'Moderate', 'Challenging', 'Difficult'];
  }
}
