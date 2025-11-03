# Address Normalization Implementation

## Overview
This document describes the implementation of normalized address fields for POIs and plan items in the ItaloPlanner application.

## Changes Made

### 1. POI Type Updates (`lib/pois.ts`)
- Added normalized address fields to POI type:
  - `addressLine1?: string` - Street address line
  - `locality?: string` - City/town
  - `region?: string` - Region/province
  - `postcode?: string` - Postal code
- Updated CSV parsing to read these fields from `address_line1`, `locality`, `region`, `postcode` columns
- Maintained backward compatibility with legacy `address` field

### 2. Plan Item Types (`lib/plan.ts`)
- Added same address fields to `PlanSlot` type
- Added same address fields to `Sidequest` type
- Created `formatAddress()` utility function that:
  - Returns `'line1, locality'` when both fields are present
  - Returns just `line1` when only that is present
  - Returns `'Address not provided'` as fallback

### 3. Address Copying Logic (`app/components/DayPlannerWrapper.tsx`)
- Updated `fetchPOIById()` to include new address fields
- Modified slot addition logic to copy address fields from POI:
  ```typescript
  addressLine1: fullPOI.addressLine1,
  locality: fullPOI.locality,
  region: fullPOI.region,
  postcode: fullPOI.postcode
  ```
- Updated sidequest creation to fetch and include address fields
- Applied same logic when promoting sidequests to main slots

### 4. PDF View Integration (`components/ItineraryPrintView.tsx`)
- Imported `formatAddress` utility
- Updated address display to use `formatAddress(slot)` instead of raw address field
- Result: PDF shows proper one-line formatted address or fallback message

### 5. API Exposure (`app/api/pois/route.ts`)
- Updated GeoJSON properties to include normalized fields:
  - `address_line1`
  - `locality`
  - `region`
  - `postcode`
- Maintains backward compatibility with `address` field

## Usage

### CSV Format
POI data can now include these optional columns:
```csv
id,name,lat,lon,address_line1,locality,region,postcode
poi-1,Restaurant Name,37.5,14.2,"Via Roma 123","Catania","Sicily","95100"
```

### Address Display
The `formatAddress()` function handles all formatting:
- With full data: `"Via Roma 123, Catania"`
- With line1 only: `"Via Roma 123"`
- Without data: `"Address not provided"`

### In Code
```typescript
import { formatAddress } from '@/lib/plan';

// For POI
const address = formatAddress(poi);

// For PlanSlot
const address = formatAddress(slot);

// For Sidequest  
const address = formatAddress(sidequest);
```

## Testing Checklist

- [x] POI type includes new address fields
- [x] CSV parsing reads address fields correctly
- [x] formatAddress utility works with all input types
- [x] Address fields copied when adding POI to slot
- [x] Address fields copied when adding POI to sidequest
- [x] Address fields copied when promoting sidequest to slot
- [x] PDF view displays formatted addresses
- [x] API exposes address fields in GeoJSON
- [ ] Manual testing: Add POI with address fields to plan
- [ ] Manual testing: Generate PDF and verify address display
- [ ] Manual testing: Verify fallback when address missing

## Backward Compatibility

All changes maintain backward compatibility:
- Legacy `address` field still supported
- New fields are optional
- Existing POIs without new fields continue to work
- `formatAddress()` gracefully handles missing data

## Next Steps

To complete the implementation:
1. Add address fields to POI CSV data
2. Test with real data containing addresses
3. Verify PDF generation shows formatted addresses
4. Test with POIs missing address data (should show fallback)
