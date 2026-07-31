# TASK-2026-0731-053 编辑器物料收藏与最近使用

## 状态

verified

## 目标

增强 Vue3 编辑器物料库的实操效率，让运营可以收藏常用物料，并在左侧物料区快速看到最近使用的物料。

## 背景

当前编辑器已具备物料搜索、分类过滤和快捷命令添加物料，但活动页物料数量持续增加后，运营每次都需要重新搜索或翻分类。常用物料（如图片 Banner、商品列表、底部转化条）需要有更短路径，便于重复搭建页面。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace/tasks`
- `.ai`

## 范围

- 左侧物料区新增收藏入口。
- 左侧物料区展示最近使用物料。
- 收藏和最近使用写入 localStorage，刷新后保留。
- 添加物料时自动记录最近使用。
- 收藏状态在物料卡片上可见、可切换。
- Browser smoke 覆盖收藏、最近使用和本地持久化。
- 更新 AI 项目状态和任务记录。

## 不包含

- 不新增 Java 用户偏好接口。
- 不改变 Material Manifest 契约。
- 不新增物料包。
- 不调整物料分类枚举。
- 不接入真实权限或团队共享偏好。

## 责任边界

- 编辑器 playground 负责本地偏好交互和持久化演示。
- 后续 Java 管理台可以把 localStorage 替换为用户偏好接口，但本任务不实现服务端能力。
- 物料包只提供 manifest，不感知收藏或最近使用。

## 契约影响

无跨包公开契约影响。收藏和最近使用是 `apps/editor-playground` 内部 UI 偏好，不影响 schema、renderer、materials 或 adapters 的 npm API。

## 对接说明

后续迁入正式管理台时，建议将收藏物料和最近使用物料作为用户级偏好保存；字段可复用 `componentName` 列表，不需要保存 manifest 快照。

## 验收标准

- 物料卡片可以收藏和取消收藏。
- 收藏物料在左侧物料区顶部可快速访问。
- 添加物料后最近使用列表更新。
- 收藏和最近使用刷新后仍可恢复。
- 搜索和分类过滤继续可用。
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
- 不影响 H5 接入。
- 不影响 Java 配置平台。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可恢复旧物料区。

## 风险和阻塞

- 风险：localStorage 偏好是本地 mock，不能代表真实多人协作偏好。
- 缓解：任务明确后续迁管理台时替换为用户偏好接口。
- 当前无阻塞。

## 实现结果

- 左侧物料区支持星标收藏和取消收藏。
- 收藏物料在物料区顶部以快捷 chip 展示，可一键添加到画布。
- 添加物料、拖拽投放和插入到选中节点附近都会记录最近使用。
- 最近使用物料在物料区顶部以快捷 chip 展示。
- 收藏和最近使用均写入 localStorage，并按 `componentName` 保存。
- Browser smoke 已覆盖收藏、最近使用和 localStorage 持久化。

## 验证结果

```bash
pnpm typecheck
# 通过

pnpm build
# 通过

pnpm test
# 通过，32 个测试全部通过

pnpm smoke:browser
# 通过，覆盖物料可收藏、最近使用可更新并持久化
```

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入 in_progress，开始实现物料收藏与最近使用。
- 2026-07-31：完成实现并通过验证，状态流转为 verified。
