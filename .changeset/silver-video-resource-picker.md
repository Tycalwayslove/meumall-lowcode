---
"@meumall/lowcode-schema": minor
"@meumall/lowcode-adapters": minor
"@meumall/lowcode-editor": minor
"@meumall/lowcode-materials-h5": minor
"@meumall/lowcode-materials-vue-h5": minor
---

新增 `video` 物料属性 setter、视频素材 Resource Library Client 能力和 Vue3 编辑器视频素材选择体验。

`BasicVideo.videoUrl` 现在通过 `video` setter 标记，编辑器可从视频素材库选择视频并同步写回 `videoUrl` 与 `posterUrl`；旧页面 schema 不变，renderer 仍只消费普通 props。
