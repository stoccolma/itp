import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import {
  listTips,
  readTip,
  writeTip,
  deleteTip,
  tipSlugExists,
  type TipFrontmatter,
  type MarkdownContent,
} from '@/lib/fs-content';
import { generateSlug, isValidSlug } from '@/lib/slug';

// GET - List all tips
export async function GET() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tips = listTips();
    return NextResponse.json({ tips });
  } catch (error) {
    console.error('Error listing tips:', error);
    return NextResponse.json(
      { error: 'Failed to list tips' },
      { status: 500 }
    );
  }
}

// POST - Create or update a tip
export async function POST(request: NextRequest) {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug: oldSlug, action, ...tipData } = body;

    // Handle delete action
    if (action === 'delete') {
      if (!oldSlug) {
        return NextResponse.json(
          { error: 'Slug required for delete' },
          { status: 400 }
        );
      }
      const deleted = deleteTip(oldSlug);
      if (!deleted) {
        return NextResponse.json(
          { error: 'Tip not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!tipData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!tipData.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Generate or validate slug
    let slug = tipData.slug || generateSlug(tipData.title);
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    if (tipSlugExists(slug, oldSlug)) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Validate for publish
    if (tipData.status === 'published') {
      if (!tipData.bodyMd) {
        return NextResponse.json(
          { error: 'Content is required to publish' },
          { status: 400 }
        );
      }
    }

    // Prepare frontmatter
    const frontmatter: TipFrontmatter = {
      title: tipData.title,
      category: tipData.category,
      icon: tipData.icon || 'FileText',
      slug,
      status: tipData.status || 'draft',
    };

    const content: MarkdownContent<TipFrontmatter> = {
      frontmatter,
      content: tipData.bodyMd || '',
    };

    writeTip(content, oldSlug);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error saving tip:', error);
    return NextResponse.json(
      { error: 'Failed to save tip' },
      { status: 500 }
    );
  }
}
