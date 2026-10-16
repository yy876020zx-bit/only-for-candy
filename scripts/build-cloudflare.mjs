import { createHash } from 'node:crypto';
import { mkdir, open, readdir, rm, stat, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist-cloudflare');
const assetLimit = 25 * 1024 * 1024;
const chunkSize = 20 * 1024 * 1024;
const media = {};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

async function copy(relative) {
  const source = path.join(root, relative);
  const info = await stat(source);
  if (info.isDirectory()) {
    for (const entry of await readdir(source)) {
      if (!entry.startsWith('.')) await copy(path.posix.join(relative, entry));
    }
    return;
  }
  if (info.size <= assetLimit) {
    const destination = path.join(output, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
    return;
  }
  if (!relative.startsWith('assets/videos/') || !relative.endsWith('.mp4')) {
    throw new Error(`Asset exceeds Cloudflare's limit: ${relative}`);
  }
  const folder = `/__media-parts/${path.basename(relative, '.mp4')}`;
  await mkdir(path.join(output, folder), { recursive: true });
  const input = await open(source, 'r');
  const hash = createHash('sha256');
  const parts = [];
  try {
    for (let offset = 0, index = 0; offset < info.size; index++) {
      const length = Math.min(chunkSize, info.size - offset);
      const buffer = Buffer.allocUnsafe(length);
      let loaded = 0;
      while (loaded < length) {
        const { bytesRead } = await input.read(buffer, loaded, length - loaded, offset + loaded);
        if (!bytesRead) throw new Error(`Unexpected end of ${relative}`);
        loaded += bytesRead;
      }
      hash.update(buffer);
      const partPath = `${folder}/${String(index).padStart(4, '0')}.bin`;
      await writeFile(path.join(output, partPath), buffer);
      parts.push({ path: partPath, offset, size: length });
      offset += length;
    }
  } finally {
    await input.close();
  }
  media[`/${relative}`] = {
    size: info.size,
    type: 'video/mp4',
    etag: `"${hash.digest('hex')}"`,
    parts
  };
  console.log(`Stored ${relative} as ${parts.length} lossless byte segments (${info.size} bytes)`);
}

for (const directory of ['assets', 'css', 'js']) await copy(directory);
for (const filename of await readdir(root)) {
  if (filename.endsWith('.html')) await copy(filename);
}
await mkdir(path.join(root, 'cloudflare'), { recursive: true });
await writeFile(path.join(root, 'cloudflare/generated-media.mjs'), `export default ${JSON.stringify(media, null, 2)};\n`);
console.log('Cloudflare site build complete; original video bytes are preserved.');
