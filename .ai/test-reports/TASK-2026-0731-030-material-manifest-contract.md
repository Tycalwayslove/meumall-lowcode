# TASK-2026-0731-030-material-manifest-contract 验证报告

## 验证对象

- `Material Manifest v1` 契约文档。
- contracts 入口引用。
- schema 包 README 引用。
- React/Vue H5 物料 manifest 校验测试。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://127.0.0.1:5173/
curl -I http://127.0.0.1:5174/
```

## 结果

### `pnpm typecheck`

结果：通过。

覆盖：

- monorepo TypeScript project references。
- Vue3 编辑器 playground 类型检查。
- React H5 runtime playground 类型检查。

### `pnpm build`

结果：通过。

覆盖：

- packages TypeScript 构建。
- Vue3 编辑器 playground 生产构建。
- React H5 runtime playground 生产构建。

### `pnpm test`

结果：通过。

统计：

- suites：4
- tests：25
- pass：25
- fail：0

新增覆盖：

- React/Vue H5 当前所有 manifest 均通过 `validateLowcodeMaterialManifest` 校验。

### dev server smoke check

结果：通过。

- `http://127.0.0.1:5173/`：HTTP 200。
- `http://127.0.0.1:5174/`：HTTP 200。

## 人工检查

- `.ai-workspace/contracts/material-manifest-v1.md` 已覆盖提供方、消费方、适用环境、版本策略、输入格式、输出格式、错误格式、兼容性、编辑器/renderer/Java/H5 消费规则、测试方式、变更流程和回滚方式。
- `.ai-workspace/contracts/README.md` 已纳入 `material-manifest-v1.md`。
- `packages/schema/README.md` 已引用 `material-manifest-v1.md`。
- `packages/materials-h5/test/materials.test.mjs` 已加入全量 manifest 校验。

## 风险

- 当前契约文档按已有 TypeScript 类型和实现沉淀，Java 配置平台确认后可能需要补充更严格的服务端校验字段。
- 当前 Manifest 暂未提供复杂数组 item schema，编辑器仍使用通用列表项字段模板。

## 结论

本任务已通过自动化验证和 smoke check，Material Manifest v1 已从隐式 TypeScript 类型沉淀为可跨包、跨系统协作的正式契约。
