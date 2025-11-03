import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { shortlinks } from './shortlinks';

// Re-export shortlinks for convenience
export { shortlinks } from './shortlinks';

// TODO(region): when adding new regions (e.g., Sardinia, Puglia), lift the default
// and expose a region switcher in settings or navigation

// Stories table for editorial content
export const stories = sqliteTable('stories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  excerpt: text('excerpt').notNull(),
  bodyMd: text('body_md').notNull(),
  coverImage: text('cover_image'),
  tags: text('tags'), // JSON array stored as text
  region: text('region').notNull().default('sicily'), // Default to Sicily for now
  minutes: integer('minutes'), // read time
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Tips table for practical guides
export const tips = sqliteTable('tips', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  bodyMd: text('body_md').notNull(),
  category: text('category').notNull(), // 'driving' | 'local-survival' | 'coffee' | 'where-to-stay'
  icon: text('icon'), // lucide icon name
  region: text('region').notNull().default('sicily'), // Default to Sicily for now
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Gestures table for Sicilian gesture guide
export const gestures = sqliteTable('gestures', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  meaningShort: text('meaning_short').notNull(),
  descriptionMd: text('description_md').notNull(),
  doDont: text('do_dont').notNull(), // JSON stored as text
  imageUrl: text('image_url'),
  tags: text('tags').notNull(), // JSON array stored as text
  region: text('region').notNull().default('sicily'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Phrases table for phrasebook
export const phrases = sqliteTable('phrases', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  english: text('english').notNull(),
  italian: text('italian').notNull(),
  italianPhonetic: text('italian_phonetic').notNull(),
  sicilian: text('sicilian'),
  sicilianPhonetic: text('sicilian_phonetic'),
  notes: text('notes'),
  region: text('region').notNull().default('sicily'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;
export type Gesture = typeof gestures.$inferSelect;
export type NewGesture = typeof gestures.$inferInsert;
export type Phrase = typeof phrases.$inferSelect;
export type NewPhrase = typeof phrases.$inferInsert;
