import * as fs from 'fs';
import * as path from 'path';
import { parseVueSfc } from './parsers/vue-sfc';
import { transformThisInfo } from './transformers/this-info';
import { analyzeImports, removeImports } from './transformers/import';
import { generateJsOutput } from './generators/js-output';
import { fullMigrationCheck, buildSourceSymbols, buildTargetSymbols } from './checker/full-migration';
import { ConversionResult, ChangeRecord, CheckResult } from './types';

export function vueToJs(inputPath: string, outputPath?: string): ConversionResult {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const filename = path.basename(inputPath);

  const component = parseVueSfc(content, filename);

  const sourceSymbols = buildSourceSymbols(
    Object.keys(component.options),
    component.moduleSymbols,
    []
  );

  const { output: jsOutput, changes: jsChanges } = generateJsOutput(component, filename);

  const { output: transformedOutput, changes: transformChanges } = transformThisInfo(jsOutput, filename);

  const { imports, changes: importChanges } = analyzeImports(transformedOutput, filename);

  const replaceableImports = imports
    .filter((imp) => imp.isReplaceable)
    .map((imp) => imp.source);

  const { output: finalOutput, changes: removeImportChanges } = removeImports(
    transformedOutput,
    replaceableImports,
    filename
  );

  const targetSymbols = buildTargetSymbols(
    Object.keys(component.options).filter((key) => key !== 'components'),
    component.moduleSymbols,
    []
  );

  const checkResult = fullMigrationCheck(sourceSymbols, targetSymbols);

  const allChanges: ChangeRecord[] = [
    ...jsChanges,
    ...transformChanges,
    ...importChanges,
    ...removeImportChanges,
  ];

  if (outputPath) {
    fs.writeFileSync(outputPath, finalOutput, 'utf-8');
  }

  return {
    output: finalOutput,
    changes: allChanges,
    checkResult,
  };
}

export function generateConversionReport(result: ConversionResult): string {
  let report = '=== 转换报告 ===\n\n';

  if (result.changes.length > 0) {
    report += '【改动记录】\n';
    result.changes.forEach((change, index) => {
      report += `${index + 1}. [${change.type}] ${change.description}\n`;
      report += `   位置: ${change.position.file}:${change.position.line}:${change.position.column}\n`;
    });
    report += '\n';
  }

  if (result.checkResult.warnings.length > 0) {
    report += '【警告】\n';
    result.checkResult.warnings.forEach((warning) => {
      report += `- ${warning}\n`;
    });
    report += '\n';
  }

  if (result.checkResult.unmigratedItems.length > 0) {
    report += '【未迁移项】\n';
    result.checkResult.unmigratedItems.forEach((item) => {
      report += `- [${item.type}] ${item.name}\n`;
    });
    report += '\n';
  }

  report += `转换状态: ${result.checkResult.success ? '成功' : '部分完成'}\n`;

  return report;
}
