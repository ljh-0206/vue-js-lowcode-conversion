# Vue ↔ 低代码 JS 转换脚本 — 实施方案

## 一、目标

将 SKILL.md 中描述的 Vue ↔ JS 双向转换规则固化为可独立执行的 CLI 脚本，零 AI 调用。

## 二、架构总览

```
vue-convert <direction> <input> [output]
  direction: vue-to-js | js-to-vue
```

### 流程

```
         ┌──────────────────┐
         │   CLI 入口        │
         │  (vue-convert)    │
         └──────┬───────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
  ┌──────────┐   ┌──────────┐
  │ Vue→JS   │   │ JS→Vue   │
  └────┬─────┘   └────┬─────┘
       │               │
       ▼               ▼
  ┌──────────┐   ┌──────────┐
  │ 校验报告  │   │ 校验报告  │
  └──────────┘   └──────────┘
```

## 三、依赖

```json
{
  "dependencies": {
    "@vue/compiler-sfc": "^3.x",
    "@babel/parser": "^7.x",
    "@babel/traverse": "^7.x",
    "@babel/generator": "^7.x",
    "@babel/types": "^7.x"
  }
}
```

## 四、目录结构

```
src/jb/
├── cli.ts              # CLI 入口 + 参数解析
├── vue-to-js.ts        # Vue→JS 主流程
├── js-to-vue.ts        # JS→Vue 主流程
├── parsers/
│   ├── vue-sfc.ts      # 解析 .vue (template/script/style)
│   └── js-ast.ts       # 解析 JS (提取选项、符号)
├── transformers/
│   ├── this-info.ts     # this.info / mapState → _this.info
│   ├── style-class.ts   # <style> ↔ styleClass
│   ├── import.ts        # import 处理
│   └── options.ts       # Vue 选项迁移
├── generators/
│   ├── js-output.ts     # 生成 JS 骨架输出
│   └── vue-output.ts    # 生成 .vue 输出
├── checker/
│   └── full-migration.ts # 全量迁移校对
└── types.ts             # 公共类型定义
```

## 五、核心算法

### 5.1 Vue → JS

```
输入: 源 .vue 文件
输出: .js 文件 + 校验报告

步骤:
1. 用 @vue/compiler-sfc 解析 SFC → template AST + script AST + style text
2. 用 @babel/parser 解析 script 内容 → JS AST
3. 从 JS AST 提取:
   a) export default { ... } 中的 Vue 选项键列表（仅支持 export default {} 写法）
   b) 模块级符号 (const/let/function/class/import)
   c) template 中引用的依赖符号 (data/computed/methods/组件)
4. 按固定顺序生成输出骨架:
   [模块级符号声明]
   let name = '<组件名>'          (从 name 选项提取)
   let styleClass = `<CSS>`       (从 style 块提取)
   return {
     template: `<HTML>`,           (从 template 块提取)
     name: name,
     // ↓ [源文件已有可转换选项] 按源文件实际存在全量展开 ↓
     inject,
     directives,
     filters,
     model,
     mixins,
     provide,
     emits,
     // ↑ [源文件已有可转换选项] ↑
     props: {                      (合并: 骨架默认 + 源文件已有)
       index: { type: Number, default: null },
       value: { type: [Object, Array, String, Number, Boolean] },
       configdata: { type: Object, default: () => ({}) },
       propstocomponent: { type: Object, default: () => ({}) },
       fathername: { type: String },
       ...源文件其他props
     },
     data() { return 源文件data },
     created() {
       this.commonsJs.loadCssCode(styleClass, name + this._uid);
       // + 源文件 created 逻辑（若有）
     },
     watch: { ...源文件watch },
     computed: { ...源文件computed },
     mounted() { ...源文件mounted },
     methods: { ...源文件methods },
     beforeDestroy() {
       this.commonsJs.removeCssCode(name + this._uid);
       // + 源文件 beforeDestroy 逻辑（若有）
     }
   }
5. 在生成的 AST 上执行变换:
   a) this.info / mapState(...) → _this.info
   b) 删除 import 语句（需检查可替代性）
   c) 移除 components 字段
   d) this.someFunction → 保持（非 this.info 的不变）
   e) 输出改动代码位置信息（文件、行号、列号）
6. **全量迁移校对** (full migration check):
   a) 构建"源符号清单": Vue选项键 + 模块级符号 + 模板依赖符号
   b) 构建"目标产物符号清单"
   c) 求差集 → 标记缺失项
    d) 缺失项尝试自动补齐; 无法补齐 → 输出 WARNING + 继续执行 + 在报告中标注未迁移项
7. 输出 .js 文件 + 校验报告
```

### 5.2 JS → Vue

```
输入: 源 .js 文件
输出: .vue 文件 + 校验报告

步骤:
1. 用 @babel/parser 解析 JS 文件 → AST
2. 识别骨架模式: let name / let styleClass / return { ... }
3. 提取:
   a) template 字符串 → <template> 块
   b) styleClass 内容 → <style> 块
   c) return 对象中的 Vue 选项 → <script> 块
4. 变换:
   a) 删除 this.commonsJs.loadCssCode / removeCssCode 调用
   b) _this.commonsJs.xxx → this.commonsJs.xxx
   c) _this.info → mapState('admin/user', ['info']); 
      注意: _this.info 也可能来自 computed/data → 需检查上下文
   d) this.info → 同样需判断
   e) 输出改动代码位置信息（文件、行号、列号）
5. 重建 .vue 结构
6. **全量迁移校对** (同 Vue→JS)
7. 输出 .vue 文件 + 校验报告
```

## 六、关键变换规则详解

### 6.1 `this.info` / `mapState` → `_this.info`

| 源 | 目标 |
|----|------|
| `this.info` | `_this.info` |
| `mapState('admin/user', ['info'])` | `_this.info` |
| `...mapState('admin/user', ['info'])` | 移除该行，转为 `_this.info` 使用处 |

实现: Babel 遍历 MemberExpression + Identifier，匹配 `this.info` 和 `mapState(...)` 调用。

### 6.2 `<style>` ↔ `styleClass`

**Vue→JS**: 提取 style text → 写入 `let styleClass = \`<CSS>\`` (转义反引号)
**JS→Vue**: 从 `let styleClass` 提取 → 写入 `<style scoped>\n<CSS>\n</style>`

### 6.3 Import 处理

```
1. 遍历 import 声明
2. 检查 import 内容是否可被 this.commonsJs.xxx 替代
   - 可替代: 删除 import，生成 WARNING 日志
    - 不可替代: 互动式询问用户（CLI 模式下提供选项：跳过/终止/强制删除）
3. 检查项目统一入口可替代
```

可替代性判断: 维护一张已知映射表（初期人工维护，后续可扩展为配置文件）。

### 6.4 Props 合并策略

骨架默认 props 与源文件 props 合并:
- 骨架默认: index, value, configdata, propstocomponent, fathername
- 注: 骨架中 `index` 出现两次（一次 `{ type: Number }`, 一次 `{ type: Number, default: null }`）→ 保留后者
- 源文件 props 中有同名时: 以源文件为准
- 源文件 props 中有额外项: 追加

### 6.5 全量迁移校对算法

```
function fullMigrationCheck(source: SourceSymbols, target: TargetSymbols): CheckResult {
  const missing = source.optionsKeys.diff(target.optionsKeys);
  const missingModuleSymbols = source.moduleSymbols.diff(target.moduleSymbols);
  const missingTemplateDeps = source.templateDeps.diff(target.templateDeps);

  const warnings = [];
  const unmigratedItems = [];
  if (missing.length > 0) {
    for (const key of missing) {
      if (isAutoFillable(key)) {
        autoFill(key, target);  // 自动补齐
      } else {
        warnings.push(`选项 ${key} 无法自动迁移，需人工处理`);
        unmigratedItems.push({ type: 'option', name: key });
      }
    }
  }
  // ...同上处理 moduleSymbols、templateDeps
  return { success: warnings.length === 0, warnings, unmigratedItems };
}
```

## 七、注意事项与修正点

对比原始口头计划，以下需要修正:

| # | 原始计划 | 修正 |
|---|---------|------|
| 1 | 只说"template 字符串" | 实际输出是 `template: \`<html>\`` 作为 return 对象属性 |
| 2 | 忽略 `let name = ''` | 必须从源组件提取 name 选项填充 |
| 3 | 忽略输出顺序固定 | 严格按: template → name → [源文件已有可转换选项] → props → data → created → watch → computed → mounted → methods → beforeDestroy |
| 4 | 忽略 props 合并 | 骨架默认 props + 源文件 props |
| 5 | 忽略 import 可替代判断 | 不能直接删除，需先检查可替代性 |
| 6 | 未提及 created/beforeDestroy 骨架注入 | 自动注入 loadCssCode / removeCssCode |
| 7 | 未提及"无则不加" | 源文件没有的选项 (如 emits/directives) 不追加 |
| 8 | 未提及"全量迁移校对"细节 | 需要符号清单比对 + 自动补齐 + 不可补齐时输出 WARNING + 继续执行 + 在报告中标注未迁移项 |
| 9 | `index` 重复未处理 | 骨架中 `index` 出现两次，取后者 `{ type: Number, default: null }` |
| 10 | 未提及"需要通知用户"场景 | import 不可替代、规则冲突、缺少可替代能力等需互动式询问用户 |
| 11 | 未明确 Vue 组件导出方式 | 仅支持 `export default {}` 写法 |
| 12 | 未提及改动代码位置输出 | 需输出改动代码位置信息（文件、行号、列号） |

## 八、验收标准（映射自 SKILL.md）

- [ ] Vue→JS: 套骨架、styleClass、无 import、`this.info/mapState → _this.info`、无新增 `computed.info`、无 `components`
- [ ] Vue→JS: 全量迁移校对通过—源文件已使用符号与 Vue 选项无遗漏（含模块级/局外符号与 inject 等非模板固定项）
- [ ] JS→Vue: 去除 load/removeCssCode、还原 commonsJs 与 mapState
- [ ] JS→Vue: 全量迁移校对通过—选项参数与模块级符号还原完整，无漏项
- [ ] 双向: 关键生命周期和交互语义一致
- [ ] 校验报告包含未迁移项清单（如有）
- [ ] 校验报告包含改动代码位置信息（文件、行号、列号）

## 九、实施阶段建议

| 阶段 | 内容 | 估算 |
|------|------|------|
| 1 | 搭建 CLI 框架 + 类型定义 + SFC 解析 | 1d |
| 2 | Vue→JS 核心变换（不含全量校对） | 2d |
| 3 | JS→Vue 反向变换 | 1d |
| 4 | 全量迁移校对模块 | 1d |
| 5 | 互动式询问机制 + import 可替代判断 + 改动位置输出 | 0.5d |
| 6 | 测试: 覆盖规则验收表所有条目 | 1d |
| 7 | 真实项目验证 + 修正 | 1d |
