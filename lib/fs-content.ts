// File system utilities for managing markdown content
import fs from 'fs';
import path from 'path';

export interface StoryFrontmatter {
  title: string;
  subtitle?: string;
  slug: string;
  region: string;
  tags: string[];
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  status?: 'draft' | 'published';
}

export interface TipFrontmatter {
  title: string;
  category: string;
  icon: string;
  slug?: string;
  status?: 'draft' | 'published';
}

export interface MarkdownContent<T> {
  frontmatter: T;
  content: string;
}

const STORIES_DIR = path.join(process.cwd(), 'content', 'stories');
const TIPS_DIR = path.join(process.cwd(), 'content', 'tips');

// Ensure directories exist
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Parse frontmatter and content from markdown
function parseFrontmatter<T>(markdown: string): MarkdownContent<T> {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid markdown format: No frontmatter found');
  }

  const [, frontmatterStr, content] = match;
  const frontmatter: any = {};

  // Parse YAML-like frontmatter
  frontmatterStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        frontmatter[key] = JSON.parse(value);
      } catch {
        frontmatter[key] = value;
      }
    } else {
      frontmatter[key] = value;
    }
  });

  return {
    frontmatter: frontmatter as T,
    content: content.trim(),
  };
}

// Serialize frontmatter and content to markdown
function serializeFrontmatter<T>(data: MarkdownContent<T>): string {
  const lines = ['---'];

  Object.entries(data.frontmatter as object).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === 'string') {
      // Quote strings that contain special characters
      const needsQuotes = value.includes(':') || value.includes('#') || value.includes('"');
      lines.push(`${key}: ${needsQuotes ? `"${value}"` : value}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  });

  lines.push('---');
  lines.push('');
  lines.push(data.content);

  return lines.join('\n');
}

// Generate filename from date and slug
function generateFilename(slug: string, publishedAt?: string): string {
  const date = publishedAt || new Date().toISOString().split('T')[0];
  return `${date}__${slug}.md`;
}

// List all stories
export function listStories(): MarkdownContent<StoryFrontmatter>[] {
  ensureDir(STORIES_DIR);
  const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const content = fs.readFileSync(path.join(STORIES_DIR, file), 'utf-8');
    const parsed = parseFrontmatter<StoryFrontmatter>(content);
    
    // Extract slug from filename if not in frontmatter
    if (!parsed.frontmatter.slug) {
      const match = file.match(/\d{4}-\d{2}-\d{2}__(.+)\.md$/);
      if (match) {
        parsed.frontmatter.slug = match[1];
      }
    }

    return parsed;
  });
}

// List all tips
export function listTips(): MarkdownContent<TipFrontmatter>[] {
  ensureDir(TIPS_DIR);
  const files = fs.readdirSync(TIPS_DIR).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const content = fs.readFileSync(path.join(TIPS_DIR, file), 'utf-8');
    const parsed = parseFrontmatter<TipFrontmatter>(content);
    
    // Use filename as slug if not in frontmatter
    if (!parsed.frontmatter.slug) {
      parsed.frontmatter.slug = file.replace('.md', '');
    }

    return parsed;
  });
}

// Read a story by slug
export function readStory(slug: string): MarkdownContent<StoryFrontmatter> | null {
  ensureDir(STORIES_DIR);
  const files = fs.readdirSync(STORIES_DIR);
  const file = files.find((f) => f.includes(`__${slug}.md`));

  if (!file) return null;

  const content = fs.readFileSync(path.join(STORIES_DIR, file), 'utf-8');
  const parsed = parseFrontmatter<StoryFrontmatter>(content);
  
  if (!parsed.frontmatter.slug) {
    parsed.frontmatter.slug = slug;
  }

  return parsed;
}

// Read a tip by slug
export function readTip(slug: string): MarkdownContent<TipFrontmatter> | null {
  ensureDir(TIPS_DIR);
  const filePath = path.join(TIPS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter<TipFrontmatter>(content);
  
  if (!parsed.frontmatter.slug) {
    parsed.frontmatter.slug = slug;
  }

  return parsed;
}

// Write a story
export function writeStory(
  data: MarkdownContent<StoryFrontmatter>,
  oldSlug?: string
): void {
  ensureDir(STORIES_DIR);
  
  const filename = generateFilename(
    data.frontmatter.slug,
    data.frontmatter.publishedAt
  );
  const filePath = path.join(STORIES_DIR, filename);

  // Delete old file if slug changed
  if (oldSlug && oldSlug !== data.frontmatter.slug) {
    const files = fs.readdirSync(STORIES_DIR);
    const oldFile = files.find((f) => f.includes(`__${oldSlug}.md`));
    if (oldFile) {
      fs.unlinkSync(path.join(STORIES_DIR, oldFile));
    }
  }

  const markdown = serializeFrontmatter(data);
  fs.writeFileSync(filePath, markdown, 'utf-8');
}

// Write a tip
export function writeTip(
  data: MarkdownContent<TipFrontmatter>,
  oldSlug?: string
): void {
  ensureDir(TIPS_DIR);
  
  const slug = data.frontmatter.slug || data.frontmatter.title.toLowerCase().replace(/\s+/g, '-');
  const filePath = path.join(TIPS_DIR, `${slug}.md`);

  // Delete old file if slug changed
  if (oldSlug && oldSlug !== slug) {
    const oldPath = path.join(TIPS_DIR, `${oldSlug}.md`);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const markdown = serializeFrontmatter(data);
  fs.writeFileSync(filePath, markdown, 'utf-8');
}

// Delete a story
export function deleteStory(slug: string): boolean {
  ensureDir(STORIES_DIR);
  const files = fs.readdirSync(STORIES_DIR);
  const file = files.find((f) => f.includes(`__${slug}.md`));

  if (!file) return false;

  fs.unlinkSync(path.join(STORIES_DIR, file));
  return true;
}

// Delete a tip
export function deleteTip(slug: string): boolean {
  ensureDir(TIPS_DIR);
  const filePath = path.join(TIPS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return false;

  fs.unlinkSync(filePath);
  return true;
}

// Check if slug exists
export function storySlugExists(slug: string, excludeSlug?: string): boolean {
  ensureDir(STORIES_DIR);
  const files = fs.readdirSync(STORIES_DIR);
  return files.some((f) => {
    const fileSlug = f.match(/\d{4}-\d{2}-\d{2}__(.+)\.md$/)?.[1];
    return fileSlug === slug && fileSlug !== excludeSlug;
  });
}

export function tipSlugExists(slug: string, excludeSlug?: string): boolean {
  ensureDir(TIPS_DIR);
  const filePath = path.join(TIPS_DIR, `${slug}.md`);
  return fs.existsSync(filePath) && slug !== excludeSlug;
}
