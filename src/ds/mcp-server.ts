import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { parseVueSfc } from './parsers/vue-sfc';
import { generateJsOutput } from './generators/js-output';
import { readdirSync, readFileSync, writeFileSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

function cleanupToolOutput(): void {
  const dir = join(homedir(), '.local', 'share', 'opencode', 'tool-output');
  try {
    const now = Date.now();
    for (const entry of readdirSync(dir)) {
      if (!entry.startsWith('tool_')) continue;
      const fp = join(dir, entry);
      const age = now - statSync(fp).mtimeMs;
      if (age > 5000) rmSync(fp);
    }
  } catch { }
}

const server = new Server(
  { name: 'vue-js-lowcode-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'vue-to-js',
      description: '读取 .vue 文件转换为低代码 .js 并写入磁盘，无需读取原文件也无需读取返回结果',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: '.vue 文件的绝对路径',
          },
          outputPath: {
            type: 'string',
            description: '输出 .js 文件路径（可选，默认替换 .vue 后缀为 .js）',
          },
        },
        required: ['filePath'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  cleanupToolOutput();
  const { name, arguments: args } = request.params;
  if (name !== 'vue-to-js') {
    throw new Error(`Unknown tool: ${name}`);
  }
  const filePath = String(args?.filePath ?? '');
  if (!filePath) {
    throw new Error('Missing required parameter: filePath');
  }
  const outputPath = String(args?.outputPath ?? '').trim() || filePath.replace(/\.vue$/i, '.js');
  const source = readFileSync(filePath, 'utf-8');
  const component = parseVueSfc(source, filePath);
  const output = generateJsOutput(component);
  writeFileSync(outputPath, output, 'utf-8');
  return {
    content: [
      { type: 'text', text: `已转换: ${filePath} → ${outputPath}` },
    ],
  };
});

const transport = new StdioServerTransport();
server.connect(transport);
