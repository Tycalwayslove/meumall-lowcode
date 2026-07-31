# TASK-2026-0731-018-editor-resource-pickers 验证报告

## 验证时间

2026-07-31

## 变更范围

- Vue3 编辑器 playground 新增 mock 素材库数据，支持素材分类、搜索、缩略图展示和一键应用到选中图片字段。
- Vue3 编辑器 playground 新增 mock 商品选择器，支持商品搜索、勾选、多选数量展示和写入 `ProductList` / `FlashSaleList`。
- 商品静态写入时会移除当前节点的 `dataBinding.items`，避免静态商品被 data source 覆盖。
- 保留一键绑定 `products` 数据源能力，方便在静态商品和数据源商品之间切换。
- 更新右侧属性区样式，补充资源卡片、商品卡片、搜索框、提示和操作按钮。
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

- 选中图片类节点时出现素材库，并可按关键词/分类过滤。
- 选中商品类节点时出现商品选择器，并可多选商品。
- 应用商品会写入 `props.items` 并移除当前节点 `dataBinding.items`。
- 绑定数据源按钮仍可把商品类节点恢复为 `products` 数据源驱动。
- 编辑器和 H5 runtime 基础入口均可访问。

## 未覆盖和风险

- 未接入真实素材中心和商品中心。
- 未做浏览器自动点击用例；当前通过类型、构建、单元测试和入口 smoke check 覆盖基础回归。
- 静态商品适合小型活动页，大促长列表仍应优先使用 data source。

## 结论

Vue3 编辑器 playground 已具备更接近运营实操的 mock 素材库和商品选择器，图片与商品类物料可以通过可视化选择写回 schema。
