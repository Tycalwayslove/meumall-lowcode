---
"@meumall/lowcode-adapters": minor
---

新增 `createHttpActionHandler`，用于把白名单 `action.type` 接到宿主固定 HTTP endpoint，并补齐 `createSafeActionExecutor` 对异步 action 失败的 `onError` 回调闭环。

该能力让 H5 宿主可以在不把任意 URL 写入 Page Schema 的前提下，将点击埋点、领券、跳转桥、权限和风控等动作通过受控 handler 接入。
