# TASK-2026-0731-014-safe-action-editor-runtime

## 状态

verified

## 目标

补齐 action 安全白名单和事件配置闭环，让运营可以在 Vue3 编辑器 playground 中维护页面 actions，并把物料事件绑定到受控 action；编辑器预览和 React H5 runtime 都通过安全 action registry 执行动作。

## 背景

当前 schema 已有 `actions` 和节点 `events` 字段，renderer 也支持 `actionExecutor`，但编辑器还没有 action 配置 UI，运行时也没有注入安全 action handler。运营搭建活动页时常见需求包括按钮跳转、优惠券领取和点击埋点，这些动作必须是白名单能力，不能让运营写任意 JavaScript 或任意接口调用。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `packages/adapters/test`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`

## 范围

包含：

- 在 adapters 中补充 safe action registry 执行上下文和 renderer executor 适配能力。
- 编辑器新增 actions 配置面板，支持新增、修改、删除 action。
- 编辑器属性面板根据物料 manifest events 绑定/解除节点事件。
- Vue 编辑器预览和独立 runtime 注入 safe action executor。
- React H5 runtime 注入 safe action executor 并展示执行日志。
- adapters 单元测试覆盖 safe action executor 成功和错误分支。
- 更新项目状态、TODO 和验证报告。

不包含：

- 真实 Java action API。
- 登录态、优惠券真实领取、业务跳转桥接。
- action 审批、权限、风控和埋点上报平台。
- schema 字段结构调整。

## 责任边界

当前仓库：

- 提供 action 白名单适配协议、playground 级 handler 和编辑器配置闭环。

外部系统：

- Java 配置平台后续负责 action 类型、权限、审计和真实业务接口。
- H5 宿主后续负责注册真实 navigate、coupon.receive、tracking.click 等 handler。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-adapters` action executor 公开 API。
- 契约文档路径：`packages/adapters/README.md`
- 是否向后兼容：是，仅新增 API 并扩展 handler 可选上下文。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/adapters/README.md`
- 需要确认的角色：后续 Java 配置平台和 H5 接入负责人。
- 当前确认状态：本地 playground mock 验证。

## 实现计划

1. 新增任务并置为 `ready` 后进入 `in_progress`。
2. adapters 新增 safe action executor 和测试。
3. Vue3 编辑器 playground 增加 actions 配置和事件绑定 UI。
4. Vue/React runtime 注入 safe action executor。
5. 更新 README、项目状态、TODO 和验证报告。
6. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build` 和本地 smoke check。

## 验收标准

- [x] adapters 提供 safe action executor 适配能力。
- [x] 未注册 action type 或缺失 actionId 不导致页面白屏，并能反馈错误。
- [x] 编辑器可新增、修改、删除 action。
- [x] 编辑器可把选中节点 manifest events 绑定到 action。
- [x] 编辑器预览点击已绑定事件会走安全 action handler。
- [x] React H5 runtime 点击已绑定事件会走安全 action handler。
- [x] adapters 单元测试覆盖 safe action executor。
- [x] `pnpm test` 通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 编辑器和 React H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增 API。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：基础测试、类型检查、构建和本地入口检查通过。

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm test` 通过，Node.js 内置测试共 3 个 suite、14 个用例全部通过。
- `pnpm build` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-014-safe-action-editor-runtime.md`

## 风险和阻塞

- 当前 action handler 仍是 playground mock，不触达真实业务系统。
- Action 类型、权限、审批、风控和真实执行结果需要 Java 配置平台后续提供契约。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确补齐 action 安全白名单和编辑器事件配置闭环。 |
| 2026-07-31 | in_progress | 开始实现 adapters executor、编辑器配置和 runtime 注入。 |
| 2026-07-31 | verified | `pnpm typecheck`、`pnpm test`、`pnpm build` 和本地 smoke check 通过。 |
