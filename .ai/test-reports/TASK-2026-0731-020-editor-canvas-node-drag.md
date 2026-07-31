# TASK-2026-0731-020-editor-canvas-node-drag 验证报告

## 验证时间

2026-07-31

## 变更范围

- `@meumall/lowcode-renderer-vue-h5` 的 editable wrapper 新增可选 `nodeDraggable`、`onNodeDragStart` 和 `onNodeDragEnd`。
- Vue3 编辑器 playground 可区分新物料拖拽和已有节点拖拽。
- 已有节点拖到目标节点上半区时移动到目标节点前。
- 已有节点拖到目标节点下半区时移动到目标节点后。
- 已有节点拖到 `SectionContainer` 中间区域时移动到容器内部末尾。
- 已有节点拖到画布空白区域时移动到根节点末尾。
- 已规避拖到自己或自己后代时显示无效提示或破坏 schema。
- 更新 renderer README、项目状态、TODO 和任务记录。

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

```bash
node -e "import('playwright').then(()=>console.log('playwright available')).catch(()=>{console.error('playwright missing'); process.exit(1)})"
```

结果：未通过，当前仓库未安装 Playwright。

## 覆盖内容

- Vue renderer 可选拖拽回调类型和构建。
- editor playground 对 material/node 两类拖拽来源的区分。
- 已有节点 before/after/inside/append 四种移动语义。
- 同父级移动时的 index 修正。
- 自身和自身后代投放的防护。
- 基础类型、构建、单元测试和入口可访问性。

## 未覆盖和风险

- 未执行浏览器自动化拖拽用例，因为当前仓库没有 Playwright。
- 当前使用浏览器 HTML5 drag，移动端管理台体验仍需 Pointer Events 或拖拽库。
- 多选拖拽、吸附线和跨页面拖拽未实现。

## 结论

Vue3 编辑器 playground 已支持画布中已有节点直接拖拽移动，搭建页面时不再只能依赖结构面板或上下文按钮调整楼层位置。
