# EndfieldComboBuilder

ゲーム「アークナイツ：エンドフィールド」でのチームでのコンボを視覚的に構築するツールです

## 機能

### 基本機能
- **チーム編成**: 最大4人のオペレーターを選択
- **コンボタイムライン**: 各オペレーターの4種類のアクション（通常攻撃、戦技、連携技、必殺技）をタイムライン上に配置
- **コンボ管理**: 
  - コンボの保存（ローカルストレージ）
  - コンボの読み込み
  - コンボのクリア
- **エクスポート機能**:
  - 画像エクスポート
  - URL共有

### 技術スタック
- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **テスト**: 
  - Vitest (ユニットテスト)
  - Playwright (E2Eテスト)
- **デプロイ**: Vercel対応

## セットアップ

### 前提条件
- Node.js 18以上

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスします。

### ビルド

```bash
npm run build
```

### テスト

```bash
# ユニットテストの実行
npm test

# E2Eテストの実行
npm run test:e2e
```

## 使い方

1. **チーム編成**: 左側のパネルで4つのスロットにオペレーターを選択します
2. **アクション追加**: タイムライン上の各アクションレーンをクリックしてアクションを追加します
3. **アクション削除**: 追加したアクションをクリックして削除します
4. **コンボ保存**: コンボ名を入力して「保存」ボタンをクリックします
5. **コンボ読込**: 「読込」ボタンをクリックして保存したコンボを選択します
6. **画像エクスポート**: 「画像エクスポート」ボタンでタイムラインを画像として保存します
7. **共有**: 「共有」ボタンでURLをクリップボードにコピーします

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── CharacterSelector.tsx
│   ├── ComboTimeline.tsx
│   ├── ControlPanel.tsx
│   └── LoadDialog.tsx
├── types/                 # TypeScript型定義
│   └── combo.ts
├── lib/                   # ユーティリティ関数
│   ├── storage.ts         # ローカルストレージ操作
│   └── export.ts          # 画像エクスポート
├── __tests__/            # ユニットテスト
└── e2e/                  # E2Eテスト
```

## 参考リンク

- [公式サイト](https://endfield.gryphline.com/ja-jp#home)
- [オペレーター一覧](https://game8.jp/arknights-endfield/681604)

## ライセンス

ISC

