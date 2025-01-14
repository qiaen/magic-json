# 基于Vite4 + Vue3

## 安装项目
执行：
```
npm install
```
或
```
yarn
```

## 使用方法：开发环境

执行：
```
npm run dev
```
或
```
yarn dev
```

## 使用方法：build项目

> ※注：
> 1. 执行build前一定检查是否取消mock.js，即确认src/api/index.js中，将import '@/mock'注释掉。这是因为mock.js使用window变量，而运行background script的Service Worker不支持window，将导致插件运行失败。
> 2. 执行build前一定检查src/popup/popup.vue代码中，注释掉import '@/content'。这段代码是用于方便在开发环境调试content script的，否则content script会被集成到popup页面中。

执行：
```
npm run build
```
或
```
yarn build
```

