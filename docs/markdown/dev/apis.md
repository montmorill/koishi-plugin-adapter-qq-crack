# 通用 API

本页只介绍部分调用方式。

## `markdown`

`markdown` 在本适配器里默认等价于 `qq:rawmarkdown-without-keyboard`。

### 最简单写法

```ts
await session.send(h('markdown', '# 你好\n## 这是 Markdown'))
```

### 对象写法

```ts
await session.send(h('markdown', {
  content: '# 你好\n## 这是 Markdown',
}))
```

### 流式首包写法

```ts
await session.send(h('markdown', {
  content: '# 你好\n## 这是 Markdown',
  stream: true,
}))
```

这里的 `stream: true` 是适配器内部快捷写法，表示自动附加：

```ts
stream: {
  state: 1,
  reset: false,
}
```

注意：

- 这里只会自动进入流式状态
- 不会自动发送 `state = 10`

## `qq:rawmarkdown-without-keyboard`

这个元素和 `markdown` 的行为一致，只是名字更显式。

```ts
await session.send(h('qq:rawmarkdown-without-keyboard', '# 你好\n这是原生 Markdown'))
```

也支持对象写法：

```ts
await session.send(h('qq:rawmarkdown-without-keyboard', {
  content: '# 你好\n这是原生 Markdown',
  stream: true,
}))
```

## `qq:rawmarkdown`

用于发送原生 Markdown，同时允许你自己带上 `keyboard`。

```ts
await session.send(h('qq:rawmarkdown', {
  markdown: {
    content: '# 标题\n这是正文',
  },
  keyboard: {
    content: {
      rows: [
        {
          buttons: [
            {
              render_data: {
                label: '再来一次',
                style: 1,
              },
              action: {
                type: 2,
                permission: { type: 2 },
                data: '重新执行',
                enter: true,
              },
            },
          ],
        },
      ],
    },
  },
}))
```

如果你只是想传文本内容，也可以写成：

```ts
await session.send(h('qq:rawmarkdown', {
  content: '# 标题\n这是正文',
  stream: true,
}))
```

## `qq:markdown`

推荐用于“模板 Markdown”消息。
也就是你已经在 QQ 官方后台申请好了 Markdown 模板 ID。

### 模板写法

```ts
await session.send(h('qq:markdown', {
  markdown: {
    custom_template_id: '你的模板ID',
    params: [
      { key: 'text1', values: ['第一个参数'] },
      { key: 'text2', values: ['第二个参数'] },
    ],
  },
  keyboard: {
    id: '你的按钮模板ID',
  },
}))
```

### 兼容快捷写法

如果你直接传字符串或 `content`，当前适配器也会把它当成原生 Markdown 内容处理：

```ts
await session.send(h('qq:markdown', '# 你好\n## 这是 Markdown'))
```

```ts
await session.send(h('qq:markdown', {
  content: '# 你好\n## 这是 Markdown',
  stream: true,
}))
```

但如果你明确在发模板消息，还是建议使用完整对象写法。

## `qq:json`

这个元素主要用于发送 QQ 按钮模板 JSON。

### 直接传模板 ID

```ts
await session.send(h('qq:json', '123456789'))
```

### 对象写法

```ts
await session.send(h('qq:json', {
  keyboard: {
    id: '123456789',
  },
}))
```

也兼容：

```ts
await session.send(h('qq:json', {
  id: '123456789',
}))
```

## `stream` 的两种写法

当前推荐统一写成 `stream`。

### `stream: true`

这是适配器内部的布尔快捷开关：

```ts
await session.send(h('markdown', {
  content: '正在生成中',
  stream: true,
}))
```

作用：

- 自动附加 `state = 1`
- 方便快速进入流式状态

### `stream: { ... }`

这是 QQ 官方原始流式对象：

```ts
await session.send(h('markdown', {
  content: '完整消息',
  stream: {
    state: 10,
    id: streamId,
    index: 1,
    reset: true,
  },
}))
```

如果你自己显式传了对象形式的 `stream`，它的优先级更高。

## 自动纯文本流式

如果你在插件配置里打开：

```json
{
  "autoStreamText": true
}
```

那么纯文本消息会自动改成 QQ 原生 Markdown 流式首包发送。

生效条件大致是：

- 纯文本
- 没有附件
- 没有按钮
- 没有复杂富媒体元素

## 注意事项

### 1. 原生 Markdown 是 QQ 客户端自己的渲染

不同客户端对同一条 Markdown 的表现可能不同，尤其是：

- Windows QQ
- 手机 QQ

### 2. 蓝字按钮本质是 Markdown 链接

例如：

```md
[蓝字按钮](mqqapi://aio/inlinecmd?command=帮助&enter=false&reply=false)
```

### 3. 自动流式不会自动结束

如果你用了 `stream: true`，适配器只会帮你发首包。
结束流式这一步仍然需要你自己决定时机并显式发送 `state = 10`。
