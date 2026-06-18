import * as fs from 'fs';
import * as path from 'path';
import { parseVueSfc } from './parsers/vue-sfc';
import { generateJsOutput } from './generators/js-output';

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 2 || args[0] !== 'vue-to-js') {
    console.error('Usage: node convert.js vue-to-js <input.vue>');
    process.exit(1);
  }

  const inputPath = path.resolve(args[1]);

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.vue') {
    console.error('Input file must be a .vue file');
    process.exit(1);
  }

  const dir = path.dirname(inputPath);
  const baseName = path.basename(inputPath, '.vue');
  const outputPath = path.join(dir, `${baseName}.js`);

  const content = fs.readFileSync(inputPath, 'utf-8');
  const component = parseVueSfc(content, path.basename(inputPath));
  const jsOutput = generateJsOutput(component);

  fs.writeFileSync(outputPath, jsOutput, 'utf-8');

  const parts: string[] = [];
  parts.push(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  if (component.importsRemoved > 0) {
    parts.push(`(removed ${component.importsRemoved} import(s))`);
  }
  console.log(parts.join(' '));
}

main();
