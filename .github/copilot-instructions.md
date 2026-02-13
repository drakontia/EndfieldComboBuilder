# Endfield Combo Builder — Copilot Coding Agent Instructions

## このドキュメントについて

- この文書は GitHub Copilot Coding Agent が本リポジトリで安全かつ正確に開発タスクを実施するための実務ガイドです。
- 現行コードベース（Next.js 16 / TypeScript / Tailwind v4 / next-intl / Zustand）に沿った運用ルールを補足しています。
- 新しい機能を実装する際はここで示す技術選定・設計方針・モジュール構成を前提にしてください。
- 不確かな点がある場合は、リポジトリのファイルを探索し、ユーザーに「こういうことですか?」と確認をするようにしてください。

## 前提条件

- 回答は必ず日本語でしてください。
- コードの変更をする際、変更量が200行を超える可能性が高い場合は、事前に「この指示では変更量が200行を超える可能性がありますが、実行しますか?」とユーザーに確認をとるようにしてください。
- 何か大きい変更を加える場合、まず何をするのか計画を立てた上で、ユーザーに「このような計画で進めようと思います。」と提案してください。この時、ユーザーから計画の修正を求められた場合は計画を修正して、再提案をしてください。

## 目的 / スコープ
- ゲーム「アークナイツ：エンドフィールド」のコンボビルダー Web アプリの機能追加・改善・バグ修正。
- チーム編成とコンボのタイムラインを視覚的に構築できるUI/UXを提供する。
- 仕様への準拠、型安全、UI/UX一貫性、多言語対応の維持。
- 変更は最小限で、既存挙動・公開 API を壊さない。

## 技術スタックと前提
- Framework: Next.js 16.x（App Router, Turbopack）
- Language: TypeScript 5.9.x
- Styling: Tailwind CSS 4.1.x
- UI Components: shadcn/ui + lucide-react (icons)
- i18n: next-intl（ja/en、localePrefix: 'never'）
- State Management: Zustand
- Tests: Vitest（ユニット + カバレッジ）、Playwright（E2E）
- Package manager: pnpm
- Analytics: Vercel Web Analytics
- **リンター/フォーマッター**: ESLint + Prettier
- **型チェック**: TypeScript strict mode

## アーキテクチャ指針

### コンポーネント設計

- **Atomic Design の部分的採用**: `/components/ui` に基本コンポーネント、`/components` 内に機能特化コンポーネント
- **Composition Pattern**: 小さなコンポーネントを組み合わせて複雑な UI を構築
- **Container/Presentational Pattern**: ロジックと表示を分離（Zustand stores でロジックを抽出）

### 状態管理の方針

- **グローバル状態**: Zustand で管理（コンボ情報など）
- **ローカル状態**: `useState` で管理（UI状態など）

## ディレクトリ・ファイル命名規則

### コンポーネント

- **ファイル名**: PascalCase (例: `CharacterSelector.tsx`, `ComboTimeline.tsx`)
- **ディレクトリ**: ケバブケース (例: `character-selector/`, `combo-timeline/`)

### Store

- **ファイル名**: camelCase + `Store` サフィックス (例: `comboStore.ts`)
- **場所**: `/stores` ディレクトリ

### フック

- **ファイル名**: camelCase + `use` プレフィックス (例: `useCombo.ts`)

### ユーティリティ

- **ファイル名**: camelCase (例: `storage.ts`, `export.ts`)

## コーディング規約

### TypeScript

- **厳格な型付け**: `any` の使用を避ける
- **インターフェース**: 型定義は `/types` ディレクトリに集約
- **null 安全性**: Optional chaining と Nullish coalescing を活用

### React

- **関数コンポーネント**: アロー関数で定義
- **Hooks**: カスタムフックは `/hooks` に配置
- **Props**: インターフェースで明示的に型定義

### Zustand

- **Store 定義**: `/stores` ディレクトリに配置
- **命名**: `use[Entity]Store` の形式
- **構造**: state と actions を明確に分離

### スタイリング

- **Tailwind優先**: インラインスタイルは最小限に
- **レスポンシブ**: モバイルファースト
- **ダークモード**: 将来的な対応を考慮

## テスト指針

### ユニットテスト（Vitest）

- **配置**: `/tests/unit`
- **カバレッジ**: 重要なロジックは必ずテスト
- **実行**: `pnpm test` or `pnpm test:coverage`

### E2Eテスト（Playwright）

- **配置**: `/tests/e2e`
- **実行**: `pnpm test:e2e`
- **対象**: ユーザーフロー全体

## CI/CD

- **Unit Tests**: PRごとに自動実行（カバレッジ付き）
- **E2E Tests**: PRごとに自動実行
- **ワークフロー**: `.github/workflows/`

## 多言語対応

- **対応言語**: 日本語（ja）、英語（en）
- **ファイル**: `/messages/{locale}.json`
- **使用**: `useTranslations()` hook
- **URL**: localePrefix なし（/ja や /en のプレフィックスなし）

## コミット規約

- feat: 新機能
- fix: バグ修正
- refactor: リファクタリング
- test: テスト追加・修正
- docs: ドキュメント
- style: コードスタイル
- chore: その他

## 注意事項

- pnpm を使用（npm/yarn ではない）
- Zustand で状態管理（useContext/Redux ではない）
- shadcn/ui コンポーネントを活用
- lucide-react でアイコン統一
- localePrefix は 'never' に設定済み
