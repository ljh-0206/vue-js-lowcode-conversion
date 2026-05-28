---
name: vue-js-lowcode-conversion
description: 'Vue 与特定低代码 JS 双向转换。用于 vue转js、js转vue、mapState 与 _this.info 映射、_this.commonsJs/this.commonsJs 还原、styleClass 与 CSS 迁移、去除 loadCssCode/removeCssCode。'
argument-hint: '提供源文件路径、目标方向(vue-to-js/js-to-vue)、是否使用内置模板(默认是)'
user-invocable: true
---

# Vue JS Lowcode Conversion

## 适用场景
- 需要把 Vue 组件转换为特定格式低代码 JS。
- 需要把特定低代码 JS 还原为 Vue 组件。
- 需要统一处理 `mapState('admin/user', ['info'])` 与 `_this.info` 的双向映射。
- 需要统一处理 `_this.commonsJs` 与 `this.commonsJs` 的语义还原。

## 内置模板（Vue -> JS）
```javascript
let name = ''
let styleClass = ``
return {
    template: `
		
`,
    name: name,
    props: {
        index: { type: Number },
        value: { type: [Object, Array, String, Number, Boolean] },
        configdata: { type: Object, default: () => ({}), },
        propstocomponent: { type: Object, default: () => ({}), },
        index: { type: Number, default: null },
        fathername: { type: String }
    },
    data() {
        return {}
    },
    created() {
        this.commonsJs.loadCssCode(styleClass, name)
    },
    watch: {},
    computed: {},
    mounted() { },
    methods: {},
    beforeDestroy() {
        this.commonsJs.removeCssCode(name)
    }
}
```

## 转换规则

### Vue -> JS
1. 必须先套内置模板，再填充 `template/data/computed/watch/methods` 与生命周期。
2. 顶层顺序必须保持：`template -> name -> props -> data -> created -> watch -> computed -> mounted -> methods -> beforeDestroy`。
3. Vue `style` 必须转换为 CSS 文本写入 `styleClass`，不保留 less/scss/sass/stylus 专有语法。
4. 生成的低代码 JS 不能保留 `import`，可迁移能力改为 `this.commonsJs.xxx` 或项目统一入口。
5. `mapState('admin/user', ['info'])` 必须转换为 `_this.info`。
6. 转换时只能依据本 Skill 规则、内置模板与当前源文件内容，不得去项目或仓库中搜索、参考、比对其他示例文件来决定转换结果。

### JS -> Vue
1. 还原 Vue 的 `template/script/style`，保证关键交互与生命周期语义一致。
2. 将 `styleClass` 还原为 Vue `style`。
3. 必须移除 `this.commonsJs.loadCssCode(...)` 与 `this.commonsJs.removeCssCode(...)`。
4. `_this.commonsJs.xxx` 必须还原为 `this.commonsJs.xxx`。
5. `_this.info`（及等价 `this.info`）必须还原为 `mapState('admin/user', ['info'])` 对应计算属性映射。

## Import 迁移规则
1. 先查 `this.commonsJs` 是否有可替代能力。
2. 再查项目统一能力入口。
3. 能替代则迁移并删除 import。
4. 不能替代时先通知用户，等待确认后继续。

## 通知用户的场景
- 找不到 `this.commonsJs` 或项目统一入口的替代能力。
- 迁移会改变外部接口或调用方式。
- 需要新增第三方依赖。
- 样例冲突，无法确定唯一方案。

## 验收清单
- Vue -> JS：已套模板、样式已转 CSS、无 import、`mapState` 已转 `_this.info`。
- JS -> Vue：已移除 `loadCssCode/removeCssCode`、`_this.commonsJs` 已还原、`_this.info` 已还原为 `mapState`。
- 双向：关键交互与生命周期语义一致，无新增明显语法错误。
