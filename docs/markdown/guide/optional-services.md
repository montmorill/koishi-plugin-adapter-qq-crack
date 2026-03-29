# 依赖与可选服务

本页说明适配器在不同场景下会依赖哪些 Koishi 服务。

## silk / ffmpeg

这些服务主要与语音发送有关。

适配器在发送音频时会优先尝试：

1. `ntsilk`
2. `silk`
3. `ffmpeg`

`silk` 是 QQ 可接受的音频格式，需要上述服务参与转码。

### 建议

- 从 koishi 插件市场 安装 `ffmpeg-path` 插件

## database

## server

## logger

## http
