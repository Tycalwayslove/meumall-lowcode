# TASK-2026-0731-022-editor-release-diff-rollback 验证报告

## 验证时间

2026-07-31

## 变更范围

- Vue3 编辑器 playground 本地版本列表新增“对比”选择。
- 对比面板展示当前草稿与选中版本的摘要差异：标题、状态、环境、页面版本、节点数、数据源数、动作数。
- 对比面板支持载入所选版本继续编辑。
- 对比面板支持将所选版本作为新的 published release 回滚发布。
- 回滚发布后刷新本地版本列表，更新 active published mock，并把编辑器载入到新的 published release。
- `releases` 改为 `shallowRef`，避免 Vue 深层响应式推导完整 schema 导致类型检查过深。
- 更新项目状态、TODO 和任务记录。

## 验证命令和结果

```bash
pnpm typecheck
```

结果：通过。

```bash
pnpm build
```

结果：通过。

```bash
pnpm test
```

结果：通过。

- `@meumall/lowcode-adapters`：12 个用例通过。
- `@meumall/lowcode-core`：4 个用例通过。
- `@meumall/lowcode-schema`：3 个用例通过。
- 合计：3 个 suite、19 个用例全部通过。

```bash
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

结果：均返回 `HTTP/1.1 200 OK`。

## 覆盖内容

- 本地版本选择和高亮。
- 当前草稿与选中版本的摘要级差异展示。
- 载入选中版本。
- 基于选中版本创建新的 published release。
- 回滚后刷新本地版本列表和 active published mock。
- 基础类型、构建、单元测试和入口可访问性。

## 未覆盖和风险

- 尚未实现 JSON 逐字段 diff。
- 当前回滚是 localStorage mock，真实回滚必须由 Java 配置平台执行，并包含审批、审计和缓存失效。
- 未执行浏览器自动点击用例。

## 结论

Vue3 编辑器 playground 已具备本地版本对比和回滚发布闭环，运营可以在回滚前看到摘要差异，并将历史版本重新发布为新的 active published schema。
