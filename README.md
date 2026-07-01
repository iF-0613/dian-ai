# 店宣 AI

店宣 AI 是一款面向本地小商家的 AI 营销助手，帮助门店用一句话生成完整营销素材，包括宣传海报、宣传网页、朋友圈文案、小红书文案、视频脚本和营销诊断。

## 产品定位

**AI 本地商家营销助手**

适合养生馆、美容院、按摩馆、沙疗馆、足疗馆、餐饮店、健身房、理发店、美甲店等本地门店，用于新店开业、活动促销、团购引流、会员充值、老客户召回等营销场景。

## 核心功能

- AI 营销顾问：通过对话收集需求，生成营销诊断和方案。
- DeepSeek 文本 AI：用于营销分析、文案生成、聊天修改和图片 Prompt 生成。
- 通义万相图片生成：用于生成宣传海报背景和宣传图片。
- 宣传海报：支持 AI 图片背景、标题、价格、联系方式、二维码和预约引导。
- 宣传网页：生成本地商家宣传落地页预览。
- 营销文案：生成朋友圈、小红书和视频脚本内容。
- 成果中心：集中管理海报、网页、文案、Logo 和视频脚本。
- 一键导出：导出营销素材包。
- 模拟模式：未配置图片或文本 Key 时，保留本地模板预览和模拟体验。

## 技术栈

- 前端：React + Vite + Tailwind CSS
- UI 图标：lucide-react
- 导出：html-to-image + JSZip
- 后端：Node.js + Express
- 文本 AI：DeepSeek，兼容 OpenAI Provider
- 图片 AI：阿里云百炼 / 通义万相
- 数据保存：LocalStorage

## 本地运行

安装依赖：

```bash
npm install
```

复制环境变量示例：

```bash
copy .env.example .env
```

启动前后端：

```bash
npm run dev:all
```

也可以分开启动：

```bash
npm run server
npm run dev
```

访问地址：

```text
http://127.0.0.1:5173/
```

后端健康检查：

```text
http://127.0.0.1:3001/api/health
```

## 常用命令

```bash
npm run dev
npm run server
npm run dev:all
npm run build
npm run preview
```

生产后端启动命令：

```bash
npm start
```

## 当前版本状态

当前版本已经具备真实网站部署基础：

- 前端支持通过 `VITE_API_BASE_URL` 指向线上后端。
- 后端 API Key 只从服务器环境变量读取，不暴露到前端。
- 后端支持通过 `FRONTEND_ORIGIN` / `CORS_ORIGINS` 配置线上前端跨域。
- DeepSeek 文本 AI 和通义万相图片生成接口已接入。
- 未配置 Key 时自动回退到 Mock / 本地模板模式。

详细部署步骤见 [DEPLOY.md](./DEPLOY.md)。
