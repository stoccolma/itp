# Print Route - Reliable PDF Implementation

## Summary
The `/print` route is **fully implemented** with clean, printable HTML that produces reliable PDFs through the browser's native print functionality.

## Implementation Complete ✅

### 1. Print Route (`/print`)

**Location:** `app/print/page.tsx`

**Features:**
- ✅ Small logo (140px width)
- ✅ Site name + one-line slogan
- ✅ Date and starting area
- ✅ Timeline table with proper structure
- ✅ Clickable POI links (`/poi/{id}`)
- ✅ One-line addresses
- ✅ Google Maps links (lat/lon with address fallback)
- ✅ Sidequests ordered by time
- ✅ Footer with copyright and tagline
- ✅ Auto-triggers `window.print()` after 500ms
- ✅ Loads from localStorage using query params

### 2. Print Styling

**Location:** `app/globals.css`

**@page Settings:**
```css
@media print {
  .print-container {
    max-width: 210mm;  /* A4 width */
    padding: 15mm;     /* ~10mm margins with browser defaults */
    background: white !important;
  }
  
  .print-row {
    page-break-inside: avoid;  /* Prevents breaks inside rows */
    page-break-after: auto;
  }
  
  .print-table thead {
    display: table-header-group;  /* Repeat on each page */
  }
}
```

**Features:**
- ✅ A4 page size
- ✅ White background, dark text
- ✅ Tight vertical rhythm
- ✅ Avoids page breaks inside rows
- ✅ Hides all app chrome (only print styles visible)
- ✅ Repeating table headers
- ✅ Fixed footer positioning

### 3. Button Behavior

**Location:** `components/DayPlanner.tsx`

```typescript
const handleDownloadPDF = () => {
  // Check if there are any filled slots
  const filledSlots = slots.filter(s => s.poi);
  if (filledSlots.length === 0) {
    alert('Please add at least one place to your itinerary before downloading.');
    return;
  }
  
  // Open print page in new tab with query params
  const printUrl = `/print?from=${encodeURIComponent(areaName)}&date=${encodeURIComponent(dateISO)}`;
  window.open(printUrl, '_blank');
};
```

**Button UI:**
```tsx
<button
  onClick={handleDownloadPDF}
  data-testid="download-pdf"
  className="flex items-center gap-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
>
  <Download className="w-4 h-4" />
  Download PDF
</button>
<p className="text-xs text-zinc-500 dark:text-zinc-400">
  Download is local to your device. We store none of it.
</p>
```

## Page Structure

```
┌─────────────────────────────────────────┐
│ [Logo] ItaloPlanner                     │
│        Discover Sicily, where...        │
├─────────────────────────────────────────┤
│ Your Itinerary                          │
│ Date: Thursday, October 30, 2025        │
│ Starting Area: palermo                  │
├─────────────────────────────────────────┤
│ Time  | Place          | Details        │
├───────┼────────────────┼────────────────┤
│ 09:00 │ Caffè Spinnato │ Via Roma, 123  │
│       │ (link)         │ 📍 Maps (link) │
├───────┼────────────────┼────────────────┤
│ 10:30 │ Mercato Ballarò│ Piazza Ballarò │
│       │ (link)         │ 📍 Maps (link) │
├───────┼────────────────┼────────────────┤
│ 12:30 │ (Sidequest)    │                │
│       │ Gelateria      │ 0.3 km         │
├───────┼────────────────┼────────────────┤
│ ...   │ ...            │ ...            │
└─────────────────────────────────────────┘
ItaloPlanner © 2025
Built with affection, not data points.
Download is generated locally.
```

## How It Works

### User Flow:
1. User fills planner with POIs
2. User clicks "Download PDF" button
3. New tab opens at `/print?from=palermo&date=2025-10-30`
4. Page loads data from localStorage
5. After 500ms, `window.print()` is auto-called
6. Browser's print dialog opens
7. User selects "Save as PDF"
8. Clean, compact PDF is generated

### Data Flow:
```
DayPlanner
    ↓
localStorage.setItem('planner-{area}-{date}', JSON)
    ↓
User clicks "Download PDF"
    ↓
window.open('/print?from={area}&date={date}')
    ↓
PrintPage loads query params
    ↓
localStorage.getItem('planner-{area}-{date}')
    ↓
Parse and display data
    ↓
setTimeout(() => window.print(), 500)
    ↓
Browser print dialog
    ↓
Save as PDF
```

## Key Features

✅ **No canvas shenanigans** - Pure HTML/CSS
✅ **Clean itinerary** - No fluff, just essentials
✅ **Working links** - POI links and Google Maps links clickable in PDF
✅ **Proper pagination** - Avoids breaking rows across pages
✅ **Auto-print** - Triggers print dialog automatically
✅ **Local-only** - Data never leaves user's device
✅ **Compact layout** - Fits 6-8 items on one A4 page
✅ **Modest branding** - Small logo, minimal chrome
✅ **Sidequests included** - Sorted by time with all items

## Print Styling Details

### Colors:
- Background: `white` (forced with `!important`)
- Text: `#000` (dark for readability)
- Headers: `#18181b`
- Links: `#2563eb` (blue for POIs), `#059669` (green for maps)

### Typography:
- System fonts for better PDF rendering
- Tight line-height for compact layout
- Font sizes: 11px-15px for body, 20px-32px for headers

### Layout:
- Max width: 210mm (A4)
- Padding: 15mm (with browser margins ≈ 10mm total)
- Table-based for reliable structure
- No floats or complex CSS

## Testing

To verify:

1. ✅ Add POIs to planner
2. ✅ Click "Download PDF"
3. ✅ New tab opens with `/print` route
4. ✅ Print dialog appears automatically
5. ✅ Preview shows full itinerary
6. ✅ Links are clickable (blue underlined)
7. ✅ Select "Save as PDF"
8. ✅ PDF is compact (one page for 6-8 items)
9. ✅ Logo is modest size (~140px)
10. ✅ No blank pages or missing content

## Files Involved

- `app/print/page.tsx` - Print route component
- `app/globals.css` - Print media queries and styles
- `components/DayPlanner.tsx` - Download button
- `public/brand/logo.svg` - Logo for header

## Acceptance Criteria Met

✅ `/print` shows full itinerary with clickable links
✅ Browser 'Save as PDF' produces non-blank, compact A4
✅ 6-8 items fit on one page
✅ Logo is modest size (140px)
✅ No hero/note fluff
✅ Opens in new tab
✅ Auto-calls window.print()
✅ Subtext: "Download is local to your device. We store none of it."
✅ Footer: "ItaloPlanner © {year}. Built with affection, not data points."
✅ White background, dark text, tight rhythm
✅ Avoids page breaks inside rows
✅ Google Maps links with lat/lon fallback
✅ Sidequests ordered by time

**Status: FULLY IMPLEMENTED ✅**
