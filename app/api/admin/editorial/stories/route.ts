import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import {
  listStories,
  readStory,
  writeStory,
  deleteStory,
  storySlugExists,
  type StoryFrontmatter,
  type MarkdownContent,
} from '@/lib/fs-content';
import { generateSlug, isValidSlug } from '@/lib/slug';

// GET - List all stories
export async function GET() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stories = listStories();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error listing stories:', error);
    return NextResponse.json(
      { error: 'Failed to list stories' },
      { status: 500 }
    );
  }
}

// POST - Create or update a story
export async function POST(request: NextRequest) {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug: oldSlug, action, ...storyData } = body;

    // Handle delete action
    if (action === 'delete') {
      if (!oldSlug) {
        return NextResponse.json(
          { error: 'Slug required for delete' },
          { status: 400 }
        );
      }
      const deleted = deleteStory(oldSlug);
      if (!deleted) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!storyData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate or validate slug
    let slug = storyData.slug || generateSlug(storyData.title);
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    if (storySlugExists(slug, oldSlug)) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Validate for publish
    if (storyData.status === 'published') {
      if (!storyData.bodyMd) {
        return NextResponse.json(
          { error: 'Content is required to publish' },
          { status: 400 }
        );
      }
    }

    // Prepare frontmatter
    const frontmatter: StoryFrontmatter = {
      title: storyData.title,
      subtitle: storyData.subtitle || '',
      slug,
      region: storyData.region || 'sicily',
      tags: Array.isArray(storyData.tags) ? storyData.tags : [],
      coverImage: storyData.coverImage || '',
      author: storyData.author || 'ItaloPlanner',
      publishedAt: storyData.publishedAt || new Date().toISOString().split('T')[0],
      status: storyData.status || 'draft',
    };

    const content: MarkdownContent<StoryFrontmatter> = {
      frontmatter,
      content: storyData.bodyMd || '',
    };

    writeStory(content, oldSlug);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json(
      { error: 'Failed to save story' },
      { status: 500 }
    );
  }
}
