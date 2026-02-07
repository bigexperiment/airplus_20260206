import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { MediaAsset, MediaFilter } from '../models/media-asset.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private assetsSubject = new BehaviorSubject<MediaAsset[]>([]);
  public assets$ = this.assetsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private readonly BUCKET = 'website-assets';
  private readonly TABLE = 'media_assets';

  constructor(private supabaseService: SupabaseService) {}

  // ===== Load all assets =====
  async loadAssets(filter?: MediaFilter): Promise<void> {
    this.loadingSubject.next(true);
    try {
      let query = this.supabaseService.client
        .from(this.TABLE)
        .select('*');

      // Apply search filter
      if (filter?.search) {
        query = query.or(
          `file_name.ilike.%${filter.search}%,original_name.ilike.%${filter.search}%,alt_text.ilike.%${filter.search}%`
        );
      }

      // Apply tag filter
      if (filter?.tag) {
        query = query.contains('tags', [filter.tag]);
      }

      // Apply usage filter
      if (filter?.usedIn) {
        query = query.contains('used_in', [filter.usedIn]);
      }

      // Apply mime type filter
      if (filter?.mimeType) {
        query = query.eq('mime_type', filter.mimeType);
      }

      // Apply sorting
      const sortBy = filter?.sortBy || 'created_at';
      const sortOrder = filter?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;
      if (error) throw error;
      this.assetsSubject.next(data || []);
    } catch (err) {
      console.error('Error loading media assets:', err);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // ===== Upload a file =====
  async uploadFile(file: File, altText: string = '', tags: string[] = [], usedIn: string[] = []): Promise<MediaAsset | null> {
    this.loadingSubject.next(true);
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${timestamp}_${sanitizedName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await this.supabaseService.client
        .storage
        .from(this.BUCKET)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: urlData } = this.supabaseService.client
        .storage
        .from(this.BUCKET)
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;

      // 3. Get image dimensions if it's an image
      const dimensions = await this.getImageDimensions(file);

      // 4. Get the current user email
      const { data: { session } } = await this.supabaseService.client.auth.getSession();
      const uploadedBy = session?.user?.email || 'unknown';

      // 5. Insert metadata into the media_assets table
      const { data: asset, error: dbError } = await this.supabaseService.client
        .from(this.TABLE)
        .insert({
          file_name: sanitizedName,
          original_name: file.name,
          storage_path: storagePath,
          public_url: publicUrl,
          alt_text: altText,
          tags: tags,
          used_in: usedIn,
          file_size: file.size,
          mime_type: file.type,
          width: dimensions?.width || null,
          height: dimensions?.height || null,
          uploaded_by: uploadedBy
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Refresh the list
      await this.loadAssets();
      return asset;
    } catch (err) {
      console.error('Error uploading file:', err);
      return null;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // ===== Upload multiple files =====
  async uploadFiles(files: File[], tags: string[] = [], usedIn: string[] = []): Promise<MediaAsset[]> {
    const results: MediaAsset[] = [];
    for (const file of files) {
      const asset = await this.uploadFile(file, '', tags, usedIn);
      if (asset) results.push(asset);
    }
    return results;
  }

  // ===== Update asset metadata =====
  async updateAsset(id: string, updates: Partial<Pick<MediaAsset, 'alt_text' | 'tags' | 'used_in'>>): Promise<boolean> {
    try {
      const { error } = await this.supabaseService.client
        .from(this.TABLE)
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await this.loadAssets();
      return true;
    } catch (err) {
      console.error('Error updating media asset:', err);
      return false;
    }
  }

  // ===== Replace a file (keep same metadata, swap the file) =====
  async replaceFile(assetId: string, newFile: File): Promise<boolean> {
    try {
      // 1. Get the existing asset
      const { data: existing, error: fetchError } = await this.supabaseService.client
        .from(this.TABLE)
        .select('*')
        .eq('id', assetId)
        .single();

      if (fetchError || !existing) throw fetchError || new Error('Asset not found');

      // 2. Delete the old file from storage
      await this.supabaseService.client
        .storage
        .from(this.BUCKET)
        .remove([existing.storage_path]);

      // 3. Upload the new file with a new path
      const timestamp = Date.now();
      const sanitizedName = newFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const newStoragePath = `${timestamp}_${sanitizedName}`;

      const { error: uploadError } = await this.supabaseService.client
        .storage
        .from(this.BUCKET)
        .upload(newStoragePath, newFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 4. Get the new public URL
      const { data: urlData } = this.supabaseService.client
        .storage
        .from(this.BUCKET)
        .getPublicUrl(newStoragePath);

      // 5. Get new dimensions
      const dimensions = await this.getImageDimensions(newFile);

      // 6. Update the database record
      const { error: updateError } = await this.supabaseService.client
        .from(this.TABLE)
        .update({
          file_name: sanitizedName,
          original_name: newFile.name,
          storage_path: newStoragePath,
          public_url: urlData.publicUrl,
          file_size: newFile.size,
          mime_type: newFile.type,
          width: dimensions?.width || null,
          height: dimensions?.height || null
        })
        .eq('id', assetId);

      if (updateError) throw updateError;

      await this.loadAssets();
      return true;
    } catch (err) {
      console.error('Error replacing file:', err);
      return false;
    }
  }

  // ===== Delete an asset =====
  async deleteAsset(id: string): Promise<boolean> {
    try {
      // 1. Get the asset to find the storage path
      const { data: asset, error: fetchError } = await this.supabaseService.client
        .from(this.TABLE)
        .select('storage_path')
        .eq('id', id)
        .single();

      if (fetchError || !asset) throw fetchError || new Error('Asset not found');

      // 2. Delete from storage
      const { error: storageError } = await this.supabaseService.client
        .storage
        .from(this.BUCKET)
        .remove([asset.storage_path]);

      if (storageError) {
        console.warn('Warning: Could not delete file from storage:', storageError);
      }

      // 3. Delete from database
      const { error: dbError } = await this.supabaseService.client
        .from(this.TABLE)
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      await this.loadAssets();
      return true;
    } catch (err) {
      console.error('Error deleting media asset:', err);
      return false;
    }
  }

  // ===== Get all unique tags =====
  async getAllTags(): Promise<string[]> {
    const assets = this.assetsSubject.value;
    const tagSet = new Set<string>();
    assets.forEach(a => a.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }

  // ===== Helper: Get image dimensions =====
  private getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // ===== Helper: Format file size =====
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

