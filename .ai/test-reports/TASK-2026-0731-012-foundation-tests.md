# TASK-2026-0731-012-foundation-tests 验证报告

## 验证时间

2026-07-31

## 变更范围

- 根目录新增 `pnpm test` 脚本。
- 新增 `packages/schema/test/schema.test.mjs`。
- 新增 `packages/core/test/core.test.mjs`。
- 新增 `packages/adapters/test/adapters.test.mjs`。
- 更新 README、项目状态、TODO 和任务记录。

## 验证命令和结果

```bash
pnpm test
```

结果：通过。

- `@meumall/lowcode-schema`：3 个用例通过。
- `@meumall/lowcode-core`：4 个用例通过。
- `@meumall/lowcode-adapters`：4 个用例通过。
- 合计：3 个 suite、11 个用例全部通过。

```bash
pnpm typecheck
```

结果：通过。

```bash
pnpm build
```

结果：通过。

## 覆盖内容

- Page Schema 创建、嵌套节点校验、重复节点 id、缺失 action 引用、Material Manifest 和 schema major 兼容判断。
- Material Registry、节点遍历、节点查找、dataBinding 合并、visibility 判断和 runtime action executor。
- Data Source Registry、Safe Action Registry、schema URL safe 编解码和无效 payload 拒绝。

## 未覆盖和风险

- 尚未覆盖 Vue/React 组件 DOM 渲染。
- 尚未覆盖浏览器交互和 visual regression。
- 当前测试通过构建后的 `dist` 执行，适合模拟 npm 消费，但运行前依赖 `pnpm build`。

## 结论

基础单元测试体系已建立，可作为后续 schema/core/adapters 回归门禁。
