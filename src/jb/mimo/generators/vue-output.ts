import { JsComponent, ChangeRecord } from '../types';
import { styleClassToVueStyle } from '../transformers/style-class';

export function generateVueOutput(component: JsComponent, filename: string): { output: string; changes: ChangeRecord[] } {
  const changes: ChangeRecord[] = [];
  const { name, template, styleClass, options, moduleSymbols } = component;

  const { style } = styleClassToVueStyle(styleClass, filename);

  let scriptContent = '';

  if (moduleSymbols.length > 0) {
    scriptContent += moduleSymbols.map((sym) => `const ${sym} = undefined;`).join('\n') + '\n\n';
  }

  scriptContent += 'export default {\n';
  scriptContent += `  name: '${name}',\n`;

  Object.keys(options).forEach((key) => {
    if (key === 'props') {
      scriptContent += '  props: {\n';
      Object.keys(options.props).forEach((propKey) => {
        const prop = options.props[propKey];
        if (prop.type && Array.isArray(prop.type)) {
          scriptContent += `    ${propKey}: { type: [${prop.type.join(', ')}]`;
        } else if (prop.type) {
          scriptContent += `    ${propKey}: { type: ${prop.type}`;
        } else {
          scriptContent += `    ${propKey}: {`;
        }
        if (prop.default) {
          scriptContent += `, default: ${prop.default}`;
        }
        scriptContent += ' },\n';
      });
      scriptContent += '  },\n';
    } else if (key === 'data') {
      scriptContent += '  data() {\n';
      scriptContent += '    return {};\n';
      scriptContent += '  },\n';
    } else if (key === 'created' || key === 'beforeDestroy') {
      scriptContent += `  ${key}() {\n`;
      scriptContent += `    // TODO: 迁移原始逻辑\n`;
      scriptContent += '  },\n';
    } else if (typeof options[key] === 'function') {
      scriptContent += `  ${key}() {\n`;
      scriptContent += `    // TODO: 迁移原始逻辑\n`;
      scriptContent += '  },\n';
    } else if (typeof options[key] === 'object') {
      scriptContent += `  ${key}: ${JSON.stringify(options[key], null, 4).replace(/\n/g, '\n  ')},\n`;
    }
  });

  scriptContent += '};\n';

  let output = '';
  output += `<template>\n${template}\n</template>\n\n`;
  output += `<script>\n${scriptContent}</script>\n\n`;
  output += `<style scoped>\n${style}\n</style>\n`;

  return { output, changes };
}
