import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  readAreaImagesManifest, 
  writeAreaImagesManifest, 
  ensureAreaDirectory,
  type AreaImage,
  type AreaImagesManifest 
} from '@/lib/areas';

// Admin guard
function checkAdmin() {
  if (process.env.ITP_ADMIN !== 'true') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

// GET: Return manifest JSON
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const manifest = await readAreaImagesManifest(slug);
  
  if (!manifest) {
    return NextResponse.json({ 
      slug, 
      images: [], 
      updatedAt: new Date().toISOString() 
    });
  }
  
  return NextResponse.json(manifest);
}

// POST: Upload new image
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = checkAdmin();
  if (adminCheck) return adminCheck;
  
  const { slug } = await params;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const caption = formData.get('caption') as string | null;
    const credit = formData.get('credit') as string | null;
    const source_url = formData.get('source_url') as string | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!alt || alt.trim() === '') {
      return NextResponse.json({ error: 'Alt text is required' }, { status: 400 });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }
    
    // Validate file size (8MB max)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 8MB.' 
      }, { status: 400 });
    }
    
    // Ensure directory exists
    const areaDir = await ensureAreaDirectory(slug);
    
    // Generate safe filename
    const ext = path.extname(file.name);
    const id = uuidv4();
    const filename = `${id}${ext}`;
    const filePath = path.join(areaDir, filename);
    
    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);
    
    // Update manifest
    let manifest = await readAreaImagesManifest(slug);
    if (!manifest) {
      manifest = {
        slug,
        images: [],
        updatedAt: new Date().toISOString()
      };
    }
    
    const newImage: AreaImage = {
      id,
      src: `/areas/${slug}/${filename}`,
      alt: alt.trim(),
      ...(caption && { caption: caption.trim() }),
      ...(credit && { credit: credit.trim() }),
      ...(source_url && { source_url: source_url.trim() }),
      featured: manifest.images.length === 0, // First image is featured by default
      order: manifest.images.length
    };
    
    manifest.images.push(newImage);
    await writeAreaImagesManifest(manifest);
    
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image' 
    }, { status: 500 });
  }
}

// PATCH: Update metadata or reorder
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = checkAdmin();
  if (adminCheck) return adminCheck;
  
  const { slug } = await params;
  
  try {
    const updates = await request.json() as AreaImage[];
    
    const manifest = await readAreaImagesManifest(slug);
    if (!manifest) {
      return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
    }
    
    // Update images
    manifest.images = updates.map(update => {
      const existing = manifest.images.find(img => img.id === update.id);
      if (!existing) return update;
      
      return {
        ...existing,
        ...update,
        alt: update.alt.trim() || existing.alt // Alt is required
      };
    });
    
    await writeAreaImagesManifest(manifest);
    
    return NextResponse.json(manifest);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update images' 
    }, { status: 500 });
  }
}

// DELETE: Delete image by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = checkAdmin();
  if (adminCheck) return adminCheck;
  
  const { slug } = await params;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }
    
    const manifest = await readAreaImagesManifest(slug);
    if (!manifest) {
      return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
    }
    
    const image = manifest.images.find(img => img.id === id);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // Delete file
    const filePath = path.join(process.cwd(), 'public', image.src);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File deletion error:', error);
      // Continue even if file doesn't exist
    }
    
    // Remove from manifest
    manifest.images = manifest.images.filter(img => img.id !== id);
    await writeAreaImagesManifest(manifest);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete image' 
    }, { status: 500 });
  }
}
