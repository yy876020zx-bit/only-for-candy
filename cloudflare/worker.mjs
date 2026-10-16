import media from './generated-media.mjs';
import { serveMedia } from './media.mjs';

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith('/__media-parts/')) return new Response('Not found', { status: 404 });
    const file = media[pathname];
    if (file) return serveMedia(request, env.ASSETS, file);
    return env.ASSETS.fetch(request);
  }
};
