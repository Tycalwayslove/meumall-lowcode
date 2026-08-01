---
"@meumall/lowcode-design-tokens": minor
"@meumall/lowcode-materials-h5": patch
"@meumall/lowcode-materials-vue-h5": patch
---

新增 `@meumall/lowcode-design-tokens` 公开包，承载 H5 runtime primitives 共用的框架无关 token、tone 取色、颜色 tint 和 CSS 变量派生 helper。

React/Vue H5 materials 内部 primitives 改为消费该包，物料 `componentName`、manifest、props schema 和旧页面渲染语义保持不变。
