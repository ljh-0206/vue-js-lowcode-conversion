import { ChangeRecord, Position } from '../types';

const DEFAULT_OPTIONS_ORDER = [
  'inject',
  'directives',
  'filters',
  'model',
  'mixins',
  'provide',
  'emits',
];

const VUE_OPTIONS_KEYS = [
  'name',
  'template',
  'props',
  'data',
  'created',
  'watch',
  'computed',
  'mounted',
  'methods',
  'beforeDestroy',
  'inject',
  'directives',
  'filters',
  'model',
  'mixins',
  'provide',
  'emits',
];

export function extractVueOptions(options: Record<string, any>): {
  orderOptions: Record<string, any>;
  otherOptions: Record<string, any>;
} {
  const orderOptions: Record<string, any> = {};
  const otherOptions: Record<string, any> = {};

  Object.keys(options).forEach((key) => {
    if (DEFAULT_OPTIONS_ORDER.includes(key)) {
      orderOptions[key] = options[key];
    } else if (VUE_OPTIONS_KEYS.includes(key)) {
      otherOptions[key] = options[key];
    } else {
      otherOptions[key] = options[key];
    }
  });

  return { orderOptions, otherOptions };
}

export function filterConvertableOptions(options: Record<string, any>): Record<string, any> {
  const filtered: Record<string, any> = {};
  const skipKeys = ['components', 'name', 'template'];

  Object.keys(options).forEach((key) => {
    if (!skipKeys.includes(key)) {
      filtered[key] = options[key];
    }
  });

  return filtered;
}

export function mergeProps(
  defaultProps: Record<string, any>,
  sourceProps: Record<string, any>
): Record<string, any> {
  const merged = { ...defaultProps };

  Object.keys(sourceProps).forEach((key) => {
    if (key === 'index') {
      merged[key] = sourceProps[key];
    } else {
      merged[key] = sourceProps[key];
    }
  });

  return merged;
}

export function reorderOptions(options: Record<string, any>): string[] {
  const ordered: string[] = [];
  const remaining: string[] = [];

  DEFAULT_OPTIONS_ORDER.forEach((key) => {
    if (key in options) {
      ordered.push(key);
    }
  });

  Object.keys(options).forEach((key) => {
    if (!DEFAULT_OPTIONS_ORDER.includes(key) && key !== 'components') {
      remaining.push(key);
    }
  });

  return [...ordered, ...remaining];
}
