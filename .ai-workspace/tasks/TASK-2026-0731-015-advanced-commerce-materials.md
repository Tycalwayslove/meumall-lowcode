# TASK-2026-0731-015-advanced-commerce-materials

## 状态

verified

## 目标

扩展基础电商活动页物料库，新增倒计时、导航宫格和秒杀商品组三个高频运营物料，并同步 React H5 runtime、Vue3 编辑器预览和页面模板示例。

## 背景

当前低代码平台已经具备基础物料、模板库、data source resolver 和 action 安全执行闭环，但运营活动页常见的“限时氛围、快速楼层导航、秒杀商品区”仍需要多个基础物料手工组合。新增高阶活动物料可以让编辑器更接近真实运营使用方式，也能继续验证物料 manifest、事件、dataBinding 和多 runtime 对齐能力。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`

## 范围

包含：

- React H5 物料包新增 `CountdownTimer`、`NavGrid`、`FlashSaleList`。
- Vue H5 物料包新增同名物料，并保持 manifest 字段一致。
- `FlashSaleList` 支持商品数据和商品点击事件。
- 页面模板使用新增高阶物料，增强默认运营页面骨架。
- React H5 runtime 示例使用新增物料。
- 更新项目状态、TODO 和验证报告。

不包含：

- 真实倒计时动态刷新。
- 真实楼层滚动锚点。
- 秒杀库存/价格接口。
- 新增 schema 字段。
- 小程序物料实现。

## 责任边界

当前仓库：

- 提供 H5 高阶活动物料的 React/Vue 实现、manifest 和 playground 示例。

外部系统：

- Java 配置平台后续负责真实活动、楼层、商品、库存和价格数据。
- H5 宿主后续负责真实跳转、点击、埋点和锚点滚动能力。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 Material Manifest 物料。
- 契约文档路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`
- 是否向后兼容：是，仅新增物料。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：物料包 README 和任务记录。
- 需要确认的角色：后续 Java 配置平台和 H5 接入负责人。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 新增任务并置为 `ready` 后进入 `in_progress`。
2. 在 React H5 物料包实现三个高阶物料和 manifest。
3. 在 Vue H5 物料包实现同名物料和 manifest。
4. 更新页面模板和 React H5 runtime 示例。
5. 更新 README、项目状态、TODO 和测试报告。
6. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build` 和 smoke check。

## 验收标准

- [x] React H5 物料包包含 `CountdownTimer`、`NavGrid`、`FlashSaleList`。
- [x] Vue H5 物料包包含同名物料。
- [x] 三个新增物料都有 manifest、defaultProps 和 propsSchema。
- [x] `FlashSaleList` 支持 `items` 数据和 `onProductClick` 事件。
- [x] 页面模板至少一个使用新增高阶物料。
- [x] React H5 runtime 示例使用新增高阶物料。
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
- 发布对象：后续发布 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5` 时包含新增物料。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：基础测试、类型检查、构建和本地入口检查通过。

## 验证结果

2026-07-31：

- `pnpm test` 通过，Node.js 内置测试共 3 个 suite、14 个用例全部通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- 新增物料 manifest 与 3 个页面模板 schema 校验通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-015-advanced-commerce-materials.md`

## 风险和阻塞

- 当前倒计时为静态配置展示，未实现实时倒计时刷新。
- 当前导航宫格仅执行绑定事件或链接跳转，真实楼层锚点滚动需要宿主 action handler。
- 秒杀商品价格、库存和状态仍依赖 mock 数据，后续需要真实数据源。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确新增倒计时、导航宫格和秒杀商品组高阶物料。 |
| 2026-07-31 | in_progress | 开始实现 React/Vue H5 高阶物料并更新模板示例。 |
| 2026-07-31 | verified | `pnpm test`、`pnpm typecheck`、`pnpm build`、manifest/schema 校验和本地 smoke check 通过。 |
