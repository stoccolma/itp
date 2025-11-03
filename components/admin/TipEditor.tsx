'use client';

import { useState, useEffect } from 'react';
import { MarkdownPreview } from './MarkdownPreview';

interface TipEditorProps {
  slug?: string;
  onCancel: () => void;
  onSave: () => void;
}

export function TipEditor({ slug, onCancel, onSave }: TipEditorProps) {
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    icon: 'FileText',
    slug: '',
    bodyMd: '',
    status: 'draft' as 'draft' | 'published',
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (slug) {
      loadTip();
    }
  }, [slug]);

  async function loadTip() {
    if (!slug) return;

    try {
      const res = await fetch('/api/admin/editorial/tips');
      const data = await res.json();
      const tip = data.tips.find((t: any) => t.frontmatter.slug === slug);

      if (tip) {
        setFormData({
          title: tip.frontmatter.title || '',
          category: tip.frontmatter.category || '',
          icon: tip.frontmatter.icon || 'FileText',
          slug: tip.frontmatter.slug || '',
          bodyMd: tip.content || '',
          status: tip.frontmatter.status || 'draft',
        });
      }
    } catch (err) {
      setError('Failed to load tip');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(publish: boolean = false) {
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/editorial/tips', {
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
      setError(err.message || 'Failed to save tip');
    } finally {
      setSaving(false);
    }
  }

  function generateSlug() {
    if (formData.title && !slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const iconOptions = [
    'FileText', 'Car', 'Coffee', 'Home', 'Users', 'MapPin', 
    'Utensils', 'Camera', 'Sun', 'Moon', 'Star', 'Heart'
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-serif text-stone-900">
          {slug ? 'Edit Tip' : 'New Tip'}
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
                  placeholder="Tip title"
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
                  placeholder="tip-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="e.g., driving, coffee, local-survival"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Use lowercase with hyphens (e.g., local-survival)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
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
              placeholder="Write your tip in markdown..."
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
