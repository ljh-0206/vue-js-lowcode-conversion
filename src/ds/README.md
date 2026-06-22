# vue-to-js 低代码转换工具

将 `.vue` 单文件组件转换为低代码 `.js` 格式。

## 使用方法

```bash
# 编译
npm run compile

# 转换
node out/ds/convert.js vue-to-js 输入文件.vue
```

输出文件自动生成在同目录，文件名相同、扩展名为 `.js`。

## 转换规则

| 输入 | 输出 |
|------|------|
| `<template>` | `template: \`...\`` |
| `<style>` | `let styleClass = \`...\`` |
| `name: 'xxx'` | `let name = 'xxx'` |
| `export default { ... }` 各选项 | `return { ... }` 对应字段 |
| `import ...` | 删除 |
| `components` | 删除 |
| 模块级 `const`/`let`/`function`/`class` | `const` 转 `let`，保留实际值 |
| `created` / `beforeDestroy` | 注入 `commonsJs.loadCssCode` / `removeCssCode` |
| `props` | 合并骨架默认 props + 源文件 props |
| `this.info` | 转 `_this.info` |
| `...mapState('admin/user', ['info'])` | 转 `// _this.info`（而非删除） |

### 输出顺序

```
let name = '...'
let styleClass = `...`
return {
  template: `...`,
  name: name,
  inject?, directives?, filters?, model?, mixins?, provide?, emits?,
  props: { ... },
  data() { ... },
  created() { commonsJs.loadCssCode + 源逻辑 },
  watch: { ... },
  computed: { ... },
  mounted() { ... },
  methods: { ... },
  beforeDestroy() { commonsJs.removeCssCode + 源逻辑 },
};
```

### 骨架默认 props

```javascript
index: { type: Number, default: null }
value: { type: [Object, Array, String, Number, Boolean] }
configdata: { type: Object, default: () => ({}) }
propstocomponent: { type: Object, default: () => ({}) }
fathername: { type: String }
```

源文件中的同名 prop 会覆盖骨架默认值，额外 prop 会追加。

## 文件结构

```
src/ds/
├── README.md              # 本说明
├── convert.ts             # CLI 入口
├── mcp-server.ts          # MCP Server（AI Agent 调用入口）
├── types.ts               # 类型定义
├── parsers/
│   └── vue-sfc.ts         # 解析 .vue（正则 + Babel）
└── generators/
    └── js-output.ts       # 生成 .js 输出
skills/
└── vue-js-lowcode.skill.md  # opencode skill（AI 辅助说明）
scripts/
└── install.js             # 一键安装脚本（Windows）
```

## 退出码

- `0`: 转换成功
- `1`: 参数错误、文件不存在、非 .vue 文件

## AI Agent 集成（MCP）

本工具注册为一个 **MCP Server**，opencode 等支持 MCP 的 AI Agent 可直接调用。

### 一键安装

```bash
node scripts/install.js
```

安装程序自动完成：`npm install` → `npm run compile` → 配置 opencode。

### 安装后效果

opencode 全局配置 `~/.config/opencode/opencode.json` 会自动添加：

```json
{
  "mcp": {
    "vue-to-js": {
      "type": "local",
      "command": ["node", "项目路径\\out\\ds\\mcp-server.js"]
    }
  }
}
```

在任何项目目录下打开 opencode，AI Agent 即可调用 `vue-to-js` 工具。

### 手动配置

若不使用一键安装，可在 `opencode.json` 中手动添加：

```json
{
  "mcp": {
    "vue-to-js": {
      "type": "local",
      "command": ["node", "项目绝对路径\\out\\ds\\mcp-server.js"]
    }
  }
}
```

### MCP 工具参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filePath` | string | 是 | .vue 文件的绝对路径 |
| `outputPath` | string | 否 | 输出 .js 路径（默认替换 .vue 后缀为 .js） |

行为：读取 `.vue` → 转换 → 写入 `.js`，返回简短确认消息。
AI 无需先读取原文件，也无需读取返回结果，仅消耗路径参数 token。

### 在两台电脑间同步

```bash
# 新电脑上
git clone 仓库地址
cd vue-js-lowcode-conversion
npm install
npm run compile
# 手动在 opencode.json 中添加 mcp 配置，路径指向 out/ds/mcp-server.js
```

## 依赖

- `@babel/parser` / `@babel/traverse` / `@babel/types` — 解析 script AST
- `@modelcontextprotocol/sdk` — MCP Server 框架
