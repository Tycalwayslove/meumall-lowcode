# TASK-2026-0731-050 编辑器自动保存和恢复提示

## 状态

verified

## 目标

为 Vue3 编辑器 playground 增加本地自动保存和恢复提示，降低运营搭页过程中因为误关页面、刷新或长时间未手动保存导致的草稿丢失风险。

## 背景

当前编辑器已经具备手动保存草稿、版本列表和本地 mock 发布链路，但实操场景中运营人员会长时间编辑活动页，不能只依赖手动保存。正式 Java 配置平台接入前，应先在 playground 中建立自动保存体验和状态提示，后续再替换为真实草稿服务。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- 编辑器 schema 发生变更后自动延迟写入 localStorage 草稿。
- 顶部状态展示自动保存状态和最近自动保存时间。
- 从 localStorage 恢复草稿时展示恢复提示。
- 手动保存后同步更新自动保存状态。
- 清空画布、应用模板、发布回滚等已有路径保持可用。
- Browser smoke 覆盖自动保存状态提示。

## 不包含

- 不接入真实 Java 草稿保存接口。
- 不实现远端冲突检测、多人协作或草稿合并。
- 不新增 Page Schema 字段。
- 不改变 npm 包公开 API。
- 不实现离线队列或 IndexedDB。

## 责任边界

- `apps/editor-playground` 负责本地自动保存状态、localStorage 写入和恢复提示。
- Java 配置平台正式草稿服务仍属于后续外部系统接入。
- renderer 和 materials 不感知编辑器自动保存状态。

## 契约影响

- 不改变 Page Schema、Material Manifest、renderer API、editor npm API 或 adapters API。
- 自动保存复用现有 localStorage 草稿格式，旧草稿可继续读取。

## 对接说明

后续接真实 Java 配置平台时，可以将自动保存写入函数替换为 config platform client 的草稿保存接口，并补充服务端更新时间、保存失败重试和冲突提示。

## 验收标准

- schema 变更后会自动写入 localStorage 草稿。
- 顶部展示“自动保存中”和“自动保存”结果状态。
- 页面从本地草稿恢复时有可见提示。
- 手动保存后自动保存状态同步为已保存。
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

## 实现记录

- 编辑器 schema 变更后通过 watcher 延迟 700ms 写入 localStorage 草稿。
- 顶栏新增自动保存状态徽标，展示自动保存待命、已恢复本地草稿、自动保存中、已自动保存和自动保存失败。
- 从 localStorage 成功读取草稿时，编辑器初始化显示“已恢复本地草稿”。
- 手动保存草稿、发布和回滚发布路径复用同一 localStorage 持久化函数，并抑制下一次 watcher 重复标记为自动保存中。
- 自动保存 timer 在组件卸载时清理。
- Browser smoke 在节点重命名后等待“已自动保存”，并断言 localStorage 草稿包含重命名后的节点名称。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，32 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过，覆盖自动保存状态和 localStorage 草稿写入。

## 发布影响

- 暂不发布 npm。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 当前自动保存仍是 localStorage mock，不等于真实服务端持久化。
- localStorage 容量有限，正式接入复杂页面和素材数据时需要切换远端草稿服务。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充本地自动保存和恢复提示。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
