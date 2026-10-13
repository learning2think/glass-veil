import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSite, siteRoot } from './check-site.mjs';

const atlasRoot = fileURLToPath(new URL('../', import.meta.url));
const standaloneOutput = path.join(atlasRoot, '.pages');
if (process.argv.length > 2) throw new Error('Build accepts no arguments; output is always .pages');
const output = standaloneOutput;
const files = await checkSite();
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const versions = new Map();
for (const relative of files) {
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(siteRoot, relative), destination);
  if (/\.(css|js)$/.test(relative)) {
    const contents = await readFile(destination);
    versions.set(relative, createHash('sha256').update(contents).digest('hex').slice(0, 12));
  }
}

// A changed file gets a new URL so returning readers receive the current styles and behavior.
const indexPath = path.join(output, 'index.html');
const html = await readFile(indexPath, 'utf8');
const versionedHtml = html.replace(
  /\b(src|href)="\.\/([^"?]+\.(?:css|js))"/g,
  (_, attribute, relative) => {
    const version = versions.get(relative);
    if (!version) throw new Error(`Missing resource version: ${relative}`);
    return `${attribute}="./${relative}?v=${version}"`;
  },
);
await writeFile(indexPath, versionedHtml);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`GLASS VEIL: ${files.length} files prepared in ${output}`);
