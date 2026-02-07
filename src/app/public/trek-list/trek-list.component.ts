import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Trek, TrekFilter } from '../../models';
import { TrekService } from '../../services';

@Component({
  selector: 'app-trek-list',
  templateUrl: './trek-list.component.html',
  styleUrls: ['./trek-list.component.scss']
})
export class TrekListComponent implements OnInit {
  treks: Trek[] = [];
  filteredTreks: Trek[] = [];
  loading = true;

  filter: TrekFilter = {};
  regions: string[] = [];
  difficulties: string[] = [];
  searchText = '';
  sortBy = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  showAdvancedFilters = false;

  constructor(
    private trekService: TrekService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.regions = this.trekService.getRegions();
    this.difficulties = this.trekService.getDifficulties();
    this.loadTreks();
  }

  loadTreks(): void {
    this.loading = true;
    this.trekService.getAllTreks().subscribe({
      next: (treks) => {
        this.treks = treks;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading treks:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.treks];

    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.region.toLowerCase().includes(search) ||
        t.difficulty.toLowerCase().includes(search) ||
        (t.summary && t.summary.toLowerCase().includes(search))
      );
    }

    if (this.filter.difficulty) {
      result = result.filter(t => t.difficulty === this.filter.difficulty);
    }
    if (this.filter.region) {
      result = result.filter(t => t.region === this.filter.region);
    }
    if (this.filter.minDays) {
      result = result.filter(t => t.days >= this.filter.minDays!);
    }
    if (this.filter.maxDays) {
      result = result.filter(t => t.days <= this.filter.maxDays!);
    }
    if (this.filter.maxPrice) {
      result = result.filter(t => t.price <= this.filter.maxPrice!);
    }

    this.filteredTreks = result;
    this.applySort();
  }

  applySort(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredTreks.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        this.filteredTreks.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredTreks.sort((a, b) => b.price - a.price);
        break;
      case 'days-short':
        this.filteredTreks.sort((a, b) => a.days - b.days);
        break;
      case 'days-long':
        this.filteredTreks.sort((a, b) => b.days - a.days);
        break;
    }
  }

  toggleDifficulty(difficulty: string): void {
    if (this.filter.difficulty === difficulty) {
      this.filter.difficulty = undefined;
    } else {
      this.filter.difficulty = difficulty;
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.filter = {};
    this.searchText = '';
    this.applyFilters();
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'diff-easy';
      case 'moderate': return 'diff-moderate';
      case 'challenging': return 'diff-challenging';
      case 'difficult': return 'diff-difficult';
      default: return '';
    }
  }

  viewTrek(id: number): void {
    this.router.navigate(['/treks', id]);
  }
}
