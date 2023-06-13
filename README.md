<!-- 底下標籤來源參考寫法可至：https://github.com/Envoy-VC/awesome-badges#github-stats -->

![](https://img.shields.io/github/stars/kimnTai/prometheus.svg)｜![](https://img.shields.io/github/forks/kimnTai/prometheus.svg)｜![](https://img.shields.io/github/issues-pr/kimnTai/prometheus.svg)｜![](https://img.shields.io/github/issues/kimnTai/prometheus.svg)

## 功能

- Lunar 專案管理工具 Server

## 畫面

![](https://hackmd.io/_uploads/SyIIokIw2.png)

## 安裝

Node.js 版本建議為：`18.16.0` 以上

### 取得專案

```bash
git clone https://github.com/kimnTai/prometheus.git
```

### 移動到專案內

```bash
cd prometheus
```

### 安裝套件

```bash
yarn
```

### 環境變數設定

請在終端機輸入 `cp .env.example .env` 來複製 .env.example 檔案，並依據 `.env` 內容調整相關欄位。

### 運行專案

```bash
yarn dev
```

### 開啟專案

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:3005/
```

## 環境變數說明

```env
PORT = 3005

DATABASE =  DB連結
DATABASE_PASSWORD = DB密碼

JWT_EXPIRES_DAY = token 到期日
JWT_SECRET = Token密鑰

IMGUR_REFRESH_TOKEN = imgur token
IMGUR_ALBUM_ID = imgur 相簿 id

GOOGLE_CLIENT_ID = gcp id
GOOGLE_CLIENT_SECRET = gcp 密鑰
GOOGLE_LOGIN_CALL_BACK_URL = google 登入回傳連結

GITHUB_CLIENT_ID =
GITHUB_CLIENT_SECRET =
GITHUB_LOGIN_CALL_BACK_URL =

MAILER_ACCOUNT = 寄信帳號
MAILER_PASSWORD = 寄信密碼

CLIENT_URL = 前端連結
```

## Swagger

產生文件

```bash
npm run swagger-autogen
```

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:3005/swagger
```

## 資料夾說明

## 專案技術

- node.js v18.16.0
- vite v4.3.9
- express v4.18.2
- mongoose v7.0.4
- jsonwebtoken v9.0.0
- nodemailer v6.9.3
- ws v8.13.0
- redis v4.6.7

# Docker

```bash
docker build -t prometheus:v1 .
docker run -p 3005:3005 -d prometheus:v1
```
