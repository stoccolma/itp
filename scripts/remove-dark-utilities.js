#!/usr/bin/env node

/**
 * Remove Tailwind dark: utilities and replace with CSS variable-based alternatives
 * This enforces light mode as default with attribute-based dark mode toggling
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping of dark utilities to their var(--) replacements
const replacements = {
  // Backgrounds
  'dark:bg-zinc-50': 'bg-[var(--card)]',
  'dark:bg-zinc-100': 'bg-[var(--card)]',
  'dark:bg-zinc-800': 'bg-[var(--card)]',
  'dark:bg-zinc-900': 'bg-[var(--paper)]',
  'dark:bg-zinc-700': 'bg-[var(--card)]',
  'dark:bg-zinc-900/40': 'bg-[var(--card)]',
  'dark:bg-zinc-900/50': 'bg-[var(--card)]',
  'dark:bg-zinc-800/50': 'bg-[var(--card)]',
  'dark:bg-black': 'bg-[var(--paper)]',
  'dark:bg-white': '',
  
  // Text colors
  'dark:text-zinc-50': 'text-[var(--ink)]',
  'dark:text-zinc-100': 'text-[var(--ink)]',
  'dark:text-zinc-200': 'text-[var(--ink)]',
  'dark:text-zinc-300': 'text-[var(--ink)]',
  'dark:text-zinc-400': 'text-[var(--ink)]/60',
  'dark:text-zinc-500': 'text-[var(--ink)]/50',
  'dark:text-zinc-600': 'text-[var(--ink)]/70',
  'dark:text-zinc-700': 'text-[var(--ink)]/80',
  'dark:text-zinc-800': 'text-[var(--ink)]',
  'dark:text-zinc-900': 'text-[var(--ink)]',
  
  // Borders
  'dark:border-zinc-600': 'border-[var(--line)]',
  'dark:border-zinc-700': 'border-[var(--line)]',
  'dark:border-zinc-800': 'border-[var(--line)]',
  'dark:border-zinc-400': 'border-[var(--line)]',
  'dark:border-zinc-500': 'border-[var(--line)]',
  
  // Hover states - remove them as they'll work with base classes
  'dark:hover:bg-zinc-200': '',
  'dark:hover:bg-zinc-300': '',
  'dark:hover:bg-zinc-700': '',
  'dark:hover:bg-zinc-800': '',
  'dark:hover:text-zinc-100': '',
  'dark:hover:text-zinc-200': '',
  'dark:hover:text-zinc-300': '',
  'dark:hover:border-zinc-400': '',
  'dark:hover:border-zinc-500': '',
  
  // Focus states - remove them
  'dark:focus:bg-zinc-700': '',
  'dark:focus:border-zinc-400': '',
  'dark:focus:ring-zinc-400': '',
  
  // Ring colors
  'dark:ring-zinc-400': '',
  'dark:ring-zinc-500': '',
  
  // Accent colors - keep these for actual accent usage
  'dark:text-green-400': 'text-green-600',
  'dark:text-red-400': 'text-red-600',
  'dark:text-orange-300': 'text-orange-600',
  'dark:bg-orange-900/30': 'bg-orange-100',
  'dark:bg-red-900/30': 'bg-red-100',
  'dark:hover:bg-red-900/30': '',
};

function removeDarkUtilities(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply replacements
  for (const [darkUtil, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\s*${darkUtil.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (content.includes(darkUtil)) {
      if (replacement) {
        // Only add replacement if it's not already there
        content = content.replace(regex, (match) => {
          const beforeMatch = content.substring(0, content.indexOf(match));
          if (!beforeMatch.includes(replacement)) {
            return ' ' + replacement;
          }
          return '';
        });
      } else {
        content = content.replace(regex, '');
      }
      modified = true;
    }
  }
  
  // Clean up multiple spaces in className
  content = content.replace(/className="([^"]*)"/g, (match, classes) => {
    return `className="${classes.replace(/\s+/g, ' ').trim()}"`;
  });
  
  // Clean up empty className attributes
  content = content.replace(/\s*className=""\s*/g, ' ');
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Find all TypeScript/JavaScript files
const files = glob.sync('{app,components}/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/.next/**']
});

console.log(`\nRemoving dark mode utilities from ${files.length} files...\n`);

let updatedCount = 0;
files.forEach(file => {
  if (removeDarkUtilities(file)) {
    updatedCount++;
  }
});

console.log(`\n✓ Complete! Updated ${updatedCount} files.\n`);
