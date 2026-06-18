import { ChangeRecord, Position } from '../types';

export function transformThisInfo(content: string, filename: string): { output: string; changes: ChangeRecord[] } {
  const changes: ChangeRecord[] = [];
  let output = content;

  // Simple string replacement for this.info → _this.info
  const thisInfoRegex = /this\.info/g;
  let match;
  while ((match = thisInfoRegex.exec(content)) !== null) {
    changes.push({
      type: 'replace',
      position: { file: filename, line: 0, column: match.index },
      description: 'this.info → _this.info',
    });
  }
  output = output.replace(thisInfoRegex, '_this.info');

  // Simple string replacement for ...mapState('admin/user', ['info']) → _this.info
  const mapStateRegex = /\.\.\.mapState\('admin\/user',\s*\['info'\]\)/g;
  while ((match = mapStateRegex.exec(content)) !== null) {
    changes.push({
      type: 'replace',
      position: { file: filename, line: 0, column: match.index },
      description: "mapState('admin/user', ['info']) → _this.info",
    });
  }
  output = output.replace(mapStateRegex, '_this.info');

  return { output, changes };
}

export function reverseTransformThisInfo(content: string, filename: string): { output: string; changes: ChangeRecord[] } {
  const changes: ChangeRecord[] = [];
  let output = content;

  // Simple string replacement for _this.info → this.info
  const thisInfoRegex = /_this\.info/g;
  let match;
  while ((match = thisInfoRegex.exec(content)) !== null) {
    changes.push({
      type: 'replace',
      position: { file: filename, line: 0, column: match.index },
      description: '_this.info → this.info',
    });
  }
  output = output.replace(thisInfoRegex, 'this.info');

  return { output, changes };
}
