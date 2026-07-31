# TASK-2026-0731-061-section-title-material

## 标题

新增区块标题基础物料

## 状态

verified

## 目标

为运营活动页补充常用的“区块标题”基础物料，用于分隔商品楼层、活动规则、品牌专题等内容模块，并同时支持 Vue3 编辑器预览和 React H5 runtime 渲染。

## 背景

当前物料库已有头图、图片、商品、优惠券、直播、榜单等活动物料，但缺少最基础的楼层标题/说明类物料。运营在实操搭建页面时，经常需要在不同内容块之间增加标题、说明、角标和视觉分隔。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

- React H5 物料包新增 `SectionTitle` 组件和 manifest。
- Vue H5 物料包新增 `SectionTitle` 组件和 manifest。
- 编辑器页面模板接入区块标题，提升默认页面层次。
- React H5 runtime 示例接入区块标题。
- Browser smoke check 覆盖编辑器、内置 runtime 和 React runtime 的区块标题渲染。
- 更新任务记录和 AI 项目状态。

## 不包含

- 不改变 Page Schema v1。
- 不改变 renderer API。
- 不接入真实 Java 配置平台。
- 不发布 npm 版本。

## 责任边界

- `materials-h5` 和 `materials-vue-h5` 负责物料组件与 manifest。
- 编辑器通过现有物料 registry 自动暴露该物料，不新增编辑器专属协议。
- H5 runtime 继续通过 schema 消费该物料。

## 契约影响

新增 `SectionTitle` 物料 manifest，属于向后兼容的物料库扩展；不影响已有页面渲染。

## 对接说明

后续 Java 配置平台物料市场需要同步展示 `SectionTitle` 的 manifest 字段；当前编辑器 playground 会从本地物料 registry 自动展示。

## 验收标准

- React H5 runtime 可以渲染 `SectionTitle`。
- Vue3 编辑器画布可以渲染并添加 `SectionTitle`。
- React/Vue 物料 manifest 名称保持对齐。
- 默认模板或示例中能看到“今日主推”等区块标题文案。
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
- 不影响 H5 runtime 接入方式。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可移除新增物料和示例接入。

## 风险和阻塞

- 当前 `SectionTitle` 为 H5 基础物料，未来小程序端需要单独实现 miniapp 版本后再声明跨端支持。

## 变更记录

- 2026-07-31：创建任务，状态置为 `in_progress`。
- 2026-07-31：实现 React/Vue `SectionTitle` 物料、接入默认模板和 React H5 示例，并完成验证，状态置为 `verified`。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，33 个测试全部通过。
- `pnpm smoke:browser`：通过，已覆盖 Vue3 编辑器物料入口、默认模板、编辑器内置 runtime 和 React H5 runtime 的区块标题渲染。

## 实现摘要

- React H5 物料包新增 `SectionTitle`，支持角标、标题、说明、对齐、颜色和留白配置。
- Vue H5 物料包新增同名同 manifest 的 `SectionTitle`。
- 默认大促模板和 React H5 runtime 示例新增“今日主推 / 先领券，再逛精选好物”区块标题。
- Browser smoke check 增加区块标题物料和 runtime 文案断言。
