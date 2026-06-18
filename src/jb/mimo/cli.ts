import * as fs from 'fs';
import * as path from 'path';
import { vueToJs, generateConversionReport as vueToJsReport } from './vue-to-js';
import { jsToVue, generateConversionReport as jsToVueReport } from './js-to-vue';
import { ConvertOptions, Direction } from './types';

function parseArgs(args: string[]): ConvertOptions {
  if (args.length < 3) {
    console.error('Usage: vue-convert <direction> <input> [output]');
    console.error('  direction: vue-to-js | js-to-vue');
    process.exit(1);
  }

  const direction = args[2] as Direction;
  if (direction !== 'vue-to-js' && direction !== 'js-to-vue') {
    console.error('Invalid direction. Must be "vue-to-js" or "js-to-vue"');
    process.exit(1);
  }

  const input = args[3];
  if (!input) {
    console.error('Input file is required');
    process.exit(1);
  }

  const output = args[4];

  return { direction, input, output };
}

function validateInput(inputPath: string, direction: Direction): void {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file does not exist: ${inputPath}`);
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (direction === 'vue-to-js' && ext !== '.vue') {
    console.error('Input file must be a .vue file for vue-to-js conversion');
    process.exit(1);
  }

  if (direction === 'js-to-vue' && ext !== '.js') {
    console.error('Input file must be a .js file for js-to-vue conversion');
    process.exit(1);
  }
}

function getOutputPath(inputPath: string, direction: Direction): string {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);

  if (direction === 'vue-to-js') {
    return path.join(dir, `${name}.js`);
  } else {
    return path.join(dir, `${name}.vue`);
  }
}

function main() {
  const options = parseArgs(process.argv);

  validateInput(options.input, options.direction);

  const outputPath = options.output || getOutputPath(options.input, options.direction);

  console.log(`Converting ${options.direction}: ${options.input} → ${outputPath}`);

  let result;
  if (options.direction === 'vue-to-js') {
    result = vueToJs(options.input, outputPath);
  } else {
    result = jsToVue(options.input, outputPath);
  }

  const report = options.direction === 'vue-to-js'
    ? vueToJsReport(result)
    : jsToVueReport(result);

  console.log(report);

  if (result.checkResult.unmigratedItems.length > 0) {
    console.log('\n⚠️  有未迁移项，请检查报告并手动处理');
    process.exit(1);
  } else {
    console.log('\n✅ 转换完成');
  }
}

main();
