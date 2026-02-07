import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../models';
import { CategoryService } from '../../services';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: MatTableDataSource<Category>;
  loading = true;

  categoryForm: FormGroup;
  isEditMode = false;
  editingCategoryId: number | null = null;
  showForm = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Category>([]);
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
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

  showCreateForm(): void {
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.categoryForm.reset();
    this.showForm = true;
  }

  editCategory(category: Category): void {
    this.isEditMode = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue(category);
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.categoryForm.reset();
    this.isEditMode = false;
    this.editingCategoryId = null;
  }

  submitForm(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const categoryData = this.categoryForm.value;
    const operation = this.isEditMode
      ? this.categoryService.updateCategory(this.editingCategoryId!, categoryData)
      : this.categoryService.createCategory(categoryData);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Category updated successfully' : 'Category created successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.loadCategories();
        this.cancelForm();
      },
      error: (error) => {
        console.error('Error saving category:', error);
        this.snackBar.open('Error saving category', 'Close', { duration: 3000 });
      }
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.snackBar.open('Error deleting category', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
