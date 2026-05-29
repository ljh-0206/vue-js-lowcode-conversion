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

### 高优先补充规范（实操）
1. 当源代码中存在 `this.info` 时，Vue -> JS 直接替换为 `_this.info`。
2. 不需要为了 `info` 映射额外在 `computed` 中新增 `info()`（除非源文件本身已有该计算属性且需保留语义）。
3. 用户明确要求除乱码字符修正外不得做任何额外逻辑调整、重构或风格改写。
4. 在“最小改动”模式下，优先保留原有字段顺序、命名和方法结构，仅修改用户点名的目标片段。

### Vue -> JS
1. 必须先套内置模板，再填充 `template/data/computed/watch/methods` 与生命周期。
2. 顶层顺序必须保持：`template -> name -> [源 Vue 实际声明的选项(如 emits/directives 等，禁止 components)] -> props -> data -> created -> watch -> computed -> mounted -> methods -> beforeDestroy`。
3. Vue `style` 必须转换为 CSS 文本写入 `styleClass`，不保留 less/scss/sass/stylus 专有语法。
4. 生成的低代码 JS 不能保留 `import`，可迁移能力改为 `this.commonsJs.xxx` 或项目统一入口。
5. `mapState('admin/user', ['info'])` 必须转换为 `_this.info`；若同时出现 `this.info` 访问，也按同一规则替换为 `_this.info`。
6. 转换时只能依据本 Skill 规则、内置模板与当前源文件内容，不得去项目或仓库中搜索、参考、比对其他示例文件来决定转换结果。
7. Vue 组件中的可转换选项遵循“有则转、无则不加”：例如源组件声明了 `emits` 才在 JS 中输出 `emits`，未声明则不生成该字段。
8. 低代码 JS 中禁止输出 `components` 字段；源 Vue 的组件依赖必须改为项目统一注入能力（如全局注册、`this.commonsJs`、运行时注入）或在转换前先由调用方处理。

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
- Vue -> JS：已套模板、样式已转 CSS、无 import、`mapState`/`this.info` 已按规则转 `_this.info`、未额外新增 `computed.info` 映射（除非源文件本身需要）、源 Vue 已声明的可转换选项(如 `emits`)已保留，未声明项未被硬编码新增、结果中不包含 `components` 字段。
- JS -> Vue：已移除 `loadCssCode/removeCssCode`、`_this.commonsJs` 已还原、`_this.info` 已还原为 `mapState`。
- 双向：关键交互与生命周期语义一致，无新增明显语法错误。
