# PDF Generation Flow - Implementation Summary

## Date
October 26, 2025

## Objective
Replace the PDF generation flow with an offscreen print view using proper portal rendering and resource loading waits.

## Changes Implemented

### 1. Portal-Based Rendering (`components/DayPlanner.tsx`)

**New PDF Generation Flow:**

```typescript
const handleDownloadPDF = async () => {
  // 1. Create portal root on demand
  let printRoot = document.getElementById('print-root');
  if (!printRoot) {
    printRoot = document.createElement('div');
    printRoot.id = 'print-root';
    document.body.appendChild(printRoot);
  }
  
  // 2. Render print view offscreen using React portal
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(printRoot);
  
  root.render(
    <div style={{
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      width: '794px',
      background: '#fff',
      color: '#000',
      padding: '16px'
    }}>
      <ItineraryPrintView ... />
    </div>
  );
  
  // 3. Wait for fonts
  await document.fonts?.ready;
  
  // 4. Wait for ALL images to load
  const images = Array.from(printNode.querySelectorAll('img'));
  await Promise.all(images.map(img => 
    img.complete ? Promise.resolve() : 
    new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      setTimeout(() => resolve(), 2000); // Timeout fallback
    })
  ));
  
  // 5. Wait for two animation frames
  await new Promise(resolve => 
    requestAnimationFrame(() => 
      requestAnimationFrame(resolve)
    )
  );
  
  // 6. Generate PDF
  await html2pdf().set({
    filename: 'ItaloPlanner-Itinerary.pdf',
    margin: 10,
    image: { type: 'jpeg', quality: 0.92 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  }).from(printNode).save();
  
  // 7. Clean up
  root.unmount();
  printRoot.parentNode.removeChild(printRoot);
}
```

### 2. Print View Structure (`components/ItineraryPrintView.tsx`)

**Already implemented with:**

✅ **Header Section:**
- Logo from `/public/brand/logo.svg`
- Site name: "ItaloPlanner"
- Slogan: "Discover Sicily, where every stop has a story."

✅ **Subheader Section:**
- Formatted date (e.g., "Monday, October 30, 2025")
- Starting area name

✅ **Timeline Table:**
- Merged main slots and sidequests, sorted by time
- Columns: Time | Place | Details
- For each POI:
  - Name with clickable link to `/poi/{id}`
  - Address using `formatAddress()` utility
  - Google Maps link: `https://www.google.com/maps/search/?api=1&query={lat},{lon}`
  - Website link (if available)
- For sidequests: Special styling with "Sidequest" badge

✅ **Footer:**
- "ItaloPlanner © {YEAR}"
- Tagline: "Built with affection, not data points."
- Privacy note: "Download is generated locally. We don't store your itinerary."
- Page numbers (via CSS `counter(page)`)

### 3. Address Handling (`lib/plan-utils.ts`)

**formatAddress() Utility:**
```typescript
export function formatAddress(item: POI | PlanSlot | Sidequest): string {
  const line1 = item.addressLine1?.trim();
  const locality = item.locality?.trim();
  
  if (line1 && locality) {
    return `${line1}, ${locality}`;
  }
  
  if (line1) {
    return line1;
  }
  
  return 'Address not provided';
}
```

**Data Guard:**
- Each planned item has: `{ id, name, lat, lon, addressLine1?, locality?, region?, postcode? }`
- If address missing: Shows "Address not provided"
- Google Maps link still works via lat/lon coordinates

### 4. Key Improvements Over Previous Implementation

**Before:**
- Used hidden `<div>` with `position: fixed; left: -9999px`
- No proper wait for images
- Single RAF wait only
- Component rendered in main React tree

**After:**
- ✅ Dynamic portal creation (`#print-root`)
- ✅ Proper React 18 `createRoot()` API
- ✅ Wait for `document.fonts.ready`
- ✅ Wait for ALL images with Promise.all
- ✅ Two RAF waits for complete layout
- ✅ Proper cleanup (unmount + remove DOM node)
- ✅ Better error handling with fallback to print dialog

## Testing Checklist

### Before Testing:
1. Navigate to planner page with POIs: `http://localhost:3000/?from=palermo&date=2025-10-30`
2. Drag at least one POI into a time slot
3. Optionally add a sidequest

### PDF Generation Test:
1. Click "Download PDF" button
2. Wait for generation (button shows "Generating...")
3. PDF file downloads: `ItaloPlanner-Itinerary.pdf`

### PDF Content Verification:
✅ **Header:**
- [ ] Logo displays correctly
- [ ] "ItaloPlanner" title visible
- [ ] Slogan present

✅ **Subheader:**
- [ ] Date formatted correctly
- [ ] Area name displays

✅ **Timeline:**
- [ ] All filled slots appear
- [ ] POI names are clickable links
- [ ] Addresses show (or "Address not provided")
- [ ] Google Maps links work
- [ ] Sidequests appear with special styling
- [ ] Items sorted by time

✅ **Footer:**
- [ ] Copyright notice with current year
- [ ] Tagline displays
- [ ] Privacy note present

✅ **Quality:**
- [ ] File is non-empty (>10KB typical)
- [ ] Text is clear and readable
- [ ] Links are clickable in PDF
- [ ] No cut-off content
- [ ] Logo renders properly

## Technical Notes

### Portal Rendering
- Portal is created in `<body>` as `#print-root`
- Rendered offscreen to avoid visual flicker
- Uses `position: fixed` (NOT `display: none` which breaks html2canvas)
- Width set to 794px (A4 width in pixels at 96 DPI)

### Resource Loading
- **Fonts**: Critical for text rendering
- **Images**: Logo must load before capture
- **Layout**: Two RAFs ensure CSS is fully applied

### Cleanup
- Unmounts React component
- Removes DOM node
- Prevents memory leaks

### Error Handling
- Try-catch around entire process
- Fallback to browser print dialog
- Cleanup on error path
- User-friendly error messages

## Files Modified

1. `components/DayPlanner.tsx` - PDF generation logic
2. `components/ItineraryPrintView.tsx` - Already had correct structure
3. `lib/plan-utils.ts` - Already had formatAddress() utility

## Migration Notes

- Removed old hidden print view from JSX
- Now uses dynamic portal rendering
- Better resource management
- Improved error recovery
