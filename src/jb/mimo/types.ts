export interface Position {
  file: string;
  line: number;
  column: number;
}

export interface ChangeRecord {
  type: 'replace' | 'delete' | 'insert';
  position: Position;
  description: string;
}

export interface SourceSymbols {
  optionsKeys: string[];
  moduleSymbols: string[];
  templateDeps: string[];
}

export interface TargetSymbols {
  optionsKeys: string[];
  moduleSymbols: string[];
  templateDeps: string[];
}

export interface UnmigratedItem {
  type: 'option' | 'moduleSymbol' | 'templateDep';
  name: string;
}

export interface CheckResult {
  success: boolean;
  warnings: string[];
  unmigratedItems: UnmigratedItem[];
}

export interface ImportInfo {
  source: string;
  specifiers: string[];
  isReplaceable: boolean;
  replaceableWith?: string;
}

export interface VueComponent {
  name: string;
  template: string;
  script: string;
  style: string;
  options: Record<string, any>;
  moduleSymbols: string[];
  imports: ImportInfo[];
}

export interface JsComponent {
  name: string;
  template: string;
  styleClass: string;
  options: Record<string, any>;
  moduleSymbols: string[];
}

export interface ConversionResult {
  output: string;
  changes: ChangeRecord[];
  checkResult: CheckResult;
}

export type Direction = 'vue-to-js' | 'js-to-vue';

export interface ConvertOptions {
  direction: Direction;
  input: string;
  output?: string;
  interactive?: boolean;
}
