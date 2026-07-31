# TASK-2026-0731-049 编辑器节点命名

## 状态

verified

## 目标

让 Vue3 编辑器支持给节点设置运营可读名称，提升复杂活动页结构树、属性面板和搜索定位的可维护性。

## 背景

结构树已经支持搜索、折叠和画布定位，但长活动页中多个同类物料会反复出现，例如多个容器、多个商品列表或多个按钮。只看物料标题不利于运营或前端协作，需要允许给节点设置“首屏主会场”“精选专区 CTA”“新人券楼层”等可读名称，并让搜索和属性区使用该名称。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- 结构树展示节点运营名称，并保留物料类型辅助信息。
- 当前选中节点的右侧信息卡支持编辑节点名称。
- 结构树节点支持内联重命名。
- 节点右键菜单支持进入重命名。
- 重命名写入已有 `node.meta.name`，并支持清空后回退到物料标题。
- 结构树搜索可搜索重命名后的节点名称。
- Browser smoke 覆盖重命名、结构树展示和搜索。

## 不包含

- 不新增 Page Schema 字段。
- 不新增 editor npm 公共 API。
- 不实现批量重命名。
- 不接入服务端审计或多人协作锁。
- 不实现节点备注、颜色标记或标签体系。

## 责任边界

- `apps/editor-playground` 负责节点命名 UI、交互状态和 schema 写回。
- `packages/editor` 继续负责 headless editor state 命令，本任务不扩展其公开 API。
- `packages/renderer-*` 不参与编辑器节点命名交互。

## 契约影响

- 不改变 Page Schema 结构，复用已有 `node.meta.name`。
- 不改变 Material Manifest、renderer API、editor npm API 或 adapters API。
- 旧页面不受影响；没有 `meta.name` 的节点继续回退显示物料标题。

## 对接说明

正式管理台接入时，节点名称可作为运营侧结构树展示名和搜索字段。服务端如果需要审计重命名动作，可在 Java 配置平台保存草稿时比较 schema 差异。

## 验收标准

- 结构树主标题显示节点名称，副标题显示物料类型和节点 id。
- 右侧当前节点信息卡可编辑节点名称。
- 结构树节点可内联重命名。
- 节点右键菜单可进入重命名。
- 重命名后结构树搜索可命中新名称。
- 清空名称后回退显示物料标题。
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

- 结构树主标题改为节点运营名称，副标题显示物料类型和节点 id。
- 右侧当前节点信息卡新增节点名称输入，写入已有 `node.meta.name`。
- 结构树支持内联重命名，提供确认和取消操作。
- 节点右键菜单新增“重命名节点”，可进入结构树内联重命名状态。
- 重命名使用 `commitPlaygroundSchemaChange` 写入 schema 历史，支持后续撤销/重做。
- 清空节点名称时写回 `meta.name: undefined`，展示回退到物料标题。
- Browser smoke 覆盖右键进入重命名、确认重命名、结构树展示新名称和搜索新名称。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，32 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过，覆盖结构树重命名和搜索新名称。

## 发布影响

- 暂不发布 npm。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 内联重命名需要避开结构树拖拽、点击选中和右键菜单冲突。
- 清空名称时需要保留合理回退，避免结构树出现空标题。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充节点命名和重命名交互。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
