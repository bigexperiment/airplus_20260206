import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrekService, CategoryService } from '../../../services';
import { Category } from '../../../models';

@Component({
  selector: 'app-trek-form',
  templateUrl: './trek-form.component.html',
  styleUrls: ['./trek-form.component.scss']
})
export class TrekFormComponent implements OnInit {
  trekForm: FormGroup;
  isEditMode = false;
  trekId: number | null = null;
  loading = false;
  submitting = false;

  regions: string[] = [];
  difficulties: string[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private trekService: TrekService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.trekForm = this.fb.group({
      name: ['', Validators.required],
      region: ['', Validators.required],
      difficulty: ['', Validators.required],
      days: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      summary: ['', Validators.required],
      itinerary: ['', Validators.required],
      bestSeason: ['', Validators.required],
      imageUrl: ['', Validators.required],
      categoryId: [null]
    });
  }

  ngOnInit(): void {
    this.regions = this.trekService.getRegions();
    this.difficulties = this.trekService.getDifficulties();
    this.loadCategories();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.trekId = +id;
      this.loadTrek(this.trekId);
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadTrek(id: number): void {
    this.loading = true;
    this.trekService.getTrekById(id).subscribe({
      next: (trek) => {
        this.trekForm.patchValue(trek);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trek:', error);
        this.snackBar.open('Error loading trek', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/treks']);
      }
    });
  }

  submit(): void {
    if (this.trekForm.invalid) {
      return;
    }

    this.submitting = true;
    const trekData = this.trekForm.value;

    const operation = this.isEditMode
      ? this.trekService.updateTrek(this.trekId!, trekData)
      : this.trekService.createTrek(trekData);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Trek updated successfully' : 'Trek created successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.router.navigate(['/admin/treks']);
      },
      error: (error) => {
        console.error('Error saving trek:', error);
        this.snackBar.open('Error saving trek', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/treks']);
  }
}
