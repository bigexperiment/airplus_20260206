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
    this.trekService.getAllTreks(this.filter).subscribe({
      next: (treks) => {
        this.treks = treks;
        this.filteredTreks = treks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading treks:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filter.search = this.searchText;
    this.loadTreks();
  }

  clearFilters(): void {
    this.filter = {};
    this.searchText = '';
    this.loadTreks();
  }

  viewTrek(id: number): void {
    this.router.navigate(['/treks', id]);
  }
}
