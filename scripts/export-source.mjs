import { copyFile, lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSite, siteRoot } from './check-site.mjs';

const atlasRoot = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(atlasRoot, '.source');
if (process.argv.length > 2) throw new Error('Source export accepts no arguments');

const siteFiles = await checkSite();
const sourceFiles = [
  '.gitignore',
  '.prettierignore',
  '.prettierrc.json',
  'README.md',
  'PUBLISHING.md',
  'SOURCES-AUDIT.md',
  'package.json',
  'package-lock.json',
  'serve.mjs',
  'scripts/check-site.mjs',
  'scripts/build-site.mjs',
  'scripts/export-source.mjs',
];
for (const relative of sourceFiles) {
  const info = await lstat(path.join(atlasRoot, relative));
  if (!info.isFile() || info.isSymbolicLink())
    throw new Error(`Not a regular source file: ${relative}`);
}

// Use the standalone workflow when exporting an already separated copy.
let workflow;
try {
  workflow = await readFile(path.join(atlasRoot, '.github/workflows/pages.yml'), 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  workflow = await readFile(path.resolve(atlasRoot, '../../.github/workflows/docs.yml'), 'utf8');
}
workflow = workflow
  .replace('ATLAS_DIRECTORY: apps/atlas', 'ATLAS_DIRECTORY: .')
  .replaceAll('apps/atlas/**', '**')
  .replaceAll('.github/workflows/docs.yml', '.github/workflows/pages.yml');
if (!workflow.includes('ATLAS_DIRECTORY: .') || workflow.includes('path: site'))
  throw new Error('Expected a standalone workflow publishing .pages only');

// Copy an explicit list into a fixed generated directory; never copy the parent repository.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const relative of sourceFiles) {
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(atlasRoot, relative), destination);
}
for (const relative of siteFiles) {
  const destination = path.join(output, 'dist', relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(siteRoot, relative), destination);
}
await copyFile(path.join(siteRoot, 'LICENSE.txt'), path.join(output, 'LICENSE'));
await mkdir(path.join(output, '.github/workflows'), { recursive: true });
await writeFile(path.join(output, '.github/workflows/pages.yml'), workflow);
console.log(
  `GLASS VEIL: ${sourceFiles.length + siteFiles.length + 2} standalone source files in ${output}`,
);
