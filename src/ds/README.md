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
| `created` / `beforeDestroy` | 注入 `commonsJs.loadCssCode` / `removeCssCode` |
| `props` | 合并骨架默认 props + 源文件 props |

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
├── types.ts               # 类型定义
├── parsers/
│   └── vue-sfc.ts         # 解析 .vue（@vue/compiler-sfc + Babel）
└── generators/
    └── js-output.ts       # 生成 .js 输出
```

## 退出码

- `0`: 转换成功
- `1`: 参数错误、文件不存在、非 .vue 文件

## 依赖

- `@vue/compiler-sfc` — 解析 Vue SFC
- `@babel/parser` / `@babel/traverse` / `@babel/types` — 解析 script AST
