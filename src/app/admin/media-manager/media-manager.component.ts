import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MediaService } from '../../services/media.service';
import { MediaAsset, MediaFilter, USAGE_LOCATIONS } from '../../models/media-asset.model';

@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('replaceInput') replaceInput!: ElementRef<HTMLInputElement>;

  assets: MediaAsset[] = [];
  loading = false;
  dragOver = false;

  // Filters
  searchQuery = '';
  selectedTag = '';
  selectedUsage = '';
  allTags: string[] = [];
  usageLocations = USAGE_LOCATIONS;

  // Selected asset for details panel
  selectedAsset: MediaAsset | null = null;
  editingAltText = false;
  editAltText = '';
  editingTags = false;
  editTagsStr = '';
  editingUsage = false;
  editUsedIn: string[] = [];

  // Upload dialog
  showUploadDialog = false;
  uploadTags: string[] = [];
  uploadTagInput = '';
  uploadUsedIn: string[] = [];
  uploadAltText = '';
  pendingFiles: File[] = [];
  uploading = false;

  // Replace
  replacingAssetId: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private mediaService: MediaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.mediaService.assets$.subscribe(assets => {
        this.assets = assets;
        this.mediaService.getAllTags().then(tags => this.allTags = tags);
      }),
      this.mediaService.loading$.subscribe(l => this.loading = l)
    );
    this.mediaService.loadAssets();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  // ===== Search & Filter =====
  applyFilters(): void {
    const filter: MediaFilter = {};
    if (this.searchQuery.trim()) filter.search = this.searchQuery.trim();
    if (this.selectedTag) filter.tag = this.selectedTag;
    if (this.selectedUsage) filter.usedIn = this.selectedUsage;
    this.mediaService.loadAssets(filter);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedTag = '';
    this.selectedUsage = '';
    this.mediaService.loadAssets();
  }

  // ===== Drag & Drop =====
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  // ===== File Selection =====
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  handleFiles(files: File[]): void {
    // Filter to only images
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      this.snackBar.open('Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)', 'OK', { duration: 3000 });
      return;
    }
    if (imageFiles.length !== files.length) {
      this.snackBar.open(`${files.length - imageFiles.length} non-image file(s) were skipped`, 'OK', { duration: 3000 });
    }

    this.pendingFiles = imageFiles;
    this.uploadTags = [];
    this.uploadTagInput = '';
    this.uploadUsedIn = [];
    this.uploadAltText = '';
    this.showUploadDialog = true;
  }

  // ===== Upload Dialog =====
  addUploadTag(): void {
    const tag = this.uploadTagInput.trim().toLowerCase();
    if (tag && !this.uploadTags.includes(tag)) {
      this.uploadTags.push(tag);
    }
    this.uploadTagInput = '';
  }

  removeUploadTag(tag: string): void {
    this.uploadTags = this.uploadTags.filter(t => t !== tag);
  }

  toggleUploadUsage(usage: string): void {
    const idx = this.uploadUsedIn.indexOf(usage);
    if (idx > -1) {
      this.uploadUsedIn.splice(idx, 1);
    } else {
      this.uploadUsedIn.push(usage);
    }
  }

  cancelUpload(): void {
    this.showUploadDialog = false;
    this.pendingFiles = [];
  }

  async confirmUpload(): Promise<void> {
    if (this.pendingFiles.length === 0) return;
    this.uploading = true;

    try {
      if (this.pendingFiles.length === 1) {
        const result = await this.mediaService.uploadFile(
          this.pendingFiles[0],
          this.uploadAltText,
          this.uploadTags,
          this.uploadUsedIn
        );
        if (result) {
          this.snackBar.open('Image uploaded successfully!', 'OK', { duration: 3000 });
        } else {
          this.snackBar.open('Upload failed. Please try again.', 'OK', { duration: 3000 });
        }
      } else {
        const results = await this.mediaService.uploadFiles(
          this.pendingFiles,
          this.uploadTags,
          this.uploadUsedIn
        );
        this.snackBar.open(`${results.length} of ${this.pendingFiles.length} images uploaded!`, 'OK', { duration: 3000 });
      }
    } catch (err) {
      this.snackBar.open('Upload failed. Please try again.', 'OK', { duration: 3000 });
    } finally {
      this.uploading = false;
      this.showUploadDialog = false;
      this.pendingFiles = [];
    }
  }

  // ===== Select Asset =====
  selectAsset(asset: MediaAsset): void {
    this.selectedAsset = asset;
    this.editingAltText = false;
    this.editingTags = false;
    this.editingUsage = false;
  }

  closeDetailPanel(): void {
    this.selectedAsset = null;
  }

  // ===== Edit Alt Text =====
  startEditAltText(): void {
    if (!this.selectedAsset) return;
    this.editAltText = this.selectedAsset.alt_text || '';
    this.editingAltText = true;
  }

  async saveAltText(): Promise<void> {
    if (!this.selectedAsset) return;
    const success = await this.mediaService.updateAsset(this.selectedAsset.id, { alt_text: this.editAltText });
    if (success) {
      this.selectedAsset.alt_text = this.editAltText;
      this.snackBar.open('Alt text updated', 'OK', { duration: 2000 });
    }
    this.editingAltText = false;
  }

  cancelEditAltText(): void {
    this.editingAltText = false;
  }

  // ===== Edit Tags =====
  startEditTags(): void {
    if (!this.selectedAsset) return;
    this.editTagsStr = (this.selectedAsset.tags || []).join(', ');
    this.editingTags = true;
  }

  async saveTags(): Promise<void> {
    if (!this.selectedAsset) return;
    const tags = this.editTagsStr.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    const success = await this.mediaService.updateAsset(this.selectedAsset.id, { tags });
    if (success) {
      this.selectedAsset.tags = tags;
      this.snackBar.open('Tags updated', 'OK', { duration: 2000 });
    }
    this.editingTags = false;
  }

  cancelEditTags(): void {
    this.editingTags = false;
  }

  // ===== Edit Usage =====
  startEditUsage(): void {
    if (!this.selectedAsset) return;
    this.editUsedIn = [...(this.selectedAsset.used_in || [])];
    this.editingUsage = true;
  }

  toggleEditUsage(usage: string): void {
    const idx = this.editUsedIn.indexOf(usage);
    if (idx > -1) {
      this.editUsedIn.splice(idx, 1);
    } else {
      this.editUsedIn.push(usage);
    }
  }

  async saveUsage(): Promise<void> {
    if (!this.selectedAsset) return;
    const success = await this.mediaService.updateAsset(this.selectedAsset.id, { used_in: this.editUsedIn });
    if (success) {
      this.selectedAsset.used_in = [...this.editUsedIn];
      this.snackBar.open('Usage locations updated', 'OK', { duration: 2000 });
    }
    this.editingUsage = false;
  }

  cancelEditUsage(): void {
    this.editingUsage = false;
  }

  // ===== Replace File =====
  triggerReplace(asset: MediaAsset): void {
    this.replacingAssetId = asset.id;
    this.replaceInput.nativeElement.click();
  }

  async onReplaceFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.replacingAssetId) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Only image files allowed', 'OK', { duration: 3000 });
      return;
    }

    const success = await this.mediaService.replaceFile(this.replacingAssetId, file);
    if (success) {
      this.snackBar.open('Image replaced successfully!', 'OK', { duration: 3000 });
      // Refresh selected asset
      if (this.selectedAsset?.id === this.replacingAssetId) {
        const updated = this.assets.find(a => a.id === this.replacingAssetId);
        if (updated) this.selectedAsset = updated;
      }
    } else {
      this.snackBar.open('Replace failed. Please try again.', 'OK', { duration: 3000 });
    }
    this.replacingAssetId = null;
    input.value = '';
  }

  // ===== Delete =====
  async deleteAsset(asset: MediaAsset): Promise<void> {
    if (!confirm(`Delete "${asset.original_name}"? This cannot be undone.`)) return;

    const success = await this.mediaService.deleteAsset(asset.id);
    if (success) {
      this.snackBar.open('Image deleted', 'OK', { duration: 3000 });
      if (this.selectedAsset?.id === asset.id) {
        this.selectedAsset = null;
      }
    } else {
      this.snackBar.open('Delete failed. Please try again.', 'OK', { duration: 3000 });
    }
  }

  // ===== Copy URL =====
  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('URL copied to clipboard!', 'OK', { duration: 2000 });
    });
  }

  // ===== Helpers =====
  formatSize(bytes: number): string {
    return MediaService.formatFileSize(bytes);
  }

  getUsageLabel(value: string): string {
    const found = USAGE_LOCATIONS.find(u => u.value === value);
    return found ? found.label : value;
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('svg')) return 'draw';
    if (mimeType.includes('gif')) return 'gif';
    if (mimeType.includes('webp')) return 'image';
    return 'photo';
  }

  trackById(index: number, item: MediaAsset): string {
    return item.id;
  }
}

