# AI Context

## 当前目标

建设 MeuMall 低代码平台基础架构，先统一放在 `/Users/mac/person_code/meumall-lowcode`，后续可拆包、发布 npm、上传 GitHub 留存。

## 设计基线

- schema 是核心契约。
- editor 生产 schema。
- renderer 消费 schema。
- materials 实现可配置节点。
- Java 配置平台负责存储和发布 schema。
- H5 通过 npm 引入 renderer/materials/schema。
- 未来小程序复用 schema/core，新增小程序 renderer/materials。

## 当前协作约定

- 中文为主要协作语言。
- 正式任务先建或读取 `.ai-workspace/tasks/`。
- 重要事实写入仓库，不依赖聊天记忆。
- schema、包边界、发布流程和外部系统对接变化必须更新文档。

## 外部参考

- 已阅读掘金小册并生成原创读书笔记：`/Users/mac/Documents/掘金小册/从零开发H5可视化搭建项目-原创读书笔记与MeuMall落地方案.md`
- 已分析 `buqiyuan/vite-vue3-lowcode`，结论是可借鉴编辑器交互和 schema 思路，但本项目采用可发布 npm 包的 monorepo 架构。

