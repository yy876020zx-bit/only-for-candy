export function parseRange(value, size) {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return false;
  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return false;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || start > end) return false;
    end = Math.min(end, size - 1);
  }
  return { start, end };
}

async function fetchPart(assets, requestURL, part, start, end) {
  const localStart = start - part.offset;
  const localEnd = end - part.offset;
  const response = await assets.fetch(new Request(new URL(part.path, requestURL), {
    headers: { Range: `bytes=${localStart}-${localEnd}`, 'Accept-Encoding': 'identity' }
  }));
  if (!response.ok || !response.body) throw new Error(`Media segment unavailable: ${response.status}`);
  if (response.status === 206) {
    const expected = `bytes ${localStart}-${localEnd}/${part.size}`;
    if (response.headers.get('Content-Range') !== expected) throw new Error('Incorrect media segment range');
    return response.body;
  }
  if (localStart === 0 && localEnd === part.size - 1) return response.body;
  // Keep byte ranges correct even if an asset service returns the whole segment.
  const reader = response.body.getReader();
  let position = 0;
  let remaining = localEnd - localStart + 1;
  return new ReadableStream({
    async pull(controller) {
      while (remaining > 0) {
        const { value, done } = await reader.read();
        if (done) {
          controller.error(new Error('Truncated media segment'));
          return;
        }
        const from = Math.max(0, localStart - position);
        position += value.byteLength;
        if (from >= value.byteLength) continue;
        const bytes = value.subarray(from, from + remaining);
        remaining -= bytes.byteLength;
        controller.enqueue(bytes);
        if (!remaining) {
          controller.close();
          await reader.cancel();
        }
        return;
      }
    },
    cancel(reason) { return reader.cancel(reason); }
  });
}

export async function serveMedia(request, assets, file) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const headers = new Headers({
    'Content-Type': file.type,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=14400',
    ETag: file.etag,
    'X-Content-Type-Options': 'nosniff'
  });
  if (request.headers.get('If-None-Match')?.split(/\s*,\s*/).some(tag => tag === file.etag || tag === '*')) {
    return new Response(null, { status: 304, headers });
  }
  const ifRange = request.headers.get('If-Range');
  const range = request.method === 'GET' && (!ifRange || ifRange === file.etag)
    ? parseRange(request.headers.get('Range'), file.size) : null;
  if (range === false) {
    headers.set('Content-Range', `bytes */${file.size}`);
    return new Response(null, { status: 416, headers });
  }
  const start = range?.start ?? 0;
  const end = range?.end ?? file.size - 1;
  const length = end - start + 1;
  headers.set('Content-Length', String(length));
  if (range) headers.set('Content-Range', `bytes ${start}-${end}/${file.size}`);
  const status = range ? 206 : 200;
  if (request.method === 'HEAD') return new Response(null, { status, headers });
  const parts = file.parts.filter(part => part.offset <= end && part.offset + part.size > start);
  let first;
  try {
    first = await fetchPart(assets, request.url, parts[0], start, Math.min(end, parts[0].offset + parts[0].size - 1));
  } catch {
    return new Response('Video is temporarily unavailable', { status: 502 });
  }
  // Workers uses this stream's known length for Content-Length, including 206 responses on iOS.
  const stream = new FixedLengthStream(length);
  async function pump() {
    await first.pipeTo(stream.writable, { preventClose: true });
    for (const part of parts.slice(1)) {
      const body = await fetchPart(assets, request.url, part, Math.max(start, part.offset), Math.min(end, part.offset + part.size - 1));
      await body.pipeTo(stream.writable, { preventClose: true });
    }
    await stream.writable.close();
  }
  void pump().catch(async () => { await stream.writable.abort().catch(() => {}); });
  return new Response(stream.readable, { status, headers });
}
