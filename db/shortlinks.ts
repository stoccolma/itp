import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Shortlinks table for plan sharing
 * Stores shortened URLs with TTL for plan sharing
 */
export const shortlinks = sqliteTable('shortlinks', {
  code: text('code').primaryKey(),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  ttlDays: integer('ttl_days').notNull(),
});

export type Shortlink = typeof shortlinks.$inferSelect;
export type NewShortlink = typeof shortlinks.$inferInsert;
