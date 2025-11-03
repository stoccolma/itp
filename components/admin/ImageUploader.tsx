'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import type { AreaImage } from '@/lib/areas';

interface ImageUploaderProps {
  slug: string;
  onUploadComplete: (image: AreaImage) => void;
}

export default function ImageUploader({ slug, onUploadComplete }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const resetForm = () => {
    setAlt('');
    setCaption('');
    setCredit('');
    setSourceUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (file: File) => {
    if (!alt.trim()) {
      setError('Alt text is required');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', alt.trim());
      if (caption.trim()) formData.append('caption', caption.trim());
      if (credit.trim()) formData.append('credit', credit.trim());
      if (sourceUrl.trim()) formData.append('source_url', sourceUrl.trim());

      const res = await fetch(`/api/areas/${slug}/images`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const newImage = await res.json();
      onUploadComplete(newImage);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          dragActive
            ? 'border-gold-500 bg-gold-50'
            : 'border-primary-300 hover:border-gold-400'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-primary-400" />
        <p className="text-primary-700 mb-2">
          Drag and drop an image here, or click to browse
        </p>
        <p className="text-sm text-primary-500 mb-4">
          JPG, PNG, or WebP · Max 8MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Select File'}
        </button>
      </div>

      {/* Metadata fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary-900 mb-1">
            Alt Text <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for accessibility"
            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-gold-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-900 mb-1">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption"
            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-900 mb-1">
            Photo Credit
          </label>
          <input
            type="text"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            placeholder="Photographer name"
            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-900 mb-1">
            Source URL
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
