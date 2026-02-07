import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaService } from '../../../services/media.service';
import { MediaAsset } from '../../../models/media-asset.model';

export interface ImagePickerData {
  title?: string;
  currentUrl?: string;
  usageTag?: string; // e.g. 'home-hero' to pre-filter
}

@Component({
  selector: 'app-image-picker-dialog',
  template: `
    <div class="image-picker-dialog">
      <h2 mat-dialog-title>{{ data.title || 'Choose an Image' }}</h2>

      <mat-dialog-content>
        <!-- Search & Upload -->
        <div class="picker-toolbar">
          <mat-form-field appearance="outline" class="search-input">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search images..." [(ngModel)]="searchQuery" (keyup.enter)="search()">
          </mat-form-field>
          <button mat-stroked-button (click)="fileInput.click()" class="upload-inline">
            <mat-icon>add_photo_alternate</mat-icon>
            Upload New
          </button>
          <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)">
        </div>

        <!-- Current Image -->
        <div class="current-image" *ngIf="data.currentUrl">
          <span class="label">Current:</span>
          <img [src]="data.currentUrl" alt="Current image">
        </div>

        <!-- Loading -->
        <div class="picker-loading" *ngIf="loading">
          <mat-spinner diameter="32"></mat-spinner>
        </div>

        <!-- Image Grid -->
        <div class="picker-grid" *ngIf="!loading">
          <div class="picker-item"
               *ngFor="let asset of assets"
               [class.selected]="selectedAsset?.id === asset.id"
               (click)="selectAsset(asset)">
            <img [src]="asset.public_url" [alt]="asset.alt_text || asset.original_name" loading="lazy">
            <div class="picker-item-info">
              <span>{{ asset.original_name }}</span>
            </div>
            <div class="selected-check" *ngIf="selectedAsset?.id === asset.id">
              <mat-icon>check_circle</mat-icon>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div class="picker-empty" *ngIf="!loading && assets.length === 0">
          <mat-icon>photo_library</mat-icon>
          <p>No images found. Upload one!</p>
        </div>

        <!-- Manual URL -->
        <mat-expansion-panel class="manual-url-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>Or enter URL manually</mat-panel-title>
          </mat-expansion-panel-header>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Image URL</mat-label>
            <input matInput [(ngModel)]="manualUrl" placeholder="https://...">
          </mat-form-field>
          <button mat-stroked-button color="primary" (click)="useManualUrl()" [disabled]="!manualUrl.trim()">
            Use This URL
          </button>
        </mat-expansion-panel>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" [disabled]="!selectedAsset" (click)="confirm()">
          <mat-icon>check</mat-icon>
          Select Image
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .image-picker-dialog {
      min-width: 500px;
      max-width: 700px;
    }

    .picker-toolbar {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 12px;

      .search-input {
        flex: 1;

        ::ng-deep .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }

      .upload-inline {
        height: 44px;
        border-radius: 10px;
      }
    }

    .current-image {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 12px;

      .label {
        font-size: 0.82rem;
        color: #64748b;
        font-weight: 600;
      }

      img {
        width: 60px;
        height: 45px;
        object-fit: cover;
        border-radius: 6px;
      }
    }

    .picker-loading {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .picker-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
      max-height: 350px;
      overflow-y: auto;
      padding: 4px;
    }

    .picker-item {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      background: #f8fafc;

      &:hover {
        border-color: rgba(14, 165, 233, 0.3);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }

      &.selected {
        border-color: #0ea5e9;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
      }

      img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        display: block;
      }

      .picker-item-info {
        padding: 4px 6px;
        span {
          font-size: 0.72rem;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }

      .selected-check {
        position: absolute;
        top: 6px;
        right: 6px;
        color: #0ea5e9;
        background: white;
        border-radius: 50%;
        line-height: 1;
      }
    }

    .picker-empty {
      text-align: center;
      padding: 40px;
      color: #64748b;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.4;
      }
    }

    .manual-url-panel {
      margin-top: 12px;

      .full-width {
        width: 100%;
      }
    }

    @media (max-width: 600px) {
      .image-picker-dialog {
        min-width: unset;
        width: 100%;
      }

      .picker-toolbar {
        flex-direction: column;

        .search-input {
          width: 100%;
        }
      }
    }
  `]
})
export class ImagePickerDialogComponent implements OnInit {
  assets: MediaAsset[] = [];
  loading = false;
  searchQuery = '';
  selectedAsset: MediaAsset | null = null;
  manualUrl = '';

  constructor(
    public dialogRef: MatDialogRef<ImagePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImagePickerData,
    private mediaService: MediaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    this.loading = true;
    await this.mediaService.loadAssets(
      this.data.usageTag ? { usedIn: this.data.usageTag } : undefined
    );
    this.mediaService.assets$.subscribe(assets => {
      this.assets = assets;
      this.loading = false;
    });
  }

  search(): void {
    this.loading = true;
    this.mediaService.loadAssets(
      this.searchQuery.trim()
        ? { search: this.searchQuery.trim() }
        : undefined
    ).then(() => this.loading = false);
  }

  selectAsset(asset: MediaAsset): void {
    this.selectedAsset = asset;
  }

  confirm(): void {
    if (this.selectedAsset) {
      this.dialogRef.close(this.selectedAsset.public_url);
    }
  }

  useManualUrl(): void {
    if (this.manualUrl.trim()) {
      this.dialogRef.close(this.manualUrl.trim());
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Only image files allowed', 'OK', { duration: 3000 });
      return;
    }

    this.loading = true;
    const asset = await this.mediaService.uploadFile(file, '', [], this.data.usageTag ? [this.data.usageTag] : []);
    if (asset) {
      this.snackBar.open('Image uploaded!', 'OK', { duration: 2000 });
      this.selectedAsset = asset;
    }
    this.loading = false;
    input.value = '';
  }
}

