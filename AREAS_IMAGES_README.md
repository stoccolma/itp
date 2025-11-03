# Area Images Management System

File-based image management system for area pages with SSR support and full accessibility features.

## Features

- 📸 **Hero Images**: Featured image display on area pages
- 🖼️ **Gallery**: Lightbox-enabled image gallery
- ⚙️ **Admin UI**: Drag-and-drop upload and management interface
- ♿ **Accessibility**: Full a11y support with text-only mode
- 📁 **File-Based**: No database required, JSON manifests
- 🎨 **Brand Aligned**: Uses project color palette

## Architecture

### Data Model

**Manifest Location**: `data/areas_images/<slug>.json`

```json
{
  "slug": "noto",
  "images": [
    {
      "id": "uuid-here",
      "src": "/areas/noto/image.jpg",
      "alt": "Required accessible description",
      "caption": "Optional display caption",
      "credit": "Photographer name",
      "source_url": "https://source.com",
      "featured": true,
      "order": 0
    }
  ],
  "updatedAt": "2025-10-24T12:00:00.000Z"
}
```

**Image Storage**: `public/areas/<slug>/`

### Components

#### Public-Facing Components

1. **AreaImageHero** (`components/AreaImageHero.tsx`)
   - Displays featured image or first image
   - Responsive aspect ratio (21:9 on desktop, 16:7 on mobile)
   - Shows caption and photo credit
   - Respects text-only mode

2. **AreaImageGallery** (`components/AreaImageGallery.tsx`)
   - Grid layout (2-4 columns based on screen size)
   - Lightbox modal on click
   - Filters out featured image
   - Hidden in text-only mode

#### Admin Components

3. **ImageUploader** (`components/admin/ImageUploader.tsx`)
   - Drag-and-drop file upload
   - File validation (type, size)
   - Metadata input fields
   - Progress indication

4. **ImageListEditor** (`components/admin/ImageListEditor.tsx`)
   - Sortable list with @dnd-kit
   - Inline metadata editing
   - Featured image toggle
   - Delete functionality

### API Routes

**Endpoint**: `/api/areas/[slug]/images`

- **GET**: Fetch manifest (public)
- **POST**: Upload new image (admin only)
- **PATCH**: Update metadata/order (admin only)
- **DELETE**: Remove image (admin only)

All write operations require `ITP_ADMIN=true` in environment.

### Library Functions

**Location**: `lib/areas.ts`

```typescript
// Get all images for an area (sorted by order, then featured)
getAreaImages(slug: string): Promise<AreaImage[]>

// Get featured image or first image
getFeaturedAreaImage(slug: string): Promise<AreaImage | null>

// Read manifest (returns null if doesn't exist)
readAreaImagesManifest(slug: string): Promise<AreaImagesManifest | null>

// Write manifest (auto-updates timestamp)
writeAreaImagesManifest(manifest: AreaImagesManifest): Promise<void>

// Ensure directory exists in public/areas
ensureAreaDirectory(slug: string): Promise<string>
```

## Setup

### 1. Enable Admin Mode

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local
ITP_ADMIN=true
```

### 2. Enable in Browser

Open browser console and run:

```javascript
localStorage.setItem('itp_admin', 'true');
```

### 3. Access Admin UI

Navigate to: `/admin/areas/{area-slug}/images`

Example: `/admin/areas/noto/images`

## Usage

### Adding Images to an Area

1. Go to `/admin/areas/noto/images`
2. Fill in **required** alt text
3. Add optional caption, credit, source URL
4. Drag and drop image or click to browse
5. Image uploads and appears in list below

### Managing Images

- **Reorder**: Drag items by the grip handle
- **Set Featured**: Click star icon (only one can be featured)
- **Edit Metadata**: Type directly in the fields
- **Delete**: Click trash icon
- **Save**: Click "Save Changes" button to persist

### Integrating into Area Pages

In your area page (`app/areas/[slug]/page.tsx`):

```typescript
import { getFeaturedAreaImage, getAreaImages } from '@/lib/areas';
import AreaImageHero from '@/components/AreaImageHero';
import AreaImageGallery from '@/components/AreaImageGallery';

export default async function AreaPage({ params }) {
  const { slug } = params;
  
  const featuredImage = await getFeaturedAreaImage(slug);
  const allImages = await getAreaImages(slug);

  return (
    <div>
      <AreaImageHero image={featuredImage} />
      
      {/* Your content here */}
      
      <AreaImageGallery images={allImages} />
    </div>
  );
}
```

## File Validation

### Accepted Formats
- JPEG/JPG
- PNG
- WebP

### Size Limits
- Maximum: 8MB per file
- Recommended: 1-2MB for optimal loading

### Naming
- Files auto-renamed with UUID
- Original filename not preserved
- Safe from path traversal

## Accessibility

### Alt Text
- **Required** for all images
- Prevents save if missing
- Displayed to screen readers

### Text-Only Mode
- Hero shows placeholder text
- Gallery completely hidden
- No visual distractions

### Keyboard Navigation
- Full keyboard support in admin
- Sortable with keyboard
- Focus indicators on all controls

## Color Palette Integration

Components use the project palette:

- `primary-50` (#FBF3D1) - Backgrounds
- `primary-100` (#DEDED1) - Cards
- `primary-200` (#C5C7BC) - Borders
- `primary-300` (#B6AE9F) - Accents
- `gold-400-600` - Highlights and actions

## Security Considerations

1. **Admin Gate**: All write operations check `ITP_ADMIN` env var
2. **Client Check**: Admin pages check localStorage before rendering
3. **File Validation**: Type and size checks server-side
4. **Path Safety**: Normalized paths prevent directory traversal
5. **No DB**: File-based means no SQL injection risks

## Production Recommendations

1. **Disable Admin**: Set `ITP_ADMIN=false` in production
2. **CDN**: Serve images from CDN for better performance
3. **Image Optimization**: Consider next/image automatic optimization
4. **Backup**: Version control your `data/areas_images/` folder
5. **Auth**: Add proper authentication before admin access

## Troubleshooting

### Images not appearing
- Check file exists in `public/areas/{slug}/`
- Verify manifest JSON is valid
- Check browser console for 404s

### Can't upload
- Verify `ITP_ADMIN=true` in `.env.local`
- Check file size (<8MB)
- Ensure file type is supported

### Admin page redirects
- Run `localStorage.setItem('itp_admin', 'true')` in console
- Hard refresh the page

### Drag and drop not working
- Ensure @dnd-kit packages installed
- Check browser console for errors
- Try clicking and dragging from grip icon

## Example Workflows

### Initial Setup for New Area

```bash
# 1. Create manifest file
touch data/areas_images/palermo.json

# 2. Add basic structure
echo '{
  "slug": "palermo",
  "images": [],
  "updatedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
}' > data/areas_images/palermo.json

# 3. Create directory
mkdir -p public/areas/palermo

# 4. Go to admin UI and upload images
```

### Bulk Import

For bulk importing existing images:

1. Place images in `public/areas/{slug}/`
2. Manually create manifest JSON with entries
3. Use UUID generator for IDs
4. Set proper order and featured flags

## Future Enhancements

Potential additions:

- [ ] Image cropping tool
- [ ] Multiple featured images (carousel)
- [ ] EXIF data extraction
- [ ] Automatic WebP conversion
- [ ] Lazy loading optimization
- [ ] Image CDN integration
- [ ] Bulk upload interface

## Dependencies

- `uuid` - ID generation
- `@dnd-kit/core` - Drag and drop core
- `@dnd-kit/sortable` - Sortable lists
- `@dnd-kit/utilities` - DnD utilities
- `next/image` - Image optimization
- `lucide-react` - Icons

## Support

For issues or questions:
1. Check this README
2. Review component comments
3. Check browser console for errors
4. Verify file permissions

---

**Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Maintainer**: ItaloPlanner Team
