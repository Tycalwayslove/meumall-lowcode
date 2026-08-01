# TASK-2026-0801-133-adapters-editor-workflow-client

## 标题

扩展 adapters 编辑器工作流状态 client

## 状态

verified

## 目标

在不引入真实 Java 后端实现、不改变 Vue3 编辑器现有本地演示流程的前提下，为 `@meumall/lowcode-adapters` 补充 Java 配置平台编辑器工作流状态协议，包括协作锁、审批状态、锁操作和审批流转的类型与 HTTP client 参考实现，让后续管理台接入可以用稳定 client 替换 playground 本地状态。

## 背景

当前 `@meumall/lowcode-editor` 已沉淀 permission/capability、collaboration state 和 approval state API，Vue3 editor playground 已能用 URL 参数演示协作锁定和审批状态。但 Java 配置平台 API 草案和 adapters client 仍只覆盖草稿、预览、发布、release 查询、draft 查询和 published 查询。本任务把编辑器工作流状态推进到 adapters 协议层，保持 adapters 只依赖 schema，不反向依赖 editor 包。

## 涉及包或系统

- `packages/adapters`
- `.ai-workspace/contracts/java-config-platform-api-v1.md`
- `.ai/`

## 范围

包含：

- 新增编辑器锁状态、审批状态、操作人、工作流状态、锁操作入参和审批操作入参类型。
- 扩展 `LowcodeConfigPlatformClient`，增加可选编辑器工作流方法。
- 扩展 `createHttpConfigPlatformClient`，提供工作流查询、抢锁、续期、释放、提交审批、取消审批和审核审批的参考 HTTP 调用。
- 补充 adapters 测试，验证新增 HTTP 路径、请求体和响应解析。
- 更新 Java 配置平台 API 草案、adapters README、AI 上下文、TODO 和项目事实源。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不实现真实 Java 锁服务、审批服务、审批历史、通知或审计。
- 不改变 Vue3 editor playground UI 或本地 URL 演示状态。
- 不把 `@meumall/lowcode-editor` 作为 adapters 依赖。
- 不新增 npm 包、不新增 npm 依赖。
- 不执行真实 npm 发布。

## 责任边界

当前仓库：

- `@meumall/lowcode-adapters` 负责声明 Java 配置平台编辑器工作流状态协议和 HTTP client 参考实现。
- `@meumall/lowcode-editor` 继续负责把状态映射为编辑器可用的权限、标题、描述、tone 和禁用原因。
- Vue3 editor playground 仍使用本地状态演示，后续管理台 shell 可把 adapters 返回值映射进 editor 状态 API。

外部系统：

- Java 配置平台未来负责真实锁存储、租约续期、锁冲突、审批实例、审批权限、审批历史、通知和审计。
- Java 管理台未来负责选择真实 config platform client、注入当前操作人、处理错误提示和页面生命周期。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 是否向后兼容：是，新增字段和 client 方法均为可选能力，现有草稿、预览、发布和 runtime 加载流程不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 Java 接入时可先只实现查询和抢锁，再逐步启用审批接口。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/adapters/README.md`、`.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 需要确认的角色：Java 配置平台、Java 管理台、H5 前端。
- 当前确认状态：待 Java 配置平台确认响应包装、鉴权、锁 TTL、审批权限和错误码。

## 实现计划

1. 梳理现有 config platform client 和 Java 配置平台 API 草案。
2. 在 adapters 中增加编辑器工作流状态协议类型和可选 client 方法。
3. 扩展 HTTP client 路径、请求体和响应校验。
4. 补充 adapters 测试覆盖新增工作流路径。
5. 更新契约、README、AI 状态文档和 TODO。
6. 运行验证命令并记录结果。

## 验收标准

- [x] adapters 新增编辑器锁状态、审批状态、操作人、工作流状态和操作入参类型。
- [x] `LowcodeConfigPlatformClient` 暴露可选工作流方法，旧 mock client 不需要立即实现。
- [x] `createHttpConfigPlatformClient` 支持工作流查询、锁操作和审批操作。
- [x] 新增测试覆盖 workflow、lock acquire 和 approval submit 请求。
- [x] Java 配置平台 API 草案记录新增 endpoints、请求和响应结构。
- [x] README 说明 adapters 与 editor 状态 API 的映射边界。
- [x] 不新增 npm 包、不新增依赖、不改变 Page Schema v1。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务只准备 npm 包协议和文档，不执行真实发布。
- 发布对象：后续真实 npm 发布时影响 `@meumall/lowcode-adapters` 类型和 HTTP client 能力。
- 是否需要 changeset：否，当前仓库尚未进入真实 npm 发布流程。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不影响现有 H5 runtime。
- 是否影响 npm 发布：影响 adapters 包内容，需通过 `pnpm pack:dry-run` 预检。
- 是否影响 Java 配置平台：是，新增待确认编辑器工作流 API 草案。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证编辑器和 H5 runtime 关键路径不受 adapters 协议扩展影响。

## 风险和阻塞

- Java 配置平台真实响应可能使用统一包装格式，host adapter 需要在接入时解包。
- 锁 TTL、抢锁策略、审批权限、审批历史和错误码仍需 Java 侧确认。
- adapters 只提供协议和参考 HTTP client，真实管理台仍需注入当前操作人、处理 token、CSRF、审计和异常提示。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，75 个测试通过，并包含新增 config platform workflow、lock acquire 和 approval submit HTTP client 覆盖。
- `pnpm check:architecture` 通过，确认 adapters 仍只依赖 schema，不反向依赖 editor 包。
- `pnpm smoke:browser` 通过，Vue3 编辑器、内置 runtime 和 React H5 runtime 关键路径均通过。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 当前只完成 adapters 协议和参考 HTTP client；真实 Java 锁存储、锁 TTL、抢锁策略、审批实例、审批历史、通知、审计和错误码仍需 Java 配置平台确认。
- 真实管理台接入时仍需处理统一响应解包、鉴权、CSRF、当前操作人注入、异常提示和页面关闭释放锁。
- Vue3 editor playground 仍使用本地演示状态，本任务不改变 UI 行为。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 adapters 编辑器工作流状态 client、Java 配置平台契约和验证。 |
| 2026-08-01 | in_progress | 开始扩展 adapters 类型、HTTP client 和测试。 |
| 2026-08-01 | verified | 完成 adapters 编辑器工作流状态 client、Java 配置平台契约和验证。 |
