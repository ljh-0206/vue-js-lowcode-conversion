import * as fs from 'fs';
import * as path from 'path';
import { parseJsFile } from './parsers/js-ast';
import { reverseTransformThisInfo } from './transformers/this-info';
import { generateVueOutput } from './generators/vue-output';
import { fullMigrationCheck, buildSourceSymbols, buildTargetSymbols } from './checker/full-migration';
import { ConversionResult, ChangeRecord } from './types';

export function jsToVue(inputPath: string, outputPath?: string): ConversionResult {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const filename = path.basename(inputPath);

  const component = parseJsFile(content);

  const sourceSymbols = buildSourceSymbols(
    Object.keys(component.options),
    component.moduleSymbols,
    []
  );

  const { output: vueOutput, changes: vueChanges } = generateVueOutput(component, filename);

  const { output: transformedOutput, changes: transformChanges } = reverseTransformThisInfo(vueOutput, filename);

  const targetSymbols = buildTargetSymbols(
    Object.keys(component.options),
    component.moduleSymbols,
    []
  );

  const checkResult = fullMigrationCheck(sourceSymbols, targetSymbols);

  const allChanges: ChangeRecord[] = [...vueChanges, ...transformChanges];

  if (outputPath) {
    fs.writeFileSync(outputPath, transformedOutput, 'utf-8');
  }

  return {
    output: transformedOutput,
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
