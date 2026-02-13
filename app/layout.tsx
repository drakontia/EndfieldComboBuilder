import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Endfield Combo Builder',
  description: 'ゲーム「アークナイツ：エンドフィールド」でのチームでのコンボを視覚的に構築するツール',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans">{children}</body>
    </html>
  )
}
