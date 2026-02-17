import type { Metadata } from 'next'
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import './globals.css'

export const metadata: Metadata = {
  title: 'Endfield Combo Builder',
  description: 'ゲーム「アークナイツ：エンドフィールド」でのチームでのコンボを視覚的に構築するツール',
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale();
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
