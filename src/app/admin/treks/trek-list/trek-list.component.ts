import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Trek } from '../../../models';
import { TrekService } from '../../../services';

@Component({
  selector: 'app-admin-trek-list',
  templateUrl: './trek-list.component.html',
  styleUrls: ['./trek-list.component.scss']
})
export class AdminTrekListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'region', 'difficulty', 'days', 'price', 'actions'];
  dataSource: MatTableDataSource<Trek>;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private trekService: TrekService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Trek>([]);
  }

  ngOnInit(): void {
    this.loadTreks();
  }

  loadTreks(): void {
    this.loading = true;
    this.trekService.getAllTreks().subscribe({
      next: (treks) => {
        this.dataSource.data = treks;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading treks:', error);
        this.snackBar.open('Error loading treks', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createTrek(): void {
    this.router.navigate(['/admin/treks/new']);
  }

  editTrek(id: number): void {
    this.router.navigate(['/admin/treks', id, 'edit']);
  }

  deleteTrek(trek: Trek): void {
    if (confirm(`Are you sure you want to delete "${trek.name}"?`)) {
      this.trekService.deleteTrek(trek.id).subscribe({
        next: () => {
          this.snackBar.open('Trek deleted successfully', 'Close', { duration: 3000 });
          this.loadTreks();
        },
        error: (error) => {
          console.error('Error deleting trek:', error);
          this.snackBar.open('Error deleting trek', 'Close', { duration: 3000 });
        }
      });
    }
  }

  viewTrek(id: number): void {
    this.router.navigate(['/treks', id]);
  }
}
