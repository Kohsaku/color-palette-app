# Random-Color-Palette-App

カラーパレットをランダム作成できるアプリケーションです。
適当に色合いを探すのに使用できます。

This app generates randomly color palette in this app.
Find color combination and appropriate color.

# DEMO

準備中

coming soon

# Features

カラーパレットを作成し、保存できます。（保存にはログインが必要）
また、カラー生成は hsl 形式となっており、彩度や明度はコード上で調整できます。

This app generates color palette. Also, you can save the palette if like it.
(You need to login to save the palette.)
You can choose saturation and brightness in code.

# Requirement

*React
*Typescript
*React Router v6.2.1
*Node.js v16.13.2
*firebase v9.21
-authentication
-firestore
-firestorage
*Redux Toolkit v1.7.2
\*Material ui
-meterial v5.4
-styles v5.4

# Usage

```bash
git clone https://github.com/Kohsaku/color-palette-app.git
cd color-palette-app
npm start
```

# Note

src/firebase.ts の firebaseConfig には各自で生成した API キーを入力してください。
