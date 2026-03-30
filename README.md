# koishi-plugin-adapter-qq-crack

[![npm](https://img.shields.io/npm/v/koishi-plugin-adapter-qq-crack?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-adapter-qq-crack)

主要更改：

- 仅使用 AccessToken 鉴权，不再保留旧固定 Token 模式
- 支持 qq:json、qq:markdown、qq:rawmarkdown、qq:rawmarkdown-without-keyboard
- 兼容 h('markdown', ...) 直接走 QQ 原生 Markdown
- 支持 private:${userId} 私聊频道 ID 方案
- 支持将 WebSocket 消息中的用户名写回 Koishi 数据库并回填到 session.username
- 心跳僵死时会立即重连，尽量缩短断开时间
- 支持文件上传，富媒体文件类型选择type=4
- 支持私聊引用消息
