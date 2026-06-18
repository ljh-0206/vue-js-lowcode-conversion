import * as compiler from '@vue/compiler-sfc';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { ParsedComponent } from '../types';

export function parseVueSfc(content: string, _filename: string): ParsedComponent {
  const { descriptor, errors } = compiler.parse(content);

  if (errors.length > 0) {
    throw new Error(`SFC parse errors: ${errors.join(', ')}`);
  }

  const template = descriptor.template?.content || '';
  const style = descriptor.styles[0]?.content || '';
  const scriptRaw = descriptor.script?.content || '';

  const ast = parser.parse(scriptRaw, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let name = '';
  const options: Record<string, string> = {};
  const moduleSymbols: string[] = [];
  const importRanges: Array<[number, number]> = [];

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const decl = path.node.declaration;
      if (t.isObjectExpression(decl)) {
        decl.properties.forEach((prop) => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            const key = prop.key.name;
            if (key === 'name' && t.isStringLiteral(prop.value)) {
              name = prop.value.value;
            } else if (key !== 'components') {
              options[key] = getPropRawText(scriptRaw, prop.start!, prop.end!);
            }
          } else if (t.isObjectMethod(prop) && t.isIdentifier(prop.key)) {
            const key = prop.key.name;
            options[key] = getPropRawText(scriptRaw, prop.start!, prop.end!);
          }
        });
      }
    },

    ImportDeclaration(path) {
      if (typeof path.node.start === 'number' && typeof path.node.end === 'number') {
        importRanges.push([path.node.start, path.node.end]);
      }
    },

    VariableDeclaration(path) {
      if (path.scope.parent === null || path.parent.type === 'Program') {
        path.node.declarations.forEach((decl) => {
          if (t.isIdentifier(decl.id)) {
            moduleSymbols.push(decl.id.name);
          }
        });
      }
    },

    FunctionDeclaration(path) {
      if ((path.scope.parent === null || path.parent.type === 'Program') && path.node.id && t.isIdentifier(path.node.id)) {
        moduleSymbols.push(path.node.id.name);
      }
    },

    ClassDeclaration(path) {
      if ((path.scope.parent === null || path.parent.type === 'Program') && path.node.id && t.isIdentifier(path.node.id)) {
        moduleSymbols.push(path.node.id.name);
      }
    },
  });

  let scriptClean = scriptRaw;
  if (importRanges.length > 0) {
    importRanges.sort((a, b) => b[0] - a[0]);
    for (const [start, end] of importRanges) {
      let endPos = end;
      if (endPos < scriptClean.length && scriptClean[endPos] === '\n') {
        endPos = endPos + 1;
      } else if (endPos + 1 < scriptClean.length && scriptClean.substring(endPos, endPos + 2) === '\r\n') {
        endPos = endPos + 2;
      }
      scriptClean = scriptClean.substring(0, start) + scriptClean.substring(endPos);
    }
    scriptClean = scriptClean.trim();
  }

  return {
    name,
    template,
    style,
    options,
    moduleSymbols,
    importsRemoved: importRanges.length,
  };
}

function getPropRawText(scriptRaw: string, start: number, end: number): string {
  const lineStart = scriptRaw.lastIndexOf('\n', start - 1) + 1;
  return scriptRaw.substring(lineStart, end);
}
