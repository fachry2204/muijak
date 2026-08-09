import {NextResponse} from 'next/server';

const cache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const {texts, target} = await request.json() as {texts: string[]; target: string};
    if (!['en', 'ar'].includes(target) || !Array.isArray(texts)) {
      return NextResponse.json({success: false, error: 'Invalid translation request'}, {status: 400});
    }

    const limitedTexts = texts.slice(0, 40).map((text) => String(text || '').slice(0, 12000));
    const translated = await Promise.all(limitedTexts.map(async (text) => {
      if (!text.trim()) return text;
      const key = `${target}:${text}`;
      if (cache.has(key)) return cache.get(key)!;

      const body = new URLSearchParams({client: 'gtx', sl: 'id', tl: target, dt: 't', q: text});
      const response = await fetch('https://translate.googleapis.com/translate_a/single', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body,
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) return text;
      const data = await response.json();
      const result = Array.isArray(data?.[0])
        ? data[0].map((segment: unknown[]) => segment?.[0] || '').join('')
        : text;
      cache.set(key, result);
      return result;
    }));

    return NextResponse.json({success: true, data: translated});
  } catch {
    return NextResponse.json({success: false, error: 'Translation unavailable'}, {status: 500});
  }
}
