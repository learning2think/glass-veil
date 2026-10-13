import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

export const siteRoot = fileURLToPath(new URL('../dist/', import.meta.url));

// Resolve every dependency against its referring file, as a browser on /repo/atlas/ does.
export async function checkSite() {
  const files = new Set();
  const pending = [
    'index.html',
    'NOTICE.txt',
    'LICENSE.txt',
    'fonts/OFL-PT-Sans.txt',
    'assets/glass-veil-lockup.svg',
  ];
  const addReference = (reference, parent) => {
    if (!reference || reference.startsWith('#') || /^(https:|data:|mailto:)/.test(reference))
      return;
    if (/^([a-z]+:|\/)/i.test(reference))
      throw new Error(`Unsupported resource URL in ${parent}: ${reference}`);
    const resource = decodeURIComponent(reference.split(/[?#]/)[0]);
    const resolved = path.resolve(siteRoot, path.dirname(parent), resource);
    const relative = path.relative(siteRoot, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative))
      throw new Error(`Resource leaves the site directory: ${reference}`);
    pending.push(relative.replaceAll(path.sep, '/'));
  };

  const sandbox = { window: {} };
  const catalogSource = await readFile(path.join(siteRoot, 'catalog.js'), 'utf8');
  vm.runInNewContext(catalogSource, sandbox, { timeout: 1000 });
  const molecules = sandbox.window.ATLAS_CATALOG?.molecules;
  if (!Array.isArray(molecules) || !molecules.length) throw new Error('Empty molecule catalog');
  const moleculeIds = new Set();
  for (const molecule of molecules) {
    if (!/^[a-z0-9-]+$/.test(molecule.id) || moleculeIds.has(molecule.id))
      throw new Error(`Invalid or duplicate molecule ID: ${molecule.id}`);
    moleculeIds.add(molecule.id);
    for (const metric of ['mw', 'logp', 'tpsa', 'hbd', 'hba'])
      if (!Number.isFinite(molecule[metric])) throw new Error(`Invalid ${metric}: ${molecule.id}`);
    pending.push(`structures/${molecule.id}.svg`);
  }

  while (pending.length) {
    const relative = pending.pop();
    if (files.has(relative)) continue;
    const absolute = path.join(siteRoot, relative);
    const info = await lstat(absolute);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error(`Not a regular file: ${relative}`);
    if (info.size > 50 * 1024 * 1024) throw new Error(`Oversized site resource: ${relative}`);
    files.add(relative);

    if (/\.(html|css|svg)$/.test(relative)) {
      const source = await readFile(absolute, 'utf8');
      for (const match of source.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g))
        addReference(match[1], relative);
      for (const match of source.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))
        addReference(match[1], relative);
      if (relative === 'index.html') {
        const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
        if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML ID');
        for (const match of source.matchAll(/href="#([^"]+)"/g))
          if (!ids.includes(match[1])) throw new Error(`Missing navigation anchor: ${match[1]}`);
        if (/127\.0\.0\.1|localhost|concept-controls|atmosphere-concept\.js/.test(source))
          throw new Error('Local preview controls found in the public page');
      }
    }
    if (relative.endsWith('.js')) {
      const result = spawnSync(process.execPath, ['--check', absolute], { encoding: 'utf8' });
      if (result.status !== 0) throw new Error(result.stderr || `Invalid JavaScript: ${relative}`);
    }
  }

  // A release should contain the active version, not old design experiments.
  const scan = async (directory, prefix = '') => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory()) await scan(path.join(directory, entry.name), `${relative}/`);
      else if (!files.has(relative)) throw new Error(`Unused release file: ${relative}`);
    }
  };
  await scan(siteRoot);
  return [...files].sort();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = await checkSite();
  console.log(`GLASS VEIL: ${files.length} files, catalog, syntax and relative paths verified.`);
}
