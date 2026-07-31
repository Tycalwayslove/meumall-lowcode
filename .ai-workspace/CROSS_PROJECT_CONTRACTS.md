# 跨包和跨系统契约治理

## 目的

低代码平台的核心资产是契约。schema、material manifest、renderer API、editor protocol、Java 配置平台 API 和 H5 接入方式都必须可追踪。

## 契约类型

- Page Schema 契约。
- Material Manifest 契约。
- DataSource 和 Action 契约。
- Java 配置平台 API 契约。
- H5 接入契约。
- 未来小程序 renderer/materials 契约。
- npm 包公开 API 契约。

## 契约存放

根级契约入口：

```text
.ai-workspace/contracts/
```

稳定架构说明也可以写入：

```text
docs/
```

但任务文件必须引用最终事实源路径。

## 契约模板

每份契约至少包含：

```text
契约名称
提供方
消费方
适用环境
版本策略
输入格式
输出格式
错误格式
兼容性要求
测试方式
变更流程
回滚方式
```

## 变更流程

1. 在工作项中声明契约影响。
2. 创建或更新契约文档。
3. 标明是否向后兼容。
4. 更新受影响包的类型、README 和测试。
5. 记录外部系统确认状态。
6. 运行验证命令。
7. 在任务文件记录验证结果。

## 兼容性规则

- 新增可选字段通常向后兼容。
- 删除字段、改字段类型、改默认语义通常不兼容。
- 改 renderer 行为可能影响已发布页面，必须评估回滚。
- schema major 变更必须提供迁移策略。
- material manifest 变更必须说明旧页面是否仍可渲染。

