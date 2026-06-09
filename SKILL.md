---
name: vue-js-lowcode-conversion
description: 'Vue<->低代码JS转换：模板、styleClass、_this.info、commonsJs 语义还原'
argument-hint: '输入: 源文件路径, 方向(vue-to-js/js-to-vue), 是否用模板(默认是)'
user-invocable: true
---

# Vue JS Lowcode Conversion

## 优先级
1. 当次用户指令
2. 本文 高优先规则
3. 方向规则(Vue->JS / JS->Vue)
4. 示例模板

## 高优先规则
- 最小改动: 仅改用户点名目标。
- 禁止擅自修改原本逻辑: 未经用户明确指令, 不得改变已有业务语义、交互流程与对外接口。
- 用户要求仅修乱码: 只修乱码, 不做额外逻辑改动。
- Vue->JS: `this.info` 与 `mapState('admin/user', ['info'])` 统一转 `_this.info`。
- Vue->JS: 不额外新增 `computed.info`，除非源文件本身已有且必须保语义。
- 结果禁止 `components` 字段。
- 必须做“全量迁移校对”: 不仅迁移模板字段, 还要校对并迁移源文件中所有已使用符号与 Vue 选项。
- 模块级/局外符号必须纳入迁移结果, 禁止遗漏。
- Vue 选项参数必须逐项校对并迁移, 不能只保留固定模板中的少量字段。
- 转换仅依据: 本 Skill + 内置模板 + 当前源文件。

## 内置模板(Vue->JS, 最小骨架)，先确保js文件必须包含模板内参数, 再逐项对账补齐:
```javascript
let name = ''
let styleClass = ``
return {
  template: ``,
  name: name,
  props: {
        index: { type: Number },
        value: { type: [Object, Array, String, Number, Boolean] },
        configdata: { type: Object, default: () => ({}), },
        propstocomponent: { type: Object, default: () => ({}), },
        index: { type: Number, default: null },
        fathername: { type: String }
  },
  data() { return {} },
  created() { this.commonsJs.loadCssCode(styleClass, name+ this._uid) },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
  beforeDestroy() { this.commonsJs.removeCssCode(name+ this._uid) }
}
```

## Vue -> JS
- 顺序固定:
  `template -> name -> [源文件已有可转换选项, 禁止components] -> props -> data -> created -> watch -> computed -> mounted -> methods -> beforeDestroy`
- 顺序中的 `[源文件已有可转换选项]` 必须按“源文件实际存在”全量展开校对, 例如 `inject`、`directives`、`filters`、`model`、`mixins`、`provide`、`emits` 等(有则转, 无则不加)。
- 同步校对脚本作用域符号: `const/let`、函数声明、工具常量、枚举映射等模块级定义需保持可达与语义一致。
- `style` 转纯 CSS 写入 `styleClass`。
- 删除 `import`; 可替代能力迁移到 `this.commonsJs.xxx` 或项目统一入口。
- 仅“有则转, 无则不加”(如 `emits`/`directives`)。

### 执行流程(强制)
1. 先抽取源文件符号清单: Vue 选项键 + 模块级符号 + 模板依赖符号。
2. 再按固定顺序生成目标骨架, 仅填充源文件实际存在项。
3. 逐项对账: 对比“源符号清单”与“目标产物符号”, 标记缺失项。
4. 若存在缺失项, 先补齐迁移; 无法补齐时按“需通知用户”中断并说明原因。
5. 最后做语义等价复核: 不改变业务语义、交互流程、对外接口。

## JS -> Vue
- 还原 `template/script/style`，保持交互语义。
- `styleClass` 还原到 `style`。
- 移除 `this.commonsJs.loadCssCode/removeCssCode`。
- `_this.commonsJs.xxx` 还原 `this.commonsJs.xxx`。
- `_this.info` 或 `this.info` 还原为 `mapState('admin/user', ['info'])`。
- 同样执行“全量迁移校对”: 脚本作用域符号与 Vue 选项参数需逐项回填, 不得漏还原。

## Import 迁移决策
1. 查 `this.commonsJs` 替代能力。
2. 查项目统一入口。
3. 可替代: 迁移并删除 import。
4. 不可替代: 通知用户后再继续。

## 需通知用户
- 缺少可替代能力。
- 迁移将改变对外接口/调用方式。
- 需要新增第三方依赖。
- 规则冲突无法唯一决策。

## 验收(简版)
- Vue->JS: 套模板、styleClass、无 import、`this.info/mapState -> _this.info`、无新增 `computed.info`、无 `components`。
- Vue->JS: 通过“全量迁移校对”: 源文件已使用符号与 Vue 选项无遗漏(含模块级/局外符号与 `inject` 等非模板固定项)。
- JS->Vue: 去除 load/removeCssCode、还原 commonsJs 与 mapState。
- JS->Vue: 通过“全量迁移校对”: 选项参数与模块级符号还原完整, 无漏项。
- 双向: 关键生命周期和交互语义一致。
