import { ChangeRecord, Position } from '../types';

export function vueStyleToStyleClass(style: string, filename: string): { styleClass: string; changes: ChangeRecord[] } {
  const changes: ChangeRecord[] = [];
  const trimmedStyle = style.trim();

  if (trimmedStyle) {
    changes.push({
      type: 'replace',
      position: { file: filename, line: 0, column: 0 },
      description: '<style> → styleClass',
    });
  }

  const escapedStyle = trimmedStyle.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return {
    styleClass: escapedStyle,
    changes,
  };
}

export function styleClassToVueStyle(styleClass: string, filename: string): { style: string; changes: ChangeRecord[] } {
  const changes: ChangeRecord[] = [];
  const unescapedStyle = styleClass.replace(/\\`/g, '`').replace(/\\\$/g, '$');

  if (unescapedStyle) {
    changes.push({
      type: 'replace',
      position: { file: filename, line: 0, column: 0 },
      description: 'styleClass → <style>',
    });
  }

  return {
    style: unescapedStyle,
    changes,
  };
}
