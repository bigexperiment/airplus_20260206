import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Trek, SiteContent, DestinationItem, WhyChooseItem, HowItWorksStep, TrustBadge } from '../../models';
import { TrekService, SiteContentService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredTreks: Trek[] = [];
  loading = true;

  // Site content (reactive)
  content!: SiteContent;
  destinations: DestinationItem[] = [];
  whyChooseUs: WhyChooseItem[] = [];
  howItWorks: HowItWorksStep[] = [];
  trustBadges: TrustBadge[] = [];
  private contentSub!: Subscription;

  constructor(
    private trekService: TrekService,
    private siteContentService: SiteContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contentSub = this.siteContentService.content$.subscribe(content => {
      this.content = content;
      this.destinations = content.destinations;
      this.whyChooseUs = content.whyChooseUs;
      this.howItWorks = content.howItWorks;
      this.trustBadges = content.trustBadges;
    });
    this.loadFeaturedTreks();
  }

  ngOnDestroy(): void {
    if (this.contentSub) {
      this.contentSub.unsubscribe();
    }
  }

  loadFeaturedTreks(): void {
    this.trekService.getAllTreks().subscribe({
      next: (treks) => {
        this.featuredTreks = treks.slice(0, 5);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading treks:', error);
        this.loading = false;
      }
    });
  }

  viewTrek(id: number): void {
    this.router.navigate(['/treks', id]);
  }

  viewAllTreks(): void {
    this.router.navigate(['/treks']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatTitle(title: string): string {
    return title ? title.replace(/\\n/g, '<br>') : '';
  }
}
