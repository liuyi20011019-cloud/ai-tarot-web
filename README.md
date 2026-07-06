# AI Tarot Reading

一个基于 React + TypeScript + Vite 的 AI 塔罗牌抽牌解牌 Web 应用。当前版本保留本地 78 张韦特牌库、牌阵推荐、抽牌动画、规则式解读、本地 RAG 知识库、案例库和浏览器 localStorage 历史记录。

## 本地运行

```bash
npm install
npm run dev
```

## 本地构建

```bash
npm run build
npm run preview
```

## 部署到 Vercel

1. 将项目上传到 GitHub。
2. 登录 [vercel.com](https://vercel.com)。
3. 点击 New Project。
4. Import GitHub Repository。
5. Framework Preset 选择 Vite。
6. Build Command 填写 `npm run build`。
7. Output Directory 填写 `dist`。
8. 点击 Deploy。

部署成功后，网站会生成类似：

```text
https://your-project.vercel.app
```

## 环境变量

复制 `.env.example` 为 `.env.local` 后可按需调整：

```bash
VITE_APP_NAME=AI Tarot
VITE_ENABLE_LOCAL_RAG=true
VITE_ENABLE_HISTORY=true
```

前端不能直接暴露 OpenAI API Key。未来接入真实 AI API 时，应通过 Vercel Serverless Function 或独立后端代理调用模型服务，再由前端请求自己的后端接口。

## 历史记录说明

历史记录使用浏览器 `localStorage` 保存。部署到公网后，每个用户的数据都会独立保存在自己的浏览器中，不依赖本机路径，也不依赖 localhost。隐私模式、存储禁用或容量限制可能导致历史记录无法写入，应用会自动降级而不崩溃。

## 路由刷新

项目包含 `vercel.json`，所有路径都会 fallback 到 `index.html`。因此未来即使加入前端路由，直接访问或刷新 `/history` 等路径也不会在 Vercel 上返回 404。
