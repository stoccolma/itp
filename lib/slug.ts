// Slug generation and validation utilities

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w-]+/g, '')
    // Remove multiple consecutive hyphens
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Must not start or end with a hyphen
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
