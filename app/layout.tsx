import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'

import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI SDK Tools Registry',
  metadataBase: new URL('https://ai-agents.dev'),
  description: 'A comprehensive collection of ready-to-use AI tools and integrations for the Vercel AI SDK. Features include search capabilities, platform integrations (Discord, Slack, GitHub), and more - all easily installable via shadcn CLI.',
  keywords: [
    'AI SDK',
    'Vercel AI SDK',
    'shadcn/ui',
    'AI Tools',
    'AI Integrations',
    'Discord Bot',
    'Slack Integration',
    'GitHub Tools',
    'Tavily Search',
    'Perplexity AI',
    'React',
    'Next.js',
    'TypeScript',
  ],
  authors: [
    {
      name: 'monto',
      url: 'https://nicolasmontone.com',
    },
  ],
  creator: 'monto',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased dark',
          geistSans.variable,
          geistMono.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
