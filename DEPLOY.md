# 店宣 AI 内测版部署说明

目标：用最低成本上线一个可测试版本。

部署方案：

- 前端：Netlify
- 后端：Render
- 暂不购买域名
- 暂不接数据库
- 暂不做登录、支付

## 1. 本地启动方法

安装依赖：

```bash
npm install
```

复制环境变量示例：

```bash
copy .env.example .env
```

本地启动后端：

```bash
npm run server
```

本地启动前端：

```bash
npm run dev
```

也可以一次启动前后端：

```bash
npm run dev:all
```

本地访问：

```text
前端：http://127.0.0.1:5173/
后端：http://127.0.0.1:3001
健康检查：http://127.0.0.1:3001/api/health
```

说明：

- 前端会优先读取 `VITE_API_BASE_URL`。
- 如果本地没有配置 `VITE_API_BASE_URL`，默认访问 `http://127.0.0.1:3001`。

## 2. Netlify 前端部署

在 Netlify 新建站点，连接项目仓库。

构建配置：

```text
Build command: npm run build
Publish directory: dist
```

前端环境变量：

```env
VITE_API_BASE_URL=https://你的 Render 后端域名
```

示例：

```env
VITE_API_BASE_URL=https://dianxuan-ai-api.onrender.com
```

注意：

- 前端只配置 `VITE_API_BASE_URL`。
- 不要在 Netlify 配置 `DEEPSEEK_API_KEY`、`DASHSCOPE_API_KEY`、`OPENAI_API_KEY`。
- 所有 AI Key 只放在 Render 后端环境变量里。

## 3. Render 后端部署

在 Render 新建 Web Service，连接同一个项目仓库。

配置：

```text
Environment: Node
Build command: npm install
Start command: npm run server
```

Render 后端环境变量：

```env
PORT=3001
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
MODEL_CHAT=deepseek-chat
MODEL_REASONER=deepseek-reasoner
IMAGE_PROVIDER=wanxiang
DASHSCOPE_API_KEY=
WANXIANG_BASE_URL=https://dashscope.aliyuncs.com/api/v1
WANXIANG_IMAGE_MODEL=wan2.6-image
IMAGE_SIZE=1024*1024
FRONTEND_ORIGIN=
CORS_ORIGINS=
```

部署完成后，把 Netlify 域名填入：

```env
FRONTEND_ORIGIN=https://你的 Netlify 前端域名
CORS_ORIGINS=https://你的 Netlify 前端域名,http://localhost:5173,http://127.0.0.1:5173
```

示例：

```env
FRONTEND_ORIGIN=https://dianxuan-ai.netlify.app
CORS_ORIGINS=https://dianxuan-ai.netlify.app,http://localhost:5173,http://127.0.0.1:5173
```

说明：

- Render 可能会自动注入端口，如果平台提示不要手动设置 `PORT`，可以删除 `PORT=3001`。
- 修改环境变量后，需要重新部署或重启 Render 服务。

## 4. 前端环境变量清单

Netlify 只需要：

```env
VITE_API_BASE_URL=
```

填写 Render 后端地址，例如：

```env
VITE_API_BASE_URL=https://dianxuan-ai-api.onrender.com
```

## 5. 后端环境变量清单

Render 需要：

```env
PORT=3001
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
MODEL_CHAT=deepseek-chat
MODEL_REASONER=deepseek-reasoner
IMAGE_PROVIDER=wanxiang
DASHSCOPE_API_KEY=
WANXIANG_BASE_URL=https://dashscope.aliyuncs.com/api/v1
WANXIANG_IMAGE_MODEL=wan2.6-image
IMAGE_SIZE=1024*1024
FRONTEND_ORIGIN=
CORS_ORIGINS=
```

其中：

- `DEEPSEEK_API_KEY`：DeepSeek 文本 AI Key。
- `DASHSCOPE_API_KEY`：阿里云百炼 / 通义万相图片生成 Key。
- `FRONTEND_ORIGIN`：Netlify 前端域名。
- `CORS_ORIGINS`：允许访问后端的前端域名列表。

## 6. 测试 /api/health

Render 部署完成后，在浏览器打开：

```text
https://你的 Render 后端域名/api/health
```

正常返回示例：

```json
{
  "ok": true,
  "provider": "deepseek",
  "mode": "online",
  "chatModel": "deepseek-chat",
  "imageProvider": "wanxiang",
  "imageMode": "wanxiang",
  "imageModel": "wan2.6-image"
}
```

## 7. 判断 DeepSeek 是否 online

查看 `/api/health`：

```json
"provider": "deepseek",
"mode": "online"
```

判断：

- `mode=online`：DeepSeek Key 已被后端识别。
- `mode=mock`：DeepSeek Key 未配置或未被后端读取。

如果不是 online，检查：

1. Render 是否配置了 `AI_PROVIDER=deepseek`。
2. Render 是否配置了 `DEEPSEEK_API_KEY`。
3. 修改环境变量后是否重新部署。

## 8. 判断通义万相图片生成是否可用

查看 `/api/health`：

```json
"imageProvider": "wanxiang",
"imageMode": "wanxiang",
"imageModel": "wan2.6-image"
```

判断：

- `imageMode=wanxiang`：检测到 `DASHSCOPE_API_KEY`，图片生成可用。
- `imageMode=mock`：没有检测到 `DASHSCOPE_API_KEY`，图片会使用本地模板预览。

也可以在前端工作区点击“重新生成图片”测试：

- 成功：海报背景替换为 AI 生成图片。
- 失败：显示“图片生成失败，已保留本地模板预览。”

## 9. 客户访问方式

内测阶段暂不购买域名，客户直接访问 Netlify 提供的默认域名：

```text
https://你的项目名.netlify.app
```

客户不需要访问 Render 后端地址。Render 地址只作为前端调用 API 使用。

## 10. 安全注意事项

- 不要把真实 `.env` 提交到 Git。
- 不要把任何 API Key 写进前端代码。
- 不要在 Netlify 配置 AI Key。
- 只把 AI Key 配置在 Render 后端环境变量中。
- `.env.example` 只保留变量名，不填写真实 Key。
