'use client';

import { useState, useEffect } from 'react';
import { StoryEditor } from '@/components/admin/StoryEditor';
import { TipEditor } from '@/components/admin/TipEditor';
import { ContentList } from '@/components/admin/ContentList';

type Tab = 'stories' | 'tips';

export default function AdminEditorialPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/editorial/stories');
      setIsAuthenticated(res.ok);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setAdminKey('');
      } else {
        setError('Invalid admin key');
      }
    } catch (err) {
      setError('Failed to authenticate');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setIsAuthenticated(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-stone-200">
          <h1 className="text-2xl font-serif mb-6 text-stone-900">Editorial Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-stone-700 mb-2">
                Admin Key
              </label>
              <input
                id="key"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                placeholder="Enter admin key"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-2 rounded hover:bg-stone-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-stone-900">Editorial Admin</h1>
            <button
              onClick={handleLogout}
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('stories');
                setEditingSlug(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stories'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => {
                setActiveTab('tips');
                setEditingSlug(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tips'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              Tips
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {editingSlug !== null ? (
          activeTab === 'stories' ? (
            <StoryEditor
              slug={editingSlug || undefined}
              onCancel={() => setEditingSlug(null)}
              onSave={() => setEditingSlug(null)}
            />
          ) : (
            <TipEditor
              slug={editingSlug || undefined}
              onCancel={() => setEditingSlug(null)}
              onSave={() => setEditingSlug(null)}
            />
          )
        ) : (
          <ContentList
            type={activeTab}
            onEdit={(slug) => setEditingSlug(slug)}
            onNew={() => setEditingSlug('')}
          />
        )}
      </div>
    </div>
  );
}
