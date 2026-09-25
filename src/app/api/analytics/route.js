import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { profileId, eventType } = body;

    if (!profileId || !eventType) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const ua = request.headers.get('user-agent') || null;

    await prisma.analyticsEvent.create({
      data: {
        profileId,
        eventType,
        userAgent: ua ? ua.slice(0, 200) : null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
