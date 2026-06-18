import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { ChangeRecord, ImportInfo } from '../types';

const REPLACEABLE_MAP: Record<string, string> = {
  'lodash': 'this.commonsJs._',
  'lodash/debounce': 'this.commonsJs.debounce',
  'lodash/throttle': 'this.commonsJs.throttle',
  'moment': 'this.commonsJs.moment',
  'axios': 'this.commonsJs.axios',
};

export function analyzeImports(content: string, filename: string): { imports: ImportInfo[]; changes: ChangeRecord[] } {
  // Wrap content in a function if it contains top-level return
  const hasTopLevelReturn = /^\s*return\s+\{/m.test(content);
  const wrappedContent = hasTopLevelReturn ? `function __wrapper__() {\n${content}\n}` : content;
  
  const ast = parser.parse(wrappedContent, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const imports: ImportInfo[] = [];
  const changes: ChangeRecord[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      const specifiers = path.node.specifiers.map((spec) => {
        if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
          return spec.imported.name;
        }
        if (t.isImportDefaultSpecifier(spec)) {
          return 'default';
        }
        if (t.isImportNamespaceSpecifier(spec)) {
          return '*';
        }
        return '';
      }).filter(Boolean);

      const isReplaceable = source in REPLACEABLE_MAP;
      const replaceableWith = isReplaceable ? REPLACEABLE_MAP[source] : undefined;

      imports.push({
        source,
        specifiers,
        isReplaceable,
        replaceableWith,
      });

      if (isReplaceable) {
        const position = path.node.loc?.start;
        if (position) {
          changes.push({
            type: 'delete',
            position: { file: filename, line: position.line, column: position.column },
            description: `删除可替代 import: ${source}`,
          });
        }
      }
    },
  });

  return { imports, changes };
}

export function removeImports(content: string, importsToRemove: string[], filename: string): { output: string; changes: ChangeRecord[] } {
  // Wrap content in a function if it contains top-level return
  const hasTopLevelReturn = /^\s*return\s+\{/m.test(content);
  const wrappedContent = hasTopLevelReturn ? `function __wrapper__() {\n${content}\n}` : content;
  
  const ast = parser.parse(wrappedContent, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const changes: ChangeRecord[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (importsToRemove.includes(source)) {
        const position = path.node.loc?.start;
        if (position) {
          changes.push({
            type: 'delete',
            position: { file: filename, line: position.line, column: position.column },
            description: `删除 import: ${source}`,
          });
        }
        path.remove();
      }
    },
  });

  let output = generate(ast).code;
  
  // Unwrap if we wrapped the content
  if (hasTopLevelReturn) {
    const lines = output.split('\n');
    if (lines[0].includes('function __wrapper__()') && lines[lines.length - 1].trim() === '}') {
      lines.shift();
      lines.pop();
      // Remove leading spaces from each line
      output = lines.map(line => line.replace(/^  /, '')).join('\n');
    } else {
      output = lines.join('\n');
    }
  }
  
  return { output, changes };
}

export function checkImportReplaceability(source: string): { replaceable: boolean; replacement?: string } {
  if (source in REPLACEABLE_MAP) {
    return {
      replaceable: true,
      replacement: REPLACEABLE_MAP[source],
    };
  }
  return { replaceable: false };
}
