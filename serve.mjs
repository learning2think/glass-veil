import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const atlasRoot = fileURLToPath(new URL('./', import.meta.url));
const { values } = parseArgs({
  options: {
    root: { type: 'string' },
    base: { type: 'string', default: '/' },
    port: { type: 'string', default: process.env.ATLAS_PORT || '4178' },
  },
});
const root = values.root ? path.resolve(values.root) : path.join(atlasRoot, 'dist');
const allowedRoots = [path.join(atlasRoot, 'dist'), path.join(atlasRoot, '.pages')];
if (!allowedRoots.includes(root)) throw new Error('Preview root must be dist or .pages');
const base = `${values.base.replace(/\/+$/, '')}/`;
if (!/^\/(?:[^/?#\\]+\/)*$/.test(base) || base.split('/').some((part) => part === '..'))
  throw new Error('Base must be an absolute URL directory, for example /In-Silico-BBB/');
const port = Number(values.port);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    if (base !== '/' && pathname === base.slice(0, -1)) {
      res.writeHead(301, { Location: base }).end();
      return;
    }
    if (!pathname.startsWith(base)) {
      res.writeHead(404).end('Not found');
      return;
    }
    let target = path.resolve(root, pathname.slice(base.length));
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`GLASS VEIL: http://127.0.0.1:${port}${base}`));
