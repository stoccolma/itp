import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const slug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !slug) {
      return NextResponse.json(
        { error: 'Type and slug are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Get current date for directory structure
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    // Create upload directory
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'images',
      'editorial',
      year,
      month,
      slug
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate filename
    const extension = file.name.split('.').pop();
    const filename = `cover.${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    // Return public URL
    const publicUrl = `/images/editorial/${year}/${month}/${slug}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
