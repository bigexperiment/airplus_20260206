import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserRole } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'fullName', 'role', 'actions'];
  dataSource: MatTableDataSource<User>;
  loading = true;

  userForm: FormGroup;
  isEditMode = false;
  editingUserId: number | null = null;
  showForm = false;

  userRoles = Object.values(UserRole);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: [''],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
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
    this.editingUserId = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  editUser(user: User): void {
    this.isEditMode = true;
    this.editingUserId = user.id;
    this.userForm.patchValue(user);
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.userForm.reset();
    this.isEditMode = false;
    this.editingUserId = null;
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;
    const operation = this.isEditMode
      ? this.userService.updateUser(this.editingUserId!, userData)
      : this.userService.createUser(userData);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'User updated successfully' : 'User created successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.loadUsers();
        this.cancelForm();
      },
      error: (error) => {
        console.error('Error saving user:', error);
        this.snackBar.open('Error saving user', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
