# TASK-2026-0731-004-editor-interaction-upgrade

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的实际操作感：支持画布节点点击选中、高亮、结构面板拖拽排序、页面状态配置和数据源面板。

## 背景

上一版 playground 已经能添加物料、编辑属性和预览 H5，但画布无法直接选中节点，结构面板不能排序，页面状态和数据源也缺少入口。为了更接近运营可用的低代码编辑器，需要继续补齐这些基础交互。

## 涉及包或系统

- `apps/editor-playground`
- `@meumall/lowcode-renderer-vue-h5`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- Vue H5 renderer 增加可选编辑态节点 wrapper、选中态和节点选择回调。
- playground 支持画布点击选中节点和选中高亮。
- 结构面板支持拖拽排序和选中节点上下移动。
- 页面面板支持状态和发布环境配置。
- 新增数据源面板，支持新增、编辑、删除数据源。

不包含：

- 多层容器节点排序。
- 真实远端数据源测试。
- Java 管理台保存/发布 API。
- Playwright 截图测试。

## 责任边界

当前仓库：

- 提供编辑器本地交互能力和 Vue renderer 编辑态支持。

外部系统：

- Java 管理台、素材库、商品库和发布系统仍为后续外部对接。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`packages/renderer-vue-h5/src/index.ts`、`apps/editor-playground/src/App.vue`
- 是否向后兼容：是，renderer 新增可选 props，默认行为不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 增强 Vue H5 renderer 编辑态 wrapper。
2. 增强 playground 画布选择和结构排序。
3. 增强页面状态和数据源面板。
4. 补充样式和文档记录。
5. 运行类型检查、构建和本地访问验证。

## 验收标准

- [x] 画布点击节点可以选中对应节点。
- [x] 选中节点在 H5 预览中有可见高亮。
- [x] 结构面板节点可以拖拽排序。
- [x] 选中节点可以上移/下移。
- [x] 页面状态和发布环境可以配置。
- [x] 数据源可以新增、编辑和删除。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 本地 dev server 返回 200。

## 验证命令

```bash
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
```

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-004-editor-interaction-upgrade.md`

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：本地 dev server 可访问，类型检查和构建通过。

## 风险和阻塞

- 当前拖拽排序只覆盖根节点。
- 数据源面板只编辑 schema 配置，不执行真实请求。
- 未做浏览器截图自动化验证。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确补齐编辑器基础交互。 |
| 2026-07-31 | in_progress | 增强 renderer 和 playground。 |
| 2026-07-31 | verified | 类型检查、构建和 HTTP smoke check 通过。 |

