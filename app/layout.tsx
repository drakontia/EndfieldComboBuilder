import type { Metadata } from 'next'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';
import { Analytics } from '@vercel/analytics/react';
import './globals.css'

export const metadata: Metadata = {
  title: 'Endfield Combo Builder',
  description: 'ゲーム「アークナイツ：エンドフィールド」でのチームでのコンボを視覚的に構築するツール',
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const {locale} = await params;
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

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
