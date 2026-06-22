import * as parser from '@babel/parser';
import * as t from '@babel/types';
import { ParsedComponent } from '../types';

const SKELETON_PROPS_ORDER = ['index', 'value', 'configdata', 'propstocomponent', 'fathername'];
const SKELETON_PROPS_KEYS = new Set(SKELETON_PROPS_ORDER);

const EXTRA_OPTIONS_BEFORE_PROPS = [
  'inject', 'directives', 'filters', 'model', 'mixins', 'provide', 'emits',
];

export function generateJsOutput(component: ParsedComponent): string {
  const { name, template, style, options, moduleSymbols, moduleDeclarations } = component;

  const transformedTemplate = transformThisRefs(template);
  const transformedOptions: Record<string, string> = {};
  for (const [key, value] of Object.entries(options)) {
    transformedOptions[key] = transformThisRefs(value);
  }
  const transformedDeclarations = moduleDeclarations.map(d => ({
    ...d,
    raw: transformThisRefs(d.raw),
  }));

  const result: string[] = [];

  const declMap = new Map<string, string>();
  for (const d of transformedDeclarations) {
    declMap.set(d.name, d.raw);
  }
  for (const sym of moduleSymbols) {
    if (declMap.has(sym)) {
      const raw = declMap.get(sym)!;
      if (raw.startsWith('function ') || raw.startsWith('class ')) {
        result.push(raw);
      } else if (raw.startsWith('const ') || raw.startsWith('let ') || raw.startsWith('var ')) {
        result.push('let ' + raw.substring(raw.indexOf(' ') + 1));
      } else {
        result.push(`let ${raw};`);
      }
    } else {
      result.push(`let ${sym} = undefined;`);
    }
  }
  if (moduleSymbols.length > 0) result.push('');

  result.push(`let name = '${name}';`);
  result.push(`let styleClass = \`${escapeTemplateLiteral(style)}\`;`);
  result.push('');
  result.push('return {');
  result.push(`  template: \`${escapeTemplateLiteral(transformedTemplate)}\`,`);
  result.push('  name: name,');

  for (const key of EXTRA_OPTIONS_BEFORE_PROPS) {
    if (key in transformedOptions) {
      result.push(ensureTrailingComma(formatRawOption(transformedOptions[key], 2)));
    }
  }

  result.push(generateMergedProps(transformedOptions['props']));

  if ('data' in transformedOptions) {
    result.push(ensureTrailingComma(formatRawOption(transformedOptions['data'], 2)));
  } else {
    result.push('  data() {');
    result.push('    return {};');
    result.push('  },');
  }

  result.push(generateAugmentedHook('created', transformedOptions['created'],
    'this.commonsJs.loadCssCode(styleClass, name + this._uid)'));

  if ('watch' in transformedOptions) {
    result.push(ensureTrailingComma(formatRawOption(transformedOptions['watch'], 2)));
  } else {
    result.push('  watch: {},');
  }

  if ('computed' in transformedOptions) {
    const noComments = transformedOptions['computed'].replace(/\/\/.*/g, '').trim();
    if (/^\s*computed\s*:\s*\{\s*\}\s*$/.test(noComments)) {
      result.push('  computed: {},');
    } else {
      result.push(ensureTrailingComma(formatRawOption(transformedOptions['computed'], 2)));
    }
  } else {
    result.push('  computed: {},');
  }

  if ('mounted' in transformedOptions) {
    result.push(ensureTrailingComma(formatRawOption(transformedOptions['mounted'], 2)));
  } else {
    result.push('  mounted() {},');
  }

  if ('methods' in transformedOptions) {
    result.push(ensureTrailingComma(formatRawOption(transformedOptions['methods'], 2)));
  } else {
    result.push('  methods: {},');
  }

  result.push(generateAugmentedHook('beforeDestroy', transformedOptions['beforeDestroy'],
    'this.commonsJs.removeCssCode(name + this._uid)'));

  result.push('};');
  result.push('');

  return result.join('\n');
}

function escapeTemplateLiteral(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

function transformThisRefs(code: string): string {
  let result = code;
  // ...mapState('admin/user', ['info']) → // _this.info
  result = result.replace(
    /\.\.\.mapState\s*\(\s*['"]admin\/user['"]\s*,\s*\[\s*['"]info['"]\s*\]\s*\)\s*,?(\s*)/g,
    '// _this.info$1'
  );
  // this.info → _this.info
  result = result.replace(/\bthis\.info\b/g, '_this.info');
  return result;
}

function formatRawOption(raw: string, baseIndent: number): string {
  const lines = raw.split('\n');

  const firstLine = lines.find((l) => l.trim() !== '');
  const firstIndent = firstLine ? (firstLine.match(/^ */)?.[0].length || 0) : 0;

  const formatted = lines.map((line) => {
    if (line.trim() === '') return '';
    const curIndent = line.match(/^ */)?.[0].length || 0;
    const relIndent = curIndent >= firstIndent ? curIndent - firstIndent : 0;
    return ' '.repeat(baseIndent + relIndent) + line.trimStart();
  });
  return formatted.join('\n');
}

function ensureTrailingComma(text: string): string {
  const lines = text.split('\n');
  let lastNonEmptyIdx = lines.length - 1;
  while (lastNonEmptyIdx >= 0 && lines[lastNonEmptyIdx].trim() === '') {
    lastNonEmptyIdx--;
  }
  if (lastNonEmptyIdx < 0) return text;

  const trimmed = lines[lastNonEmptyIdx].trimEnd();
  if (!trimmed.endsWith(',') && !trimmed.endsWith('{') && !trimmed.endsWith('(')) {
    lines[lastNonEmptyIdx] = trimmed + ',';
  }
  return lines.join('\n');
}

function generateMergedProps(sourceRaw: string | undefined): string {
  const propsLines: string[] = [];
  const usedKeys = new Set<string>();

  for (const key of SKELETON_PROPS_ORDER) {
    propsLines.push(`    ${key}: { type: ${getDefaultPropType(key)}${getDefaultPropDefault(key)} }`);
    usedKeys.add(key);
  }

  if (sourceRaw) {
    const colonIdx = sourceRaw.indexOf(':');
    if (colonIdx !== -1) {
      const objStr = sourceRaw.substring(colonIdx + 1).trim();
      try {
        const prefix = 'var _x = ';
        const fullInput = prefix + objStr;
        const ast = parser.parse(fullInput, { sourceType: 'module' });
        const vdecl = ast.program.body[0] as t.VariableDeclaration;
        const declarator = vdecl.declarations[0];
        if (declarator && t.isObjectExpression(declarator.init)) {
          for (const prop of declarator.init.properties) {
            if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
              const key = prop.key.name;
              const adjustedStart = prop.start! - prefix.length;
              const adjustedEnd = prop.end! - prefix.length;
              const propRaw = objStr.substring(adjustedStart, adjustedEnd).trimEnd();
                const clean = propRaw.endsWith(',') ? propRaw.slice(0, -1).trimEnd() : propRaw;
              if (usedKeys.has(key)) {
                const idx = SKELETON_PROPS_ORDER.indexOf(key);
                if (idx !== -1) {
                  propsLines[idx] = `    ${clean}`;
                }
              } else {
                propsLines.push(`    ${clean}`);
                usedKeys.add(key);
              }
            }
          }
        }
      } catch {
        // If parsing fails, append raw source props
      }
    }
  }

  const inner = propsLines.map((l, i) => l + (i < propsLines.length - 1 ? ',' : '')).join('\n');
  return `  props: {\n${inner}\n  },`;
}

function getDefaultPropType(key: string): string {
  const types: Record<string, string> = {
    index: 'Number',
    value: '[Object, Array, String, Number, Boolean]',
    configdata: 'Object',
    propstocomponent: 'Object',
    fathername: 'String',
  };
  return types[key] || 'String';
}

function getDefaultPropDefault(key: string): string {
  const defaults: Record<string, string> = {
    index: ', default: null',
    configdata: ', default: () => ({})',
    propstocomponent: ', default: () => ({})',
  };
  return defaults[key] || '';
}

function generateAugmentedHook(key: string, sourceRaw: string | undefined, commonsJsCall: string): string {
  const lines: string[] = [];

  if (sourceRaw) {
    const braceIdx = sourceRaw.indexOf('{');
    const decl = braceIdx !== -1 ? sourceRaw.substring(0, braceIdx).trim() : `${key}()`;
    lines.push(`  ${decl} {`);
  } else {
    lines.push(`  ${key}() {`);
  }

  lines.push(`    ${commonsJsCall};`);

  if (sourceRaw) {
    const body = extractHookBody(sourceRaw);
    if (body) {
      const bodyLines = body.split('\n');
      const baseBodyIndent = calcBodyBaseIndent(bodyLines);
      for (const bl of bodyLines) {
        if (bl.trim()) {
          const curIndent = bl.match(/^ */)?.[0].length || 0;
          const relIndent = curIndent >= baseBodyIndent ? curIndent - baseBodyIndent : 0;
          lines.push(`    ${' '.repeat(relIndent)}${bl.trimStart()}`);
        } else {
          lines.push('');
        }
      }
    }
  }

  lines.push('  },');
  return lines.join('\n');
}

function extractHookBody(raw: string): string {
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return '';
  const body = raw.substring(firstBrace + 1, lastBrace);
  return body.replace(/^\n+/, '').replace(/\n+$/, '');
}

function calcBodyBaseIndent(lines: string[]): number {
  for (const line of lines) {
    if (line.trim()) {
      return line.match(/^ */)?.[0].length || 0;
    }
  }
  return 0;
}
