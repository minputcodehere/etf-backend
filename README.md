# ETF Backend API Service

## 📊 項目概述

ETF 股票數據後端 API 服務 - 專為台股 ETF 即時數據提供的高性能 RESTful API，整合 Yahoo Finance 數據源，提供緩存機制和可靠的股票數據服務。

## 🚀 核心功能

### 數據源整合
- **Yahoo Finance API**：即時股票數據獲取
- **支援 ETF**：0056.TW, 00878.TW, 00919.TW, 0050.TW, 006208.TW
- **多時間範圍**：3天、1週、1月、3月、6月、1年歷史數據

### 主要特性
- **⚡ 高性能緩存**：30秒 TTL 緩存機制，減少 API 調用
- **🚀 快速啟動**：應用啟動時預熱緩存
- **🔄 自動重試**：錯誤處理和重試機制
- **📊 RESTful API**：標準化 REST 端點設計
- **🛡️ CORS 支援**：跨域請求處理

## 🏗️ 技術架構

### 核心技術棧
- **Node.js** - 服務器運行環境
- **Express.js** - Web 應用框架
- **node-cache** - 內存緩存系統
- **Axios** - HTTP 請求客戶端
- **dotenv** - 環境變量管理
- **cors** - 跨域資源共享

### 項目結構
```
src/
├── app.js              # Express 應用配置
├── server.js           # 服務器啟動入口
├── routes/             # API 路由
│   └── stockRoutes.js  # 股票數據路由
└── services/           # 業務邏輯服務
    └── stockService.js # 股票數據服務
```

## 🛠️ 安裝與運行

### 環境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安裝步驟
```bash
# 克隆項目
git clone git@github.com:minputcodehere/etf-backend.git
cd etf-backend

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

### 可用腳本
```bash
npm start       # 啟動生產服務器
npm run dev     # 啟動開發服務器 (with nodemon)
```

## 🔗 API 端點

### 健康檢查
```http
GET /api/health
```
**響應範例：**
```json
{
  "status": "OK",
  "timestamp": "2025-08-09T12:00:00.000Z",
  "uptime": 3600
}
```

### 獲取股票數據
```http
GET /api/stock/{symbol}?range={period}
```

**參數說明：**
- `symbol`: 股票代號 (例: 0056.TW, 00878.TW, 00919.TW, 0050.TW, 006208.TW)
- `range`: 時間範圍 (3d, 1wk, 1mo, 3mo, 6mo, 1y)

**響應範例：**
```json
{
  "symbol": "0056.TW",
  "meta": {
    "currency": "TWD",
    "symbol": "0056.TW",
    "exchangeName": "TAI",
    "instrumentType": "ETF",
    "firstTradeDate": 1167609600,
    "regularMarketTime": 1723190400,
    "gmtoffset": 28800,
    "timezone": "CST",
    "exchangeTimezoneName": "Asia/Taipei"
  },
  "timestamp": [1723104000, 1723190400, ...],
  "indicators": {
    "quote": [{
      "volume": [2843924, 3456789, ...],
      "open": [37.45, 37.52, ...],
      "high": [37.65, 37.78, ...],
      "low": [37.32, 37.41, ...],
      "close": [37.58, 37.69, ...]
    }]
  }
}
```

### 獲取支援的股票列表
```http
GET /api/supported-symbols
```

**響應範例：**
```json
{
  "symbols": ["0056.TW", "00878.TW", "00919.TW", "0050.TW", "006208.TW"]
}
```

## ⚙️ 環境配置

### 環境變數
創建 `.env` 文件：
```env
PORT=3001
NODE_ENV=development
```

### 預設配置
- **服務埠號**: 3001
- **緩存 TTL**: 30秒
- **支援的股票**: 台股 ETF (0056, 00878, 00919, 0050, 006208)

## 🔧 緩存機制

### 緩存策略
- **內存緩存**: 使用 node-cache 進行高速內存緩存
- **TTL 設置**: 30秒過期時間，平衡數據新鮮度和性能
- **緩存鍵**: `{symbol}_{range}` 格式
- **預熱機制**: 應用啟動時預先載入 1年數據

### 緩存流程
```
請求 → 檢查緩存 → 緩存命中？ → 返回數據
                    ↓ 否
              調用 Yahoo API → 存入緩存 → 返回數據
```

## 📦 主要依賴

| 依賴包 | 版本 | 用途 |
|--------|------|------|
| express | ^4.18.2 | Web 框架 |
| axios | ^1.6.0 | HTTP 客戶端 |
| node-cache | ^5.1.2 | 內存緩存 |
| cors | ^2.8.5 | 跨域處理 |
| dotenv | ^17.2.1 | 環境變數 |
| nodemon | ^3.0.2 | 開發熱重載 |

## 🚀 部署

### Docker 部署 (可選)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 部署
```bash
npm install -g pm2
pm2 start src/server.js --name etf-backend
```

## 🔍 監控與日誌

### 健康檢查端點
- 端點: `/api/health`
- 用途: 監控服務狀態、運行時間

### 日誌輸出
- 服務啟動日誌
- API 請求錯誤日誌
- 緩存操作日誌

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request。在提交代碼前，請確保：
- 遵循 Node.js 最佳實踐
- 添加適當的錯誤處理
- 更新相關文檔

## 📄 授權

MIT License

---

## 🔗 相關項目

- **前端項目**: [ETF Frontend Dashboard](https://github.com/minputcodehere/etf-frontend)
- **數據源**: Yahoo Finance API