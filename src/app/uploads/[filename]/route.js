import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword'
};

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;

    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid file request', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    const fileBuffer = await readFile(filePath);

    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new NextResponse('File not found', { status: 404 });
    }
    return new NextResponse('Server file error', { status: 500 });
  }
}
