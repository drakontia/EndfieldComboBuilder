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

## 主要ドメイン仕様（要点）
- キャラクターのレアリティは、星4，星5、星6 の3種類。
- 属性は、物理、灼熱、寒冷、自然、電磁
- タイプは、前衛、突撃、先鋒、補助、術師、重装
- アーツ付着には4種類ある。灼熱、電磁、寒冷、自然。付着は最大4段階まで行える。
- 同じ付着を重ねると、アーツ爆発が発生する
- 他のアーツ付着状態の敵がさらに灼熱付着を受けた場合、燃焼状態になる。
- 他のアーツ付着状態の敵がさらに電磁付着を受けた場合、感電状態になる。
- 他のアーツ付着状態の敵がさらに寒冷付着を受けた場合、凍結状態になる。
- 他のアーツ付着状態の敵がさらに自然付着を受けた場合、腐食状態になる。
- アーツ異常の継続時間は、10秒間である。
- 敵が1回目の物理異常を受けたとき、効果は直ちに発動せず、まずクラッシュ状態になる。
  - クラッシュ状態は浮遊と転倒によって最大4段階まで増加し、猛撃と破砕によって消費される。
- バフ・デバフには、シールド、弱体化、籠、脆弱、スロー、増幅、リンクがある。
- SP(Skill Points)は、戦技を使用するのに必要なポイントである。時間経過で自動回復し、および捜査中のオペレーターの重攻撃でも一定量回復する。
  - SPの最大値は、300である。

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

## UI 実装ガイド

### コンポーネント設計原則

- **Single Responsibility**: 1つのコンポーネントは1つの責務のみ
- **Props の型定義**: 全ての props に明示的な型を定義
- **デフォルトエクスポートを避ける**: Named export を使用し、リファクタリングを容易に
- **children パターン**: 柔軟性が必要な場合は `children` を活用

### スタイリング

- **Tailwind CSS をベースに使用**: ユーティリティファーストのアプローチ
- **共通スタイルの定義**: `styles/globals.css` でカスタムユーティリティクラスを定義
- **CSS Modules**: コンポーネント固有の複雑なスタイルが必要な場合のみ使用
- **レスポンシブ対応**: Tailwind のブレークポイント (`sm:`, `md:`, `lg:`) を活用

### アクセシビリティ (a11y)

- **セマンティック HTML**: 適切な HTML タグを使用 (`<button>`, `<nav>`, `<main>` 等)
- **aria 属性**: 必要に応じて `aria-label`, `aria-describedby` 等を付与
- **キーボード操作**: すべての操作をキーボードで実行可能に
- **フォーカス管理**: `focus-visible` で適切なフォーカススタイルを適用

### パフォーマンス最適化

- **React.memo**: 不要な再レンダリングを防ぐ
- **useMemo / useCallback**: 高コストな計算や関数の再生成を防ぐ
- **Code Splitting**: React.lazy + Suspense で遅延ロード
- **画像最適化**: WebP 形式、適切なサイズ、lazy loading

## コーディング規約・ベストプラクティス

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

### インポート順序

1. React 関連
2. 外部ライブラリ
3. 内部モジュール (features, shared, lib)
4. 型定義
5. スタイル

```typescript
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TaskList } from '@/features/task/components';
import { Button } from '@/components/ui';
import { formatDate } from '@/utils';

import type { Task } from '@/features/task/types';

import styles from './Home.module.css';
```

### コメント

- **JSDoc**: 複雑な関数には JSDoc コメントを付与
- **TODO コメント**: 一時的な実装には `// TODO:` を残す
- **コメントアウト**: 不要なコードは削除し、コメントアウトは残さない

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

## 実装ルール
- 型安全: すべて TypeScript で厳密に型定義を尊重（`types/index.ts` を参照）。
- i18n: 表示文言は next-intl のキーを用い、`messages/*` にキー追加。既存キー構造に従い、フォールバックを適切に設定。
- UI: Tailwind v4 記法に準拠。Shadcn UI コンポーネントのスタイル/アクセシビリティを維持。
- 最小変更: 既存 API/挙動を壊さず、差分を限定的に。
- 仕様準拠: `SPECIFICATION.md` に沿い、現行コードとの差異はコード側を優先（例: `convertedCards` は Map）。
- ドメイン整合性: ヒラメキ/神ヒラメキのルール、ポイント算出のルールを守る。

## 変更の作法（PR作成の指針）
- ブランチ: `feature/<短く要点>` / `fix/<短く要点>` など意味のある名前。
- コミット: 1つの目的に絞った小さなコミット。メッセージは動詞先行で簡潔に。
- PR説明: 目的/背景、仕様への整合性、UI変更のスクリーンショット（必要時）、テスト実行結果の要約。
- テスト: 変更に関係するユニットテストを追加/更新。UIに影響がある場合は E2E 更新も検討。
- i18n: 新規文言は全言語にキー追加。未翻訳は一時的にフォールバック（英語 or 日本語）。

### コミット規約

- feat: 新機能
- fix: バグ修正
- refactor: リファクタリング
- test: テスト追加・修正
- docs: ドキュメント
- style: コードスタイル
- chore: その他

## 破壊的変更の禁止例
- 型定義の互換性を壊す変更（引数/戻り値の型を勝手に変更）
- i18nキー構造の破壊（既存キーの削除・意味変更）
- 既存コンポーネントの公開プロップの後方互換性を損なう変更

## セキュリティ / 品質
- XSS/CSRF 等は Next.js/React 標準挙動に準拠しつつ、危険な HTML を挿入しない。
- コード整形は既存のスタイルに合わせる。不要なリファクタリングは避ける。
- 大規模改修は要分割・段階的 PR。

## 失敗時の対応
- ビルド/テスト失敗時は差分を見直し、最小修正で復旧。
- i18nエラー（キー欠落等）はフォールバックを暫定使用し、キーを追って追加。

## アンチパターン

以下のパターンは避けてください。既存コードで発見した場合は、リファクタリングを提案してください。

### コンポーネント設計

- **巨大コンポーネント**: 1つのコンポーネントが200行を超える場合は分割を検討
- **Prop Drilling**: 深い階層での props バケツリレーは、Context や状態管理ライブラリで解決
- **useEffect の濫用**: データフェッチは React Query、イベントハンドラーで済む処理は useEffect を使わない

### 状態管理

- **過度なグローバル状態**: 真にグローバルな状態のみを Zustand で管理
- **useState の濫用**: 複雑な状態は useReducer で管理
- **直接的な状態変更**: イミュータブルな更新を心がける

### パフォーマンス

- **不要な再レンダリング**: React DevTools Profiler で計測し、必要に応じて最適化
- **過度な最適化**: 実測せずに useMemo/useCallback を多用しない
- **巨大なバンドル**: Code Splitting を活用し、初期ロードを軽量化

### TypeScript

- **any の濫用**: 型推論が難しい場合は `unknown` を使用し、型ガードで絞り込む
- **型アサーション (as)**: 必要最小限に留め、型の安全性を保つ
- **オプショナルの濫用**: 本当に必要な場合のみ `?` を使用

## セキュリティとプライバシー

- **環境変数**: API キーは `.env` で管理し、`.gitignore` に追加
- **XSS 対策**: ユーザー入力は適切にサニタイズ、React の JSX は自動エスケープ
- **CSRF 対策**: Firebase Authentication のトークンベース認証で対応
- **HTTPS 通信**: 本番環境では必ず HTTPS を使用
- **CSP (Content Security Policy)**: 適切な CSP ヘッダーを設定

## アクセシビリティ (a11y) ガイドライン

- **WCAG 2.1 AA レベル**: 準拠を目指す
- **スクリーンリーダー対応**: ARIA 属性を適切に使用
- **キーボードナビゲーション**: Tab, Enter, Escape キーでの操作をサポート
- **カラーコントラスト**: 4.5:1 以上のコントラスト比を維持
- **axe DevTools**: 開発時に定期的にチェック

## 注意事項

- pnpm を使用（npm/yarn ではない）
- Zustand で状態管理（useContext/Redux ではない）
- shadcn/ui コンポーネントを活用
- lucide-react でアイコン統一
- localePrefix は 'never' に設定済み
