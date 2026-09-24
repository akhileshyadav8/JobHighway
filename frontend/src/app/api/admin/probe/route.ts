import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let url = '';

  try {
    const body = await request.json();
    url = body.url;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'JobHighway-Link-Probe/1.0'
      },
      signal: controller.signal,
      redirect: 'follow'
    }).catch(async () => {
      // Fallback to GET with small range if HEAD is not supported by target server
      return await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'JobHighway-Link-Probe/1.0',
          'Range': 'bytes=0-100'
        },
        signal: controller.signal
      });
    });

    clearTimeout(timeout);
    const durationMs = Date.now() - startTime;
    const httpStatus = res.status;
    let statusType: 'healthy' | 'redirect' | 'broken' | 'expired' = 'healthy';

    if (httpStatus >= 400 && httpStatus < 500) {
      statusType = httpStatus === 410 ? 'expired' : 'broken';
    } else if (httpStatus >= 500) {
      statusType = 'broken';
    } else if (res.redirected) {
      statusType = 'redirect';
    }

    return NextResponse.json({
      url,
      httpStatus,
      statusText: res.statusText || 'OK',
      statusType,
      durationMs,
      checkedAt: new Date().toISOString()
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return NextResponse.json({
      url,
      httpStatus: 504,
      statusText: err.name === 'AbortError' ? 'Probe Timeout (6s)' : 'Connection Failed',
      statusType: 'broken',
      durationMs,
      checkedAt: new Date().toISOString()
    });
  }
}
