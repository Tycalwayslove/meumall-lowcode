# 发布治理

## 目标

发布流程必须可验证、可回滚、可追踪。AI 不能只完成代码，还必须说明 npm、GitHub、schema、H5 接入和外部平台影响。

## 发布对象

- npm packages。
- GitHub repository、tag 和 release。
- schema major/minor/patch。
- H5 renderer/materials 接入版本。
- Java 配置平台 schema/API 对接说明。

## 发布影响声明

每个工作项必须写明：

- 是否需要 npm 发布。
- 发布哪些包。
- 是否影响 schema 兼容性。
- 是否影响 H5 接入。
- 是否影响 Java 配置平台。
- 是否需要 GitHub tag 或 release。
- 回滚目标是什么。
- smoke check 怎么做。

## 版本规则

- `patch`：bug 修复，不改变 schema 或公开 API 语义。
- `minor`：新增向后兼容能力。
- `major`：删除字段、修改字段类型、破坏旧页面或公开 API。

## npm 发布规则

发布前必须：

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm build`
4. `npm pack --dry-run` 或等价 dry-run 检查
5. Changesets 记录版本变化
6. 确认 registry、access 和 npm token

## GitHub 留存规则

- `main` 保护分支。
- PR 必须通过类型检查和构建。
- 发布提交必须可追踪到 changeset。
- npm 发布后创建 tag 或 GitHub release。
- 不把 `node_modules`、`dist`、构建缓存和本地密钥提交到仓库。

## 回滚规则

回滚必须明确：

- 异常包或异常 schema 版本。
- 目标版本。
- H5 或 Java 配置平台是否需要降级。
- 回滚后 smoke check。
- 是否需要禁用已发布页面。

