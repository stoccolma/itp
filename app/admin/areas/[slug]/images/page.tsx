'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { AreaImage } from '@/lib/areas';
import ImageUploader from '@/components/admin/ImageUploader';
import ImageListEditor from '@/components/admin/ImageListEditor';

export default function AdminAreaImagesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [images, setImages] = useState<AreaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if admin mode is enabled
  useEffect(() => {
    // In a real app, you'd check this server-side
    // For now, we'll just show a warning
    const isAdmin = localStorage.getItem('itp_admin') === 'true';
    if (!isAdmin) {
      router.push('/');
    }
  }, [router]);

  // Load images
  useEffect(() => {
    loadImages();
  }, [slug]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/areas/${slug}/images`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newImage: AreaImage) => {
    setImages(prev => [...prev, newImage]);
  };

  const handleImagesUpdate = (updatedImages: AreaImage[]) => {
    setImages(updatedImages);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/areas/${slug}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(images)
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      alert('Changes saved successfully!');
    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const res = await fetch(`/api/areas/${slug}/images?id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="text-primary-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            Manage Images: <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
          </h1>
          <p className="text-primary-700">
            Upload, reorder, and manage images for this area
          </p>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg p-6 mb-8 card-shadow">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Upload New Image</h2>
          <ImageUploader slug={slug} onUploadComplete={handleUploadComplete} />
        </div>

        {/* Image List Editor */}
        <div className="bg-white rounded-lg p-6 mb-8 card-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary-900">
              Current Images ({images.length})
            </h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          <ImageListEditor
            images={images}
            onUpdate={handleImagesUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Back button */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/areas/${slug}`)}
            className="text-gold-600 hover:text-gold-700 font-semibold"
          >
            ← Back to Area Page
          </button>
        </div>
      </div>
    </div>
  );
}
