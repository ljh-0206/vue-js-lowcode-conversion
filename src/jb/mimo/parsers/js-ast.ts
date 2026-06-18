import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { JsComponent } from '../types';

export function parseJsFile(content: string): JsComponent {
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let name = '';
  let template = '';
  let styleClass = '';
  const options: Record<string, any> = {};
  const moduleSymbols: string[] = [];

  traverse(ast, {
    VariableDeclaration(path) {
      path.node.declarations.forEach((decl) => {
        if (t.isIdentifier(decl.id)) {
          const varName = decl.id.name;
          if (varName === 'name' && t.isStringLiteral(decl.init)) {
            name = decl.init.value;
          }
          if (varName === 'styleClass' && t.isTemplateLiteral(decl.init)) {
            styleClass = decl.init.quasis[0].value.raw;
          }
          if (varName !== 'name' && varName !== 'styleClass') {
            moduleSymbols.push(varName);
          }
        }
      });
    },
    FunctionDeclaration(path) {
      if (t.isIdentifier(path.node.id)) {
        moduleSymbols.push(path.node.id.name);
      }
    },
    ReturnStatement(path) {
      if (t.isObjectExpression(path.node.argument)) {
        path.node.argument.properties.forEach((prop) => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            const key = prop.key.name;
            if (key === 'template' && t.isTemplateLiteral(prop.value)) {
              template = prop.value.quasis[0].value.raw;
            } else if (key !== 'name' && key !== 'styleClass') {
              if (t.isObjectExpression(prop.value)) {
                options[key] = extractObjectExpression(prop.value);
              } else if (t.isArrayExpression(prop.value)) {
                options[key] = extractArrayExpression(prop.value);
              } else if (t.isFunctionExpression(prop.value) || t.isArrowFunctionExpression(prop.value)) {
                options[key] = true;
              } else {
                options[key] = extractValue(prop.value);
              }
            }
          }
        });
      }
    },
  });

  return {
    name,
    template,
    styleClass,
    options,
    moduleSymbols,
  };
}

function extractObjectExpression(node: t.ObjectExpression): Record<string, any> {
  const result: Record<string, any> = {};
  node.properties.forEach((prop) => {
    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      result[prop.key.name] = extractValue(prop.value);
    }
  });
  return result;
}

function extractArrayExpression(node: t.ArrayExpression): any[] {
  return node.elements.map((el) => {
    if (el === null) return null;
    return extractValue(el);
  });
}

function extractValue(node: any): any {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node)) return null;
  if (t.isIdentifier(node)) return node.name;
  if (t.isObjectExpression(node)) return extractObjectExpression(node);
  if (t.isArrayExpression(node)) return extractArrayExpression(node);
  if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) return true;
  if (t.isTemplateLiteral(node)) {
    return node.quasis[0].value.raw;
  }
  if (t.isCallExpression(node)) {
    const callee = node.callee;
    if (t.isIdentifier(callee)) {
      return `${callee.name}(...)`;
    }
    if (t.isMemberExpression(callee) && t.isIdentifier(callee.object) && t.isIdentifier(callee.property)) {
      return `${callee.object.name}.${callee.property.name}(...)`;
    }
  }
  return 'unknown';
}
