# TASK-2026-0731-015-advanced-commerce-materials 验证报告

## 验证时间

2026-07-31

## 变更范围

- React H5 物料包新增 `CountdownTimer`、`NavGrid`、`FlashSaleList`。
- Vue H5 物料包新增同名物料，并保持 manifest 对齐。
- 大促活动页模板新增倒计时、导航宫格和秒杀商品组。
- React H5 runtime 示例新增高阶物料展示。
- 编辑器商品快捷操作支持 `FlashSaleList`。
- 更新物料包 README、项目状态、TODO 和任务记录。

## 验证命令和结果

```bash
pnpm test
```

结果：通过，3 个 suite、14 个用例全部通过。

```bash
pnpm typecheck
```

结果：通过。

```bash
pnpm build
```

结果：通过。

```bash
node --input-type=module - <<'NODE'
import { h5Materials } from './packages/materials-h5/dist/index.js';
import { h5VueMaterials } from './packages/materials-vue-h5/dist/index.js';
import { validateLowcodeMaterialManifest, validateLowcodePageSchema } from './packages/schema/dist/index.js';
import { pageTemplates } from './apps/editor-playground/src/pageTemplates.ts';

const required = ['CountdownTimer', 'NavGrid', 'FlashSaleList'];
for (const name of required) {
  if (!h5Materials.some((material) => material.manifest.componentName === name)) throw new Error(`React material missing: ${name}`);
  if (!h5VueMaterials.some((material) => material.manifest.componentName === name)) throw new Error(`Vue material missing: ${name}`);
}
for (const material of [...h5Materials, ...h5VueMaterials]) {
  const result = validateLowcodeMaterialManifest(material.manifest);
  if (!result.valid) throw new Error(`${material.manifest.componentName}: ${result.errors.join('; ')}`);
}
for (const template of pageTemplates) {
  const result = validateLowcodePageSchema(template.schema);
  if (!result.valid) throw new Error(`${template.id}: ${result.errors.join('; ')}`);
}
NODE
```

结果：通过，3 个新增高阶物料在 React/Vue manifest 中均存在，3 个页面模板 schema 均合法。

```bash
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

结果：均返回 `HTTP/1.1 200 OK`。

## 覆盖内容

- React/Vue 双 runtime 的高阶物料 manifest 对齐。
- `FlashSaleList` 商品数据和 `onProductClick` 事件声明。
- 大促模板可直接展示新增高阶物料。
- React H5 runtime 默认示例可消费新增高阶物料。

## 未覆盖和风险

- 倒计时当前为静态展示，未实现实时递减。
- 导航宫格当前只支持事件或链接，真实楼层锚点滚动需要宿主 action handler。
- 秒杀商品数据仍来自 mock data source，真实库存、价格和活动状态需要 Java 配置平台或业务接口。

## 结论

高阶活动物料已补齐到 React/Vue H5 物料包，并接入编辑器模板和 React H5 runtime 示例，运营搭建活动页的基础物料完整度进一步提升。
