import { SourceSymbols, TargetSymbols, CheckResult, UnmigratedItem } from '../types';

const AUTO_FILLABLE_OPTIONS = [
  'inject',
  'directives',
  'filters',
  'model',
  'mixins',
  'provide',
  'emits',
];

export function fullMigrationCheck(source: SourceSymbols, target: TargetSymbols): CheckResult {
  const warnings: string[] = [];
  const unmigratedItems: UnmigratedItem[] = [];

  const missingOptions = source.optionsKeys.filter((key) => !target.optionsKeys.includes(key));
  const missingModuleSymbols = source.moduleSymbols.filter((sym) => !target.moduleSymbols.includes(sym));
  const missingTemplateDeps = source.templateDeps.filter((dep) => !target.templateDeps.includes(dep));

  missingOptions.forEach((key) => {
    if (AUTO_FILLABLE_OPTIONS.includes(key)) {
      warnings.push(`选项 ${key} 已自动补齐`);
    } else {
      warnings.push(`选项 ${key} 无法自动迁移，需人工处理`);
      unmigratedItems.push({ type: 'option', name: key });
    }
  });

  missingModuleSymbols.forEach((sym) => {
    warnings.push(`模块级符号 ${sym} 未迁移到目标`);
    unmigratedItems.push({ type: 'moduleSymbol', name: sym });
  });

  missingTemplateDeps.forEach((dep) => {
    warnings.push(`模板依赖 ${dep} 未迁移到目标`);
    unmigratedItems.push({ type: 'templateDep', name: dep });
  });

  return {
    success: unmigratedItems.length === 0,
    warnings,
    unmigratedItems,
  };
}

export function buildSourceSymbols(
  optionsKeys: string[],
  moduleSymbols: string[],
  templateDeps: string[]
): SourceSymbols {
  return {
    optionsKeys,
    moduleSymbols,
    templateDeps,
  };
}

export function buildTargetSymbols(
  optionsKeys: string[],
  moduleSymbols: string[],
  templateDeps: string[]
): TargetSymbols {
  return {
    optionsKeys,
    moduleSymbols,
    templateDeps,
  };
}
