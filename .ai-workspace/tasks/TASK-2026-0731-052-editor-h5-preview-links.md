# TASK-2026-0731-052 编辑器 H5 预览入口

## 状态

verified

## 目标

增强 Vue3 编辑器到 H5 渲染结果的可达性，让运营在编辑器内可以清楚看到并复制当前草稿、页面草稿和发布版本的 H5 预览链接。

## 背景

当前编辑器已具备本地保存、生成预览、发布、内置 H5 runtime 和 React H5 runtime handoff，但这些入口分散在按钮、命令面板和版本列表中。运营完成页面配置后，需要更直观地理解“当前页面在哪里看”“草稿链接和发布链接有什么区别”“如何复制给别人验收”。

## 涉及包或系统

- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace/tasks`
- `.ai`

## 范围

- 在右侧发布区域新增 H5 预览入口面板。
- 展示当前草稿 React H5 预览链接、页面草稿/最新版本内置 H5 链接、最近发布 release 链接。
- 提供打开和复制链接操作。
- 复制成功或失败通过现有发布消息反馈。
- Browser smoke 覆盖预览入口文案、复制动作和链接字段。
- 更新 AI 项目状态和任务记录。

## 不包含

- 不修改 Page Schema。
- 不新增 Java 配置平台接口。
- 不新增二维码依赖或第三方库。
- 不改变现有 H5 runtime loader 优先级。
- 不发布 npm 包。

## 责任边界

- 编辑器负责生成本地 playground 可用的预览链接和复制交互。
- H5 runtime playground 继续负责按 `schema`、`releaseId` 或 `pageId` 渲染 schema。
- Java 配置平台后续可替换链接域名和 previewId 协议，但本任务不实现服务端能力。

## 契约影响

无跨包公开契约影响。本任务复用既有 `schema` URL 参数、`releaseId` 和 `pageId` runtime 查询入口，不新增 schema 字段或 npm API。

## 对接说明

后续接入真实 Java 配置平台时，预览入口面板可以复用为正式管理台的“预览与发布地址”区块；链接来源应替换为 Java 返回的 preview URL、published URL 或 H5 页面路由。

## 验收标准

- 右侧发布区域展示 H5 预览入口面板。
- 当前草稿 React H5 预览链接可打开和复制。
- 页面草稿/最新版本内置 H5 链接可打开和复制。
- 最近发布 release 存在时展示 release 级内置 H5 链接。
- 复制链接后有明确反馈。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过。
- `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 不需要 npm 发布。
- 不影响 schema 兼容性。
- 不影响 H5 接入协议。
- 不影响 Java 配置平台。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可恢复旧发布区域。

## 风险和阻塞

- 风险：当前链接仍是 playground 本地域名和 URL schema handoff，不等同于生产预览域名。
- 缓解：面板文案区分“当前草稿 React H5”和“内置 H5”，长期文档继续记录真实 Java 预览协议待接入。
- 当前无阻塞。

## 实现结果

- 右侧发布区域新增 `H5 预览入口` 面板。
- 当前草稿 React H5 预览链接通过 `schema` URL 参数实时生成，可打开和复制。
- 页面草稿/最新版本 H5 链接通过 `pageId` 打开内置 runtime，可打开和复制。
- 最近存在 published release 时展示 release 级 H5 链接。
- 复制操作通过发布消息反馈成功或失败。
- Browser smoke 已覆盖预览入口展示、链接参数和复制反馈。

## 验证结果

```bash
pnpm typecheck
# 通过

pnpm build
# 通过

pnpm test
# 通过，32 个测试全部通过

pnpm smoke:browser
# 通过，覆盖 H5 预览入口展示链接并提供复制反馈
```

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入 in_progress，开始实现 H5 预览入口面板。
- 2026-07-31：完成实现并通过验证，状态流转为 verified。
