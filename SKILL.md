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
- 用户要求仅修乱码: 只修乱码, 不做额外逻辑改动。
- Vue->JS: `this.info` 与 `mapState('admin/user', ['info'])` 统一转 `_this.info`。
- Vue->JS: 不额外新增 `computed.info`，除非源文件本身已有且必须保语义。
- 结果禁止 `components` 字段。
- 转换仅依据: 本 Skill + 内置模板 + 当前源文件。

## 内置模板(Vue->JS, 最小骨架)
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
  created() { this.commonsJs.loadCssCode(styleClass, name) },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
  beforeDestroy() { this.commonsJs.removeCssCode(name) }
}
```

## Vue -> JS
- 顺序固定:
  `template -> name -> [源文件已有可转换选项, 禁止components] -> props -> data -> created -> watch -> computed -> mounted -> methods -> beforeDestroy`
- `style` 转纯 CSS 写入 `styleClass`。
- 删除 `import`; 可替代能力迁移到 `this.commonsJs.xxx` 或项目统一入口。
- 仅“有则转, 无则不加”(如 `emits`/`directives`)。

## JS -> Vue
- 还原 `template/script/style`，保持交互语义。
- `styleClass` 还原到 `style`。
- 移除 `this.commonsJs.loadCssCode/removeCssCode`。
- `_this.commonsJs.xxx` 还原 `this.commonsJs.xxx`。
- `_this.info` 或 `this.info` 还原为 `mapState('admin/user', ['info'])`。

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
- JS->Vue: 去除 load/removeCssCode、还原 commonsJs 与 mapState。
- 双向: 关键生命周期和交互语义一致。
