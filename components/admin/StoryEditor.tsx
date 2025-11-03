'use client';

import { useState, useEffect } from 'react';
import { MarkdownPreview } from './MarkdownPreview';

interface StoryEditorProps {
  slug?: string;
  onCancel: () => void;
  onSave: () => void;
}

export function StoryEditor({ slug, onCancel, onSave }: StoryEditorProps) {
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    region: 'sicily',
    tags: [] as string[],
    coverImage: '',
    author: 'ItaloPlanner',
    publishedAt: new Date().toISOString().split('T')[0],
    bodyMd: '',
    status: 'draft' as 'draft' | 'published',
  });

  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (slug) {
      loadStory();
    }
  }, [slug]);

  async function loadStory() {
    if (!slug) return;

    try {
      const res = await fetch('/api/admin/editorial/stories');
      const data = await res.json();
      const story = data.stories.find((s: any) => s.frontmatter.slug === slug);

      if (story) {
        setFormData({
          title: story.frontmatter.title || '',
          subtitle: story.frontmatter.subtitle || '',
          slug: story.frontmatter.slug || '',
          region: story.frontmatter.region || 'sicily',
          tags: story.frontmatter.tags || [],
          coverImage: story.frontmatter.coverImage || '',
          author: story.frontmatter.author || 'ItaloPlanner',
          publishedAt: story.frontmatter.publishedAt || new Date().toISOString().split('T')[0],
          bodyMd: story.content || '',
          status: story.frontmatter.status || 'draft',
        });
      }
    } catch (err) {
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(publish: boolean = false) {
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/editorial/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: slug, // old slug for renaming detection
          status: publish ? 'published' : formData.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save story');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'stories');
      formData.append('slug', slug || 'new-story');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function handleAddTag() {
    if (!tagInput.trim()) return;
    if (formData.tags.includes(tagInput.trim())) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }));
    setTagInput('');
  }

  function handleRemoveTag(tag: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  function generateSlug() {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-serif text-stone-900">
          {slug ? 'Edit Story' : 'New Story'}
        </h2>
        <button
          onClick={onCancel}
          className="text-stone-600 hover:text-stone-900"
        >
          ← Back to list
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <h3 className="text-lg font-medium mb-4">Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  onBlur={generateSlug}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="Story title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="Story subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="story-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                    placeholder="Add tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-stone-600 text-white rounded hover:bg-stone-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 text-stone-700 rounded text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-stone-500 hover:text-stone-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
                {uploading && <div className="text-sm text-stone-500 mt-1">Uploading...</div>}
                {formData.coverImage && (
                  <div className="mt-2">
                    <img
                      src={formData.coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded"
                    />
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full mt-2 px-3 py-1 border border-stone-300 rounded text-sm font-mono"
                      placeholder="Or enter image URL"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Content *</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
            <textarea
              value={formData.bodyMd}
              onChange={(e) => setFormData({ ...formData, bodyMd: e.target.value })}
              className="w-full h-96 px-3 py-2 border border-stone-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="Write your story in markdown..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 bg-stone-600 text-white py-3 rounded hover:bg-stone-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex-1 bg-stone-900 text-white py-3 rounded hover:bg-stone-800 disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <MarkdownPreview content={formData.bodyMd} title={formData.title} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
