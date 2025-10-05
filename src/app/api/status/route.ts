import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

  try {
    const response = await fetch(url, { 
      signal: controller.signal, 
      cache: 'no-store',
      headers: {
        'User-Agent': 'ServerWatch-Status-Checker/1.0'
      }
    });
    clearTimeout(timeoutId);

    // Any 2xx or 3xx status code is considered 'online'
    if (response.ok) {
      return NextResponse.json({ status: 'online' });
    } else {
      return NextResponse.json({ status: 'offline' });
    }
  } catch (error) {
    clearTimeout(timeoutId);
    // This catches network errors, timeouts, DNS errors, etc.
    return NextResponse.json({ status: 'offline' });
  }
}
