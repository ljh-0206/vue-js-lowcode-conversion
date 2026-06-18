import { VueComponent, ChangeRecord } from '../types';
import { vueStyleToStyleClass } from '../transformers/style-class';
import { extractVueOptions, filterConvertableOptions, mergeProps, reorderOptions } from '../transformers/options';

const DEFAULT_PROPS: Record<string, any> = {
  index: { type: 'Number', default: 'null' },
  value: { type: ['Object', 'Array', 'String', 'Number', 'Boolean'] },
  configdata: { type: 'Object', default: '() => ({})' },
  propstocomponent: { type: 'Object', default: '() => ({})' },
  fathername: { type: 'String' },
};

export function generateJsOutput(component: VueComponent, filename: string): { output: string; changes: ChangeRecord[] } {
  const changes: ChangeRecord[] = [];
  const { name, template, style, options, moduleSymbols } = component;

  const { styleClass } = vueStyleToStyleClass(style, filename);
  const { orderOptions, otherOptions } = extractVueOptions(options);
  const convertableOptions = filterConvertableOptions({ ...orderOptions, ...otherOptions });

  const props = convertableOptions.props ? mergeProps(DEFAULT_PROPS, convertableOptions.props) : DEFAULT_PROPS;
  const reorderedOptions = reorderOptions(convertableOptions);

  let output = '';

  if (moduleSymbols.length > 0) {
    output += moduleSymbols.map((sym) => `let ${sym} = undefined;`).join('\n') + '\n\n';
  }

  output += `let name = '${name}';\n`;
  output += `let styleClass = \`${styleClass}\`;\n\n`;

  output += 'return {\n';
  output += `    template: \`${template}\`,\n`;
  output += '    name: name,\n';

  reorderedOptions.forEach((key) => {
    if (key === 'props') {
      output += '    props: {\n';
      Object.keys(props).forEach((propKey) => {
        const prop = props[propKey];
        if (prop.type && Array.isArray(prop.type)) {
          output += `      ${propKey}: { type: [${prop.type.join(', ')}]`;
        } else if (prop.type) {
          output += `      ${propKey}: { type: ${prop.type}`;
        } else {
          output += `      ${propKey}: {`;
        }
        if (prop.default) {
          output += `, default: ${prop.default}`;
        }
        output += ' },\n';
      });
      output += '    },\n';
    } else if (key === 'data') {
      output += '    data() {\n';
      output += '      return {};\n';
      output += '    },\n';
    } else if (key === 'created') {
      output += '    created() {\n';
      output += '      this.commonsJs.loadCssCode(styleClass, name + this._uid);\n';
      output += '    },\n';
    } else if (key === 'beforeDestroy') {
      output += '    beforeDestroy() {\n';
      output += '      this.commonsJs.removeCssCode(name + this._uid);\n';
      output += '    },\n';
    } else if (key === 'mounted') {
      const mountedVal = convertableOptions[key];
      if (typeof mountedVal === 'object' && mountedVal.__isMethod && mountedVal.raw !== undefined) {
        // mounted 生命周期钩子，保留原始代码并追加 commonsJs 调用
        output += '    mounted() {\n';
        output += '      this.commonsJs.loadCssCode(styleClass, name + this._uid);\n';
        output += '      this.$nextTick(() => {\n';
        if (mountedVal.raw) {
          output += `        ${mountedVal.raw}\n`;
        }
        output += '      });\n';
        output += '    },\n';
      } else {
        output += `    ${key}: ${JSON.stringify(convertableOptions[key])},\n`;
      }
    } else if (typeof convertableOptions[key] === 'function') {
      // 函数类型选项（如 data, created, mounted 等）
      const fnStr = convertableOptions[key].toString();
      output += `    ${key}: ${fnStr},\n`;
    } else if (typeof convertableOptions[key] === 'object') {
      // 对象类型选项（如 computed, watch, methods）
      // 需要将字符串值转换为函数格式
      output += `    ${key}: {\n`;
      Object.keys(convertableOptions[key]).forEach((methodKey) => {
        const methodValue = convertableOptions[key][methodKey];
        
        // 检查是否是新的方法格式
        if (methodValue && typeof methodValue === 'object' && methodValue.__isMethod) {
          if (methodValue.raw) {
            // 原始源码格式：保留原始代码
            output += `        ${methodValue.raw},\n`;
          } else {
            // params/body 格式
            const { params, body } = methodValue;
            if (body) {
              // 检查是否包含 await 关键字，如果是则添加 async 修饰符
              const isAsync = body.includes('await');
              const asyncPrefix = isAsync ? 'async ' : '';
              output += `        ${asyncPrefix}${methodKey}(${params}) {\n`;
              // 添加函数体（需要适当缩进）
              const bodyLines = body.split('\n');
              bodyLines.forEach((line: string) => {
                output += `            ${line}\n`;
              });
              output += '        },\n';
            } else {
              // 空函数体
              output += `        ${methodKey}(${params}) {},\n`;
            }
          }
        } else if (typeof methodValue === 'string') {
          // 旧的字符串格式（向后兼容）
          // 检查是否包含参数（如 "handlerImg(id)"）
          const match = methodValue.match(/^(\w+)\(([^)]*)\)\s*\{([\s\S]*)\}$/);
          if (match) {
            // 已经是函数格式，直接输出
            output += `        ${methodKey}(${match[2]}) {${match[3]}},\n`;
          } else {
            // 纯表达式，包装成函数
            output += `        ${methodKey}() { ${methodValue} },\n`;
          }
        } else if (typeof methodValue === 'function') {
          // 如果是函数，直接输出
          output += `        ${methodKey}: ${methodValue.toString()},\n`;
        } else {
          // 其他类型，直接输出
          output += `        ${methodKey}: ${JSON.stringify(methodValue)},\n`;
        }
      });
      output += '    },\n';
    }
  });

  if (!('created' in convertableOptions)) {
    output += '    created() {\n';
    output += '      this.commonsJs.loadCssCode(styleClass, name + this._uid);\n';
    output += '    },\n';
  }

  if (!('beforeDestroy' in convertableOptions)) {
    output += '    beforeDestroy() {\n';
    output += '      this.commonsJs.removeCssCode(name + this._uid);\n';
    output += '    },\n';
  }

  output += '};\n';

  return { output, changes };
}
