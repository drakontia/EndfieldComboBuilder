# デザインシステム — アークナイツ：エンドフィールド コンボビルダー
> Google Stitch design-md 形式に準拠

---

## 1. カラートークン

### ベース（ダークテーマ）
| トークン | 値 | 用途 |
|---------|-----|------|
| `color.bg.app` | `#111827` (gray-900) | アプリ背景 |
| `color.bg.card` | `#1f2937` (gray-800) | カード・パネル |
| `color.bg.cell` | `#374151` (gray-700) | 入力・行 |
| `color.border` | `#4b5563` (gray-600) | ボーダー |
| `color.text.primary` | `#f3f4f6` (gray-100) | 主テキスト |
| `color.text.secondary` | `#d1d5db` (gray-300) | 副テキスト |
| `color.text.muted` | `#9ca3af` (gray-400) | 補助テキスト |

### セマンティックカラー（ボタン用）
| トークン | 値 | 用途 |
|---------|-----|------|
| `color.action.primary` | `#2563eb` (blue-600) | 主要アクション（保存） |
| `color.action.secondary` | transparent + border | 副次アクション（読込・エクスポート・共有） |
| `color.action.destructive` | `#dc2626` (red-600) | 破壊的アクション（クリア） |
| `color.action.warning` | `#d97706` (amber-600) | 警告アクション（削除モード ON） |

### スキルタイプカラー
| スキル | テキスト | アクセント | 背景 |
|--------|---------|-----------|------|
| 通常攻撃 | `text-slate-300` | `#64748b` | `#64748b` |
| 戦技 | `text-green-400` | `#22c55e` | `#22c55e` |
| 連携技 | `text-purple-400` | `#a855f7` | `#a855f7` |
| 必殺技 | `text-red-400` | `#ef4444` | `#ef4444` |

---

## 2. タイポグラフィスケール

| ロール | クラス |
|--------|--------|
| アプリタイトル | `text-4xl font-bold` |
| セクションヘッダー | `text-sm font-semibold uppercase tracking-wide text-gray-300` |
| カードラベル | `text-sm font-medium text-gray-200` |
| 補助テキスト | `text-xs text-gray-400` |
| タイムラインラベル | `text-sm font-medium` + スキルタイプカラー |

---

## 3. スペーシング

| 用途 | 値 |
|------|-----|
| セクション間 | `mb-4` |
| カード内パディング | `p-4` |
| ボタン間隔 | `gap-2` |
| アイコン+テキスト間隔 | `gap-1.5` |

---

## 4. コンポーネント仕様

### ControlPanel ボタン
ボタンは役割ごとにバリアントを統一し、視覚的ノイズを減らす。

```
[ コンボ名入力____________________ ]  [ 削除モード ]  [ 💾 保存 ]  [ 📂 読込 ]  [ 🖼 エクスポート ]  [ 🔗 共有 ]  [ 🗑 クリア ]
                                         ↑ outline or amber  ↑ primary    ↑ outline   ↑ outline          ↑ outline   ↑ destructive
```

- **保存** → `bg-blue-600` (primary) + `Save` アイコン
- **読込 / エクスポート / 共有** → outline variant + 対応アイコン
- **クリア** → `bg-red-600` (destructive) + `Trash2` アイコン
- **削除モード OFF** → outline + `Pencil` アイコン
- **削除モード ON** → `bg-amber-600` (warning) + `Pencil` アイコン

### セクションヘッダー（統一スタイル）
```
SP              ← text-sm font-semibold uppercase tracking-wide text-gray-300
自操作キャラ     ← 同上
敵の状態        ← 同上
```

### スキルタイプ行ラベル
```
| 戦技  |  ←  border-left: 3px solid #22c55e  +  text-green-400  font-medium
| 連携技 |  ←  border-left: 3px solid #a855f7  +  text-purple-400
| 必殺技 |  ←  border-left: 3px solid #ef4444  +  text-red-400
```

### 空キャラクタースロット
```
┌ ─ ─ ─ ─ ─ ─ ┐
    ⊕
    選択...
└ ─ ─ ─ ─ ─ ─ ┘
border-dashed border-2 border-gray-500 hover:border-gray-300
```

---

## 5. 実装済み変更一覧

| ファイル | 変更 | ステータス |
|---|---|---|
| `skillTypeConfig.ts` | テキスト・アクセントカラー追加 | ✅ Done |
| `TimelineRow.tsx` | 左ボーダー + 色付きラベル | ✅ Done |
| `OperatorStatusTimeline.tsx` | ダークテーマ色修正 | ✅ Done |
| `CharacterCard.tsx` | 空スロット改善 | ✅ Done |
| `ComboBuilder.tsx` | セクションヘッダー統一 | ✅ Done |
| `ControlPanel.tsx` | ボタンアイコン + セマンティックカラー | 🔜 Next |
| `ComboBuilder.tsx` | 「自操作キャラ」ヘッダー統一 | 🔜 Next |
