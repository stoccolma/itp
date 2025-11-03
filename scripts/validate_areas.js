const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

console.log('🔍 Validating Areas Data...\n');

// Read areas.csv
const areasPath = path.join(__dirname, '..', 'data', 'areas.csv');
const areasContent = fs.readFileSync(areasPath, 'utf-8');
const areasResult = Papa.parse(areasContent, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => h.trim().toLowerCase()
});

// Read areas_story.csv
const storyPath = path.join(__dirname, '..', 'data', 'areas_story.csv');
const storyContent = fs.readFileSync(storyPath, 'utf-8');
const storyResult = Papa.parse(storyContent, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => h.trim().toLowerCase()
});

const areas = areasResult.data.filter(row => row.name);
const stories = storyResult.data.filter(row => row.name);

// Stats
const stats = {
  totalAreas: areas.length,
  totalStories: stories.length,
  withCoords: areas.filter(a => a.lat && a.lon).length,
  withoutCoords: areas.filter(a => !a.lat || !a.lon).length,
  duplicates: [],
  missingStories: [],
  orphanedStories: []
};

// Check for duplicates in areas.csv
const areaNames = areas.map(a => a.name.toLowerCase().trim());
const duplicateNames = areaNames.filter((name, index) => areaNames.indexOf(name) !== index);
stats.duplicates = [...new Set(duplicateNames)];

// Check for missing stories
const storyMap = new Map(stories.map(s => [s.name.toLowerCase().trim(), s]));
areas.forEach(area => {
  const normalized = area.name.toLowerCase().trim();
  if (!storyMap.has(normalized)) {
    stats.missingStories.push(area.name);
  }
});

// Check for orphaned stories (story without area)
const areaMap = new Map(areas.map(a => [a.name.toLowerCase().trim(), a]));
stories.forEach(story => {
  const normalized = story.name.toLowerCase().trim();
  if (!areaMap.has(normalized)) {
    stats.orphanedStories.push(story.name);
  }
});

// Print results
console.log('📊 SUMMARY');
console.log('─'.repeat(50));
console.log(`Total Areas (areas.csv):        ${stats.totalAreas}`);
console.log(`Total Stories (areas_story.csv): ${stats.totalStories}`);
console.log(`With Coordinates:                ${stats.withCoords} ✅`);
console.log(`Without Coordinates:             ${stats.withoutCoords} ⚠️`);
console.log();

if (stats.duplicates.length > 0) {
  console.log('❌ DUPLICATE NAMES IN AREAS.CSV:');
  stats.duplicates.forEach(name => console.log(`   - ${name}`));
  console.log();
}

if (stats.missingStories.length > 0) {
  console.log('⚠️  AREAS WITHOUT STORIES:');
  stats.missingStories.forEach(name => console.log(`   - ${name}`));
  console.log();
}

if (stats.orphanedStories.length > 0) {
  console.log('⚠️  STORIES WITHOUT AREAS:');
  stats.orphanedStories.forEach(name => console.log(`   - ${name}`));
  console.log();
}

// Detail view
console.log('📋 DETAILED AREA LIST');
console.log('─'.repeat(50));
areas.forEach((area, i) => {
  const normalized = area.name.toLowerCase().trim();
  const hasStory = storyMap.has(normalized);
  const hasCoords = area.lat && area.lon;
  const tags = area.tags ? area.tags.split(',').length : 0;
  
  console.log(`${i + 1}. ${area.name}`);
  console.log(`   Region: ${area.region || 'N/A'}`);
  console.log(`   Coords: ${hasCoords ? `${area.lat}, ${area.lon} ✅` : 'Missing ⚠️'}`);
  console.log(`   Story:  ${hasStory ? 'Yes ✅' : 'Missing ⚠️'}`);
  console.log(`   Tags:   ${tags} tag(s)`);
  console.log();
});

// Exit code
const hasErrors = stats.duplicates.length > 0;
const hasWarnings = stats.missingStories.length > 0 || stats.orphanedStories.length > 0 || stats.withoutCoords > 0;

if (hasErrors) {
  console.log('❌ VALIDATION FAILED: Duplicates found');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  VALIDATION WARNING: Some data issues detected');
  process.exit(0);
} else {
  console.log('✅ VALIDATION PASSED: All data looks good!');
  process.exit(0);
}
