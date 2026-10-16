import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { open, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import manifest from './generated-media.mjs';
import worker from './worker.mjs';
import { serveMedia } from './media.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const mediaPath = '/assets/videos/episode-01-main.mp4';
const file = manifest[mediaPath];
globalThis.FixedLengthStream = class extends TransformStream {
  constructor(length) {
    let bytes = 0;
    super({
      transform(chunk, controller) {
        bytes += chunk.byteLength;
        assert.ok(bytes <= length);
        controller.enqueue(chunk);
      },
      flush() { assert.equal(bytes, length); }
    });
  }
};

function assetService(ignoreRange = false) {
  return {
    async fetch(request) {
      const pathname = new URL(request.url).pathname;
      const content = await readFile(path.join(root, 'dist-cloudflare', pathname));
      const match = /^bytes=(\d+)-(\d+)$/.exec(request.headers.get('Range') || '');
      if (!match || ignoreRange) return new Response(content);
      const start = Number(match[1]);
      const end = Number(match[2]);
      return new Response(content.subarray(start, end + 1), {
        status: 206,
        headers: { 'Content-Range': `bytes ${start}-${end}/${content.length}` }
      });
    }
  };
}

async function expectRange(range, start, end, ignoreRange = false) {
  const result = await serveMedia(new Request(`https://candy.test${mediaPath}`, { headers: { Range: range } }), assetService(ignoreRange), file);
  assert.equal(result.status, 206);
  assert.equal(result.headers.get('Content-Range'), `bytes ${start}-${end}/${file.size}`);
  assert.equal(Number(result.headers.get('Content-Length')), end - start + 1);
  const input = await open(path.join(root, mediaPath), 'r');
  const expected = Buffer.alloc(end - start + 1);
  await input.read(expected, 0, expected.length, start);
  await input.close();
  assert.deepEqual(Buffer.from(await result.arrayBuffer()), expected);
}

test('iOS two-byte probe and seeking within a segment', async () => {
  await expectRange('bytes=0-1', 0, 1);
  await expectRange('bytes=500000-503999', 500000, 503999);
});
test('byte ranges cross segment boundaries without changing bytes', async () => {
  const boundary = file.parts[1].offset;
  await expectRange(`bytes=${boundary - 2048}-${boundary + 2047}`, boundary - 2048, boundary + 2047);
});
test('suffix, open-ended, and oversized end ranges', async () => {
  await expectRange('bytes=-1024', file.size - 1024, file.size - 1);
  await expectRange(`bytes=${file.size - 1024}-`, file.size - 1024, file.size - 1);
  await expectRange(`bytes=${file.size - 1024}-${file.size + 10000}`, file.size - 1024, file.size - 1);
});
test('range remains correct if asset binding returns a full segment', async () => {
  await expectRange('bytes=1234-5678', 1234, 5678, true);
});
test('full playback hashes to the original file, with matching metadata', async () => {
  const response = await serveMedia(new Request(`https://candy.test${mediaPath}`), assetService(), file);
  assert.equal(response.status, 200);
  assert.equal(Number(response.headers.get('Content-Length')), file.size);
  const digest = createHash('sha256');
  for await (const chunk of response.body) digest.update(chunk);
  const original = createHash('sha256').update(await readFile(path.join(root, mediaPath))).digest('hex');
  assert.equal(digest.digest('hex'), original);
  assert.equal(file.etag, `"${original}"`);
});
test('HEAD and conditional requests do not read video segments', async () => {
  const noFetch = { fetch() { throw new Error('must not read video'); } };
  const head = await serveMedia(new Request(`https://candy.test${mediaPath}`, { method: 'HEAD' }), noFetch, file);
  assert.equal(head.status, 200);
  assert.equal(head.body, null);
  assert.equal(Number(head.headers.get('Content-Length')), file.size);
  const cached = await serveMedia(new Request(`https://candy.test${mediaPath}`, { headers: { 'If-None-Match': file.etag } }), noFetch, file);
  assert.equal(cached.status, 304);
  const invalid = await serveMedia(new Request(`https://candy.test${mediaPath}`, { headers: { Range: `bytes=${file.size}-` } }), noFetch, file);
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get('Content-Range'), `bytes */${file.size}`);
});
test('private storage paths are hidden and missing media returns 502', async () => {
  const response = await worker.fetch(new Request('https://candy.test/__media-parts/episode-01-main/0000.bin'), {});
  assert.equal(response.status, 404);
  const broken = await serveMedia(new Request(`https://candy.test${mediaPath}`), { fetch: async () => new Response(null, { status: 404 }) }, file);
  assert.equal(broken.status, 502);
});
test('every deployment asset fits Cloudflare limit; complete page is retained', async () => {
  async function check(folder) {
    for (const name of await readdir(folder)) {
      const p = path.join(folder, name);
      const info = await stat(p);
      if (info.isDirectory()) await check(p);
      else assert.ok(info.size <= 25 * 1024 * 1024, p);
    }
  }
  await check(path.join(root, 'dist-cloudflare'));
  assert.deepEqual(await readFile(path.join(root, 'dist-cloudflare/index.html')), await readFile(path.join(root, 'index.html')));
});
test('all six video paths support byte-range requests, even when storage ignores Range', async () => {
  assert.equal(Object.keys(manifest).length, 6);
  for (const [pathname, metadata] of Object.entries(manifest)) {
    const result = await worker.fetch(new Request(`https://candy.test${pathname}`, { headers: { Range: 'bytes=0-1023' } }), { ASSETS: assetService(true) });
    assert.equal(result.status, 206, pathname);
    assert.equal(result.headers.get('Content-Range'), `bytes 0-1023/${metadata.size}`);
    assert.deepEqual(Buffer.from(await result.arrayBuffer()), (await readFile(path.join(root, pathname))).subarray(0, 1024));
  }
});
