import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME || 'uploads';

// Ensure client only gets created if env vars exist
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function POST(request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase configuration missing' }, { status: 500 });
    }

    const data = await request.formData();
    // Support either single 'file' or multiple 'files' / repeated 'file' entries
    const rawFiles = data.getAll('files').length > 0 ? data.getAll('files') : data.getAll('file');
    const validFiles = rawFiles.filter(f => f && typeof f !== 'string' && f.name);

    if (validFiles.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid file uploaded' }, { status: 400 });
    }

    const results = [];
    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitized timestamped filename
      const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}-${sanitizedOriginal}`;
      
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFilename, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uniqueFilename);

      results.push({
        url: publicUrl,
        fileName: uniqueFilename
      });
    }

    return NextResponse.json({ 
      success: true, 
      url: results[0]?.url || null,
      urls: results.map(r => r.url),
      fileName: results[0]?.fileName || null,
      files: results
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
