---
name: endfield-combo-builder-patterns
description: Coding patterns extracted from the EndfieldComboBuilder repository git history
version: 1.0.0
source: local-git-analysis
analyzed_commits: 50
---

# Endfield Combo Builder — Coding Patterns

## Commit Conventions

このリポジトリのコミットメッセージは**日本語で動詞結び**の形式を使用：

```
〜を追加する       # 新機能・ファイルの追加
〜を修正する       # バグ修正・設定修正
〜に対応させる     # 互換対応
〜を分ける         # リファクタリング・型分離
〜に変更する       # リネーム・移行
```

例：
- `コンボ要件についてロジックを追加する`
- `バフとデバフの型を分ける`
- `スタッガーとサポートクリスタルの情報を追加する`

## Code Architecture

```
app/                    # Next.js App Router (layout + page のみ)
components/             # 機能特化コンポーネント (PascalCase.tsx)
  combo-timeline/       # タイムライン内サブコンポーネント
  ui/                   # shadcn/ui ベースコンポーネント
hooks/                  # ビジネスロジックカスタムフック (use*.ts)
lib/
  data/                 # ゲームデータ静的定義 (operators, skills, attacks)
  *.ts                  # ユーティリティ・ドメインロジック
stores/                 # Zustand ストア (*Store.ts)
types/                  # TypeScript 型定義 (combo.ts に集約)
messages/               # i18n 翻訳ファイル (en.json, ja.json)
tests/
  unit/{lib,hooks,components}/
  e2e/
public/images/operators/ # オペレーター画像 (operatorId.png)
```

## Workflows

### 新しいオペレーター追加

以下のファイルを**必ず同時に変更する**（git 履歴で常にセット）：

1. `lib/data/operators.ts` — オペレーターデータ追加（キー: スネークケース小文字）
2. `lib/data/skills.ts` — スキルデータ追加（キー: `{operatorId}_battle_skill` など）
3. `lib/data/attacks.ts` — 通常攻撃データ追加
4. `messages/ja.json` — 日本語名 (`character.{operatorId}.name`)
5. `messages/en.json` — 英語名
6. `public/images/operators/{operatorId}.png` — アイコン画像

### 新しい型・状態の追加

以下の順序で変更：

1. `types/combo.ts` — 型定義・Enum 追加
2. `stores/comboStore.ts` — State・Action 追加
3. 対象コンポーネント/フック — UI 反映

### 新しいコンポーネント追加

1. `components/ComponentName.tsx` — コンポーネント作成
2. `messages/ja.json` + `messages/en.json` — i18n キー追加
3. `tests/unit/components/ComponentName.test.tsx` — テスト作成

### ドメインロジックの変更

`lib/statusEffects.ts` または `lib/comboRequirements.ts` を変更する場合：

- `lib/timeline.ts` との整合性を確認
- 対応するテスト (`tests/unit/lib/`) を同時に更新

## Testing Patterns

**ファイル配置ルール：**

| 対象 | テストパス |
|------|-----------|
| `lib/*.ts` | `tests/unit/lib/*.test.ts` |
| `hooks/use*.ts` | `tests/unit/hooks/*.test.ts` |
| `components/*.tsx` | `tests/unit/components/*.test.tsx` |
| E2E フロー | `tests/e2e/*.spec.ts` |

**コンポーネントテストパターン：**

```typescript
// render + fireEvent + コールバック検証
import { render, screen, fireEvent } from '@testing-library/react';

it('コールバックが正しく呼ばれる', () => {
  const onAction = vi.fn();
  render(<ComponentName onAction={onAction} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onAction).toHaveBeenCalledWith(expectedArg);
});
```

**フックテストパターン：**

```typescript
// 直接関数呼び出し + 状態アサーション
import { useComboStore } from '@/stores/comboStore';

it('アクション追加が正しく動作する', () => {
  const { addAction, actions } = useComboStore.getState();
  addAction(mockAction);
  expect(useComboStore.getState().actions).toHaveLength(1);
});
```

## Key Conventions

### データキーの命名

```typescript
// operators.ts: スネークケース小文字
'laevatain', 'chen_qianyu', 'da_pan'

// skills.ts: `${operatorId}_${skillType}` 形式
'laevatain_battle_skill', 'laevatain_combo_skill', 'laevatain_ultimate'

// i18n キー
'character.laevatain.name'

// 画像パス
'public/images/operators/laevatain.png'
```

### コンポーネント設計

- Named export のみ（default export 禁止）
- Props は明示的な TypeScript インターフェースで定義
- アロー関数コンポーネント
- ビジネスロジックはカスタムフックに抽出し、コンポーネントは表示のみ

### i18n ルール

- `useTranslations()` フックを使用
- 新しい表示文言は **必ず** `ja.json` と `en.json` の両方に追加
- ロケールは `NEXT_LOCALE` Cookie で管理（デフォルト: `ja`）
- URL にロケールプレフィックスなし（`localePrefix: 'never'`）

### タイムライン定数（変更禁止）

```typescript
TIMELINE_WIDTH = 1000          // px（固定）
TEAM_SP_REGEN_PER_SECOND = 10
BATTLE_SKILL_SP_COST = 100
MAX_TEAM_SP = 300
// 変換式: ms = (pixelX / 1000) * timelineDurationMs
// スナップ単位: 100ms
```

## Co-change Patterns（同時変更が多いファイル群）

| 変更内容 | 一緒に変更するファイル |
|---------|---------------------|
| 新オペレーター | `operators.ts`, `skills.ts`, `attacks.ts`, `en.json`, `ja.json` |
| 状態異常ロジック | `statusEffects.ts`, `comboRequirements.ts`, `statusEffectLabels.ts`, `timeline.ts` |
| 新フック | 4つのフックファイルはまとめて管理 |
| 新テスト追加 | `vitest.config.ts`, `vitest.setup.ts` は稀に一緒に変更 |
