'use client';

import { useState, useEffect } from 'react';

interface Story {
  frontmatter: {
    title: string;
    slug: string;
    status?: 'draft' | 'published';
    publishedAt?: string;
    tags?: string[];
  };
}

interface Tip {
  frontmatter: {
    title: string;
    slug: string;
    category: string;
    status?: 'draft' | 'published';
  };
}

interface ContentListProps {
  type: 'stories' | 'tips';
  onEdit: (slug: string) => void;
  onNew: () => void;
}

export function ContentList({ type, onEdit, onNew }: ContentListProps) {
  const [items, setItems] = useState<(Story | Tip)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, [type]);

  async function loadItems() {
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'stories' ? '/api/admin/editorial/stories' : '/api/admin/editorial/tips';
      const res = await fetch(endpoint);
      
      if (!res.ok) throw new Error('Failed to load items');
      
      const data = await res.json();
      setItems(data[type] || []);
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete this ${type === 'stories' ? 'story' : 'tip'}?`)) {
      return;
    }

    try {
      const endpoint = type === 'stories' ? '/api/admin/editorial/stories' : '/api/admin/editorial/tips';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'delete' }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      loadItems();
    } catch (err) {
      alert('Failed to delete item');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-stone-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-stone-900">
          {type === 'stories' ? 'Stories' : 'Tips'} ({items.length})
        </h2>
        <button
          onClick={onNew}
          className="bg-stone-900 text-white px-4 py-2 rounded hover:bg-stone-800 transition-colors"
        >
          New {type === 'stories' ? 'Story' : 'Tip'}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          No {type} yet. Create your first one!
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Slug
                </th>
                {type === 'stories' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Tags
                    </th>
                  </>
                ) : (
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Category
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {items.map((item) => (
                <tr key={item.frontmatter.slug} className="hover:bg-stone-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    {item.frontmatter.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-mono">
                    {item.frontmatter.slug}
                  </td>
                  {type === 'stories' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                        {(item as Story).frontmatter.publishedAt || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        <div className="flex flex-wrap gap-1">
                          {((item as Story).frontmatter.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {(item as Tip).frontmatter.category}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.frontmatter.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.frontmatter.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(item.frontmatter.slug)}
                      className="text-stone-600 hover:text-stone-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.frontmatter.slug)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
