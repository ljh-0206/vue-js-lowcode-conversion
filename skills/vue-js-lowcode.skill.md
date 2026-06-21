---
name: vue-js-lowcode
description: Vue 单文件组件 → 低代码 JS 格式转换
---

# vue-js-lowcode

当前环境已注册 `vue-to-js` MCP 工具，用于将 .vue 文件转换为低代码 .js 格式。

当用户要求转换时：
1. 读取 .vue 文件内容
2. 调用 `vue-to-js` 工具（参数 source = 文件内容）
3. 将返回的 output 写入同名的 .js 文件
