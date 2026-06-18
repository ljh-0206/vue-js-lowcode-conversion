import * as compiler from '@vue/compiler-sfc';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { VueComponent, ImportInfo } from '../types';

export function parseVueSfc(content: string, filename: string): VueComponent {
  const { descriptor, errors } = compiler.parse(content);

  if (errors.length > 0) {
    throw new Error(`SFC parse errors: ${errors.join(', ')}`);
  }

  const template = descriptor.template?.content || '';
  const script = descriptor.script?.content || '';
  const style = descriptor.styles[0]?.content || '';

  const scriptAst = parser.parse(script, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let componentName = '';
  const options: Record<string, any> = {};
  const moduleSymbols: string[] = [];
  const imports: ImportInfo[] = [];

  traverse(scriptAst, {
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      if (t.isObjectExpression(declaration)) {
        declaration.properties.forEach((prop) => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            const key = prop.key.name;
            if (key === 'name' && t.isStringLiteral(prop.value)) {
              componentName = prop.value.value;
            }
            if (key === 'methods' || key === 'computed' || key === 'watch') {
              // 对于 methods/computed/watch，提取原始源码文本
              options[key] = extractObjectMethodsRaw(prop.value as t.ObjectExpression, script);
            } else if (key === 'mounted' || key === 'beforeDestroy' || key === 'activated' || key === 'deactivated') {
              // 对于生命周期钩子，提取原始源码文本
              if (t.isObjectExpression(prop.value)) {
                options[key] = extractObjectMethodsRaw(prop.value, script);
              } else if (t.isFunctionExpression(prop.value) || t.isArrowFunctionExpression(prop.value)) {
                options[key] = {
                  __isMethod: true,
                  raw: script.substring(prop.value.start!, prop.value.end!)
                };
              }
            } else if (t.isObjectExpression(prop.value)) {
              options[key] = extractObjectExpression(prop.value);
            } else if (t.isArrayExpression(prop.value)) {
              options[key] = extractArrayExpression(prop.value);
            } else if (t.isFunctionExpression(prop.value) || t.isArrowFunctionExpression(prop.value)) {
              options[key] = extractFunctionBody(prop.value);
            } else {
              options[key] = extractValue(prop.value);
            }
          } else if (t.isObjectMethod(prop) && t.isIdentifier(prop.key)) {
            // 处理 ObjectMethod 类型（如 methods: { handlerImg() {} }）
            const key = prop.key.name;
            const lifecycleHooks = ['mounted', 'beforeDestroy', 'activated', 'deactivated'];
            
            if (lifecycleHooks.includes(key)) {
              // 对于生命周期钩子，提取函数体内的原始源码文本（不含函数签名）
              let bodyRaw = '';
              if (t.isBlockStatement(prop.body) && prop.body.body.length > 0) {
                const firstStmt = prop.body.body[0];
                const lastStmt = prop.body.body[prop.body.body.length - 1];
                bodyRaw = script.substring(firstStmt.start!, lastStmt.end!);
              }
              options[key] = {
                __isMethod: true,
                raw: bodyRaw
              };
            } else {
              // 对于普通方法，提取参数和函数体
              const params = prop.params.map(p => {
                if (t.isIdentifier(p)) return p.name;
                if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
                  const defaultVal = generateExpression(p.right);
                  return `${p.left.name} = ${defaultVal}`;
                }
                if (t.isRestElement(p) && t.isIdentifier(p.argument)) {
                  return `...${p.argument.name}`;
                }
                return '/* param */';
              }).join(', ');
              
              let body = '';
              if (t.isBlockStatement(prop.body)) {
                body = prop.body.body.map(stmt => generateStatement(stmt)).join('\n');
              }
              
              // 存储为 __isMethod 格式
              options[key] = {
                __isMethod: true,
                params,
                body
              };
            }
          }
        });
      }
    },
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

      imports.push({
        source,
        specifiers,
        isReplaceable: false,
      });
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
      if (path.scope.parent === null || path.parent.type === 'Program') {
        if (t.isIdentifier(path.node.id)) {
          moduleSymbols.push(path.node.id.name);
        }
      }
    },
    ClassDeclaration(path) {
      if (path.scope.parent === null || path.parent.type === 'Program') {
        if (t.isIdentifier(path.node.id)) {
          moduleSymbols.push(path.node.id.name);
        }
      }
    },
  });

  return {
    name: componentName,
    template,
    script,
    style,
    options,
    moduleSymbols,
    imports,
  };
}

function extractObjectExpression(node: t.ObjectExpression): Record<string, any> {
  const result: Record<string, any> = {};
  node.properties.forEach((prop) => {
    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      if (t.isFunctionExpression(prop.value) || t.isArrowFunctionExpression(prop.value)) {
        result[prop.key.name] = extractFunctionBody(prop.value);
      } else {
        result[prop.key.name] = extractValue(prop.value);
      }
    } else if (t.isObjectMethod(prop) && t.isIdentifier(prop.key)) {
      // 保留完整的方法信息（参数列表 + 函数体）
      const params = prop.params.map(p => {
        if (t.isIdentifier(p)) return p.name;
        if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
          const defaultVal = generateExpression(p.right);
          return `${p.left.name} = ${defaultVal}`;
        }
        if (t.isRestElement(p) && t.isIdentifier(p.argument)) {
          return `...${p.argument.name}`;
        }
        return '/* param */';
      }).join(', ');
      
      let body = '';
      if (t.isBlockStatement(prop.body)) {
        body = prop.body.body.map(stmt => generateStatement(stmt)).join('\n');
      }
      
      // 返回完整的方法签名
      result[prop.key.name] = {
        __isMethod: true,
        params,
        body
      };
    }
  });
  return result;
}

/**
 * 从 ObjectExpression 中提取方法的原始源码文本
 * 保留原始代码格式，避免 AST-to-string 转换的精度损失
 */
function extractObjectMethodsRaw(node: t.ObjectExpression, scriptSource: string): Record<string, any> {
  const result: Record<string, any> = {};
  node.properties.forEach((prop) => {
    if (t.isObjectMethod(prop) && t.isIdentifier(prop.key)) {
      // ObjectMethod: handlerImg(id) { return ... }
      const rawText = scriptSource.substring(prop.start!, prop.end!);
      result[prop.key.name] = {
        __isMethod: true,
        raw: rawText
      };
    } else if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      // ObjectProperty: handlerImg: function(id) { ... } 或 handlerImg: (id) => { ... }
      const rawText = scriptSource.substring(prop.start!, prop.end!);
      result[prop.key.name] = {
        __isMethod: true,
        raw: rawText
      };
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

function extractFunctionBody(node: t.FunctionExpression | t.ArrowFunctionExpression): string {
  if (t.isBlockStatement(node.body)) {
    return node.body.body.map(stmt => generateStatement(stmt)).join('\n');
  }
  return generateExpression(node.body);
}

function generateStatement(node: t.Statement): string {
  if (t.isReturnStatement(node)) {
    if (node.argument) {
      return `return ${generateExpression(node.argument)};`;
    }
    return 'return;';
  }
  if (t.isExpressionStatement(node)) {
    return generateExpression(node.expression) + ';';
  }
  if (t.isVariableDeclaration(node)) {
    return node.declarations.map(decl => {
      if (t.isIdentifier(decl.id)) {
        return `let ${decl.id.name} = ${decl.init ? generateExpression(decl.init) : 'undefined'};`;
      }
      return '';
    }).join('\n');
  }
  if (t.isIfStatement(node)) {
    const test = generateExpression(node.test);
    const consequent = generateStatement(node.consequent);
    const alternate = node.alternate ? generateStatement(node.alternate) : '';
    return `if (${test}) { ${consequent} }${alternate ? ` else { ${alternate} }` : ''}`;
  }
  if (t.isWhileStatement(node)) {
    const test = generateExpression(node.test);
    const body = generateStatement(node.body);
    return `while (${test}) { ${body} }`;
  }
  if (t.isForStatement(node)) {
    const init = node.init ? (t.isVariableDeclaration(node.init) ? generateStatement(node.init) : generateExpression(node.init)) : '';
    const test = node.test ? generateExpression(node.test) : '';
    const update = node.update ? generateExpression(node.update) : '';
    const body = generateStatement(node.body);
    return `for (${init}; ${test}; ${update}) { ${body} }`;
  }
  if (t.isBlockStatement(node)) {
    return node.body.map(stmt => generateStatement(stmt)).join('\n');
  }
  if (t.isTryStatement(node)) {
    const block = node.block.body.map(stmt => generateStatement(stmt)).join('\n');
    let handler = '';
    if (node.handler && node.handler.body) {
      const handlerBody = node.handler.body.body.map(stmt => generateStatement(stmt)).join('\n');
      handler = ` catch ${node.handler.param ? `(${(node.handler.param as t.Identifier).name})` : ''} { ${handlerBody} }`;
    }
    let finalizer = '';
    if (node.finalizer) {
      finalizer = ` finally { ${node.finalizer.body.map(stmt => generateStatement(stmt)).join('\n')} }`;
    }
    return `try { ${block} }${handler}${finalizer}`;
  }
  return '/* unknown statement */';
}

function generateExpression(node: t.Expression | t.SpreadElement | t.JSXElement | t.JSXFragment | t.TSType | t.TSInstantiationExpression | t.TSAsExpression | t.TSSatisfiesExpression): string {
  if (t.isStringLiteral(node)) return `'${node.value}'`;
  if (t.isNumericLiteral(node)) return String(node.value);
  if (t.isBooleanLiteral(node)) return String(node.value);
  if (t.isNullLiteral(node)) return 'null';
  if (t.isThisExpression(node)) return 'this';
  if (t.isIdentifier(node)) return node.name;
  if (t.isRegExpLiteral(node)) return `/${node.pattern}/${node.flags}`;
  if (t.isAwaitExpression(node)) {
    const argument = generateExpression(node.argument as t.Expression);
    return `await ${argument}`;
  }
  if (t.isNewExpression(node)) {
    const callee = generateExpression(node.callee as t.Expression);
    const args = node.arguments.map(arg => generateExpression(arg as t.Expression)).join(', ');
    return `new ${callee}(${args})`;
  }
  if (t.isMemberExpression(node)) {
    const object = generateExpression(node.object as t.Expression);
    if (node.computed) {
      const property = generateExpression(node.property as t.Expression);
      return `${object}[${property}]`;
    } else {
      const property = (node.property as any).name || 'unknown';
      return `${object}.${property}`;
    }
  }
  if (t.isCallExpression(node)) {
    const callee = generateExpression(node.callee as t.Expression);
    const args = node.arguments.map(arg => generateExpression(arg as t.Expression)).join(', ');
    return `${callee}(${args})`;
  }
  if (t.isArrowFunctionExpression(node)) {
    const params = node.params.map((p, index) => {
      if (t.isIdentifier(p)) return p.name;
      if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
        const defaultVal = generateExpression(p.right);
        return `${p.left.name} = ${defaultVal}`;
      }
      if (t.isRestElement(p) && t.isIdentifier(p.argument)) {
        return `...${p.argument.name}`;
      }
      return `param${index}`;
    }).join(', ');
    if (t.isBlockStatement(node.body)) {
      const body = node.body.body.map(stmt => generateStatement(stmt)).join('\n');
      return `(${params}) => { ${body} }`;
    }
    return `(${params}) => ${generateExpression(node.body)}`;
  }
  if (t.isFunctionExpression(node)) {
    const params = node.params.map((p, index) => {
      if (t.isIdentifier(p)) return p.name;
      if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
        const defaultVal = generateExpression(p.right);
        return `${p.left.name} = ${defaultVal}`;
      }
      if (t.isRestElement(p) && t.isIdentifier(p.argument)) {
        return `...${p.argument.name}`;
      }
      return `param${index}`;
    }).join(', ');
    if (t.isBlockStatement(node.body)) {
      const body = node.body.body.map(stmt => generateStatement(stmt)).join('\n');
      return `function(${params}) { ${body} }`;
    }
    return `function(${params}) { return ${generateExpression(node.body)}; }`;
  }
  if (t.isConditionalExpression(node)) {
    const test = generateExpression(node.test);
    const consequent = generateExpression(node.consequent);
    const alternate = generateExpression(node.alternate);
    return `${test} ? ${consequent} : ${alternate}`;
  }
  if (t.isLogicalExpression(node)) {
    const left = generateExpression(node.left as t.Expression);
    const right = generateExpression(node.right as t.Expression);
    return `${left} ${node.operator} ${right}`;
  }
  if (t.isBinaryExpression(node)) {
    const left = generateExpression(node.left as t.Expression);
    const right = generateExpression(node.right as t.Expression);
    return `${left} ${node.operator} ${right}`;
  }
  if (t.isUnaryExpression(node)) {
    const argument = generateExpression(node.argument as t.Expression);
    return `${node.operator}${argument}`;
  }
  if (t.isAssignmentExpression(node)) {
    const left = generateExpression(node.left as any);
    const right = generateExpression(node.right as t.Expression);
    return `${left} ${node.operator} ${right}`;
  }
  if (t.isObjectExpression(node)) {
    const props = node.properties.map(prop => {
      if (t.isObjectProperty(prop)) {
        let key = '';
        if (t.isIdentifier(prop.key)) {
          key = prop.key.name;
        } else if (t.isStringLiteral(prop.key)) {
          key = `'${prop.key.value}'`;
        } else if (t.isNumericLiteral(prop.key)) {
          key = String(prop.key.value);
        }
        return `${key}: ${generateExpression(prop.value as t.Expression)}`;
      }
      if (t.isObjectMethod(prop) && t.isIdentifier(prop.key)) {
        const params = prop.params.map((p, index) => {
          if (t.isIdentifier(p)) return p.name;
          if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
            const defaultVal = generateExpression(p.right);
            return `${p.left.name} = ${defaultVal}`;
          }
          if (t.isRestElement(p) && t.isIdentifier(p.argument)) {
            return `...${p.argument.name}`;
          }
          return `param${index}`;
        }).join(', ');
        if (t.isBlockStatement(prop.body)) {
          const body = prop.body.body.map(stmt => generateStatement(stmt)).join('\n');
          return `${prop.key.name}(${params}) { ${body} }`;
        }
        return `${prop.key.name}(${params}) { return ${generateExpression(prop.body)}; }`;
      }
      return '';
    }).join(', ');
    return `{ ${props} }`;
  }
  if (t.isArrayExpression(node)) {
    const elements = node.elements.map(el => el ? generateExpression(el as t.Expression) : 'null').join(', ');
    return `[${elements}]`;
  }
  if (t.isTemplateLiteral(node)) {
    return '`' + node.quasis.map((q, i) => q.value.raw + (node.expressions[i] ? '${' + generateExpression(node.expressions[i] as t.Expression) + '}' : '')).join('') + '`';
  }
  return '/* unknown expression */';
}
