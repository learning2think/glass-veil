import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
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
for (const relative of files) {
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(siteRoot, relative), destination);
}
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`GLASS VEIL: ${files.length} files prepared in ${output}`);
