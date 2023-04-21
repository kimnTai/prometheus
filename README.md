<!-- 底下標籤來源參考寫法可至：https://github.com/Envoy-VC/awesome-badges#github-stats -->

![](https://img.shields.io/github/stars/kimnTai/prometheus.svg)｜![](https://img.shields.io/github/forks/kimnTai/prometheus.svg)｜![](https://img.shields.io/github/issues-pr/kimnTai/prometheus.svg)｜![](https://img.shields.io/github/issues/kimnTai/prometheus.svg)

# README Template

## 功能

## 畫面

## 安裝

Node.js 版本建議為：`16.15.0` 以上

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
http://localhost:5173/
```

## 環境變數說明

```env
PORT = 3005

DATABASE =  DB連結
DATABASE_PASSWORD = DB密碼
```

## 資料夾說明

## 專案技術

- Node.js v18.12.0
- Vite v4.3.1
- vite-plugin-node v3.0.2
- express v4.18.2
- mongoose v7.0.4
